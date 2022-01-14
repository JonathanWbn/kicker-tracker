import { MouseEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DataContext } from "../pages";
import { Team } from "../domain/Game";

function GameForm() {
  const { refreshGames, players } = useContext(DataContext);
  const [[winner1, winner2], setWinnerTeam] = useState<Team>(["", ""]);
  const [[loser1, loser2], setLoserTeam] = useState<Team>(["", ""]);

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!winner1 || !winner2 || !loser1 || !loser2) {
      return;
    }

    e.preventDefault();
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
      <h2>Game Form</h2>
      <form>
        <h4>Winner Team</h4>
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
        <h4>Loser Team</h4>
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
