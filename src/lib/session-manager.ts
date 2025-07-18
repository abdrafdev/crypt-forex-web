import { prisma } from "@/lib/prisma";

interface DeviceInfo {
  browser: string;
  os: string;
  device: string;
  userAgent: string;
}

interface LocationInfo {
  ip: string;
  city?: string;
  country?: string;
  location?: string;
  region?: string;
  timezone?: string;
}

export class SessionManager {
  static parseUserAgent(userAgent: string): DeviceInfo {
    console.log("Parsing user agent:", userAgent);

    // Browser detection with more specific patterns
    let browser = "Unknown";
    if (userAgent.includes("Edg/")) browser = "Microsoft Edge";
    else if (userAgent.includes("Chrome/") && !userAgent.includes("Chromium"))
      browser = "Google Chrome";
    else if (userAgent.includes("Firefox/")) browser = "Mozilla Firefox";
    else if (userAgent.includes("Safari/") && !userAgent.includes("Chrome"))
      browser = "Safari";
    else if (userAgent.includes("Opera/") || userAgent.includes("OPR/"))
      browser = "Opera";
    else if (userAgent.includes("Chromium/")) browser = "Chromium";

    // OS detection with more patterns
    let os = "Unknown";
    if (userAgent.includes("Windows NT 10.0")) os = "Windows 10/11";
    else if (userAgent.includes("Windows NT 6.3")) os = "Windows 8.1";
    else if (userAgent.includes("Windows NT 6.2")) os = "Windows 8";
    else if (userAgent.includes("Windows NT 6.1")) os = "Windows 7";
    else if (userAgent.includes("Windows")) os = "Windows";
    else if (
      userAgent.includes("Mac OS X 10_15") ||
      userAgent.includes("macOS 10.15")
    )
      os = "macOS Catalina";
    else if (
      userAgent.includes("Mac OS X 10_16") ||
      userAgent.includes("macOS 11")
    )
      os = "macOS Big Sur";
    else if (userAgent.includes("Mac OS X") || userAgent.includes("macOS"))
      os = "macOS";
    else if (userAgent.includes("Ubuntu")) os = "Ubuntu Linux";
    else if (userAgent.includes("Linux")) os = "Linux";
    else if (userAgent.includes("Android")) {
      const androidMatch = userAgent.match(/Android (\d+(?:\.\d+)?)/);
      os = androidMatch ? `Android ${androidMatch[1]}` : "Android";
    } else if (userAgent.includes("iPhone OS") || userAgent.includes("iOS")) {
      const iosMatch = userAgent.match(/OS (\d+_\d+)/);
      os = iosMatch ? `iOS ${iosMatch[1].replace("_", ".")}` : "iOS";
    }

    // Device detection
    let device = "Desktop";
    if (userAgent.includes("Mobile") || userAgent.includes("iPhone"))
      device = "Mobile";
    else if (userAgent.includes("iPad") || userAgent.includes("Tablet"))
      device = "Tablet";

    const result = { browser, os, device, userAgent };
    console.log("Parsed device info:", result);

    return result;
  }

