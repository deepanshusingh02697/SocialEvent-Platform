import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/Typedefs/typedefs";
import { resolvers } from "./graphql/Resolvers/resolvers";
import express from "express";
import { expressMiddleware } from "@as-integrations/express5";
import { checkAuth, context } from "./graphql/context";
import cookieParser from "cookie-parser";
import uploadRouter from "./Routes/uploadRoute"
const app = express();
const port = process.env.PORT || 4001;


app.use("/upload", uploadRouter);

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
    expressMiddleware(server, {
      context: checkAuth,
    }),
  );
  app.listen(port, () => {
    console.log(
      `Server is ready to listen at http://localhost:${port}`,
    );
  });
}
startServer().catch((err) => {
  console.error("Server failed to start ", err);
});
