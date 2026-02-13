import * as jose from "jose";

export function encodeJwt(jwt: string) {
  const secret = new TextEncoder().encode(jwt);

  return secret;
}

export async function signJwt(payload: jose.JWTPayload) {
  return await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setIssuer("urn:co2")
    .sign(encodeJwt(process.env.JWT_SECRET!));
}
