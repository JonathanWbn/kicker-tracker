import { MouseEvent, useContext, useState } from "react";
import axios from "axios";
import { PlayerContext } from "../pages";

function PlayerForm() {
  const { refresh } = useContext(PlayerContext);
  const [name, setName] = useState("");

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    await axios.post("/api/players", { name });
    refresh();
    setName("");
  }

  return (
    <>
      <h2>Player Form</h2>
      <form>
        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)}></input>
        </label>
        <button onClick={handeSubmit}>Submit</button>
      </form>
    </>
  );
}

export default PlayerForm;
