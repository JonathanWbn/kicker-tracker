import axios from "axios";
import type { NextPage } from "next";
import { createContext, useState } from "react";

import Button from "../components/button";
import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import PlayerForm from "../components/player-form";
import PlayerList from "../components/player-list";
import { IGame } from "../domain/Game";
import { Leaderboard } from "../domain/Leaderboard";
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
          <>
            <PlayerList />
            <PlayerForm />
          </>
        )}
      </DataContext.Provider>

      <div className="mt-4 flex justify-center underline">
        <a
          href="https://github.com/JonathanWbn/kicker-tracker"
          target="_blank"
          rel="noreferrer"
        >
          {"Don't like your rating? Just change the rules!"}
        </a>
      </div>
    </div>
  );
};

export const DataContext = createContext<{
  players: IPlayer[];
  refreshPlayers: VoidFunction;
  getPlayer: (id: PlayerId) => IPlayer;
  games: IGame[];
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

  return {
    props: {
      games: JSON.stringify(games),
      players: JSON.stringify(players),
    },
  };
}

export default Home;
