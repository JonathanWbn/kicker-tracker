import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { createContext, useEffect, useState } from "react";
import PlayerForm from "../components/player-form";
import PlayerList from "../components/player-list";
import { IPlayer } from "../domain/Player";
import styles from "../styles/Home.module.css";

export const PlayerContext = createContext<{
  players: IPlayer[];
  refresh: VoidFunction;
}>({ players: [], refresh: () => {} });

const Home: NextPage = () => {
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(fetchPlayers, []);

  function fetchPlayers() {
    axios("/api/players").then(({ data }) => setPlayers(data));
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Kicker</title>
      </Head>

      <main className={styles.main}>
        <PlayerContext.Provider value={{ players, refresh: fetchPlayers }}>
          <PlayerForm />
          <PlayerList />
        </PlayerContext.Provider>
      </main>
    </div>
  );
};

export default Home;
