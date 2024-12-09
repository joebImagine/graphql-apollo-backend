const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  await prisma.user.createMany({
    data: Array.from({ length: 100 }, (_, i) => ({
      name: `User ${i + 1}`,
      age: 20 + (i % 10),
    })),
  });
  console.log('Database seeded!');
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
