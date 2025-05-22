import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Trophy,
  Swords,
  DraftingCompass,
  Globe,
  CalendarCheck,
} from "lucide-react";
import { clsx } from "clsx";
import Link from "next/link";

export default function Home() {
  const events = [
    {
      name: "Americas Kickoff",
      region: "NA",
      date: "Jan 16 - Feb 8",
      status: "Ongoing",
    },
    {
      name: "China Kickoff",
      region: "CN",
      date: "idk date would go here",
      status: "Upcoming",
    },
    {
      name: "SEA Kickoff",
      region: "SEA",
      date: "idk",
      status: "Upcoming",
    },
    {
      name: "EMEA Kickoff",
      region: "EU",
      date: "idk",
      status: "Upcoming",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="border-b border-slate-800">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Swords className="h-6 w-6 text-red-400" />
            <span className="text-xl font-bold text-white">
              Valorant Fantasy Draft
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
            >
              Events
            </Button>
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
            >
              Players
            </Button>
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
            >
              Teams
            </Button>
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
            >
              Leaderboards
            </Button>
            <Button
              variant="ghost"
              className="text-slate-300 hover:bg-slate-800"
            >
              Information
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-900/40 transition-all"
              asChild
            >
              <Link href="/draft">Draft Phase</Link>
            </Button>
            <Button
              variant="default"
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-900/40 transition-all"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </nav>
      </div>

      <section className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">
          VALORANT Fantasy Draft
        </h1>
        <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
          Strategic team building meets competitive gameplay
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="px-12 rounded-full">
            Get Started
          </Button>
          <Button variant="outline" size="lg" className="rounded-full">
            Learn More
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 mb-32">
        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Upcoming Events
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {events.map((event) => (
            <Card
              key={event.name}
              className="bg-slate-900 border-slate-800 hover:bg-slate-800/30 transition-colors"
            >
              <CardHeader className="pb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-slate-200 flex items-center gap-2">
                      <Swords className="h-5 w-5 text-red-400" />
                      {event.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2 text-slate-400">
                      <Globe className="h-4 w-4 text-slate-500" />
                      {event.region} Regional
                    </CardDescription>
                  </div>
                  <span className="text-sm bg-slate-800 px-3 py-1 rounded-full text-slate-400">
                    {event.date}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarCheck className="h-5 w-5" />
                  <span
                    className={clsx(
                      "text-sm font-medium",
                      event.status === "Ongoing"
                        ? "text-green-400"
                        : "text-slate-400"
                    )}
                  >
                    {event.status}
                  </span>
                </div>
                <Button
                  variant="outline"
                  className={clsx(
                    "hover:bg-opacity-20 transition-colors",
                    event.status === "Ongoing"
                      ? "border-green-400 bg-green-500/20 text-green-400 hover:bg-green-500/30 hover:text-green-300"
                      : "border-blue-400 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300"
                  )}
                >
                  {event.status === "Ongoing" ? "Join Live" : "Register"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 py-32">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-2xl font-semibold text-white mb-16 text-center">
            From Draft to Championship
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 group">
              <div className="mb-6 text-red-400">
                <CalendarCheck className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-white mb-4">1. Event Registration</h3>
              <p className="text-slate-400 text-sm">
                Choose your event and join before the deadline
              </p>
            </div>

            <div className="text-center p-6 group">
              <div className="mb-6 text-red-400">
                <DraftingCompass className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-white mb-4">2. Live Snake Draft</h3>
              <p className="text-slate-400 text-sm">
                Strategically pick players in real-time with your group pool
              </p>
            </div>

            <div className="text-center p-6 group">
              <div className="mb-6 text-red-400">
                <Swords className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-white mb-4">3. Weekly Matchups</h3>
              <p className="text-slate-400 text-sm">
                Compete head-to-head using your team's actual tournament
                performance
              </p>
            </div>

            <div className="text-center p-6 group">
              <div className="mb-6 text-red-400">
                <Trophy className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-white mb-4">4. Final Playoffs</h3>
              <p className="text-slate-400 text-sm">
                Top performers advance to the championship bracket to play for
                trophies
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
