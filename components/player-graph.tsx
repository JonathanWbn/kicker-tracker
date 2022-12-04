import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { format } from "date-fns";
import React, { useContext, useState } from "react";
import { ChartProps, Line } from "react-chartjs-2";
import { DataContext } from "../data";
import { RatedPlayer } from "../domain/Leaderboard";
import Card from "./card";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
);

ChartJS.defaults.borderColor = "#475569";
ChartJS.defaults.color = "#94a3b8";

const colors = [
  "#38a2eb",
  "#f66384",
  "#4bc0c0",
  "#f89f41",
  "#9966ff",
  "#facd56",
  "#5ac39b",
  "#c0b544",
  "#bd81d9",
  "#89c06b",
  "#e46db4",
  "#ff9c5a",
  "#8494ec",
  "#ff6787",
  "#ff4ec5",
  "#ff6787",
  "#ff4ec5",
  "#ff9c5a",
  "#8494ec",
  "#e46db4",
];

const options: ChartProps<"line">["options"] = {
  plugins: { legend: { position: "bottom" as const } },
  animation: false,
};

function PlayerGraph({ onClose }: { onClose: () => void }) {
  const { leaderboard, history } = useContext(DataContext);

  const _rankedPlayers = leaderboard.getRankedPlayers();
  const rankedPlayers = _rankedPlayers.sort(
    (a, b) => +a.isRetired - +b.isRetired
  );

  const [showing, setShowing] = useState(
    rankedPlayers.filter((el) => !el.isRetired).map((el) => el.id)
  );

  const datasets = rankedPlayers.map(({ name, id }, index) => ({
    id: id,
    label: name,
    borderColor: colors[index % colors.length],
    data: history
      .filter(
        ({ rankings }, index, self) =>
          getRanking(rankings, id) !== getRanking(self[index - 1]?.rankings, id)
      )
      .map(({ date, rankings }) => ({
        x: format(date, "MMM d"),
        y: getRanking(rankings, id),
      })),
  }));

  const data = {
    labels: history.map((day) => format(day.date, "MMM d")),
    datasets: datasets.filter((dataset) => showing.includes(dataset.id)),
  };

  const presetButtons = [
    {
      label: "🎲",
      onClick: () =>
        setShowing(
          rankedPlayers
            .sort(() => Math.random() - 0.5)
            .slice(0, 5)
            .map((el) => el.id)
        ),
      active: false,
    },
    {
      label: "Active",
      onClick: () =>
        setShowing(
          rankedPlayers.filter((el) => !el.isRetired).map((el) => el.id)
        ),
      active:
        showing.length === rankedPlayers.filter((el) => !el.isRetired).length,
    },
    {
      label: "All",
      onClick: () => setShowing(rankedPlayers.map((el) => el.id)),
      active: showing.length === rankedPlayers.length,
    },
    {
      label: "None",
      onClick: () => setShowing([]),
      active: showing.length === 0,
    },
  ];

  return (
    <Card className="mb-4">
      <div className="flex justify-end">
        <button className="text-gray-400 hover:text-gray-500" onClick={onClose}>
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <Line options={options} data={data} />
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
        <div className="hidden sm:block col-span-3"></div>
        {presetButtons.map(({ label, onClick, active }) => (
          <div
            key={label}
            onClick={onClick}
            className={classNames(
              "cursor-pointer rounded-md p-1 text-xs text-center font-medium",
              active
                ? "text-slate-100 bg-slate-500"
                : "text-slate-200 bg-slate-700 hover:bg-slate-600"
            )}
          >
            {label}
          </div>
        ))}

        {datasets.map(({ id, label, borderColor }) => (
          <div
            key={id}
            onClick={() =>
              setShowing(
                showing.includes(id)
                  ? showing.filter((el) => el !== id)
                  : [...showing, id]
              )
            }
            style={{ color: borderColor }}
            className={classNames(
              "cursor-pointer rounded-md p-1 text-xs text-center font-medium",
              showing.includes(id) ? "bg-slate-600" : "bg-slate-700"
            )}
          >
            {label}
          </div>
        ))}
      </div>
    </Card>
  );
}

function getRanking(rankings: RatedPlayer[] | undefined, playerId: string) {
  return rankings?.find((ranking) => ranking.id === playerId)?.rating || 1500;
}

export default PlayerGraph;
