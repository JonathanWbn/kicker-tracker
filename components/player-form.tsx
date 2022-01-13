import { useState } from "react";
import axios from "axios";

function PlayerForm() {
  const [name, setName] = useState("");

  async function handeSubmit() {
    await axios.post("/api/player", { name });
  }

  return (
    <>
      <h2>Player Form</h2>
      <label>
        Name
        <input value={name} onChange={(e) => setName(e.target.value)}></input>
      </label>
      <button onClick={handeSubmit}>Submit</button>
    </>
  );
}

export default PlayerForm;
