import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { IPlayer, Player, PlayerAnimal } from "../domain/Player";

const { set, scan, get, del } = Redis.fromEnv();

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
    const [, keys] = await scan(0, { match: "PLAYER#*", count: 1000 });

    console.log("player keys", keys.length);

    return Promise.all(
      keys.map(async (key: string) => {
        const data = await get(key);
        const { id, name, animal, isRetired } = JSON.parse(
          data as string
        ) as IPlayer;
        return new Player(id, name, animal, Boolean(isRetired));
      })
    );
  }
}
