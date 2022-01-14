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
  const { refreshGames, players } = useContext(DataContext);

  const player1Name = players.find((el) => el.id === game.player1)?.name;
  const player2Name = players.find((el) => el.id === game.player2)?.name;

  async function handleDelete() {
    await axios.delete(`/api/games/${game.id}`);
    refreshGames();
  }

  return (
    <li key={game.id}>
      {game.winner === game.player1 ? (
        <strong>{player1Name}</strong>
      ) : (
        player1Name
      )}{" "}
      -{" "}
      {game.winner === game.player2 ? (
        <strong>{player2Name}</strong>
      ) : (
        player2Name
      )}
      <button onClick={handleDelete}>Delete</button>
    </li>
  );
}

export default GameList;
