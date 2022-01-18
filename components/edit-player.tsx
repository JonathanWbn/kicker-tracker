import axios from "axios";
import { MouseEvent, useState } from "react";

import { animals, IPlayer, PlayerAnimal } from "../domain/Player";

function EditPlayer({
  initial,
  onUpdated,
  onCancel,
}: {
  initial: IPlayer;
  onUpdated: VoidFunction;
  onCancel: VoidFunction;
}) {
  const [name, setName] = useState(initial.name);
  const [animal, setAnimal] = useState<PlayerAnimal>(initial.animal);

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await axios.post(`/api/players/${initial.id}`, { name, animal });
    onUpdated();
  }

  return (
    <form>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <select
        value={animal}
        onChange={(e) => setAnimal(e.target.value as PlayerAnimal)}
      >
        {animals.map((animal) => (
          <option key={animal} value={animal}>
            {animal}
          </option>
        ))}
      </select>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button onClick={handeSubmit}>Save</button>
    </form>
  );
}

export default EditPlayer;
