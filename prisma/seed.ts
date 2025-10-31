import prisma from "./client";
import dotenv from "dotenv";
dotenv.config();
async function main() {
  // Seed Letters
  await prisma.letter.createMany({
    data: [
      {
        content:
          "Mon cœur bat encore pour toi, même après toutes ces années. Je pense à nos promenades le long de la Seine et à tes rires qui résonnent encore dans ma mémoire.",
        city: "Paris",
        relationshipType: "amoureuse",
      },
      {
        content:
          "Merci d'être toujours là pour moi, même dans les moments difficiles. Notre amitié est un trésor que je chéris chaque jour.",
        city: "Lyon",
        relationshipType: "amicale",
      },
      {
        content:
          "Papa, je sais que je ne te l'ai jamais dit assez, mais tu es mon héros. Merci pour tous les sacrifices que tu as faits pour notre famille.",
        city: "Marseille",
        relationshipType: "familiale",
      },
      {
        content: "Tu me manques terriblement. Chaque coucher de soleil me rappelle nos soirées ensemble sur la plage.",
        city: "Nice",
        relationshipType: "amoureuse",
      },
      {
        content:
          "À mon meilleur ami d'enfance : nos aventures dans le quartier resteront gravées à jamais dans mon cœur.",
        city: "Toulouse",
        relationshipType: "amicale",
      },
      {
        content:
          "Maman, ton amour inconditionnel m'a donné la force de devenir qui je suis aujourd'hui. Je t'aime infiniment.",
        city: "Bordeaux",
        relationshipType: "familiale",
      },
    ],
  });

  // Seed Admin Users
  await prisma.adminUser.upsert({
    where: { login: "admin" },
    update: {},
    create: {
      login: "admin",
      email: "admin@turbulences.fr",
      passwordHash:
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // hash for "turbulences2024"
      role: "admin",
    },
  });

  await prisma.adminUser.upsert({
    where: { login: "facteur" },
    update: {},
    create: {
      login: "facteur",
      email: "facteur@turbulences.fr",
      passwordHash:
        "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", // hash for "turbulences2024"
      role: "facteur",
    },
  });

  // Seed CMS Page Content - exemple simplifié
  await prisma.pageContent.createMany({
    data: [
      {
        pageKey: "home_intro",
        title: "Bienvenue",
        content: "Bienvenue sur notre site !",
        metaDescription: "Page d'accueil",
      },
      {
        pageKey: "about",
        title: "À propos",
        content:
          "Nous sommes une organisation dédiée à ...",
        metaDescription: "Page à propos",
      },
    ],
  });

  // Ajouter les autres seeds CMS si nécessaire ici...
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
