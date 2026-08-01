import { db } from "../src/index";

async function main() {
  console.log("🌱 Seeding database...");

  // Create demo user
  const user = await db.user.upsert({
    where: { email: "admin@developer.workspace" },
    update: {},
    create: {
      id: "usr_admin_demo_01",
      name: "Admin Developer",
      email: "admin@developer.workspace",
      emailVerified: true,
    },
  });

  console.log(`👤 Created demo user: ${user.email}`);

  // Create demo workspace
  const workspace = await db.workspace.upsert({
    where: { slug: "demo-workspace" },
    update: {},
    create: {
      name: "Demo Workspace",
      slug: "demo-workspace",
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
      projects: {
        create: [
          {
            name: "Core API Service",
            description: "Fastify backend REST API service",
          },
          {
            name: "Developer Dashboard",
            description: "Next.js App Router web frontend",
          },
        ],
      },
    },
  });

  console.log(`🏢 Created demo workspace: ${workspace.name} (${workspace.slug})`);
  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
