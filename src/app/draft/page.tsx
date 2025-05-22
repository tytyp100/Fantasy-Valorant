"use client";

import { useEffect, useState } from "react";
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
  salary: number;
};

const columns: ColumnDef<Player>[] = [
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
    header: "Team",
  },
  {
    accessorKey: "agents",
    header: "Agents",
    cell: ({ row }) => row.original.agents.join(", "),
  },
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Rating <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
];

export default function Draft() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

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
                  salary: stats?.rating || 0,
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
            salary: 1.01,
          },
          {
            name: "Mazino",
            team: "KRU",
            agents: ["kayo", "skye", "breach"],
            salary: 0.94,
          },
          {
            name: "Melser",
            team: "KRU",
            agents: ["astra", "omen", "brimstone"],
            salary: 1.21,
          },
          {
            name: "Shyy",
            team: "KRU",
            agents: ["viper", "cypher", "vyse"],
            salary: 1.21,
          },
          {
            name: "kiNgg",
            team: "LEVIATÁN",
            agents: ["omen", "astra", "breach"],
            salary: 1.09,
          },
        ];

        // Update allPlayers with hard-coded info
        allPlayers.forEach((player) => {
          const hardCodedPlayer = hardCodedPlayersInfo.find(
            (p) => p.name.toLowerCase() === player.name.toLowerCase()
          );

          if (hardCodedPlayer) {
            player.agents = hardCodedPlayer.agents;
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

  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
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
                        className="bg-slate-950 hover:bg-slate-800"
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}
