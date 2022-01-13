import type { NextPage } from "next";
import Head from "next/head";
import PlayerForm from "../components/player-form";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Kicker</title>
      </Head>

      <main className={styles.main}>
        <PlayerForm />
      </main>
    </div>
  );
};

export default Home;
