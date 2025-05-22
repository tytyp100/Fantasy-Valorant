"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getVLRStats } from "@/app/actions/vlr";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/lib/utils";

const teamIds = [
  { name: "G2", id: 11058 },
  { name: "NRG", id: 1034 },
  { name: "Sentinels", id: 2 },
  { name: "100T", id: 120 },
  { name: "C9", id: 188 },
  { name: "EG", id: 5248 },
  { name: "LOUD", id: 6961 },
  { name: "2G", id: 15072 },
  { name: "MIBR", id: 7386 },
  { name: "FURIA", id: 2406 },
  { name: "LEVIATÁN", id: 2359 },
  { name: "KRU", id: 2355 },
];

type Player = {
  name: string;
  team: string;
  agents: string[];
  rating: number;
  salary: number;
};

export default function Draft() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  //For synchroning the selected players across the users
  const [pickedPlayers, setPickedPlayers] = useState<Set<string>>(new Set());

  // Row selection state
  const [rowSelection, setRowSelection] = useState({});
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);

  //Making you that the selected row is cross out
  const [confirmedRows, setConfirmedRows] = useState<Set<string>>(new Set());
  const confirmSelection = (playerId: number) => {
    setConfirmedRows((prev) => new Set(prev).add(playerId.toString()));
  };

  const baseSalary = 5000000; // Base salary for all players

  // Subscribe to realtime changes
  useEffect(() => {
    const channel = supabase
      .channel("picked_players_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "draft_picked_players",
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setPickedPlayers((prev) =>
              new Set(prev).add(payload.new.player_name)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Load initially picked players
  useEffect(() => {
    async function loadPickedPlayers() {
      const { data } = await supabase
        .from("draft_picked_players")
        .select("player_name");

      if (data) {
        setPickedPlayers(new Set(data.map((p) => p.player_name)));
      }
    }
    loadPickedPlayers();
  }, []);

  // Unified confirm handler
  const handleConfirmSelection = async () => {
    const selected = table.getSelectedRowModel().rows;
    if (selected.length === 0) return;

    const player = selected[0].original;

    try {
      // First check if player is already picked
      const { data: existing } = await supabase
        .from("draft_picked_players")
        .select("*")
        .eq("player_name", player.name)
        .single();

      if (existing) {
        alert("This player has already been picked!");
        return;
      }

      // Then insert with proper values
      const { data, error } = await supabase
        .from("draft_picked_players")
        .insert([
          {
            player_name: player.name,
            //picked_at: new Date().toISOString(),
            picked_by: null, // Make this nullable in your DB or get actual user ID
            player_id: null, // Make this nullable in your DB or get actual player ID
          },
        ])
        .select();

      if (error) {
        console.error("Detailed Supabase error:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      setPickedPlayers((prev) => new Set(prev).add(player.name));
      table.resetRowSelection();
      return data;
    } catch (error) {
      console.error("Full error object:", error);
      alert(
        `Failed to save selection: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  };

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const allPlayers: Player[] = [];

        // Fetch additional player stats
        const data2 = await getVLRStats("na", "all");
        const data3 = await getVLRStats("br", "all");

        const playerStatsMap = new Map();
        if (data2.data?.segments) {
          data2.data.segments.forEach((segment: any) => {
            playerStatsMap.set(segment.player.toLowerCase(), {
              agents: segment.agents || ["Unknown"],
              rating: parseFloat(segment.rating) || 0,
              salary: (parseFloat(segment.rating) || 0) ** 2 * baseSalary,
            });
          });
        }

        if (data3.data?.segments) {
          data3.data.segments.forEach((segment: any) => {
            const lowerCaseName = segment.player.toLowerCase();
            if (!playerStatsMap.has(lowerCaseName)) {
              playerStatsMap.set(lowerCaseName, {
                agents: segment.agents || ["Unknown"],
                rating: parseFloat(segment.rating) || 0,
                salary: (parseFloat(segment.rating) || 0) ** 2 * baseSalary,
              });
            }
          });
        }

        for (const team of teamIds) {
          const response = await fetch(
            `https://vlr.orlandomm.net/api/v1/teams/${team.id}`
          );
          const data = await response.json();

          const players = data.data?.players || [];

          if (Array.isArray(players)) {
            const teamPlayers: Player[] = players
              .slice(0, 5)
              .map((player: any) => {
                const lowerCaseName = player.user?.toLowerCase() || "unknown";
                const stats = playerStatsMap.get(lowerCaseName);

                return {
                  name: player.user || "Unknown Player",
                  team: team.name,
                  agents: stats?.agents || ["Unknown"],
                  rating: stats?.rating || 0,
                  salary: stats?.salary || 0,
                };
              });

            allPlayers.push(...teamPlayers);
          }
        }

        // Hard-coded player info to update missing data
        const hardCodedPlayersInfo = [
          {
            name: "keznit",
            team: "KRU",
            agents: ["jett", "raze"],
            rating: 1.37,
            salary: 9384500,
          },
        ];

        // Update allPlayers with hard-coded info
        allPlayers.forEach((player) => {
          const hardCodedPlayer = hardCodedPlayersInfo.find(
            (p) => p.name.toLowerCase() === player.name.toLowerCase()
          );

          if (hardCodedPlayer) {
            player.agents = hardCodedPlayer.agents;
            player.rating = hardCodedPlayer.rating;
            player.salary = hardCodedPlayer.salary;
          }
        });

        setPlayers(allPlayers);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, []);

  const columns: ColumnDef<Player>[] = [
    {
      id: "select",
      header: () => null,
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => {
              // This will automatically handle single selection
              row.toggleSelected(!!value);
            }}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Player <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "team",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "agents",
      header: "Agents",
      cell: ({ row }) => row.original.agents.join(", "),
    },
    {
      accessorKey: "rating",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Rating <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "salary",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Salary <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatCurrency(row.original.salary),
    },
  ];

  // Initialize the table instance
  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: (updater) => {
      // This ensures only one row can be selected at a time
      if (typeof updater === "function") {
        const newSelection = updater({});
        const selectedRowId = Object.keys(newSelection).find(
          (id) => newSelection[id]
        );
        setRowSelection(selectedRowId ? { [selectedRowId]: true } : {});
      } else {
        setRowSelection(updater);
      }
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    getRowId: (row) => row.name,
    enableRowSelection: true,
    enableMultiRowSelection: false, // Disable multi-row selection
  });

  return (
    <div className="bg-slate-950 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Draft Phase</h1>
        {loading ? (
          <p className="text-white">Loading players...</p>
        ) : (
          <>
            {/* Filtering Input */}
            <div className="flex items-center py-4">
              <Input
                placeholder="Search for a player..."
                value={
                  (table.getColumn("name")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("name")?.setFilterValue(event.target.value)
                }
                className="max-w-sm text-white placeholder-gray-400 bg-slate-900 border-slate-700"
              />
            </div>

            {/* Table */}
            <div className="rounded-md border border-slate-800 bg-blue-900">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-white">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        className={`bg-slate-950 hover:bg-slate-800 ${
                          pickedPlayers.has(row.id)
                            ? "opacity-50 line-through pointer-events-none"
                            : ""
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="text-white">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        className="h-24 text-center text-slate-400"
                        colSpan={4}
                      >
                        No players found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center space-x-4 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <span className="text-white">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
              <Button
                className="mt-4"
                onClick={() => {
                  const selected = table
                    .getSelectedRowModel()
                    .rows.map((row) => row.original);

                  if (selected.length > 0) {
                    setSelectedPlayers(selected);

                    // Add to confirmedRows
                    selected.forEach((player) =>
                      setConfirmedRows((prev) => {
                        const newSet = new Set(prev);
                        newSet.add(player.name);
                        return newSet;
                      })
                    );

                    // Clear selection
                    table.resetRowSelection();

                    // Log selected player to console
                    console.log("Confirmed Player:", selected[0]);
                  }
                }}
              >
                Confirm Selection
              </Button>
              <Button
                className="mt-4"
                onClick={handleConfirmSelection}
                disabled={table.getSelectedRowModel().rows.length === 0}
              >
                Confirm Synchronized Selection
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
