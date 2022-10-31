import { Game } from "./Game";
import { Player, PlayerId } from "./Player";
import { Tournament } from "./Tournament";

export interface RatedPlayer extends Player {
  rating: number;
}

export interface GameWithDelta extends Game {
  delta: number;
}

export interface TournamentWithDelta extends Tournament {
  deltas: { [playerId: string]: number };
}

export type LeaderboardEvent = GameWithDelta | TournamentWithDelta;

export class Leaderboard {
  constructor(
    public readonly players: Player[],
    public readonly games: Game[],
    public readonly tournaments: Tournament[]
  ) {}

  getRankedPlayers(date = new Date()): RatedPlayer[] {
    let ratedPlayers: RatedPlayer[] = this.players.map((player) => ({
      ...player,
      rating: 1500,
    }));

    [...this.games, ...this.tournaments]
      .filter((game) => game.createdAt < +date)
      .sort((a, b) => a.createdAt - b.createdAt)
      .forEach((gameOrTournament) => {
        if (Leaderboard.isGame(gameOrTournament)) {
          ratedPlayers = Leaderboard.applyGame(gameOrTournament, ratedPlayers);
        } else {
          ratedPlayers = Leaderboard.applyTournament(
            gameOrTournament,
            ratedPlayers
          );
        }
      });

    return ratedPlayers.sort((a, b) => b.rating - a.rating);
  }

  get events(): LeaderboardEvent[] {
    const playersWithInitialRating: RatedPlayer[] = this.players.map(
      (player) => ({ ...player, rating: 1500 })
    );

    const { events } = [...this.games, ...this.tournaments]
      .sort((a, b) => a.createdAt - b.createdAt)
      .reduce<{ events: LeaderboardEvent[]; players: RatedPlayer[] }>(
        (curr, event) => {
          if (Leaderboard.isGame(event)) {
            const ratedPlayers = Leaderboard.applyGame(event, curr.players);
            const ratedGame: GameWithDelta = {
              ...event,
              delta: Leaderboard.getGameDelta(event, curr.players),
            };

            return {
              events: [...curr.events, ratedGame],
              players: ratedPlayers,
            };
          } else {
            const ratedPlayers = Leaderboard.applyTournament(
              event,
              curr.players
            );
            const ratedTournament: TournamentWithDelta = {
              ...event,
              deltas: Leaderboard.getTournamentDeltas(event, curr.players),
            };

            return {
              events: [...curr.events, ratedTournament],
              players: ratedPlayers,
            };
          }
        },
        { events: [], players: playersWithInitialRating }
      );

    return events;
  }

  public static applyTournament(
    tournament: Tournament,
    ratedPlayers: RatedPlayer[]
  ): RatedPlayer[] {
    const prizepool = tournament.players.length * tournament.wager;

    return ratedPlayers
      .map((player) => {
        if (tournament.players.includes(player.id)) {
          return { ...player, rating: player.rating - tournament.wager };
        }
        return player;
      })
      .map((player) => {
        if (tournament.first.includes(player.id)) {
          return {
            ...player,
            rating: player.rating + Math.round(prizepool * 0.25),
          };
        }
        if (tournament.second.includes(player.id)) {
          return {
            ...player,
            rating: player.rating + Math.round(prizepool * 0.15),
          };
        }
        if (tournament.third.includes(player.id)) {
          return {
            ...player,
            rating: player.rating + Math.round(prizepool * 0.1),
          };
        }

        return player;
      });
  }

  public static applyGame(
    game: Game,
    ratedPlayers: RatedPlayer[]
  ): RatedPlayer[] {
    const delta = Leaderboard.getGameDelta(game, ratedPlayers);

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

  public static getGameDelta(game: Game, ratedPlayers: RatedPlayer[]): number {
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

  public static getTournamentDeltas(
    tournament: Tournament,
    ratedPlayers: RatedPlayer[]
  ): { [key in PlayerId]: number } {
    const ratedPlayersPostTournament = Leaderboard.applyTournament(
      tournament,
      ratedPlayers
    );

    return tournament.players.reduce<{ [key in PlayerId]: number }>(
      (curr, playerId) => {
        const playerBefore = ratedPlayers.find(
          (player) => player.id === playerId
        );
        const playerAfter = ratedPlayersPostTournament.find(
          (player) => player.id === playerId
        );

        if (playerBefore && playerAfter) {
          return {
            ...curr,
            [playerId]: playerAfter.rating - playerBefore.rating,
          };
        }

        return curr;
      },
      {}
    );
  }

  public static isGame(
    gameOrTournament: Game | Tournament
  ): gameOrTournament is Game {
    return (gameOrTournament as Game).winnerTeam !== undefined;
  }
}
