import { useEffect, useState } from "react";
import axios from "axios";

function PlayerForm({ onCreated }: { onCreated: VoidFunction }) {
  const [name, setName] = useState("");

  async function handeSubmit() {
    await axios.post("/api/players", { name });
    onCreated();
    setName("");
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
