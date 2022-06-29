import { Redis } from "@upstash/redis";
import { v4 as uuid } from "uuid";

import { IPlayer, Player, PlayerAnimal } from "../domain/Player";

const { set, mget, del, rpush, lrem, lrange } = Redis.fromEnv();

const PLAYER_LIST_KEY = "players";

export class UpstashPlayerRepository {
  public async create(name: string, animal: PlayerAnimal) {
    const player = new Player(uuid(), name, animal, false);

    await set(this.getPlayerKey(player.id), JSON.stringify(player));
    await rpush(PLAYER_LIST_KEY, player.id);
  }

  public async update(player: IPlayer) {
    await set(this.getPlayerKey(player.id), JSON.stringify(player));
  }

  public async delete(playerId: IPlayer["id"]) {
    await del(this.getPlayerKey(playerId));
    await lrem(PLAYER_LIST_KEY, 0, playerId);
  }

  public async listAll() {
    const playerIds = await lrange(PLAYER_LIST_KEY, 0, -1);
    const keys = playerIds.map(this.getPlayerKey);

    const players = await mget(keys[0], ...keys.slice(1));

    return players.map((data) => {
      const { id, name, animal, isRetired } = data as IPlayer;
      return new Player(id, name, animal, Boolean(isRetired));
    });
  }

  private getPlayerKey(playerId: IPlayer["id"]) {
    return `PLAYER#${playerId}`;
  }
}
