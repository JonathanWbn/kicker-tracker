import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashTournamentRepository } from "../../../repository/UpstashTournamentRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashTournamentRepository();
  if (req.method === "POST") {
    const { wager, players, first, second, third } = req.body;

    await repository.create(wager, players, first, second, third);

    res.status(201).json({ success: true });
  }
  if (req.method === "GET") {
    const tournaments = await repository.listAll();

    res.status(200).json(tournaments);
  }
  res.status(500);
}
