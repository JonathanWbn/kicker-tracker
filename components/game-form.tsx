import { MouseEvent, useContext, useState } from "react";
import axios from "axios";

import { DataContext } from "../pages";
import { Team } from "../domain/Game";

function GameForm() {
  const { refreshGames, players } = useContext(DataContext);
  const [[winner1, winner2], setWinnerTeam] = useState<Team>(["", ""]);
  const [[loser1, loser2], setLoserTeam] = useState<Team>(["", ""]);

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!winner1 || !winner2 || !loser1 || !loser2) {
      return;
    }

    await axios.post("/api/games", {
      winnerTeam: [winner1, winner2],
      loserTeam: [loser1, loser2],
    });
    refreshGames();
    setLoserTeam(["", ""]);
    setWinnerTeam(["", ""]);
  }

  return (
    <>
      <h1>Add Game</h1>
      <form>
        <h2>Winner Team</h2>
        <label>
          Player 1
          <select
            value={winner1}
            onChange={(e) => setWinnerTeam([e.target.value, winner2])}
          >
            <option value="">---</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Player 2
          <select
            value={winner2}
            onChange={(e) => setWinnerTeam([winner1, e.target.value])}
          >
            <option value="">---</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        <h2>Loser Team</h2>
        <label>
          Player 1
          <select
            value={loser1}
            onChange={(e) => setLoserTeam([e.target.value, loser2])}
          >
            <option value="">---</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Player 2
          <select
            value={loser2}
            onChange={(e) => setLoserTeam([loser1, e.target.value])}
          >
            <option value="">---</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
        <button onClick={handeSubmit}>Submit</button>
      </form>
    </>
  );
}

export default GameForm;
