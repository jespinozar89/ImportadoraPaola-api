const AUTH_COOKIE_NAME = "token";

const tokenDurationInMs = (value: string): number => {
  const match = value.trim().match(
    /^(\d+(?:\.\d+)?)\s*(ms|msec|msecs|millisecond|milliseconds|s|sec|secs|second|seconds|m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days|w|week|weeks|y|year|years)?$/i
  );

  if (!match) {
    throw new Error("TOKEN_EXPIRES_IN tiene un formato inválido.");
  }

  const amount = Number(match[1]);
  const unit = (match[2] || "ms").toLowerCase();
  const unitInMs: Record<string, number> = {
    ms: 1,
    msec: 1,
    msecs: 1,
    millisecond: 1,
    milliseconds: 1,
    s: 1000,
    sec: 1000,
    secs: 1000,
    second: 1000,
    seconds: 1000,
    m: 60_000,
    min: 60_000,
    mins: 60_000,
    minute: 60_000,
    minutes: 60_000,
    h: 3_600_000,
    hr: 3_600_000,
    hrs: 3_600_000,
    hour: 3_600_000,
    hours: 3_600_000,
    d: 86_400_000,
    day: 86_400_000,
    days: 86_400_000,
    w: 604_800_000,
    week: 604_800_000,
    weeks: 604_800_000,
    y: 31_557_600_000,
    year: 31_557_600_000,
    years: 31_557_600_000
  };
  const unitFactor = unitInMs[unit];
  if (unitFactor === undefined) {
    throw new Error("TOKEN_EXPIRES_IN tiene una unidad inválida.");
  }
  const maxAge = Math.floor(amount * unitFactor);

  if (!Number.isSafeInteger(maxAge) || maxAge <= 0) {
    throw new Error("TOKEN_EXPIRES_IN debe ser una duración positiva y segura.");
  }

  return maxAge;
};

const baseCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/"
});

export const getAuthCookieName = (): string => AUTH_COOKIE_NAME;

export const getAuthCookieOptions = () => ({
  ...baseCookieOptions(),
  maxAge: tokenDurationInMs(process.env.TOKEN_EXPIRES_IN || "1h")
});

export const getAuthClearCookieOptions = () => baseCookieOptions();
