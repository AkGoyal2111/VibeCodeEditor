/**
 * Builds the ICE server list used for WebRTC calls.
 *
 * - STUN alone is enough for same-network / localhost calls.
 * - A TURN relay is required when peers are behind strict/symmetric NATs
 *   (typical for two people on different home or office networks). TURN relays
 *   the media when a direct peer-to-peer path can't be established.
 *
 * Defaults to Google STUN + the Open Relay Project's free public TURN servers
 * so cross-NAT calls work out of the box. For production reliability, set your
 * own credentials (e.g. Twilio, Metered, or self-hosted coturn) via env:
 *
 *   NEXT_PUBLIC_TURN_URLS="turn:turn.example.com:3478,turns:turn.example.com:5349"
 *   NEXT_PUBLIC_TURN_USERNAME="user"
 *   NEXT_PUBLIC_TURN_CREDENTIAL="pass"
 *
 * When custom TURN env vars are present they REPLACE the public defaults.
 */

// Open Relay Project — free public TURN (https://www.metered.ca/tools/openrelay/).
// Multiple ports/transports improve the odds of getting through firewalls.
const OPEN_RELAY_TURN: RTCIceServer[] = [
  {
    urls: "turn:openrelay.metered.ca:80",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
  {
    urls: "turn:openrelay.metered.ca:443?transport=tcp",
    username: "openrelayproject",
    credential: "openrelayproject",
  },
];

const STUN_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

function customTurnFromEnv(): RTCIceServer[] | null {
  const urls = process.env.NEXT_PUBLIC_TURN_URLS;
  const username = process.env.NEXT_PUBLIC_TURN_USERNAME;
  const credential = process.env.NEXT_PUBLIC_TURN_CREDENTIAL;

  if (!urls) return null;

  const urlList = urls
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
  if (urlList.length === 0) return null;

  return [
    {
      urls: urlList,
      ...(username ? { username } : {}),
      ...(credential ? { credential } : {}),
    },
  ];
}

/** Build the RTCConfiguration for a peer connection. */
export function getIceConfiguration(): RTCConfiguration {
  const custom = customTurnFromEnv();
  const turn = custom ?? OPEN_RELAY_TURN;
  return {
    iceServers: [...STUN_SERVERS, ...turn],
    iceCandidatePoolSize: 10,
  };
}
