import React, { MouseEvent, useContext, useState } from "react";
import Button from "./button";
import Card from "./card";
import { RadioGroup } from "@headlessui/react";
import { DataContext } from "../data";
import { PlayerId } from "../domain/Player";
import axios from "axios";

interface Props {
  onClose: VoidFunction;
}

const wagerOptions = [20, 30, 40, 50];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function TournamentForm({ onClose }: Props) {
  const { refresh, leaderboard } = useContext(DataContext);
  const [wager, setWager] = useState(wagerOptions[1]);
  const [players, setPlayers] = useState<PlayerId[]>([]);
  const [_firstTeam, setFirstTeam] = useState<PlayerId[]>([]);
  const [_secondTeam, setSecondTeam] = useState<PlayerId[]>([]);
  const [_thirdTeam, setThirdTeam] = useState<PlayerId[]>([]);

  const firstTeam = _firstTeam.filter((p) => players.includes(p));
  const secondTeam = _secondTeam.filter((p) => players.includes(p));
  const thirdTeam = _thirdTeam.filter((p) => players.includes(p));

  const isComplete =
    players.length >= 6 &&
    firstTeam.length === 2 &&
    secondTeam.length === 2 &&
    thirdTeam.length === 2;

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!isComplete) {
      return;
    }

    await axios.post("/api/tournaments", {
      wager,
      players,
      first: firstTeam,
      second: secondTeam,
      third: thirdTeam,
    });
    void refresh();
    setPlayers([]);
    setFirstTeam([]);
    setSecondTeam([]);
    setThirdTeam([]);
    onClose();
  }

  return (
    <Card isActive>
      <div className="font-bold mb-1">Wager</div>
      <RadioGroup value={wager} onChange={setWager}>
        <div className="grid grid-cols-4 gap-3">
          {wagerOptions.map((wagerOption) => (
            <RadioGroup.Option
              key={wagerOption}
              value={wagerOption}
              className={({ checked, active }) =>
                classNames(
                  "cursor-pointer focus:outline-none",
                  checked ? "bg-slate-500" : "bg-slate-700",
                  "text-white rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase"
                )
              }
            >
              <RadioGroup.Label as="span">{wagerOption}</RadioGroup.Label>
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <div className="font-bold mt-2 mb-1">
        Players {players.length ? `(${players.length})` : ""}
      </div>
      <div className="grid grid-cols-3 gap-3">
        {leaderboard
          .getRankedPlayers()
          .filter((player) => !player.isRetired)
          .map((player) => (
            <div
              key={player.id}
              onClick={() =>
                setPlayers((players) => {
                  if (players.includes(player.id)) {
                    return players.filter((id) => id !== player.id);
                  }
                  return [...players, player.id];
                })
              }
              className={classNames(
                "cursor-pointer focus:outline-none",
                players.includes(player.id) ? "bg-slate-500" : "bg-slate-700",
                "text-white rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase"
              )}
            >
              <span>{player.name}</span>
            </div>
          ))}
      </div>
      {players.length >= 6 && (
        <>
          <div className="font-bold mt-2 mb-1">1st Place Team</div>
          <div className="grid grid-cols-3 gap-3">
            {leaderboard
              .getRankedPlayers()
              .filter((player) => players.includes(player.id))
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() =>
                    setFirstTeam((firstTeam) => {
                      if (firstTeam.includes(player.id)) {
                        return firstTeam.filter((id) => id !== player.id);
                      }
                      if (firstTeam.length === 2) {
                        return firstTeam;
                      }
                      return [...firstTeam, player.id];
                    })
                  }
                  className={classNames(
                    "cursor-pointer focus:outline-none",
                    firstTeam.includes(player.id)
                      ? "bg-slate-500"
                      : "bg-slate-700",
                    "text-white rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase"
                  )}
                >
                  <span>{player.name}</span>
                </div>
              ))}
          </div>
        </>
      )}
      {firstTeam.length === 2 && (
        <>
          <div className="font-bold mt-2 mb-1">2nd Place Team</div>
          <div className="grid grid-cols-3 gap-3">
            {leaderboard
              .getRankedPlayers()
              .filter(
                (player) =>
                  players.includes(player.id) && !firstTeam.includes(player.id)
              )
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() =>
                    setSecondTeam((secondTeam) => {
                      if (secondTeam.includes(player.id)) {
                        return secondTeam.filter((id) => id !== player.id);
                      }
                      if (secondTeam.length === 2) {
                        return secondTeam;
                      }
                      return [...secondTeam, player.id];
                    })
                  }
                  className={classNames(
                    "cursor-pointer focus:outline-none",
                    secondTeam.includes(player.id)
                      ? "bg-slate-500"
                      : "bg-slate-700",
                    "text-white rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase"
                  )}
                >
                  <span>{player.name}</span>
                </div>
              ))}
          </div>
        </>
      )}
      {secondTeam.length === 2 && (
        <>
          <div className="font-bold mt-2 mb-1">3rd Place Team</div>
          <div className="grid grid-cols-3 gap-3">
            {leaderboard
              .getRankedPlayers()
              .filter(
                (player) =>
                  players.includes(player.id) &&
                  !firstTeam.includes(player.id) &&
                  !secondTeam.includes(player.id)
              )
              .map((player) => (
                <div
                  key={player.id}
                  onClick={() =>
                    setThirdTeam((thirdTeam) => {
                      if (thirdTeam.includes(player.id)) {
                        return thirdTeam.filter((id) => id !== player.id);
                      }
                      if (thirdTeam.length === 2) {
                        return thirdTeam;
                      }
                      return [...thirdTeam, player.id];
                    })
                  }
                  className={classNames(
                    "cursor-pointer focus:outline-none",
                    thirdTeam.includes(player.id)
                      ? "bg-slate-500"
                      : "bg-slate-700",
                    "text-white rounded-md py-2 px-2 flex items-center justify-center text-sm font-medium uppercase"
                  )}
                >
                  <span>{player.name}</span>
                </div>
              ))}
          </div>
        </>
      )}
      <div className="flex justify-around mt-4">
        <Button
          onClick={() => {
            onClose();
          }}
          textSize="text-base"
          backgroundColor="bg-slate-700"
        >
          cancel
        </Button>
        <Button
          backgroundColor="bg-green-700"
          textSize="text-base"
          onClick={handeSubmit}
        >
          create
        </Button>
      </div>
    </Card>
  );
}

export default TournamentForm;
