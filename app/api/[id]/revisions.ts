import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid page ID" });
  }

  if (req.method === "GET") {
    try {
      const revisions = await prisma.contentRevision.findMany({
        where: { pageContentId: id },
        orderBy: { createdAt: "desc" },
      });

      return res.status(200).json(revisions);
    } catch (error) {
      console.error("Error fetching revisions:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération des révisions" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
