import { PlayerId } from "./Player";

export type TournamentTeam = [PlayerId, PlayerId];
export type TournamentId = string;
type Timestamp = number;

export interface Tournament {
  id: TournamentId;
  createdAt: Timestamp;
  wager: number;
  players: PlayerId[];
  first: TournamentTeam;
  second: TournamentTeam;
  third: TournamentTeam;
}
