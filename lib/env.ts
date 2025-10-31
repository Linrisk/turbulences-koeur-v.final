import dotenv from "dotenv";

// Charger les variables d'environnement
dotenv.config({
  path: process.env.NODE_ENV === "production" ? ".env.production" : ".env.local",
});

export const env = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV || "development",
};

// Vérifier que les variables requises sont présentes
if (!env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.error("❌ DATABASE_URL manquante");
  process.exit(1);
}
