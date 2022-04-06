import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Game, IGame, Team } from "../domain/Game";

const { set, scan, get, del } = Redis.fromEnv();

export class UpstashGameRepository {
  public async create(winnerTeam: Team, loserTeam: Team) {
    const game = new Game(uuid(), new Date(), winnerTeam, loserTeam);

    await set(`GAME#${game.id}`, JSON.stringify(game));
  }

  public async delete(gameId: IGame["id"]) {
    await del(`GAME#${gameId}`);
  }

  public async listAll() {
    console.log("listAll games");
    const [, keys] = await scan(0, { match: "GAME#*", count: 1000 });
    console.log("game keys", keys.length);

    return Promise.all(
      keys.map(async (key: string) => {
        const data = await get(key);
        const { id, createdAt, winnerTeam, loserTeam } = data as IGame;
        return new Game(id, new Date(createdAt), winnerTeam, loserTeam);
      })
    );
  }
}
