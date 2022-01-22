import React, { useContext, useState } from "react";
import { Leaderboard, RatedPlayer } from "../domain/Leaderboard";
import Image from "next/image";

import { DataContext } from "../pages";
import PlayerForm from "./player-form";

function PlayerList() {
  const { players, games } = useContext(DataContext);

  const leaderboard = new Leaderboard(players, games);

  return (
    <>
      <ol className="bg-slate-700 rounded-2xl p-4">
        {leaderboard.rankedPlayers.map((player, i) => (
          <PlayerItem key={player.id} player={player} rank={i + 1} />
        ))}
      </ol>
      <PlayerForm />
    </>
  );
}

function PlayerItem({ player, rank }: { player: RatedPlayer; rank: number }) {
  const { refreshPlayers } = useContext(DataContext);
  const [isEdit, setIsEdit] = useState(false);

  /*
  <EditPlayer
          initial={player}
          onUpdated={() => {
            refreshPlayers();
            setIsEdit(false);
          }}
          onCancel={() => setIsEdit(false)}
        />
        */

  return (
    <li
      key={player.id}
      className="border-b last:border-0 p-2 border-slate-600 flex items-center"
    >
      <p className="mr-2 w-4 text-slate-300 text-center">{rank}</p>
      <Image
        src={`/animals/${player.animal}.png`}
        alt={player.animal}
        width={24}
        height={24}
      />
      <p className="ml-2">{player.name}</p>
      <div className="grow"></div>
      <p className="text-slate-400 w-10 text-center">{player.rating}</p>
    </li>
  );
}

export default PlayerList;
