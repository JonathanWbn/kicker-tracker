"use client";

import axios from "axios";
import { endOfDay } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Button from "../components/button";
import Card from "../components/card";
import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import PlayerForm from "../components/player-form";
import PlayerGraph from "../components/player-graph";
import PlayerList from "../components/player-list";
import TournamentForm from "../components/tournament-form";
import { DataContext } from "../data";
import { Game } from "../domain/Game";
import { Leaderboard } from "../domain/Leaderboard";
import { Player, PlayerId } from "../domain/Player";
import { Tournament } from "../domain/Tournament";

export default function Page() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<"games" | "players">("games");
  const [isAddingPlayer, setIsAddingPlayer] = useState(false);
  const [isShowingGraph, setIsShowingGraph] = useState(false);
  const [isAddingGame, setIsAddingGame] = useState(false);
  const [isAddingTournament, setIsAddingTournament] = useState(false);

  const leaderboard = useMemo(
    () => new Leaderboard(players, games, tournaments),
    [players, games, tournaments]
  );

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

  const history = useMemo(
    () =>
      leaderboard.events
        .map((event) => endOfDay(event.createdAt).getTime())
        .filter((date, index, array) => array.indexOf(date) === index)
        .map((date) => ({
          date,
          rankings: leaderboard.getRankedPlayers(new Date(date)),
        })),
    [leaderboard]
  );

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
            leaderboard,
            history,
            isLoading,
          }}
        >
          {tab === "games" && (
            <>
              {isAddingGame ? (
                <GameForm onClose={() => setIsAddingGame(false)} />
              ) : isAddingTournament ? (
                <TournamentForm onClose={() => setIsAddingTournament(false)} />
              ) : (
                <div className="flex">
                  <Card
                    className="basis-1/2 mr-4 text-center cursor-pointer"
                    onClick={() => setIsAddingTournament(true)}
                  >
                    🏆
                  </Card>
                  <Card
                    onClick={() => setIsAddingGame(true)}
                    className="basis-1/2 text-center cursor-pointer"
                  >
                    ⚽
                  </Card>
                </div>
              )}
              <GameList />
            </>
          )}
          {tab === "players" && (
            <>
              {isShowingGraph ? (
                <PlayerGraph onClose={() => setIsShowingGraph(false)} />
              ) : isAddingPlayer ? (
                <PlayerForm onClose={() => setIsAddingPlayer(false)} />
              ) : (
                <div className="flex mb-4">
                  <Card
                    className="basis-1/2 mr-4 text-center cursor-pointer"
                    onClick={() => setIsAddingPlayer(true)}
                  >
                    👤
                  </Card>
                  <Card
                    onClick={() => setIsShowingGraph(true)}
                    className="basis-1/2 text-center cursor-pointer"
                  >
                    📊
                  </Card>
                </div>
              )}
              <PlayerList />
            </>
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
