import React, { useContext, useState } from "react";
import { Leaderboard, RatedPlayer } from "../domain/Leaderboard";
import Image from "next/image";

import { DataContext } from "../pages";
import PlayerForm from "./player-form";
import axios from "axios";
import { animals } from "../domain/Player";
import Button from "./button";

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

  return (
    <li className="border-b last:border-0 p-2 border-slate-600 flex items-center">
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
                onChange={(e) => setValues({ ...values, name: e.target.value })}
              ></input>
              <Button onClick={handleSave} label="Save" className="px-1 py-0" />
            </div>
          ) : (
            <>
              <p className="ml-2" onClick={() => setIsNameEdit(true)}>
                {player.name}
              </p>
              <div className="grow"></div>
              <p className="text-slate-400 w-10 text-center">{player.rating}</p>
            </>
          )}
        </>
      )}
    </li>
  );
}

export default PlayerList;
