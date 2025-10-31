import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { pageKey } = req.query;

      if (pageKey && typeof pageKey === "string") {
        const content = await prisma.pageContent.findUnique({ where: { pageKey } });
        return res.status(200).json(content);
      }

      const contents = await prisma.pageContent.findMany({ orderBy: { pageKey: "asc" } });
      return res.status(200).json(contents);
    } catch (error) {
      console.error("Error fetching CMS content:", error);
      return res.status(500).json({ error: "Erreur lors de la récupération du contenu" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
