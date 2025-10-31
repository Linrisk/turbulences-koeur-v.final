import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../prisma/client";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Invalid page ID" });
  }

  if (req.method === "PUT") {
    try {
      const { title, content, metaDescription } = req.body;

      // Save current content as revision
      const currentContent = await prisma.pageContent.findUnique({ where: { id } });

      if (currentContent) {
        await prisma.contentRevision.create({
          data: {
            pageContentId: id,
            title: currentContent.title,
            content: currentContent.content,
          },
        });
      }

      // Update the page content
      const updated = await prisma.pageContent.update({
        where: { id },
        data: { title, content, metaDescription },
      });

      return res.status(200).json(updated);
    } catch (error) {
      console.error("Error updating CMS content:", error);
      return res.status(500).json({ error: "Erreur lors de la mise à jour du contenu" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
