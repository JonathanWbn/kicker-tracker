import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashPlayerRepository } from "../../../repository/UpstashPlayerRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashPlayerRepository();
  if (req.method === "POST") {
    const { name } = req.body;
    const { id } = req.query as { id: string };

    await repository.update({ id, name });

    res.status(201).json({ success: true });
  }
  res.status(500);
}
