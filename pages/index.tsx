import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import GameForm from "../components/game-form";
import GameList from "../components/game-list";
import PlayerForm from "../components/player-form";
import PlayerList from "../components/player-list";
import { GameId, IGame } from "../domain/Game";
import { IPlayer, PlayerId } from "../domain/Player";
import styles from "../styles/Home.module.css";

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

const Home: NextPage = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);
  const [games, setGames] = useState<IGame[]>([]);

  useEffect(fetchPlayers, []);
  useEffect(fetchGames, []);

  function fetchPlayers() {
    axios("/api/players").then(({ data }) => setPlayers(data));
  }

  function fetchGames() {
    axios("/api/games").then(({ data }) => setGames(data));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kicker</title>
      </Head>

      <main className={styles.main}>
        <DataContext.Provider
          value={{
            players,
            refreshPlayers: fetchPlayers,
            getPlayer: (id) => {
              const player = players.find((el) => el.id === id);
              return player || { id: "", name: "" };
            },
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
    </div>
  );
};

export default Home;
