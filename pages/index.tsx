import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";

import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import PlayerForm from "../components/player-form";
import PlayerList from "../components/player-list";
import { IGame } from "../domain/Game";
import { IPlayer, PlayerId } from "../domain/Player";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [players, setPlayers] = useState<IPlayer[]>();
  const [games, setGames] = useState<IGame[]>();

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
    return player || { id: "", name: "" };
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kicker</title>
      </Head>

      {!players || !games ? (
        "Loading..."
      ) : (
        <main className={styles.main}>
          <DataContext.Provider
            value={{
              players,
              refreshPlayers: fetchPlayers,
              getPlayer,
              games,
              refreshGames: fetchGames,
            }}
          >
            <PlayerForm />
            <PlayerList />
            <GameForm />
            <GameList />
          </DataContext.Provider>
        </main>
      )}
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

export default Home;
