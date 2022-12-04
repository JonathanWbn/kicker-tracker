import { MouseEvent, useContext, useState } from "react";
import axios from "axios";
import { DataContext } from "../data";
import { animals, PlayerAnimal } from "../domain/Player";
import Image from "next/image";
import { upperFirst } from "lodash";
import Button from "./button";
import Card from "./card";

function PlayerForm({ onClose }: { onClose: () => void }) {
  const { refresh, players } = useContext(DataContext);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<PlayerAnimal | "">("");

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!animal || !name) {
      return;
    }

    e.preventDefault();
    await axios.post("/api/players", { name, animal });
    void refresh();
    setName("");
    onClose();
  }

  return (
    <Card className="flex flex-col mb-4">
      <input
        className="rounded bg-slate-700 px-2 py-1 mb-2"
        placeholder="Name"
        value={name}
        autoFocus
        onChange={(e) => setName(e.target.value)}
      ></input>
      <div className="flex flex-wrap items-center justify-center">
        {animals
          .filter((el) => !players.map((player) => player.animal).includes(el))
          .map((el) => (
            <div
              key={el}
              className={`p-1 flex flex-col items-center rounded-lg border-2 ${
                el === animal ? "border-slate-300" : "border-transparent"
              }`}
              onClick={() => setAnimal(el)}
            >
              <Image
                src={`/animals/${el}.png`}
                alt={el}
                width={28}
                height={28}
              />
            </div>
          ))}
      </div>
      <div className="flex justify-between items-center mt-2">
        {animal ? (
          <p className="text-sm flex-grow">{upperFirst(animal)}</p>
        ) : (
          <span className="flex-grow" />
        )}
        <Button onClick={onClose}>cancel</Button>
        <Button backgroundColor="bg-green-700" onClick={handeSubmit}>
          create
        </Button>
      </div>
    </Card>
  );
}

export default PlayerForm;
