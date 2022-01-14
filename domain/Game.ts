import { uniq } from "lodash";

import { PlayerId } from "./Player";

export type Team = [PlayerId, PlayerId];
export type GameId = string;

export class Game implements IGame {
  constructor(
    public readonly id: GameId,
    public readonly createdAt: Date,
    public readonly winnerTeam: Team,
    public readonly loserTeam: Team
  ) {
    if (uniq([...winnerTeam, ...loserTeam]).length !== 4) {
      throw new Error("There must be four unique players.");
    }
  }
}

export interface IGame {
  id: GameId;
  createdAt: Date;
  winnerTeam: Team;
  loserTeam: Team;
}
