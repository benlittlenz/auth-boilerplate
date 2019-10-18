import "dotenv/config";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";

(async () => {
  const app = express();

  app.get('/', (_req, res) => {
      res.send('hidffs')
  })

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("server running");
  });
})();