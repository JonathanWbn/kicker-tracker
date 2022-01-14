import { PlayerId } from "./Player";

export type Team = [PlayerId, PlayerId];
export type GameId = string;
export class Game implements IGame {
  constructor(
    public readonly id: GameId,
    public readonly winnerTeam: Team,
    public readonly loserTeam: Team
  ) {
    if ([...winnerTeam, ...loserTeam].filter(onlyUnique).length !== 4) {
      throw new Error("There must be four unique players.");
    }
  }
}

export interface IGame {
  id: GameId;
  winnerTeam: Team;
  loserTeam: Team;
}

function onlyUnique(value: any, index: number, self: any[]) {
  return self.indexOf(value) === index;
}
