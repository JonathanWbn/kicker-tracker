import React, { useContext, useRef, useState } from "react";
import { RatedPlayer } from "../domain/Leaderboard";
import { animated, useSpring } from "react-spring";
import Image from "next/image";

import { DataContext } from "../data";
import axios from "axios";
import { animals } from "../domain/Player";
import Button from "./button";
import Card from "./card";
import { Flipped, Flipper } from "react-flip-toolkit";
import {
  add,
  endOfDay,
  format,
  isSameDay,
  sub,
  isBefore,
  isAfter,
} from "date-fns";
import { partition } from "lodash";

function PlayerList() {
  const { leaderboard, games } = useContext(DataContext);
  const { start, date, prev, skip, cancel } = useTimeline(
    sub(leaderboard.events[0].createdAt, { days: 1 }),
    800,
    (date) => !leaderboard.games.some((game) => isSameDay(date, game.createdAt))
  );

  const rankedPlayers = leaderboard.getRankedPlayers(date);
  const [activePlayers, retiredPlayers] = partition(
    rankedPlayers,
    (player) => date || !player.isRetired
  );

  return (
    <Card>
      <div className="flex justify-center mb-2">
        {date && (
          <Button backgroundColor="bg-blue-500" onClick={() => prev(7)}>
            {"<"}
          </Button>
        )}
        <Button
          onClick={date ? cancel : start}
          backgroundColor={!date ? "bg-blue-500" : undefined}
        >
          {date
            ? format(date, "MMM do")
            : `show history (${games.length} games)`}
        </Button>
        {date && (
          <Button backgroundColor="bg-blue-500" onClick={() => skip(7)}>
            {">"}
          </Button>
        )}
      </div>
      <Flipper flipKey={activePlayers.map(({ id }) => id).join()}>
        {activePlayers.map((player, i) => (
          <PlayerItem
            key={player.id}
            player={player}
            rank={i + 1}
            showBar={Boolean(date)}
          />
        ))}
        {retiredPlayers.map((player, i) => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </Flipper>{" "}
    </Card>
  );
}

function PlayerItem({
  player,
  rank,
  showBar,
}: {
  player: RatedPlayer;
  rank?: number;
  showBar?: boolean;
}) {
  const { refresh, players } = useContext(DataContext);
  const [isNameEdit, setIsNameEdit] = useState(false);
  const [isAnimalEdit, setIsAnimalEdit] = useState(false);
  const [values, setValues] = useState(player);

  async function handleSave() {
    await axios.post(`/api/players/${player.id}`, values);
    void refresh();
    setIsNameEdit(false);
    setIsAnimalEdit(false);
  }

  async function handleRetirement() {
    const confirmed = confirm("Are you sure you want to retire this player?");
    if (!confirmed) {
      return;
    }
    await axios.post(`/api/players/${player.id}`, {
      ...player,
      isRetired: true,
    });
    void refresh();
    setIsNameEdit(false);
    setIsAnimalEdit(false);
  }

  async function handleComeback() {
    await axios.post(`/api/players/${player.id}`, {
      ...player,
      isRetired: false,
    });
    void refresh();
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
        className={`border-b last:border-0 p-2 border-slate-600 flex items-center relative ${
          player.isRetired ? "opacity-50" : ""
        }`}
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
            <div className="flex justify-around">
              {player.isRetired ? (
                <Button onClick={handleComeback}>come back</Button>
              ) : (
                <Button onClick={handleRetirement}>retire</Button>
              )}
              <Button onClick={handleSave}>save</Button>
            </div>
          </div>
        ) : (
          <>
            <p className="mr-2 w-4 text-slate-300 text-center">{rank || "-"}</p>
            {player.isTournamentWinner ? (
              <div className="w-6 flex justify-center items-center flex-col relative">
                <div className="absolute text-xs -right-1 -bottom-1">🥇</div>
                <Image
                  src={`/animals/${player.animal}.png`}
                  alt={player.animal}
                  width={20}
                  height={20}
                  onClick={() => setIsAnimalEdit(true)}
                />
              </div>
            ) : (
              <Image
                src={`/animals/${player.animal}.png`}
                alt={player.animal}
                width={24}
                height={24}
                onClick={() => setIsAnimalEdit(true)}
              />
            )}
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
                <Button onClick={handleSave} className="px-1 py-0">
                  save
                </Button>
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
): {
  start: VoidFunction;
  cancel: VoidFunction;
  date?: Date;
  skip: (days: number) => void;
  prev: (days: number) => void;
} {
  const [date, setDate] = useState<Date>();
  const intervalRef = useRef<NodeJS.Timer>();

  return {
    start: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setDate((date) => {
          if (isAfter(endOfDay(date!), new Date())) {
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
    cancel: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setDate(undefined);
    },
    skip: (days: number) => date && setDate(add(date, { days })),
    prev: (days: number) => date && setDate(sub(date, { days })),
    date,
  };
}

export default PlayerList;
