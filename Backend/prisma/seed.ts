import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const interests = [
    "Sports",
    "Technology",
    "AI",
    "Music",
    "Travel",
    "Food",
    "Art",
    "Gaming",
    "Hackathon",
    "Business",
  ];

  for (const name of interests) {
    await prisma.interest.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log("Interests seeded successfully");
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
