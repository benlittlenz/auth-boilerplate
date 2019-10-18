import { createRefreshToken, createAccessToken } from "./auth";
import { Context } from "./Context";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  ObjectType,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import "reflect-metadata";
import { hash, compare } from "bcryptjs";
import { User } from "./entity/User";
import { isAuth } from "./isAuth";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "HI!!!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: Context) {
      console.log(payload)
    return `YOur id is ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: Context,
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("No such user exists ");

    const valid = await compare(password, user.password);

    if (!valid) throw new Error("Could not find user");

    //login successfull

    res.cookie("gdsfs", createRefreshToken(user), {
      httpOnly: true,
    });

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string,
  ) {
    try {
      const hashedPassword = await hash(password, 12);
      await User.insert({
        email,
        password: hashedPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }
    return true;
  }
}
