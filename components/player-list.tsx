import { useContext, useState } from "react";

import { IPlayer } from "../domain/Player";
import { DataContext } from "../pages";
import EditPlayer from "./edit-player";

function PlayerList() {
  const { players } = useContext(DataContext);

  return (
    <>
      <h1>Players</h1>
      <ul>
        {players.map((player) => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </ul>
    </>
  );
}

function PlayerItem({ player }: { player: IPlayer }) {
  const { refreshPlayers } = useContext(DataContext);
  const [isEdit, setIsEdit] = useState(false);

  return (
    <li key={player.id}>
      {isEdit ? (
        <EditPlayer
          initial={player}
          onUpdated={() => {
            refreshPlayers();
            setIsEdit(false);
          }}
          onCancel={() => setIsEdit(false)}
        />
      ) : (
        <>
          {player.name} <button onClick={() => setIsEdit(true)}>Edit</button>
        </>
      )}
    </li>
  );
}

export default PlayerList;
