import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { Player, PlayerAnimal, PlayerId } from "../domain/Player";

const { set, mget, del, rpush, lrem, lrange } = Redis.fromEnv();

const PLAYER_LIST_KEY = "players";

export class UpstashPlayerRepository {
  public async create(name: string, animal: PlayerAnimal) {
    const player: Player = {
      id: uuid(),
      name,
      animal,
      isRetired: false,
    };

    await set(this.getPlayerKey(player.id), JSON.stringify(player));
    await rpush(PLAYER_LIST_KEY, player.id);
  }

  public async update(player: Player) {
    await set(this.getPlayerKey(player.id), JSON.stringify(player));
  }

  public async delete(playerId: PlayerId) {
    await del(this.getPlayerKey(playerId));
    await lrem(PLAYER_LIST_KEY, 0, playerId);
  }

  public async listAll() {
    const playerIds = await lrange(PLAYER_LIST_KEY, 0, -1);
    const keys = playerIds.map(this.getPlayerKey);

    return await mget<Player[]>(keys[0], ...keys.slice(1));
  }

  private getPlayerKey(playerId: PlayerId) {
    return `PLAYER#${playerId}`;
  }
}