  static async getLocationFromIP(ip: string): Promise<LocationInfo> {
    console.log("Getting location for IP:", ip);

    // Skip location lookup for local IPs
    if (
      ip === "127.0.0.1" ||
      ip === "::1" ||
      ip.startsWith("192.168.") ||
      ip.startsWith("10.") ||
      ip.startsWith("172.")
    ) {
      console.log("Local IP detected, skipping geolocation");
      return {
        ip,
        city: "Local",
        country: "Local Network",
        location: "Local Network",
      };
    }

    try {
      // Try multiple geolocation services for reliability
      const services = [
        `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,timezone,query`,
        `https://ipapi.co/${ip}/json/`,
        `http://www.geoplugin.net/json.gp?ip=${ip}`,
      ];

      for (const serviceUrl of services) {
        try {
          console.log("Trying geolocation service:", serviceUrl);

          const response = await fetch(serviceUrl, {
            timeout: 5000,
            headers: {
              "User-Agent": "CryptoForex-App/1.0",
            },
          });

          if (!response.ok) continue;

          const data = await response.json();
          console.log("Geolocation response:", data);

          // Handle ip-api.com response
          if (data.status === "success" && data.country) {
            return {
              ip,
              city: data.city || "Unknown",
              country: data.country,
              region: data.regionName,
              timezone: data.timezone,
              location: `${data.city || "Unknown"}, ${data.country}`,
            };
          }

          // Handle ipapi.co response
          if (data.city && data.country_name) {
            return {
              ip,
              city: data.city,
              country: data.country_name,
              region: data.region,
              timezone: data.timezone,
              location: `${data.city}, ${data.country_name}`,
            };
          }

          // Handle geoplugin response
          if (data.geoplugin_city && data.geoplugin_countryName) {
            return {
              ip,
              city: data.geoplugin_city,
              country: data.geoplugin_countryName,
              region: data.geoplugin_regionName,
              timezone: data.geoplugin_timezone,
              location: `${data.geoplugin_city}, ${data.geoplugin_countryName}`,
            };
          }
        } catch (serviceError) {
          console.log("Service failed:", serviceUrl, serviceError);
          continue;
        }
      }

      console.log("All geolocation services failed, using fallback");
      return {
        ip,
        city: "Unknown",
        country: "Unknown",
        location: "Unknown Location",
      };
    } catch (error) {
      console.error("Location lookup failed:", error);
      return {
        ip,
        city: "Unknown",
        country: "Unknown",
        location: "Unknown Location",
      };
    }
  }

  static getClientInfoFromRequest(request: Request): {
    userAgent: string;
    ip: string;
  } {
    console.log("Extracting client info from request headers");

    // Get all relevant headers
    const headers = request.headers;
    const userAgent = headers.get("user-agent") || "Unknown User Agent";

    // Try multiple IP extraction methods
    let ip = "127.0.0.1";

    // Check various IP headers in order of reliability
    const ipHeaders = [
      "cf-connecting-ip", // Cloudflare
      "x-real-ip", // Nginx
      "x-forwarded-for", // Most proxies
      "x-client-ip", // Apache
      "x-cluster-client-ip", // Cluster
      "forwarded-for", // RFC 7239
      "forwarded", // RFC 7239
      "via", // Proxy
      "remote-addr", // Direct connection
    ];

    for (const header of ipHeaders) {
      const value = headers.get(header);
      if (value) {
        console.log(`Found IP in ${header}:`, value);
        // Handle comma-separated IPs (take the first one)
        ip = value.split(",")[0].trim();
        // Remove port if present
        ip = ip.split(":")[0];
        // Validate IP format
        if (this.isValidIP(ip)) {
          break;
        }
      }
    }

    console.log("Final extracted info:", {
      userAgent: userAgent.substring(0, 100) + "...",
      ip,
    });

    return { userAgent, ip };
  }

