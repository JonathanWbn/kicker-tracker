import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Game, IGame, Team } from "../domain/Game";

const { set, del, mget, rpush, lrem, lrange } = Redis.fromEnv();

const GAME_LIST_KEY = "games";

export class UpstashGameRepository {
  public async create(winnerTeam: Team, loserTeam: Team) {
    const game = new Game(uuid(), new Date(), winnerTeam, loserTeam);

    await set(this.getGameKey(game.id), JSON.stringify(game));
    await rpush(GAME_LIST_KEY, game.id);
  }

  public async delete(gameId: IGame["id"]) {
    await del(this.getGameKey(gameId));
    await lrem(GAME_LIST_KEY, 0, gameId);
  }

  public async listAll() {
    const gameIds = await lrange(GAME_LIST_KEY, 0, -1);
    const keys = gameIds.map(this.getGameKey);

    const games = await mget(keys[0], ...keys.slice(1));

    return games.map((data) => {
      const { id, createdAt, winnerTeam, loserTeam } = data as IGame;
      return new Game(id, new Date(createdAt), winnerTeam, loserTeam);
    });
  }

  private getGameKey(gameId: IGame["id"]) {
    return `GAME#${gameId}`;
  }
}
