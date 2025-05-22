"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Users,
  Calendar,
  Flame,
  Shield,
  Zap,
  Target,
  Map,
  Construction,
  Newspaper,
  User2,
} from "lucide-react";

// fake data, tmp
const POSITIONS = [
  { name: "Duelist", icon: <Flame className="h-5 w-5" /> },
  { name: "Sentinel", icon: <Shield className="h-5 w-5" /> },
  { name: "Initiator", icon: <Zap className="h-5 w-5" /> },
  { name: "Controller", icon: <Target className="h-5 w-5" /> },
];

const MOCK_UPCOMING_MATCH = {
  id: 1,
  opponent: "ianator",
  date: "March 15, 2025",
  time: "18:00",
};

const MOCK_STANDINGS = [
  { position: 1, name: "FS_mang0", wins: 100, losses: 0 },
  { position: 2, name: "daaavisss", wins: 90, losses: 1 },
  { position: 3, name: "FS_mel0n", wins: 80, losses: 14 },
  { position: 4, name: "sago", wins: 16, losses: 11 },
  { position: 5, name: "Xoan", wins: 14, losses: 13 },
  { position: 6, name: "mrdrshards", wins: 13, losses: 13 },
  { position: 7, name: "eddienottiina", wins: 13, losses: 14 },
  { position: 8, name: "ianator", wins: 10, losses: 170 },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6 text-red-500" />
              <span className="text-xl font-bold text-white">
                Valorant Fantasy
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Welcome, Username</span>
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-300 hover:bg-slate-800"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-800 bg-slate-900">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-4 px-2 relative ${
                activeTab === "overview"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Overview
              {activeTab === "overview" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("myTeam")}
              className={`py-4 px-2 relative ${
                activeTab === "myTeam"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              My Team
              {activeTab === "myTeam" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("standings")}
              className={`py-4 px-2 relative ${
                activeTab === "standings"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Standings
              {activeTab === "standings" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("players")}
              className={`py-4 px-2 relative ${
                activeTab === "players"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Players
              {activeTab === "players" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`py-4 px-2 relative ${
                activeTab === "news"
                  ? "text-red-500"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              News
              {activeTab === "news" && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
              )}
            </button>
            <Link href="/draft">
              <button
                className={`py-4 px-2 relative ${
                  activeTab === "draft"
                    ? "text-red-500"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Draft
                {activeTab === "draft" && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"></span>
                )}
              </button>
            </Link>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">
              Dashboard Overview
            </h1>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Current League: Americas Kickoff Fantasy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4 text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-red-400" />
                    {/* these are hard-coded values, these should be changed TODO */}
                    <span>8-Player League</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-400" />
                    <span>Week 2 of 8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-red-400" />
                    <span>Your Record: 100-4</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Map className="h-5 w-5 text-red-400" />
                    <span>Playoff Eligible: Yes</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Upcoming Match</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 border border-slate-800 rounded-md">
                  <div>
                    <h3 className="text-white font-medium">
                      vs. {MOCK_UPCOMING_MATCH.opponent}
                    </h3>
                    <p className="text-slate-400">
                      {MOCK_UPCOMING_MATCH.date} at {MOCK_UPCOMING_MATCH.time}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500/10"
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "myTeam" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">My Team</h1>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Your Roster</h2>

              <div className="space-y-4">
                {POSITIONS.map((position, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-slate-800 rounded-md"
                  >
                    <div className="flex items-center gap-3">
                      {position.icon}
                      <div>
                        <h3 className="text-white font-medium">
                          {position.name}
                        </h3>
                        <p className="text-slate-400">SEN TenZ</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Manage Team
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "standings" && (
          <div className="space-y-8">
            <h1 className="text-2xl font-bold text-white">League Standings</h1>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">
                  Americas Kickoff Fantasy - Week 2
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left border-b border-slate-800">
                        <th className="pb-3 text-slate-400 font-medium">
                          Position
                        </th>
                        <th className="pb-3 text-slate-400 font-medium">
                          Manager
                        </th>
                        <th className="pb-3 text-slate-400 font-medium">W-L</th>
                        <th className="pb-3 text-slate-400 font-medium">
                          Win %
                        </th>
                        <th className="pb-3 text-slate-400 font-medium">
                          Playoffs
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_STANDINGS.map((player) => (
                        <tr
                          key={player.position}
                          className={`border-b border-slate-800 ${
                            player.name === "You" ? "bg-slate-800/30" : ""
                          }`}
                        >
                          <td className="py-3 text-white">{player.position}</td>
                          <td className="py-3 text-white font-medium">
                            {player.name}
                          </td>
                          <td className="py-3 text-white">
                            {player.wins}-{player.losses}
                          </td>
                          <td className="py-3 text-white">
                            {Math.round(
                              (player.wins / (player.wins + player.losses)) *
                                100
                            )}
                            %
                          </td>
                          <td className="py-3">
                            {player.position <= 6 ? (
                              <span className="text-green-400">Yes</span>
                            ) : (
                              <span className="text-slate-400">No</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 text-sm text-slate-400">
                  <p>* Top 6 teams advance to playoffs after Week 8</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "players" && (
          <div className="space-y-8 text-center py-16">
            <User2 className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">
              Players Coming Soon
            </h1>
            <p className="text-slate-400 max-w-md mx-auto">in progress...</p>
          </div>
        )}

        {activeTab === "news" && (
          <div className="space-y-8 text-center py-16">
            <Newspaper className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">News Coming Soon</h1>
            <p className="text-slate-400 max-w-md mx-auto">in progress...</p>
          </div>
        )}

        {activeTab === "draft" && (
          <div className="space-y-8 text-center py-16">
            <Construction className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white">Draft Coming Soon</h1>
            <p className="text-slate-400 max-w-md mx-auto">in progress...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
