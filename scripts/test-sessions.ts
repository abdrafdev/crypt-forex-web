import { SessionManager } from "../src/lib/session-manager";

async function testSessionStorage() {
  console.log("Testing session storage...");

  // Test creating a session
  const sessionToken = "test-session-" + Date.now();
  const userId = "test-user-id";
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  try {
    await SessionManager.createSession(
      userId,
      sessionToken,
      expires,
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "127.0.0.1"
    );

    console.log("✅ Session created successfully");

    // Test getting user sessions
    const sessions = await SessionManager.getUserSessions(userId);
    console.log("✅ Sessions retrieved:", sessions.length);

    // Test cleanup
    await SessionManager.cleanupExpiredSessions();
    console.log("✅ Cleanup completed");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSessionStorage();
