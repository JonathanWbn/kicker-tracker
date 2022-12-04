import axios from "axios";
import Image from "next/image";
import { useContext, useState, Fragment } from "react";
import { format, sub } from "date-fns";
import { DataContext } from "../data";
import Button from "./button";
import Card from "./card";
import {
  Leaderboard,
  LeaderboardEvent,
  GameWithDelta,
  TournamentWithDelta,
} from "../domain/Leaderboard";
import {
  PlayerDeltaPills,
  PlayerDeltaPillsSkeleton,
} from "./player-delta-pills";
import { Team } from "../domain/Game";

function GameList() {
  const { leaderboard, isLoading } = useContext(DataContext);
  const [daysShown, setDaysShown] = useState(5);

  const eventsByDay = leaderboard.events
    .sort((a, b) => b.createdAt - a.createdAt)
    .reduce<Record<string, LeaderboardEvent[]>>((events, event) => {
      const day = format(event.createdAt, "eeee, MMM do");
      return { ...events, [day]: [...(events[day] || []), event] };
    }, {});

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <>
      {Object.entries(eventsByDay)
        .slice(0, daysShown)
        .map(([day, events]) => (
          <Fragment key={day}>
            <p className="text-slate-400 mt-4">{day}</p>
            <PlayerDeltaPills events={events} />
            {events.map((event) =>
              Leaderboard.isGame(event) ? (
                <GameItem key={event.id} game={event} />
              ) : (
                <TournamentItem key={event.id} tournament={event} />
              )
            )}
          </Fragment>
        ))}
      {daysShown < Object.keys(eventsByDay).length && (
        <div className="flex justify-center">
          <Button
            backgroundColor="bg-slate-600"
            onClick={() => setDaysShown((v) => v + 5)}
          >
            show more
          </Button>
        </div>
      )}
    </>
  );
}

function GameItem({
  game: { id, winnerTeam, loserTeam, delta },
}: {
  game: GameWithDelta;
}) {
  const { refresh } = useContext(DataContext);
  const [isDeletion, setIsDeletion] = useState(false);

  async function handleDelete() {
    await axios.delete(`/api/games/${id}`);
    void refresh();
  }

  return (
    <Card className="mb-2" onClick={() => !isDeletion && setIsDeletion(true)}>
      {isDeletion ? (
        <div className="flex justify-around">
          <Button onClick={() => setIsDeletion(false)}>cancel</Button>
          <Button backgroundColor="bg-red-700" onClick={handleDelete}>
            delete
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center mb-2">
            <Team team={winnerTeam} />
            <div className="grow"></div>
            <p className="text-green-400">+{delta}</p>
          </div>
          <div className="flex items-center">
            <Team team={loserTeam} isBold={false} />
            <div className="grow"></div>
            <p className="text-red-400">-{delta}</p>
          </div>
        </>
      )}
    </Card>
  );
}

function TournamentItem({ tournament }: { tournament: TournamentWithDelta }) {
  const { refresh } = useContext(DataContext);
  const [isDeletion, setIsDeletion] = useState(false);

  async function handleDelete() {
    await axios.delete(`/api/tournaments/${tournament.id}`);
    void refresh();
  }

  return (
    <Card
      className="mb-2 border border-white"
      onClick={() => !isDeletion && setIsDeletion(true)}
    >
      {isDeletion ? (
        <div className="flex justify-around">
          <Button onClick={() => setIsDeletion(false)}>cancel</Button>
          <Button backgroundColor="bg-red-700" onClick={handleDelete}>
            delete
          </Button>
        </div>
      ) : (
        <>
          {tournament.players
            .sort((a, b) => tournament.deltas[b] - tournament.deltas[a])
            .map((player) => (
              <div
                key={player}
                className="flex items-center justify-between mt-2 first:mt-0"
              >
                <div className="flex items-center">
                  <div className="text-2xl mr-2">
                    {tournament.first.includes(player) ? (
                      "🥇"
                    ) : tournament.second.includes(player) ? (
                      "🥈"
                    ) : tournament.third.includes(player) ? (
                      "🥉"
                    ) : (
                      <div className="w-6 h-8"></div>
                    )}
                  </div>
                  <Team team={[player, "placeholder"]} />
                </div>
                <Delta delta={tournament.deltas[player]} />
              </div>
            ))}
        </>
      )}
    </Card>
  );
}

const Skeleton = () => (
  <>
    {Array.from(Array(3)).map((_, i) => (
      <Fragment key={i}>
        <p className="text-slate-400 mt-4">
          {format(sub(new Date(), { days: i }), "eeee, MMM do")}
        </p>
        <PlayerDeltaPillsSkeleton />
        {Array.from(Array(3)).map((_, i) => (
          <Card className="mb-2" key={i}>
            <div className="flex items-center mb-2 animate-pulse">
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>,{" "}
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>
              <div className="grow"></div>
              <p className="text-slate-100">±16</p>
            </div>
            <div className="flex items-center animate-pulse">
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="bg-slate-500 rounded-full w-6 h-6"></div>
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>,{" "}
              <div className="ml-2 bg-slate-500 w-20 h-5 rounded"></div>
              <div className="grow"></div>
              <p className="text-slate-100">±16</p>
            </div>
          </Card>
        ))}
      </Fragment>
    ))}
  </>
);

const Team = ({ team, isBold = true }: { team: Team; isBold?: boolean }) => {
  const { getPlayer } = useContext(DataContext);

  const [player1, player2] = team.map(getPlayer);

  return (
    <>
      <div className="h-6 w-12 flex justify-center">
        <Image
          src={`/animals/${player1.animal}.png`}
          alt={player1.animal}
          width={24}
          height={24}
        />
        {player2.id !== "placeholder" && (
          <Image
            src={`/animals/${player2.animal}.png`}
            alt={player2.animal}
            width={24}
            height={24}
          />
        )}
      </div>
      <p className={`${isBold ? "font-bold" : ""} ml-2`}>
        {player1.name}
        {player2.name ? `, ${player2.name}` : ""}
      </p>
    </>
  );
};

const Delta = ({ delta }: { delta: number }) =>
  delta < 0 ? (
    <p className="text-red-400">{delta}</p>
  ) : delta === 0 ? (
    <p className="text-slate-300">0</p>
  ) : (
    <p className="text-green-400">+{delta}</p>
  );

export default GameList;
