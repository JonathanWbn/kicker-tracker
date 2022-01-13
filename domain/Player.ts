export class Player implements IPlayer {
  constructor(public readonly id: string, public readonly name: string) {}
}

export interface IPlayer {
  name: string;
  id: string;
}
