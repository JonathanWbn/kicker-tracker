import React, { useContext, useState } from "react";
import { Leaderboard, RatedPlayer } from "../domain/Leaderboard";

import { IPlayer } from "../domain/Player";
import { DataContext } from "../pages";
import EditPlayer from "./edit-player";

function PlayerList() {
  const { players, games } = useContext(DataContext);

  const leaderboard = new Leaderboard(players, games);

  return (
    <>
      <h1>Players</h1>
      <ol>
        {leaderboard.rankedPlayers.map((player) => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </ol>
    </>
  );
}

function PlayerItem({ player }: { player: RatedPlayer }) {
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
          <span>{player.name}</span> | <span>{player.rating}</span> |{" "}
          <button onClick={() => setIsEdit(true)}>Edit</button>
        </>
      )}
    </li>
  );
}

export default PlayerList;