  static isValidIP(ip: string): boolean {
    // Simple IP validation
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  static async createSessionWithRequest(
    userId: string,
    sessionToken: string,
    expires: Date,
    request: Request
  ): Promise<void> {
    try {
      console.log("🚀 Creating session with request for user:", userId);

      const { userAgent, ip } = this.getClientInfoFromRequest(request);
      console.log("📱 Raw client info:", {
        userAgent: userAgent.substring(0, 50) + "...",
        ip,
      });

      const deviceInfo = this.parseUserAgent(userAgent);
      console.log("🔍 Parsed device info:", deviceInfo);

      const locationInfo = await this.getLocationFromIP(ip);
      console.log("🌍 Location info:", locationInfo);

      const deviceString = `${deviceInfo.browser} on ${deviceInfo.os} (${deviceInfo.device})`;

      console.log("💾 Creating session with data:", {
        userId,
        sessionToken: sessionToken.substring(0, 8) + "...",
        deviceString,
        ipAddress: locationInfo.ip,
        location: locationInfo.location,
        city: locationInfo.city,
        country: locationInfo.country,
      });

      const session = await prisma.session.create({
        data: {
          sessionToken,
          userId,
          expires,
          deviceInfo: deviceString,
          ipAddress: locationInfo.ip,
          location:
            locationInfo.location ||
            `${locationInfo.city || "Unknown"}, ${
              locationInfo.country || "Unknown"
            }`,
          isActive: true,
          lastActivity: new Date(),
        },
      });

      console.log(`✅ Session created successfully:`, {
        id: session.id,
        userId: session.userId,
        deviceInfo: session.deviceInfo,
        location: session.location,
        ipAddress: session.ipAddress,
      });
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      // Don't throw error to prevent login failure
      console.log("⚠️  Continuing with login despite session creation failure");
    }
  }

  static async createSession(
    userId: string,
    sessionToken: string,
    expires: Date,
    userAgent?: string,
    ip?: string
  ): Promise<void> {
    try {
      console.log("🚀 Creating session for user:", userId);

      const deviceInfo = this.parseUserAgent(userAgent || "Unknown Browser");
      const locationInfo = ip
        ? await this.getLocationFromIP(ip)
        : {
            ip: "127.0.0.1",
            city: "Local",
            country: "Local Network",
            location: "Local Network",
          };

      const deviceString = `${deviceInfo.browser} on ${deviceInfo.os} (${deviceInfo.device})`;

      console.log("💾 Creating session with fallback data:", {
        userId,
        deviceString,
        ipAddress: locationInfo.ip,
        location: locationInfo.location,
      });

      await prisma.session.create({
        data: {
          sessionToken,
          userId,
          expires,
          deviceInfo: deviceString,
          ipAddress: locationInfo.ip,
          location:
            locationInfo.location ||
            `${locationInfo.city || "Unknown"}, ${
              locationInfo.country || "Unknown"
            }`,
          isActive: true,
          lastActivity: new Date(),
        },
      });

      console.log(
        `✅ Session created successfully for user ${userId} from ${deviceString} at ${locationInfo.location}`
      );
    } catch (error) {
      console.error("❌ Failed to create session:", error);
      // Don't throw to prevent breaking the auth flow
    }
  }

  static async updateSessionActivity(sessionToken: string): Promise<void> {
    try {
      await prisma.session.update({
        where: { sessionToken },
        data: { lastActivity: new Date() },
      });
    } catch (error) {
      console.error("Failed to update session activity:", error);
    }
  }

  static async deactivateSession(sessionToken: string): Promise<void> {
    try {
      await prisma.session.update({
        where: { sessionToken },
        data: { isActive: false },
      });
    } catch (error) {
      console.error("Failed to deactivate session:", error);
    }
  }

  static async deleteSession(sessionToken: string): Promise<void> {
    try {
      await prisma.session.delete({
        where: { sessionToken },
      });
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  }

  static async getUserSessions(userId: string) {
    try {
      console.log("Getting sessions for userId:", userId);

      const sessions = await prisma.session.findMany({
        where: {
          userId,
          isActive: true,
          expires: { gt: new Date() },
        },
        orderBy: { lastActivity: "desc" },
        select: {
          id: true,
          sessionToken: true,
          deviceInfo: true,
          ipAddress: true,
          location: true,
          lastActivity: true,
          createdAt: true,
          expires: true,
        },
      });

      console.log(
        `Found ${sessions.length} active sessions for user ${userId}`
      );
      return sessions;
    } catch (error) {
      console.error("Failed to get user sessions:", error);
      return [];
    }
  }

  static async cleanupExpiredSessions(): Promise<void> {
    try {
      await prisma.session.deleteMany({
        where: { expires: { lt: new Date() } },
      });
    } catch (error) {
      console.error("Failed to cleanup expired sessions:", error);
    }
  }
}
