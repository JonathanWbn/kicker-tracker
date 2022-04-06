import { auth, set, scan, get, del } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { IPlayer, Player, PlayerAnimal } from "../domain/Player";

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN);

export class UpstashPlayerRepository {
  public async create(name: string, animal: PlayerAnimal) {
    const player = new Player(uuid(), name, animal, false);

    await set(`PLAYER#${player.id}`, JSON.stringify(player));
  }

  public async update(player: IPlayer) {
    await set(`PLAYER#${player.id}`, JSON.stringify(player));
  }

  public async delete(playerId: IPlayer["id"]) {
    await del(`PLAYER#${playerId}`);
  }

  public async listAll() {
    console.log("listAll players");
    const {
      data: [, keys],
    } = await scan(0, "MATCH", "PLAYER#*", "COUNT", 1000);

    console.log("player keys", keys.length);

    return Promise.all(
      keys.map(async (key: string) => {
        const { data } = await get(key);
        const { id, name, animal, isRetired } = JSON.parse(data) as IPlayer;
        return new Player(id, name, animal, Boolean(isRetired));
      })
    );
  }
}
