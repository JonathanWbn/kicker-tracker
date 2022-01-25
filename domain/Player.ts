export type PlayerId = string;
export type PlayerAnimal =
  | "flyingJohannes"
  | "pandabear"
  | "dog"
  | "elephant"
  | "sheep"
  | "fox"
  | "crocodile"
  | "llama"
  | "zebra"
  | "horse"
  | "snake"
  | "bear"
  | "cat"
  | "rhinoceros"
  | "sloth"
  | "whale"
  | "frog"
  | "hippopotamus"
  | "koala"
  | "boar"
  | "pig"
  | "guineapig"
  | "squirrel"
  | "lemur"
  | "duck"
  | "monkey"
  | "camel"
  | "hen"
  | "walrus"
  | "mole"
  | "mouse"
  | "buffalo"
  | "cow"
  | "owl"
  | "giraffe"
  | "bat"
  | "jaguar"
  | "wolf"
  | "chameleon"
  | "ostrich"
  | "rabbit"
  | "lion"
  | "eagle"
  | "shark"
  | "tiger"
  | "raccoon"
  | "anteater"
  | "penguin"
  | "beaver"
  | "hedgehog"
  | "kangaroo";

export class Player implements IPlayer {
  constructor(
    public readonly id: PlayerId,
    public readonly name: string,
    public readonly animal: PlayerAnimal
  ) {}
}

export interface IPlayer {
  id: PlayerId;
  name: string;
  animal: PlayerAnimal;
}

export const animals: PlayerAnimal[] = [
  "flyingJohannes",
  "pandabear",
  "dog",
  "elephant",
  "sheep",
  "fox",
  "crocodile",
  "llama",
  "zebra",
  "horse",
  "snake",
  "bear",
  "cat",
  "rhinoceros",
  "sloth",
  "whale",
  "frog",
  "hippopotamus",
  "koala",
  "boar",
  "pig",
  "guineapig",
  "squirrel",
  "lemur",
  "duck",
  "monkey",
  "camel",
  "hen",
  "walrus",
  "mole",
  "mouse",
  "buffalo",
  "cow",
  "owl",
  "giraffe",
  "bat",
  "jaguar",
  "wolf",
  "chameleon",
  "ostrich",
  "rabbit",
  "lion",
  "eagle",
  "shark",
  "tiger",
  "raccoon",
  "anteater",
  "penguin",
  "beaver",
  "hedgehog",
  "kangaroo",
];
