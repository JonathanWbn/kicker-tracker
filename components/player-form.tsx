import { MouseEvent, useContext, useState } from "react";
import axios from "axios";

import { DataContext } from "../pages";
import { animals, PlayerAnimal } from "../domain/Player";

function PlayerForm() {
  const { refreshPlayers } = useContext(DataContext);
  const [name, setName] = useState("");
  const [animal, setAnimal] = useState<PlayerAnimal | "">("");

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await axios.post("/api/players", { name, animal });
    refreshPlayers();
    setName("");
  }

  return (
    <>
      <h1>Add Player</h1>
      <form>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)}></input>
        </label>
        <label>
          Animal
          <select
            value={animal}
            onChange={(e) => setAnimal(e.target.value as PlayerAnimal)}
          >
            <option value="">---</option>
            {animals.map((animal) => (
              <option key={animal} value={animal}>
                {animal}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handeSubmit}>Submit</button>
      </form>
    </>
  );
}

export default PlayerForm;
