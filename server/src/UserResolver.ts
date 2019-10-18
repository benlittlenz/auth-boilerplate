import { Context } from "./Context";
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  ObjectType,
  Ctx,
} from "type-graphql";
import "reflect-metadata";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

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

    res.cookie(
      "gdsfs",
      sign({ userId: user.id }, "qweeqwedas", {
        expiresIn: "7d",
      }), {
          httpOnly: true
      }
    );

    return {
      accessToken: sign({ userId: user.id }, "secrdfsdfset", {
        expiresIn: "15m",
      }),
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
