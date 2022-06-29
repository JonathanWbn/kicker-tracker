import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Game, GameId, Team } from "../domain/Game";

const { set, del, mget, rpush, lrem, lrange } = Redis.fromEnv();

const GAME_LIST_KEY = "games";

export class UpstashGameRepository {
  public async create(winnerTeam: Team, loserTeam: Team) {
    const game: Game = {
      id: uuid(),
      createdAt: Date.now(),
      winnerTeam,
      loserTeam,
    };

    await set(this.getGameKey(game.id), JSON.stringify(game));
    await rpush(GAME_LIST_KEY, game.id);
  }

  public async delete(gameId: GameId) {
    await del(this.getGameKey(gameId));
    await lrem(GAME_LIST_KEY, 0, gameId);
  }

  public async listAll() {
    const gameIds = await lrange(GAME_LIST_KEY, 0, -1);
    const keys = gameIds.map(this.getGameKey);

    return await mget<Game[]>(keys[0], ...keys.slice(1));
  }

  private getGameKey(gameId: GameId) {
    return `GAME#${gameId}`;
  }
}
