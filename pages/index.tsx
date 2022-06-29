import axios from "axios";
import type { NextPage } from "next";
import { createContext, Suspense, useState } from "react";
import dynamic from "next/dynamic";

import Button from "../components/button";
import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import { Game } from "../domain/Game";
import { Leaderboard } from "../domain/Leaderboard";
import { Player, PlayerId } from "../domain/Player";
import { UpstashGameRepository } from "../repository/UpstashGameRepository";
import { UpstashPlayerRepository } from "../repository/UpstashPlayerRepository";
import Card from "../components/card";

const PlayerForm = dynamic(() => import("../components/player-form"), {
  suspense: true,
});
const PlayerList = dynamic(() => import("../components/player-list"), {
  suspense: true,
});

const Home: NextPage<{ players: Player[]; games: Game[] }> = (props) => {
  const [players, setPlayers] = useState<Player[]>(props.players);
  const [games, setGames] = useState<Game[]>(props.games);
  const [tab, setTab] = useState<"games" | "players">("games");

  function fetchPlayers() {
    axios("/api/players").then(({ data }) => setPlayers(data));
  }

  function fetchGames() {
    axios("/api/games").then(({ data }) => setGames(data));
  }

  function getPlayer(id: PlayerId) {
    const player = players?.find((el) => el.id === id);
    return player || { id: "", name: "", animal: "bat", isRetired: false };
  }

  return (
    <div className="bg-slate-800 px-5 pb-5 text-slate-200 min-h-screen">
      <div className="flex py-3 justify-around">
        <Button
          textSize="text-base"
          className={tab === "games" ? "bg-slate-600" : ""}
          onClick={() => setTab("games")}
          label="games"
        />
        <Button
          textSize="text-base"
          className={tab === "players" ? "bg-slate-600" : ""}
          onClick={() => setTab("players")}
          label="leaderboard"
        />
      </div>
      <DataContext.Provider
        value={{
          players,
          refreshPlayers: fetchPlayers,
          getPlayer,
          games,
          refreshGames: fetchGames,
          leaderboard: new Leaderboard(players, games),
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
                <Card>
                  <div className="flex justify-center mb-2">
                    <Button
                      label="show ranking history"
                      className="bg-blue-500"
                    />
                  </div>
                </Card>
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
  );
};

export const DataContext = createContext<{
  players: Player[];
  refreshPlayers: VoidFunction;
  getPlayer: (id: PlayerId) => Player;
  games: Game[];
  refreshGames: VoidFunction;
  leaderboard: Leaderboard;
}>({
  players: [],
  refreshPlayers: () => {},
  getPlayer: () => {
    throw new Error("No player found.");
  },
  games: [],
  refreshGames: () => {},
  leaderboard: new Leaderboard([], []),
});

export async function getServerSideProps() {
  const gameRepository = new UpstashGameRepository();
  const playerRepository = new UpstashPlayerRepository();

  const [games, players] = await Promise.all([
    gameRepository.listAll(),
    playerRepository.listAll(),
  ]);

  return { props: { games, players } };
}

export default Home;
