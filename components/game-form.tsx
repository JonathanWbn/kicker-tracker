import { MouseEvent, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DataContext } from "../pages";

function GameForm() {
  const { refreshGames, players } = useContext(DataContext);
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [winner, setWinner] = useState("");

  useEffect(() => {
    if (winner !== player1 && winner !== player2) {
      setWinner("");
    }
  }, [player1, player2, winner]);

  async function handeSubmit(e: MouseEvent<HTMLButtonElement>) {
    if (!player1 || !player2 || !winner) {
      return;
    }

    e.preventDefault();
    await axios.post("/api/games", { player1, player2, winner });
    refreshGames();
    setPlayer1("");
    setPlayer2("");
    setWinner("");
  }

  return (
    <>
      <h2>Game Form</h2>
      <form>
        <label>
          Player 1
          <select value={player1} onChange={(e) => setPlayer1(e.target.value)}>
            <option value="">---</option>
            {players
              .filter((player) => player.id !== player2)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </label>
        <label>
          Player 2
          <select value={player2} onChange={(e) => setPlayer2(e.target.value)}>
            <option value="">---</option>
            {players
              .filter((player) => player.id !== player1)
              .map((player) => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
          </select>
        </label>
        {player1 && player2 && (
          <>
            <h2>Winner</h2>
            <label>
              <input
                type="radio"
                checked={winner === player1}
                onChange={() => setWinner(player1)}
              />
              {players.find((el) => el.id === player1)?.name}
            </label>
            <label>
              <input
                type="radio"
                checked={winner === player2}
                onChange={() => setWinner(player2)}
              />
              {players.find((el) => el.id === player2)?.name}
            </label>
          </>
        )}
        <button onClick={handeSubmit}>Submit</button>
      </form>
    </>
  );
}

export default GameForm;
