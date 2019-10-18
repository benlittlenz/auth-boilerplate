import "dotenv/config";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./UserResolver";
import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import { verify } from "jsonwebtoken";
import { User } from "./entity/User";
import { createAccessToken } from "./auth";

(async () => {
  const app = express();
  app.use(cookieParser());
  app.get("/", (_req, res) => {
    res.send("hidffs");
  });

  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.gdsfs;
    if (!token) return res.send({ ok: false, accessToken: "" });
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
      console.log(err);
      return res.send({ ok: false, accessToken: "" });
    }

    //if payload is valid, send back an access token
    const user = await User.findOne({ id: payload.userId });
    if(!user) {
        return res.send({ ok: false, accessToken: "" });
    }
    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

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
