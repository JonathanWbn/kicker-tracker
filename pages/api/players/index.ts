import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashPlayerRepository } from "../../../repository/UpstashPlayerRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashPlayerRepository();
  if (req.method === "POST") {
    const { name, animal } = req.body;

    await repository.create(name, animal);

    res.status(201).json({ success: true });
  }
  if (req.method === "GET") {
    const players = await repository.listAll();

    res.status(200).json(players);
  }
  res.status(500);
}
