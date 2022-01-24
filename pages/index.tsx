import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";

import GameList from "../components/game-list";
import PlayerList from "../components/player-list";
import { IGame } from "../domain/Game";
import { IPlayer, PlayerId } from "../domain/Player";
import { UpstashGameRepository } from "../repository/UpstashGameRepository";
import { UpstashPlayerRepository } from "../repository/UpstashPlayerRepository";

const Home: NextPage<{ players: string; games: string }> = (props) => {
  const [players, setPlayers] = useState<IPlayer[]>(JSON.parse(props.players));
  const [games, setGames] = useState<IGame[]>(
    JSON.parse(props.games).map((game: any) => ({
      ...game,
      createdAt: new Date(game.createdAt),
    }))
  );
  const [tab, setTab] = useState<"games" | "players">("games");

  useEffect(fetchPlayers, []);
  useEffect(fetchGames, []);

  function fetchPlayers() {
    axios("/api/players").then(({ data }) => setPlayers(data));
  }

  function fetchGames() {
    axios("/api/games").then(({ data }) =>
      setGames(
        data.map((game: IGame) => ({
          ...game,
          createdAt: new Date(game.createdAt),
        }))
      )
    );
  }

  function getPlayer(id: PlayerId) {
    const player = players?.find((el) => el.id === id);
    return player || { id: "", name: "", animal: "bat" };
  }

  return (
    <div className="bg-slate-800 px-5 pb-5 text-slate-200 min-h-screen">
      <Head>
        <title>Thanks For Playing</title>
      </Head>

      <main>
        <div className="flex py-3 justify-around">
          <button
            className={`text-lg ${tab === "games" ? "font-bold border-b" : ""}`}
            onClick={() => setTab("games")}
          >
            Games
          </button>
          <button
            className={`text-lg ${
              tab === "players" ? "font-bold border-b" : ""
            }`}
            onClick={() => setTab("players")}
          >
            Leaderboard
          </button>
        </div>
        <DataContext.Provider
          value={{
            players,
            refreshPlayers: fetchPlayers,
            getPlayer,
            games,
            refreshGames: fetchGames,
          }}
        >
          {tab === "games" && <GameList />}
          {tab === "players" && <PlayerList />}
        </DataContext.Provider>
      </main>
    </div>
  );
};

export const DataContext = createContext<{
  players: IPlayer[];
  refreshPlayers: VoidFunction;
  getPlayer: (id: PlayerId) => IPlayer;
  games: IGame[];
  refreshGames: VoidFunction;
}>({
  players: [],
  refreshPlayers: () => {},
  getPlayer: () => {
    throw new Error("No player found.");
  },
  games: [],
  refreshGames: () => {},
});

export async function getServerSideProps() {
  const gameRepository = new UpstashGameRepository();
  const playerRepository = new UpstashPlayerRepository();

  const [games, players] = await Promise.all([
    gameRepository.listAll(),
    playerRepository.listAll(),
  ]);

  return {
    props: {
      games: JSON.stringify(games),
      players: JSON.stringify(players),
    },
  };
}

export default Home;
