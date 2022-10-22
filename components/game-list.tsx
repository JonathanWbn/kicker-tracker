import axios from "axios";
import Image from "next/image";
import { useContext, useState, Fragment } from "react";
import { format, sub } from "date-fns";

import { DataContext } from "../pages";
import Button from "./button";
import Card from "./card";
import { RatedGame } from "../domain/Leaderboard";
import {
  PlayerDeltaPills,
  PlayerDeltaPillsSkeleton,
} from "./player-delta-pills";

function GameList() {
  const { leaderboard, isLoading } = useContext(DataContext);
  const [daysShown, setDaysShown] = useState(5);

  const gamesByDay = leaderboard.ratedGames
    .reverse()
    .reduce<Record<string, RatedGame[]>>((games, game) => {
      const day = format(game.createdAt, "MMM do");
      return { ...games, [day]: [...(games[day] || []), game] };
    }, {});

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      {Object.entries(gamesByDay)
        .slice(0, daysShown)
        .map(([day, games]) => (
          <Fragment key={day}>
            <p className="text-slate-400 mt-4">{day}</p>
            <PlayerDeltaPills games={games} />
            {games.map((game) => (
              <GameItem key={game.id} game={game} />
            ))}
          </Fragment>
        ))}
      {daysShown < Object.keys(gamesByDay).length && (
        <div className="flex justify-center">
          <Button
            className="bg-slate-600"
            onClick={() => setDaysShown((v) => v + 5)}
            label="show more"
          />
        </div>
      )}
    </>
  );
}

function GameItem({
  game: { id, winnerTeam, loserTeam, delta },
}: {
  game: RatedGame;
}) {
  const { getPlayer, refresh } = useContext(DataContext);
  const [isDeletion, setIsDeletion] = useState(false);

  const [winner1, winner2] = winnerTeam.map(getPlayer);
  const [loser1, loser2] = loserTeam.map(getPlayer);

  async function handleDelete() {
    await axios.delete(`/api/games/${id}`);
    void refresh();
  }

  return (
    <Card className="mb-2" onClick={() => !isDeletion && setIsDeletion(true)}>
      {isDeletion ? (
        <div className="flex justify-around">
          <Button onClick={() => setIsDeletion(false)} label="cancel" />
          <Button
            className="bg-red-700"
            onClick={handleDelete}
            label="delete"
          />
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <div className="h-6 w-12 flex justify-center">
              <Image
                src={`/animals/${winner1.animal}.png`}
                alt={winner1.animal}
                width={24}
                height={24}
              />
              {winner2.id !== "placeholder" && (
                <Image
                  src={`/animals/${winner2.animal}.png`}
                  alt={winner2.animal}
                  width={24}
                  height={24}
                />
              )}
            </div>
            <p className="font-bold ml-2">
              {winner1.name}
              {winner2.name ? `, ${winner2.name}` : ""}
            </p>
            <div className="grow"></div>
            <p className="text-green-400">+{delta}</p>
          </div>
          <div className="flex items-center">
            <div className="h-6 w-12 flex justify-center">
              <Image
                src={`/animals/${loser1.animal}.png`}
                alt={loser1.animal}
                width={24}
                height={24}
              />
              {loser2.id !== "placeholder" && (
                <Image
                  src={`/animals/${loser2.animal}.png`}
                  alt={loser2.animal}
                  width={24}
                  height={24}
                />
              )}
            </div>
            <p className="ml-2">
              {loser1.name}
              {loser2.name ? `, ${loser2.name}` : ""}
            </p>
            <div className="grow"></div>
            <p className="text-red-400">-{delta}</p>
          </div>
        </>
      )}
    </Card>
  );
}

const Skeleton = () => (
  <>
    {Array.from(Array(3)).map((_, i) => (
      <Fragment key={i}>
        <p className="text-slate-400 mt-4">
          {format(sub(new Date(), { days: i }), "MMM do")}
        </p>
        <PlayerDeltaPillsSkeleton />
        {Array.from(Array(3)).map((_, i) => (
          <Card className="mb-2" key={i}>
            <div className="flex items-center mb-2 animate-pulse">
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>,{" "}
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>
              <div className="grow"></div>
              <p className="text-slate-100">±16</p>
            </div>
            <div className="flex items-center animate-pulse">
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>,{" "}
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>
              <div className="grow"></div>
              <p className="text-slate-100">±16</p>
            </div>
          </Card>
        ))}
      </Fragment>
    ))}
  </>
);

export default GameList;
