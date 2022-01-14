import axios from "axios";
import { useContext, useState } from "react";
import { IGame } from "../domain/Game";
import { IPlayer } from "../domain/Player";
import { DataContext } from "../pages";
import EditPlayer from "./edit-player";

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

function GameItem({ game }: { game: IGame }) {
  const { refreshGames, players, getPlayer } = useContext(DataContext);

  async function handleDelete() {
    await axios.delete(`/api/games/${game.id}`);
    refreshGames();
  }

  return (
    <li key={game.id}>
      <strong>
        {game.winnerTeam.map((id) => getPlayer(id).name).join(", ")}
      </strong>{" "}
      - {game.loserTeam.map((id) => getPlayer(id).name).join(", ")}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default GameList;
