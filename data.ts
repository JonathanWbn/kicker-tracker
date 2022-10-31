import { createContext } from "react";
import { Game } from "./domain/Game";
import { Leaderboard } from "./domain/Leaderboard";
import { Player, PlayerId } from "./domain/Player";

export const DataContext = createContext<{
  players: Player[];
  games: Game[];
  getPlayer: (id: PlayerId | undefined) => Player;
  refresh: VoidFunction;
  leaderboard: Leaderboard;
  isLoading: boolean;
}>({
  players: [],
  games: [],
  getPlayer: () => {
    throw new Error("No player found.");
  },
  refresh: () => {},
  leaderboard: new Leaderboard([], [], []),
  isLoading: true,
});
