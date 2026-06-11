import jwt from "jsonwebtoken";
import { Role } from "../generated/prisma/enums";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const TEMP_SECRET = process.env.TEMP_TOKEN_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  throw new Error(
    "Secret not provided key for generating access and refresh token ",
  );
}
if (!TEMP_SECRET) {
  throw new Error("Secret not provided key for generating temporary token ");
}

export const signAccessToken = (userId: number, role: Role): string => {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "10h" });
};
export const signRefreshToken = (userId: number, role: Role): string => {
  return jwt.sign({ userId }, REFRESH_SECRET, { expiresIn: "7d" });
};
export const signTempToken = (userId: number): string => {
  return jwt.sign({ userId }, TEMP_SECRET, { expiresIn: "10min" });
};

export const accessCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 1000 * 60 * 60 * 10,
};

export const refreshCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const tempCookieOptions = {
  httpOnly: true, 
  secure: true,
  sameSite: "none" as const,
  path: "/",
  maxAge: 1000 * 60 * 10,
};
export const setTokens = (res: any, userId: number, role: Role) => {
  const accessToken = signAccessToken(userId, role);
  const refresToken = signRefreshToken(userId, role);

  res.cookie("accessToken", accessToken, accessCookieOptions);
  res.cookie("refreshToken", refresToken, refreshCookieOptions);
};

export const setTempToken = (res: any, userId: number) => {
  const tempToken = signTempToken(userId);
  res.cookie("tempToken", tempToken, tempCookieOptions);
};

//through refresh token
export const createAccessToken = (res: any, userId: number, role: Role) => {
  const setAccessToken = signAccessToken(userId, role);
  res.cookie("accessToken", setAccessToken, accessCookieOptions);
};

export const verifyAccessToken = (
  token: string,
): { userId: number; role: Role } => {
  return jwt.verify(token, ACCESS_SECRET) as { userId: number; role: Role };
};

export const verifyRefreshToken = (
  token: string,
): { userId: number; role: Role } => {
  return jwt.verify(token, REFRESH_SECRET) as {
    userId: number;
    role: Role;
  };
};

export const verifyTempToken = (
  token: string,
): { userId: number; role: Role } => {
  return jwt.verify(token, TEMP_SECRET) as {
    userId: number;
    role: Role;
  };
};
