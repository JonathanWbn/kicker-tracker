import { PlayerId } from "./Player";

export type Team = [PlayerId, PlayerId | undefined];
export type GameId = string;
type Timestamp = number;

export interface Game {
  id: GameId;
  createdAt: Timestamp;
  winnerTeam: Team;
  loserTeam: Team;
}
