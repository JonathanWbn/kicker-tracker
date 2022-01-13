import { auth, set, scan, get } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { IPlayer, Player } from "../domain/Player";

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN);

export class UpstashPlayerRepository {
  public async create(name: string) {
    const player = new Player(uuid(), name);

    await set(`PLAYER#${player.id}`, JSON.stringify(player));
  }

  public async update(player: IPlayer) {
    await set(`PLAYER#${player.id}`, JSON.stringify(player));
  }

  public async listAll() {
    const {
      data: [, keys],
    } = await scan(0);

    const playerIds = (keys as string[]).filter((key) =>
      key.startsWith("PLAYER")
    );

    return Promise.all(
      playerIds.map(async (key) => {
        const { data } = await get(key);
        const { id, name } = JSON.parse(data) as IPlayer;
        return new Player(id, name);
      })
    );
  }
}
