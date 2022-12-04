import { createContext } from "react";
import { Game } from "./domain/Game";
import { Leaderboard, RatedPlayer } from "./domain/Leaderboard";
import { Player, PlayerId } from "./domain/Player";

interface GameDay {
  date: number;
  rankings: RatedPlayer[];
}
type History = Array<GameDay>;

export const DataContext = createContext<{
  players: Player[];
  games: Game[];
  getPlayer: (id: PlayerId | undefined) => Player;
  refresh: VoidFunction;
  leaderboard: Leaderboard;
  history: History;
  isLoading: boolean;
}>({
  players: [],
  games: [],
  getPlayer: () => {
    throw new Error("No player found.");
  },
  refresh: () => {},
  leaderboard: new Leaderboard([], [], []),
  history: [],
  isLoading: true,
});
