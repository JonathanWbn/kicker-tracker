import Image from "next/image";
import { useContext } from "react";
import { DataContext } from "../data";
import { Leaderboard, LeaderboardEvent } from "../domain/Leaderboard";
import Pill from "./pill";

export const PlayerDeltaPills = ({
  events,
}: {
  events: LeaderboardEvent[];
}) => {
  const { getPlayer } = useContext(DataContext);

  const players: Record<string, number> = {};

  events.forEach((event) => {
    if (Leaderboard.isGame(event)) {
      event.winnerTeam.forEach((player) => {
        if (player) {
          players[player] = (players[player] || 0) + event.delta;
        }
      });
      event.loserTeam.forEach((player) => {
        if (player) {
          players[player] = (players[player] || 0) - event.delta;
        }
      });
    } else {
      event.players.forEach((player) => {
        if (player) {
          players[player] = (players[player] || 0) + event.deltas[player];
        }
      });
    }
  });

  return (
    <div className="flex flex-wrap mb-1">
      {Object.entries(players)
        .sort(([, a], [, b]) => b - a)
        .map(([player, delta]) => (
          <Pill
            key={player}
            className="flex items-center mb-1 mr-1"
            tooltip={getPlayer(player).name}
          >
            <Image
              src={`/animals/${getPlayer(player).animal}.png`}
              alt={getPlayer(player).animal}
              width={20}
              height={20}
            />
            <div
              className={`ml-1 text-xs ${
                delta > 0
                  ? "text-green-400"
                  : delta < 0
                  ? "text-red-400"
                  : "text-slate-300"
              }`}
            >
              {delta > 0 ? "+" : ""}
              {delta}
            </div>
          </Pill>
        ))}
    </div>
  );
};

export const PlayerDeltaPillsSkeleton = () => {
  return (
    <div className="flex flex-wrap mb-1">
      {[...Array(5)].map((_, i) => (
        <Pill key={i} className="flex items-center mb-1 mr-1">
          <div className="w-5 h-5 bg-slate-600 rounded-full animate-pulse" />
          <div className="ml-1 text-xs text-slate-300 animate-pulse">±16</div>
        </Pill>
      ))}
    </div>
  );
};
