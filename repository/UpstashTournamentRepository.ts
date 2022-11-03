import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";
import { PlayerId } from "../domain/Player";

import { Tournament, TournamentTeam, TournamentId } from "../domain/Tournament";

const { set, del, mget, rpush, lrem, lrange } = Redis.fromEnv();

const TOURNAMENT_LIST_KEY = "tournaments";

export class UpstashTournamentRepository {
  public async create(
    wagerPercentage: number,
    players: PlayerId[],
    first: TournamentTeam,
    second: TournamentTeam,
    third: TournamentTeam
  ) {
    const tournament: Tournament = {
      id: uuid(),
      createdAt: Date.now(),
      wagerPercentage,
      players,
      first,
      second,
      third,
    };

    await set(this.getTournamentKey(tournament.id), JSON.stringify(tournament));
    await rpush(TOURNAMENT_LIST_KEY, tournament.id);
  }

  public async delete(tournamentId: TournamentId) {
    await del(this.getTournamentKey(tournamentId));
    await lrem(TOURNAMENT_LIST_KEY, 0, tournamentId);
  }

  public async listAll() {
    const tournamentIds = await lrange(TOURNAMENT_LIST_KEY, 0, -1);

    if (tournamentIds.length === 0) {
      return [];
    }

    const keys = tournamentIds.map(this.getTournamentKey);

    return await mget<Tournament[]>(keys[0], ...keys.slice(1));
  }

  private getTournamentKey(tournamentId: TournamentId) {
    return `TOURNAMENT#${tournamentId}`;
  }
}
