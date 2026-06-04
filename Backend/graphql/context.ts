import { Request, Response } from "express";
import { verifyAccessToken } from "../lib/jwtCookie";
import { Role, User } from "../generated/prisma/client";

export type context = {
  userId: number | null;
  req: Request;
  res: Response;
  role: Role;
};
export const checkAuth = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<context> => {
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
  return { req, res, userId, role };
};

export const isAuth = (ctx: context) => {
  if (!ctx.userId) {
    throw new Error("Not authenticated - please log in first");
  }
};

export const isAdmin = (ctx: context) => {
  isAuth(ctx);
  if (ctx.role !== "ADMIN") {
    throw new Error("You have not access - Admin can only");
  }
};
// console.log("start date : ",args.startDate);//2026-06-18
// console.log("start time : ",args.startTime);//18:05
export const mergedDateTime = (date: string, time: string) => {
  const [year, month, day] = date.split("-");
  if (!day || !month || !year) {
    throw new Error(`Invalid date format: "${date}" - expected yy-mm-dd`);
  }

  //time arrives as "HH:MM"
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(time)) {
    throw new Error(`Invalid time format: "${time}" - exprected HH:MM`);
  }

  const iso = `${year}-${month}-${day}T${time}:00.000Z`;
  const parsed = new Date(iso);

  if (isNaN(parsed.getTime())) {
    throw new Error(`could not parse date/time : ${date} ${time}`);
  }

  return parsed.toISOString();
};

