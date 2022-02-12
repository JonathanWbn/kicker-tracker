import React, { useContext, useRef, useState } from "react";
import { RatedPlayer } from "../domain/Leaderboard";
import { animated, useSpring } from "react-spring";
import Image from "next/image";

import { DataContext } from "../pages";
import axios from "axios";
import { animals } from "../domain/Player";
import Button from "./button";
import Card from "./card";
import { Flipped, Flipper } from "react-flip-toolkit";
import { add, endOfDay, format, isSameDay, sub, isBefore } from "date-fns";

function PlayerList() {
  const { leaderboard } = useContext(DataContext);
  const { start, date } = useTimeline(
    sub(leaderboard.ratedGames[0].createdAt, { days: 1 }),
    800,
    (date) => !leaderboard.games.some((game) => isSameDay(date, game.createdAt))
  );

  const rankedPlayers = leaderboard.getRankedPlayers(date);

  return (
    <Card>
      <Flipper flipKey={rankedPlayers.map(({ id }) => id).join()}>
        {rankedPlayers.map((player, i) => (
          <PlayerItem
            key={player.id}
            player={player}
            rank={i + 1}
            showBar={Boolean(date)}
          />
        ))}
      </Flipper>
      <div className="flex justify-center mt-2">
        <Button
          onClick={date ? undefined : start}
          label={date ? format(date, "MMM do") : "show ranking history"}
          className={date ? "" : "bg-blue-500"}
        />
      </div>
    </Card>
  );
}

function PlayerItem({
  player,
  rank,
  showBar,
}: {
  player: RatedPlayer;
  rank: number;
  showBar: boolean;
}) {
  const { refreshPlayers, players } = useContext(DataContext);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isAnimalEdit, setIsAnimalEdit] = useState(false);
  const [values, setValues] = useState(player);

  async function handleSave() {
    await axios.post(`/api/players/${player.id}`, values);
    refreshPlayers();
    setIsNameEdit(false);
    setIsAnimalEdit(false);
  }

  const percentage = (player.rating / 3000) * 100;
  const imageStyles = useSpring({ marginLeft: `${percentage}%` });
  const wrapperStyles = useSpring({
    background: `linear-gradient(to right, rgb(204 225 255 / 30%) ${percentage}%, transparent ${percentage}%)`,
  });

  return (
    <Flipped flipId={player.id}>
      <animated.div
        className="border-b last:border-0 p-2 border-slate-600 flex items-center relative"
        style={showBar ? wrapperStyles : {}}
      >
        {showBar && (
          <animated.div
            style={{ position: "absolute", marginTop: 6, ...imageStyles }}
          >
            <Image
              src={`/animals/${player.animal}.png`}
              alt={player.name}
              width={24}
              height={24}
            />
          </animated.div>
        )}
        {isAnimalEdit ? (
          <div className="flex flex-col">
            <div className="flex flex-wrap">
              <div
                className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                  player.animal === values.animal
                    ? "border-slate-300"
                    : "border-transparent"
                }`}
                onClick={() => setValues({ ...values, animal: player.animal })}
              >
                <Image
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={28}
                  height={28}
                />
              </div>
              {animals
                .filter(
                  (el) => !players.map((player) => player.animal).includes(el)
                )
                .map((el) => (
                  <div
                    key={el}
                    className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                      el === values.animal
                        ? "border-slate-300"
                        : "border-transparent"
                    }`}
                    onClick={() => setValues({ ...values, animal: el })}
                  >
                    <Image
                      src={`/animals/${el}.png`}
                      alt={el}
                      width={28}
                      height={28}
                    />
                  </div>
                ))}
            </div>
            <Button onClick={handleSave} label="Save" />
          </div>
        ) : (
          <>
            <p className="mr-2 w-4 text-slate-300 text-center">{rank}</p>
            <Image
              src={`/animals/${player.animal}.png`}
              alt={player.animal}
              width={24}
              height={24}
              onClick={() => setIsAnimalEdit(true)}
            />
            {isNameEdit ? (
              <div className="flex grow">
                <input
                  autoFocus
                  className="rounded bg-slate-700 px-1 ml-1 mr-2 w-0 grow"
                  placeholder="Name"
                  value={values.name}
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                ></input>
                <Button
                  onClick={handleSave}
                  label="Save"
                  className="px-1 py-0"
                />
              </div>
            ) : (
              <>
                <p className="ml-2" onClick={() => setIsNameEdit(true)}>
                  {player.name}
                </p>
                <div className="grow"></div>
                <p className="text-slate-400 w-10 text-center">
                  {player.rating}
                </p>
              </>
            )}
          </>
        )}
      </animated.div>
    </Flipped>
  );
}

function useTimeline(
  startDate: Date,
  interval = 800,
  shouldSkip: (date: Date) => boolean
): { start: VoidFunction; date?: Date } {
  const [date, setDate] = useState<Date>();
  const intervalRef = useRef<NodeJS.Timer>();

  return {
    start: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setDate((date) => {
          if (isSameDay(date!, new Date())) {
            clearInterval(intervalRef.current!);
            return undefined;
          }
          let temp = add(date!, { days: 1 });
          while (shouldSkip(temp) && isBefore(temp, new Date())) {
            temp = add(temp, { days: 1 });
          }
          return temp;
        });
      }, interval);
      setDate(endOfDay(startDate));
    },
    date,
  };
}

export default PlayerList;
