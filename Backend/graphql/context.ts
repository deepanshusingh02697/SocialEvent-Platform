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
//Apollo only passes {req,res} to context functions - io must come via closure
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
