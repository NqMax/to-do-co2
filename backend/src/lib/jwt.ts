import * as jose from "jose";

export function encodeSecret(jwt: string) {
  const secret = new TextEncoder().encode(jwt);

  return secret;
}

export async function verifyJwt(token: string) {
  const secret = encodeSecret(process.env.JWT_SECRET!);

  const { payload } = await jose.jwtVerify(token, secret);

  return payload;
}

export async function signJwt(payload: jose.JWTPayload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .sign(encodeSecret(process.env.JWT_SECRET!));
}
