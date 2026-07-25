import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const works = [
  { title: "Diginvited", tag: "Nextjs / Invitations App", year: "2025", link: "https://diginvited.cloud", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop", order: 0 },
  { title: "Berkah Jaya Motor", tag: "Nextjs / Portfolio", year: "2025", link: "https://berkahjayamotor.my.id/", image: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=800&auto=format&fit=crop", order: 1 },
  { title: "KASR", tag: "Flutter / E-commerce", year: "2025", link: "#", image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop", order: 2 },
  { title: "LaundryIN", tag: "Flutter / E-commerce", year: "2026", link: "https://github.com/f1ndah/laundryin", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop", order: 3 },
];

async function main() {
  for (const work of works) {
    await prisma.work.upsert({
      where: { id: work.order + 1 },
      update: work,
      create: { id: work.order + 1, ...work },
    });
  }
  console.log("Seeded works");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
