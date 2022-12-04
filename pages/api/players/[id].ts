import type { NextApiRequest, NextApiResponse } from "next";

import { UpstashPlayerRepository } from "../../../repository/UpstashPlayerRepository";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const repository = new UpstashPlayerRepository();
  if (req.method === "POST") {
    const { name, animal, isRetired } = req.body;
    const { id } = req.query as { id: string };

    await repository.update({
      id,
      name,
      animal,
      isRetired: Boolean(isRetired),
    });

    res.status(201).json({ success: true });
  }
  if (req.method === "DELETE") {
    const { id } = req.query as { id: string };

    await repository.delete(id);

    res.status(201).json({ success: true });
  }
  res.status(500);
}
