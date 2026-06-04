import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { context, isAdmin, isAuth, mergedDateTime } from "../context";
import {
  accessCookieOptions,
  refreshCookieOptions,
  setTempToken,
  setTokens,
  signAccessToken,
  tempCookieOptions,
  verifyRefreshToken,
  verifyTempToken,
} from "../../lib/jwtCookie";
import { getTwilioClient, isValidPhone } from "../../lib/twilio";
import { OAuth2Client } from "google-auth-library";
import { GraphQLError } from "graphql/error";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const resolvers = {
  Query: {
    currentUser: async (_parent: unknown, _args: unknown, ctx: context) => {
      if (!ctx.userId) {
        throw new Error("Not authenticated - Login first");
      }
      console.log("The admin have the role is : ", ctx.role);

      try {
        console.log("ctx.userId : ", ctx.userId);
        if (!ctx.userId) {
          throw new GraphQLError("Not authenticated — please log in first", {
            extensions: {
              code: "UNAUTHENTICATED",
            },
          });
        }
        return prisma.user.findUnique({
          where: { id: ctx.userId },
        });
      } catch (error) {
        console.log("error in currentUser : ", error);
        throw error;
      }
    },
    getEvents: async (_: unknown, __: unknown, ctx: context) => {
      return await prisma.event.findMany({
        include: {
          participants: {
            include: { user: true },
          },
        },
        orderBy: { eventStartDate: "asc" },
      });
    },

    getEvent: async (_: unknown, args: { eventId: string }, ctx: context) => {
      const event = await prisma.event.findUnique({
        where: { id: Number(args.eventId) },
        include: {
          participants: {
            include: { user: true },
          },
        },
      });

      if (!event) throw new Error("Event not found");

      return event;
    },

    userJoinedEvents: async (_: unknown, __: unknown, ctx: context) => {
      isAdmin(ctx);

      const participations = await prisma.eventParticipant.findMany({
        where: { userId: ctx.userId! },
        include: {
          event: {
            include: {
              participants: { include: { user: true } },
            },
          },
        },
        orderBy: { joinedAt: "desc" },
      });

      return participations.map((p) => p.event);
    },

    eventParticipants: async (
      _: unknown,
      args: { eventId: string },
      ctx: context,
    ) => {
      isAdmin(ctx);

      const participants = await prisma.eventParticipant.findMany({
        where: { eventId: Number(args.eventId) },
        include: { user: true },
      });

      return participants.map((p) => p.user);
    },
  },
  Mutation: {
    signUp: async (
      _parent: unknown,
      args: {
        firstname: string;
        lastname: string;
        email: string;
        password: string;
      },
      _ctx: unknown,
    ) => {
      try {
        if (!args.firstname || !args.email || !args.password) {
          throw new Error("Provide all credentials");
        }
        const existingUser = await prisma.user.findUnique({
          where: { email: args.email },
        });
        if (existingUser)
          throw new Error(
            "Account wiht this email already Exist - please logIn",
          );

        const hashPassword = await bcrypt.hash(args.password, 10);

        const user = await prisma.user.create({
          data: {
            firstname: args.firstname,
            lastname: args.lastname,
            email: args.email,
            password: hashPassword,
          },
          include: {
            interests: true,
            attendees: true,
          },
        });
        const { password, ...safeUser } = user;

        console.log("user signup successfully ", safeUser);

        return { user: safeUser };
      } catch (error) {
        console.log("error in signup mutation : ", error);
        throw error;
      }
    },
    logIn: async (
      _: unknown,
      args: { email: string; password: string },
      ctx: context,
    ) => {
      try {
        if (!args.email || !args.password) {
          throw new Error("Email and Password are required ");
        }

        const user = await prisma.user.findUnique({
          where: { email: args.email.toLowerCase().trim() },
        });

        if (!user) {
          throw new Error("Invalid credentials");
        }
        if (!user.password) {
          throw new Error("For manual login user password must");
        }
        const passwordMatches = await bcrypt.compare(
          args.password,
          user.password,
        );
        console.log("passwordMatches : ", passwordMatches);

        if (!passwordMatches) {
          throw new Error("Invalid credentials");
        }

        setTokens(ctx.res, user.id, user.role);

        const { password, ...safeUser } = user;

        console.log("login succesfully");
        return {
          user: safeUser,
        };
      } catch (error) {
        console.log("error in login mutation : ", error);
        throw error;
      }
    },
    googleLogin: async (_: any, { idToken }: any, { res }: any) => {
      try {
        const ticket = await client.verifyIdToken({
          idToken: idToken,
          audience: process.env.GOOGLE_CLIENT_ID!,
        });
        const payload = ticket.getPayload();
        console.log("payload by generating with google client id : ", payload);

        if (!payload || !payload.email_verified || !payload.email) {
          throw new Error("Invalid Google Account");
        }

        const { sub: googleId, email, given_name, family_name } = payload;

        let user = await prisma.user.findFirst({
          where: {
            OR: [{ email: email }, { googleId: googleId }],
          },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: email,
              googleId: googleId,
              firstname: given_name || "Google",
              lastname: family_name || "User",
            },
          });
        }
        //add tokens
        setTokens(res, user.id, user.role);
        console.log("check user exist in DB : ", user);

        return { user };
      } catch (error) {
        console.error("GoogleLogin error:", error);
        throw error;
      }
    },
    sendOTPLogin: async (
      _: unknown,
      args: { email: string; password: string; toPhone: string },
      ctx: context,
    ) => {
      if (!args.email || !args.password || !args.toPhone) {
        throw new Error("All field are required");
      }
      const user = await prisma.user.findUnique({
        where: { email: args.email.toLowerCase().trim() },
      });
      if (!user) {
        throw new Error("Invalid credential");
      }
      if (!user.password) {
        throw new Error("For manual login user password must");
      }
      const passwordMatches = await bcrypt.compare(
        args.password,
        user.password,
      );
      console.log("passwordMatches : ", passwordMatches);

      if (!passwordMatches) {
        throw new Error("Invalid credentials");
      }

      const twilioPhoneCheck = isValidPhone(args.toPhone);

      if (!twilioPhoneCheck) {
        throw new Error("Invalid credentials - Enter correct phone number");
      }

      const twilioVerifyServiceId = process.env.TWILIO_SERVICE_SID;

      if (!twilioVerifyServiceId) {
        throw new Error("twilioServiceId not configured");
      }

      const twilioClient = getTwilioClient();

      console.log("twilioClient through sendOTP : ", twilioClient);

      try {
        const verificationRes = await twilioClient.verify.v2
          .services(twilioVerifyServiceId)
          .verifications.create({
            to: args.toPhone,
            channel: "sms",
          });
        console.log(
          "status after send OTP to the user : ",
          verificationRes.status,
        );

        //save number in DB
        const Userdata = await prisma.user.update({
          where: { email: user.email },
          data: { phone: args.toPhone },
        });

        console.log("data after update phone ", Userdata);

        setTempToken(ctx.res, Userdata.id); // it is not for authorised the user, just for verifying the otp with same user

        return {
          success: true,
          otpMsg: "OTP sent successfully",
        };
      } catch (error) {
        console.log("Failed to send OTP : ", error);
        throw new Error("Failed to send OTP : ");
      }
    },
    verifyOTP: async (
      _parent: unknown,
      args: { code: string },
      ctx: context,
    ) => {
      try {
        if (!args.code) {
          throw new Error("OTP required to verify ");
        }
        const getTempToken = ctx.req.cookies.tempToken;
        if (!getTempToken) {
          throw new Error("Session or Time for OTP expired- sent OTP again");
        }
        const decoded = verifyTempToken(getTempToken);
        const userId = decoded.userId;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new Error("User not found to verifying the OTP");
        }
        if (!user.phone) {
          throw new Error("No phone found - please start login again");
        }

        const verifyServiceId = process.env.TWILIO_SERVICE_SID;
        if (!verifyServiceId) {
          throw new Error("Twillio verify service id, not found in env file");
        }
        const twilioClient = getTwilioClient();
        const verifyCheck = await twilioClient.verify.v2
          .services(verifyServiceId)
          .verificationChecks.create({
            to: user.phone,
            code: args.code,
          });

        console.log("verifyCheck ", verifyCheck);

        if (verifyCheck.status === "approved") {
          await prisma.user.update({
            where: { id: userId }, //update phone verified
            data: { phoneVerified: true },
          });

          ctx.res.clearCookie("tempToken", tempCookieOptions);

          setTokens(ctx.res, userId, ctx.role); //set Tokens access & refresh
          console.log("accessToken : ", ctx.req.cookies.accessToken);
          console.log("refreshToken : ", ctx.req.cookies.refreshToken);

          return {
            success: true,
            otpMsg: "OTP verified - login successfully",
          };
        } else if (verifyCheck.status === "expired") {
          throw new Error("OTP expired- please login and try again");
        } else {
          throw new Error("Invalid OTP code- please try again");
        }
      } catch (error) {
        console.log("error in verifyOTP : ", error);
        throw error;
      }
    },
    retreshTokenAPI: async (_parent: unknown, _args: unknown, ctx: context) => {
      const token = ctx.req.cookies?.refreshToken;
      console.log("refresh token is present : ========> ", token);
      if (!token) {
        throw new Error("No refresh token found ");
      }
      try {
        const decoded = verifyRefreshToken(token);
        const userId = decoded.userId;
        const role = decoded.role;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          throw new Error("User not found in refreshToken mutation");
        }

        const newAccessToken = signAccessToken(userId, role);
        ctx.res.cookie("accessToken", newAccessToken, accessCookieOptions);

        return true;
      } catch (error) {
        ctx.res.clearCookie("accessToken", accessCookieOptions);
        ctx.res.clearCookie("refreshToken", refreshCookieOptions);
        throw error;
      }
    },
    logOut: async (_parent: unknown, _args: unknown, ctx: context) => {
      if (!ctx.userId) {
        throw new Error("Not authenticated - Login first in logout mutation");
      }
      ctx.res.clearCookie("accessToken", accessCookieOptions);
      ctx.res.clearCookie("refreshToken", refreshCookieOptions);
      return true;
    },

    //ADMIN
    createEvent: async (
      _parent: unknown,
      args: {
        title: string;
        description: string;
        category: string;
        Eventlocation: string;
        latitude: number;
        longitude: number;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        image?: string;
      },
      ctx: context,
    ) => {
      isAdmin(ctx);
      console.log("start date : ", args.startDate); //2026-06-18
      console.log("start time : ", args.startTime); //18:05

      const eventStartDate = mergedDateTime(args.startDate, args.startTime);
      const eventEndDate = mergedDateTime(args.endDate, args.endTime);

      if (new Date(eventEndDate) <= new Date(eventStartDate)) {
        throw new Error("End date/time must be after start date/time");
      }

      return await prisma.event.create({
        data: {
          title: args.title,
          description: args.description,
          Eventlocation: args.Eventlocation,
          latitude: args.latitude,
          longitude: args.longitude,
          category: args.category,
          image: args.image,
          eventStartDate,
          eventEndDate,
        },
      });
    },
    updateEvent: async (
      _: unknown,
      args: {
        eventId: string;
        title: string;
        description: string;
        category: string;
        Eventlocation: string;
        latitude: number;
        longitude: number;
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
      },
      ctx: context,
    ) => {
      isAdmin(ctx);

      const event = await prisma.event.findUnique({
        where: { id: Number(args.eventId) },
      });

      if (!event) throw new Error("Event not found");

      // Only recompute dates if both date AND time are provided together
      const hasStart = args.startDate && args.startTime;
      const hasEnd = args.endDate && args.endTime;

      const eventStartDate = hasStart
        ? mergedDateTime(args.startDate!, args.startTime!)
        : undefined;

      const eventEndDate = hasEnd
        ? mergedDateTime(args.endDate!, args.endTime!)
        : undefined;

      if (eventStartDate && eventEndDate) {
        if (new Date(eventEndDate) <= new Date(eventStartDate)) {
          throw new Error("End date/time must be after start date/time");
        }
      }

      return await prisma.event.update({
        where: { id: Number(args.eventId) },
        data: {
          title: args.title,
          description: args.description,
          Eventlocation: args.Eventlocation,
          latitude: args.latitude,
          longitude: args.longitude,
          category: args.category,
          ...(eventStartDate && { eventStartDate }),
          ...(eventEndDate && { eventEndDate }),
        },
      });
    },
    deleteEvent: async (
      _: unknown,
      args: { eventId: string },
      ctx: context,
    ) => {
      isAdmin(ctx);

      const event = await prisma.event.findUnique({
        where: { id: Number(args.eventId) },
      });

      if (!event) throw new Error("Event not found");

      await prisma.eventParticipant.deleteMany({
        where: { eventId: Number(args.eventId) },
      });

      await prisma.event.delete({
        where: { id: Number(args.eventId) },
      });

      return true;
    },

    // AUTH
    joinEvent: async (_: unknown, args: { eventId: string }, ctx: context) => {
      isAuth(ctx);

      const event = await prisma.event.findUnique({
        where: { id: Number(args.eventId) },
      });

      if (!event) throw new Error("Event not found");

      const alreadyJoined = await prisma.eventParticipant.findUnique({
        where: {
          userId_eventId: {
            userId: ctx.userId!,
            eventId: Number(args.eventId),
          },
        },
      });

      if (alreadyJoined) throw new Error("You have already joined this event");

      return await prisma.eventParticipant.create({
        data: {
          userId: ctx.userId!,
          eventId: Number(args.eventId),
        },
        include: {
          user: true,
          event: true,
        },
      });
    },
    archiveEvent: async (_: unknown, args: { eventId: string }, ctx: context) => {
      // isAdmin(ctx);
      isAuth(ctx);

      const participant = await prisma.eventParticipant.findUnique({
        where: {
          userId_eventId: {
            userId: ctx.userId!,
            eventId: Number(args.eventId),
          },
        },
      });

      if (!participant) throw new Error("You have not joined this event");
      if (participant && participant.isArchive) {
        await prisma.eventParticipant.update({
          where: {
            userId_eventId: {
              userId: ctx.userId!,
              eventId: Number(args.eventId),
            },
          },
          data: {
            isArchive: true,
          },
        });
      } else if (participant && !participant.isArchive) {
        await prisma.eventParticipant.update({
          where: {
            userId_eventId: {
              userId: ctx.userId!,
              eventId: Number(args.eventId),
            },
          },
          data: {
            isArchive: false,
          },
        });
      }

      return true;
    },

    //Auth
    updateProfile: async (
      _: unknown,
      args: {
        latitude?: number;
        longitude?: number;
      },
      ctx: context,
    ) => {
      try {
        isAuth(ctx);

        const existingProfile = await prisma.profile.findUnique({
          where: { userId: ctx.userId! },
        });

        if (!existingProfile) {
          await prisma.profile.create({
            data: { userId: ctx.userId! },
          });
        }

        return await prisma.profile.update({
          where: { userId: ctx.userId! },
          data: {
            ...(args.latitude !== undefined && { latitude: args.latitude }),
            ...(args.longitude !== undefined && { longitude: args.longitude }),
          },
          include: { user: true },
        });
      } catch (error) {
        console.error("update profile error : ", error);

        throw new Error("Error in update profile ");
      }
    },
    deleteProfile: async (_: unknown, __: unknown, ctx: context) => {
      isAuth(ctx);

      const existingProfile = await prisma.profile.findUnique({
        where: { userId: ctx.userId! },
      });

      if (!existingProfile) throw new Error("Profile not found");

      await prisma.profile.delete({
        where: { userId: ctx.userId! },
      });

      return true;
    },
  },

  //field resolver
  Event: {
    attendeeCount: async (parent: { id: number }, _: unknown, ctx: context) => {
      console.log("Field resolver i.e Event called : ");

      return await prisma.eventParticipant.count({
        where: { eventId: parent.id },
      });
    },
  },
};
