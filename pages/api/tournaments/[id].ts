import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashTournamentRepository } from "../../../repository/UpstashTournamentRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashTournamentRepository();
  if (req.method === "DELETE") {
    const { id } = req.query as { id: string };

    await repository.delete(id);

    res.status(201).json({ success: true });
  }
  res.status(500);
}
