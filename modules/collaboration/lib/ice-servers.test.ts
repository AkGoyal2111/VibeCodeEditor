import { describe, it, expect, afterEach } from "vitest";
import { getIceConfiguration } from "./ice-servers";

const TURN_ENV = [
  "NEXT_PUBLIC_TURN_URLS",
  "NEXT_PUBLIC_TURN_USERNAME",
  "NEXT_PUBLIC_TURN_CREDENTIAL",
];

function clearTurnEnv() {
  for (const k of TURN_ENV) delete process.env[k];
}

describe("getIceConfiguration", () => {
  afterEach(clearTurnEnv);

  it("always includes STUN servers", () => {
    clearTurnEnv();
    const cfg = getIceConfiguration();
    const stun = cfg.iceServers!.filter((s) =>
      String(Array.isArray(s.urls) ? s.urls[0] : s.urls).startsWith("stun:")
    );
    expect(stun.length).toBeGreaterThan(0);
  });

  it("falls back to the public TURN relay when no env override is set", () => {
    clearTurnEnv();
    const cfg = getIceConfiguration();
    const hasTurn = cfg.iceServers!.some((s) => {
      const u = Array.isArray(s.urls) ? s.urls.join(",") : s.urls;
      return u.includes("turn:");
    });
    expect(hasTurn).toBe(true);
  });

  it("uses custom TURN credentials from env, replacing the public relay", () => {
    process.env.NEXT_PUBLIC_TURN_URLS =
      "turn:turn.example.com:3478,turns:turn.example.com:5349";
    process.env.NEXT_PUBLIC_TURN_USERNAME = "alice";
    process.env.NEXT_PUBLIC_TURN_CREDENTIAL = "secret";

    const cfg = getIceConfiguration();
    const custom = cfg.iceServers!.find((s) => {
      const u = Array.isArray(s.urls) ? s.urls.join(",") : s.urls;
      return u.includes("turn.example.com");
    });

    expect(custom).toBeTruthy();
    expect(custom!.username).toBe("alice");
    expect(custom!.credential).toBe("secret");

    // Public relay should no longer be present.
    const hasOpenRelay = cfg.iceServers!.some((s) => {
      const u = Array.isArray(s.urls) ? s.urls.join(",") : s.urls;
      return u.includes("openrelay.metered.ca");
    });
    expect(hasOpenRelay).toBe(false);
  });

  it("ignores an empty TURN url list", () => {
    process.env.NEXT_PUBLIC_TURN_URLS = "  , ,";
    const cfg = getIceConfiguration();
    const hasOpenRelay = cfg.iceServers!.some((s) => {
      const u = Array.isArray(s.urls) ? s.urls.join(",") : s.urls;
      return u.includes("openrelay.metered.ca");
    });
    // Empty override → public relay default still used.
    expect(hasOpenRelay).toBe(true);
  });
});
