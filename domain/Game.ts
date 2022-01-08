import { Player } from "./Player";

export class Game {
  constructor(
    public readonly id: string,
    public readonly player1: Player["id"],
    public readonly player2: Player["id"],
    public readonly winner: Player["id"]
  ) {
    if (winner !== player1 || winner !== player2) {
      throw Error("Winner is not one of the players.");
    }
    if (player1 === player2) {
      throw new Error("Both players cannot be the same.");
    }
  }
}
