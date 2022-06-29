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

export interface Player {
  id: PlayerId;
  name: string;
  animal: PlayerAnimal;
  isRetired: boolean;
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
