import Image from "next/image";
import { useContext } from "react";
import { RatedGame } from "../domain/Leaderboard";
import { DataContext } from "../pages";
import Pill from "./pill";

export const PlayerDeltaPills = ({ games }: { games: RatedGame[] }) => {
  const { getPlayer } = useContext(DataContext);

  const players: Record<string, number> = {};

  games.forEach((game) => {
    game.winnerTeam.forEach((player) => {
      if (player) {
        players[player] = (players[player] || 0) + game.delta;
      }
    });
    game.loserTeam.forEach((player) => {
      if (player) {
        players[player] = (players[player] || 0) - game.delta;
      }
    });
  });

  return (
    <div className="flex flex-wrap mb-1">
      {Object.entries(players)
        .sort(([, a], [, b]) => b - a)
        .map(([player, delta]) => (
          <Pill key={player} className="flex items-center mb-1 mr-1">
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
