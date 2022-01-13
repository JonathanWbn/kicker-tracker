import axios from "axios";
import { useEffect, useState } from "react";
import { IPlayer } from "../domain/Player";

function PlayerList({ refreshKey }: { refreshKey: number }) {
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    axios("/api/players").then(({ data }) => setPlayers(data));
  }, [refreshKey]);

  return (
    <>
      <h1>Players</h1>
      <ul>
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </>
  );
}

export default PlayerList;
