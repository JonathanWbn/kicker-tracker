import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashGameRepository } from "../../../repository/UpstashGameRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashGameRepository();
  if (req.method === "POST") {
    const { winnerTeam, loserTeam } = req.body;

    await repository.create(winnerTeam, loserTeam);

    res.status(201).json({ success: true });
  }
  if (req.method === "GET") {
    const games = await repository.listAll();

    res.status(200).json(games);
  }
  res.status(500);
}
