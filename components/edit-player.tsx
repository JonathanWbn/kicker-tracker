import axios from "axios";
import { MouseEvent, useState } from "react";

import { IPlayer } from "../domain/Player";

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

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await axios.post(`/api/players/${initial.id}`, { name });
    onUpdated();
  }

  return (
    <form>
      <input
        autoFocus
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>
      <button type="button" onClick={onCancel}>
        Cancel
      </button>
      <button onClick={handeSubmit}>Save</button>
    </form>
  );
}

export default EditPlayer;
