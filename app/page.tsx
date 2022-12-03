"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";

import Button from "../components/button";
import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import { Game } from "../domain/Game";
import { Leaderboard } from "../domain/Leaderboard";
import { Player, PlayerId } from "../domain/Player";
import Card from "../components/card";
import { DataContext } from "../data";
import { Tournament } from "../domain/Tournament";

const PlayerForm = dynamic(() => import("../components/player-form"), {
  suspense: true,
});
const PlayerList = dynamic(() => import("../components/player-list"), {
  suspense: true,
});

export default function Page() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"games" | "players">("games");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const [{ data: players }, { data: games }, { data: tournaments }] =
      await Promise.all([
        axios.get<Player[]>("/api/players"),
        axios.get<Game[]>("/api/games"),
        axios.get<Tournament[]>("/api/tournaments"),
      ]);

    setIsLoading(false);
    setPlayers(players);
    setGames(games);
    setTournaments(tournaments);
  }

  function getPlayer(id: PlayerId | undefined) {
    const player = players?.find((el) => el.id === id);
    return (
      player || { id: "placeholder", name: "", animal: "bat", isRetired: false }
    );
  }

  return (
    <div className="bg-slate-800 px-5 pb-5 text-slate-200 min-h-screen">
      <div className="w-full max-w-3xl m-auto">
        <div className="flex py-3 justify-around">
          <Button
            textSize="text-base"
            backgroundColor={tab === "games" ? "bg-slate-600" : undefined}
            onClick={() => setTab("games")}
          >
            games
          </Button>
          <Button
            textSize="text-base"
            backgroundColor={tab === "players" ? "bg-slate-600" : undefined}
            onClick={() => setTab("players")}
          >
            leaderboard
          </Button>
        </div>
        <DataContext.Provider
          value={{
            players,
            games,
            getPlayer,
            refresh: fetchData,
            leaderboard: new Leaderboard(players, games, tournaments),
            isLoading,
          }}
        >
          {tab === "games" && (
            <>
              <GameForm />
              <GameList />
            </>
          )}
          {tab === "players" && (
            <Suspense
              fallback={
                <>
                  <Card></Card>
                  <Card className="mt-2">
                    <p className="text-center text-lg">+</p>
                  </Card>
                </>
              }
            >
              <PlayerList />
              <PlayerForm />
            </Suspense>
          )}
        </DataContext.Provider>

        <div className="mt-4 flex justify-center underline">
          <a
            href="https://github.com/JonathanWbn/kicker-tracker"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
        </div>
      </div>
    </div>
  );
}
