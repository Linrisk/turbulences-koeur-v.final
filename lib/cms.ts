export type PageContent = {
  id: string;
  pageKey: string;
  title: string | null;
  content: string;
  metaDescription: string | null;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ContentRevision = {
  id: string;
  pageContentId: string;
  title: string | null;
  content: string;
  updatedBy: string | null;
  createdAt: string;
};

export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  try {
    const response = await fetch(`/api/cms/${pageKey}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("[Prisma] Error fetching page content:", error);
    return null;
  }
}

export async function getAllPageContents(): Promise<PageContent[]> {
  try {
    const response = await fetch("/api/cms");
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("[Prisma] Error fetching all page contents:", error);
    return [];
  }
}

export async function updatePageContent(
  pageId: string,
  title: string,
  content: string,
  metaDescription?: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/cms/${pageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, metaDescription }),
    });
    return response.ok;
  } catch (error) {
    console.error("[Prisma] Error updating page content:", error);
    return false;
  }
}

export async function getContentRevisions(pageContentId: string): Promise<ContentRevision[]> {
  try {
    const response = await fetch(`/api/cms/${pageContentId}/revisions`);
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("[Prisma] Error fetching content revisions:", error);
    return [];
  }
}

export function subscribeToPageContent(callback: (pageContents: PageContent[]) => void) {
  const interval = setInterval(async () => {
    const pageContents = await getAllPageContents();
    callback(pageContents);
  }, 5000);

  return () => clearInterval(interval);
}
