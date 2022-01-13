import type { NextApiRequest, NextApiResponse } from "next";
import { UpstashPlayerRepository } from "../../repository/UpstashPlayerRepository";

type Data = {
  success: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method === "POST") {
    const { name } = req.body;

    const repository = new UpstashPlayerRepository();

    await repository.create(name);

    res.status(201).json({ success: true });
  }
  res.status(500);
}
