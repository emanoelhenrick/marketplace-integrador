const jwtSecret = process.env.JWT_SECRET?.trim();

if (!jwtSecret) {
  throw new Error("JWT_SECRET não configurado no ambiente.");
}

export const JWT_SECRET = jwtSecret;
export const JWT_EXPIRES_IN = "7d";
