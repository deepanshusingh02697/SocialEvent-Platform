import { Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwtCookie";
import { Role, User } from "../generated/prisma/client";
import { GraphQLError } from "graphql";
import { Server } from "socket.io";

export type context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: Role;
  io: Server;
};
export const createCheckAuth =
  (io: Server) =>
  async ({ req, res }: { req: Request; res: Response }): Promise<context> => {
    console.log("CheckAuth called ");
    console.log("accessToken ", req.cookies?.accessToken);
    let userId: number | null = null;
    let role: Role = "USER";
    const accessToken = req.cookies.accessToken;

    if (accessToken) {
      try {
        const decoded = verifyAccessToken(accessToken);
        userId = decoded.userId;
        role = decoded.role;
      } catch (error) {
        userId = null;
      }
    }
    return { req, res, userId, role, io };
  };

export const isAuth = (ctx: context) => {
  if (!ctx.userId) {
    throw new GraphQLError("Not authenticated — please log in first", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
};

export const isAdmin = (ctx: context) => {
  isAuth(ctx);
  if (ctx.role !== "ADMIN") {
    throw new Error("You have not access - Admin can only");
  }
};

export const twoUserRoomId = <T>(senderId: T, receiverId: T) => {
  return [senderId, receiverId].sort().join("-");
};

export const checkemail = (email: string): string => {
  const emailRegex =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailRegex.test(email.trim())) {
    throw new Error("Please enter a valid email address.");
  }

  return email.trim().toLowerCase();
};

export const checkPassword = (password: string): string => {

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, a number, and a special character."
    );
  }

  return password;
};