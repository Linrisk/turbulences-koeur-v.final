export type Letter = {
  id: string;
  content: string;
  city: string;
  relationshipType: "amoureuse" | "amicale" | "familiale";
  createdAt: string;
  updatedAt: string;
};

export async function getAllLetters(): Promise<Letter[]> {
  try {
    const response = await fetch("/api/letters");
    if (!response.ok) throw new Error("Failed to fetch letters");
    return await response.json();
  } catch (error) {
    console.error("[Prisma] Error fetching letters:", error);
    return [];
  }
}

export async function addLetter(
  content: string,
  city: string,
  relationshipType: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/letters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, city, relationshipType }),
    });
    return response.ok;
  } catch (error) {
    console.error("[Prisma] Error adding letter:", error);
    return false;
  }
}

export async function updateLetter(
  id: string,
  content: string,
  city: string,
  relationshipType: string
): Promise<boolean> {
  try {
    const response = await fetch(`/api/letters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, city, relationshipType }),
    });
    return response.ok;
  } catch (error) {
    console.error("[Prisma] Error updating letter:", error);
    return false;
  }
}

export async function deleteLetter(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/letters/${id}`, {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    console.error("[Prisma] Error deleting letter:", error);
    return false;
  }
}

// Polling pour simuler les subscriptions Supabase
export function subscribeToLetters(callback: (letters: Letter[]) => void) {
  const interval = setInterval(async () => {
    const letters = await getAllLetters();
    callback(letters);
  }, 5000);

  return () => clearInterval(interval);
}
