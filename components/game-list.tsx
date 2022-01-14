import axios from "axios";
import { useContext } from "react";

import { IGame } from "../domain/Game";
import { PlayerId } from "../domain/Player";
import { DataContext } from "../pages";

function GameList() {
  const { games } = useContext(DataContext);

  return (
    <>
      <h1>Games</h1>
      <ul>
        {games.map((game) => (
          <GameItem key={game.id} game={game} />
        ))}
      </ul>
    </>
  );
}

function GameItem({ game: { id, winnerTeam, loserTeam } }: { game: IGame }) {
  const { refreshGames, getPlayer } = useContext(DataContext);

  async function handleDelete() {
    await axios.delete(`/api/games/${id}`);
    refreshGames();
  }

  return (
    <li key={id}>
      <strong>{winnerTeam.map(getPlayerName).join(", ")}</strong> -{" "}
      {loserTeam.map(getPlayerName).join(", ")}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );

  function getPlayerName(id: PlayerId) {
    return getPlayer(id).name;
  }
}

export default GameList;
