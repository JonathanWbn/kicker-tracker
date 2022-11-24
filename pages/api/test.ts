import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const img = fs.readFileSync(
      path.join(process.cwd(), "img", "bat.png"),
      "utf-8"
    );

    console.log("img", !!img);
    res.status(200).json({ ok: true });
  }
  res.status(500);
}
