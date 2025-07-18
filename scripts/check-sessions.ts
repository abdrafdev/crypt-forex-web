import { prisma } from "../src/lib/prisma";

async function checkSessions() {
  try {
    console.log("🔍 Checking sessions in database...");

    const allSessions = await prisma.session.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });

    console.log("📊 Total sessions in database:", allSessions.length);

    if (allSessions.length > 0) {
      console.log("\n📋 Session details:");
      allSessions.forEach((session, index) => {
        console.log(`${index + 1}. Session ID: ${session.id}`);
        console.log(`   User: ${session.user.email} (${session.user.id})`);
        console.log(`   Device: ${session.deviceInfo || "Unknown"}`);
        console.log(`   Location: ${session.location || "Unknown"}`);
        console.log(`   Active: ${session.isActive}`);
        console.log(`   Expires: ${session.expires}`);
        console.log(`   Created: ${session.createdAt}`);
        console.log(`   Last Activity: ${session.lastActivity}`);
        console.log("   ---");
      });
    } else {
      console.log("❌ No sessions found in database");
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });

    console.log("👥 Users in database:", users.length);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (ID: ${user.id})`);
    });
  } catch (error) {
    console.error("❌ Error checking sessions:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkSessions();
