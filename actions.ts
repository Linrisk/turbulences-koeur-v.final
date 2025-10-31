import {neon} from "@neondatabase/serverless";

export async function getData() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("La variable d'environnement DATABASE_URL est manquante.");
  }

  const sql = neon(databaseUrl);
  const data = await sql`...`;
  return data;
}