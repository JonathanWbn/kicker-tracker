import axios from "axios";
import Image from "next/image";
import { useContext, useState } from "react";
import { format } from "date-fns";

import { IGame } from "../domain/Game";
import { DataContext } from "../pages";
import GameForm from "./game-form";

function GameList() {
  const { games } = useContext(DataContext);

  return (
    <>
      <GameForm />
      <ul className="mt-1">
        {games
          .sort((a, b) => +b.createdAt - +a.createdAt)
          .map((game) => (
            <GameItem key={game.id} game={game} />
          ))}
      </ul>
    </>
  );
}

function GameItem({
  game: { id, winnerTeam, loserTeam, createdAt },
}: {
  game: IGame;
}) {
  const { getPlayer, refreshGames } = useContext(DataContext);
  const [isDeletion, setIsDeletion] = useState(false);

  const [winner1, winner2] = winnerTeam.map(getPlayer);
  const [loser1, loser2] = loserTeam.map(getPlayer);

  async function handleDelete() {
    await axios.delete(`/api/games/${id}`);
    refreshGames();
  }

  return (
    <li
      className="bg-slate-700 rounded-2xl p-4 mt-2"
      onClick={() => !isDeletion && setIsDeletion(true)}
    >
      {isDeletion ? (
        <div className="flex justify-around">
          <button
            className="text-xs px-4 py-2"
            onClick={() => {
              setIsDeletion(false);
            }}
          >
            CANCEL
          </button>
          <button
            className="text-xs rounded px-4 py-2 bg-red-700"
            onClick={handleDelete}
          >
            DELETE
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <Image
              src={`/animals/${winner1.animal}.png`}
              alt={winner1.animal}
              width={24}
              height={24}
            />
            <Image
              src={`/animals/${winner2.animal}.png`}
              alt={winner2.animal}
              width={24}
              height={24}
            />
            <p className="font-bold ml-2">
              {winner1.name}, {winner2.name}
            </p>
            <div className="grow"></div>
            <p className="text-slate-300">Winner</p>
          </div>
          <div className="flex items-center">
            <Image
              src={`/animals/${loser1.animal}.png`}
              alt={loser1.animal}
              width={24}
              height={24}
            />
            <Image
              src={`/animals/${loser2.animal}.png`}
              alt={loser2.animal}
              width={24}
              height={24}
            />
            <p className="ml-2">
              {loser1.name}, {loser2.name}
            </p>
            <div className="grow"></div>
            <p className="text-slate-400">{format(createdAt, "MMM Do")}</p>
          </div>
        </>
      )}
    </li>
  );
}

export default GameList;
