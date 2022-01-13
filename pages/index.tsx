import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import PlayerForm from "../components/player-form";
import PlayerList from "../components/player-list";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [playerRefreshKey, setPlayerRefreshKey] = useState(0);

  return (
    <div className={styles.container}>
      <Head>
        <title>Kicker</title>
      </Head>

      <main className={styles.main}>
        <PlayerForm onCreated={() => setPlayerRefreshKey((v) => v + 1)} />
        <PlayerList refreshKey={playerRefreshKey} />
      </main>
    </div>
  );
};

export default Home;
