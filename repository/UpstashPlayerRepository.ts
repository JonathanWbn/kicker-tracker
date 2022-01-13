import { auth, set } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Player } from "../domain/Player";

auth(process.env.UPSTASH_REDIS_REST_URL, process.env.UPSTASH_REDIS_REST_TOKEN);

export class UpstashPlayerRepository {
  public async create(name: string) {
    const player = new Player(uuid(), name);

    await set(`PLAYER#${player.id}`, JSON.stringify(player));
  }
}
