import { auth, set, scan, get, del } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Game, IGame, Team } from "../domain/Game";

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN);

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
    const {
      data: [, keys],
    } = await scan(0, "MATCH", "GAME#*", "COUNT", 1000);
    console.log("keys");

    return Promise.all(
      keys.map(async (key: string) => {
        console.log("getting", key);
        const { data } = await get(key);
        console.log("got", key);
        const { id, createdAt, winnerTeam, loserTeam } = JSON.parse(
          data
        ) as IGame;
        return new Game(id, new Date(createdAt), winnerTeam, loserTeam);
      })
    );
  }
}
