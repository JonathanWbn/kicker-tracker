import { Player } from "./Player";

export class Game implements IGame {
  constructor(
    public readonly id: string,
    public readonly player1: Player["id"],
    public readonly player2: Player["id"],
    public readonly winner: Player["id"]
  ) {
    if (winner !== player1 && winner !== player2) {
      throw Error("Winner is not one of the players.");
    }
    if (player1 === player2) {
      throw new Error("Both players cannot be the same.");
    }
  }
}

export interface IGame {
  id: string;
  player1: Player["id"];
  player2: Player["id"];
  winner: Player["id"];
}
