import { Game } from "./Game";
import { Player } from "./Player";

export interface RatedPlayer extends Player {
  rating: number;
}

export interface RatedGame extends Game {
  delta: number;
}

export class Leaderboard {
  constructor(
    public readonly players: Player[],
    public readonly games: Game[]
  ) {}

  getRankedPlayers(date = new Date()): RatedPlayer[] {
    let ratedPlayers: RatedPlayer[] = this.players.map((player) => ({
      ...player,
      rating: 1500,
    }));

    this.games
      .filter((game) => game.createdAt < +date)
      .sort((a, b) => a.createdAt - b.createdAt)
      .forEach((game) => {
        ratedPlayers = this.applyGame(game, ratedPlayers);
      });

    return ratedPlayers.sort((a, b) => b.rating - a.rating);
  }

  get ratedGames(): RatedGame[] {
    const playersWithInitialRating: RatedPlayer[] = this.players.map(
      (player) => ({ ...player, rating: 1500 })
    );

    const { games } = this.games
      .sort((a, b) => a.createdAt - b.createdAt)
      .reduce<{ games: RatedGame[]; players: RatedPlayer[] }>(
        (curr, game) => {
          const ratedPlayers = this.applyGame(game, curr.players);
          const ratedGame: RatedGame = {
            ...game,
            delta: this.getGameDelta(game, curr.players),
          };

          return {
            games: [...curr.games, ratedGame],
            players: ratedPlayers,
          };
        },
        { games: [], players: playersWithInitialRating }
      );

    return games;
  }

  private applyGame(game: Game, ratedPlayers: RatedPlayer[]): RatedPlayer[] {
    const delta = this.getGameDelta(game, ratedPlayers);

    return ratedPlayers.map((player) => {
      if (
        game.winnerTeam[0] === player.id ||
        game.winnerTeam[1] === player.id
      ) {
        return { ...player, rating: player.rating + delta };
      }
      if (game.loserTeam[0] === player.id || game.loserTeam[1] === player.id) {
        return { ...player, rating: player.rating - delta };
      }

      return player;
    });
  }

  public getGameDelta(game: Game, ratedPlayers: RatedPlayer[]): number {
    const winner1 = ratedPlayers.find(
      (player) => game.winnerTeam[0] === player.id
    );
    const winner2 = ratedPlayers.find(
      (player) => game.winnerTeam[1] === player.id
    );
    const loser1 = ratedPlayers.find(
      (player) => game.loserTeam[0] === player.id
    );
    const loser2 = ratedPlayers.find(
      (player) => game.loserTeam[1] === player.id
    );

    const ratingWinnerTeam =
      winner1 && winner2
        ? (winner1.rating + winner2.rating) / 2
        : winner1
        ? winner1.rating
        : 1500;
    const ratingLoserTeam =
      loser1 && loser2
        ? (loser1.rating + loser2.rating) / 2
        : loser1
        ? loser1.rating
        : 1500;

    const winnerChanceToWin =
      1 / (1 + Math.pow(10, (ratingLoserTeam - ratingWinnerTeam) / 400));
    const delta = Math.round(32 * (1 - winnerChanceToWin));

    return delta;
  }
}
