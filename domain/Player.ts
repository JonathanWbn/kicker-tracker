export type PlayerId = string;

export class Player implements IPlayer {
  constructor(public readonly id: PlayerId, public readonly name: string) {}
}

export interface IPlayer {
  id: PlayerId;
  name: string;
}
