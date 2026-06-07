import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/Typedefs/typedefs";
import { resolvers } from "./graphql/Resolvers/resolvers";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { checkAuth, context } from "./graphql/context";
import cookieParser from "cookie-parser";
import uploadRouter from "./Routes/uploadRoute"
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4001;

const httpServer= createServer(app)

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

//frontend as well 
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
});


io.on("connection",(socket)=>{
  console.log("User connected");
  console.log("Socket id : ",socket.id);
  
  socket.on("disconnect",()=>{
    console.log("Client disconnected");
  })
})

app.use("/upload", uploadRouter);

//Apollo sever
const server = new ApolloServer<context>({
  typeDefs,
  resolvers,
  introspection: true,
});

async function startServer() {
  await server.start();
  app.use(
    "/graphql",
    express.json(),
    cookieParser(),
    expressMiddleware<context>(server, {
      context: checkAuth(req,res,io),
    }),
  );
  httpServer.listen(port, () => {
    console.log(
      `Server is ready to listen at http://localhost:${port}`,
    );
  });
}
startServer().catch((err) => {
  console.error("Server failed to start ", err);
});
