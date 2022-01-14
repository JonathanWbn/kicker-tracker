import { auth, set, scan, get, del } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Game, IGame } from "../domain/Game";

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN);

export class UpstashGameRepository {
  public async create(player1: string, player2: string, winner: string) {
    const game = new Game(uuid(), player1, player2, winner);

    await set(`GAME#${game.id}`, JSON.stringify(game));
  }

  public async delete(gameId: IGame["id"]) {
    await del(`GAME#${gameId}`);
  }

  public async listAll() {
    const {
      data: [, keys],
    } = await scan(0);

    const gameIds = (keys as string[]).filter((key) => key.startsWith("GAME"));

    return Promise.all(
      gameIds.map(async (key) => {
        const { data } = await get(key);
        const { id, player1, player2, winner } = JSON.parse(data) as IGame;
        return new Game(id, player1, player2, winner);
      })
    );
  }
}
