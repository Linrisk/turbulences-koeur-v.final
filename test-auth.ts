const prisma = require("./prisma/client").default;

async function testAuth() {
  try {
    // Récupère un utilisateur admin
    const admin = await prisma.adminUser.findFirst({
      where: { login: "admin" },
    });

    console.log("✅ Admin user:", admin);

    // Récupère toutes les lettres
    const letters = await prisma.letter.findMany();
    console.log("✅ Letters count:", letters.length);
    console.log("✅ Letters:", letters);

    // Récupère le contenu d'une page
    const pageContent = await prisma.pageContent.findFirst();
    console.log("✅ Page content:", pageContent);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testAuth();
