import { User } from "../entities/User";
import { Resolver, Query, Arg, Mutation, FieldResolver, Root, ObjectType, Field, Ctx, Args } from "type-graphql";
import { MyContext } from "../types";
import { validateRegister } from "../utils/validateRegister";
import argon2 from "argon2";
import { getConnection } from "typeorm";
import { EmailPasswordInput } from "./EmailPasswordInput";

@ObjectType()
class FieldError {
    @Field()
    field: string;
    @Field()
    message: string;
}

@ObjectType()
class UserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}


@Resolver(of => User)
export class UserResolver {

    // Query to check if user is logged in 
    @Query(() => User, { nullable: true })
    me(@Ctx() { req }: MyContext) {
        // you are not logged in
        if (!req.session.userId) {
            return null;
        }

        return User.findOne(req.session.userId);
    }

    // Register new user
    @Mutation(() => UserResponse)
    async register(
        @Arg("options") options: EmailPasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }

        const hashedPassword = await argon2.hash(options.password);
        let user;
        try {
            // User.create({}).save()
            const result = await getConnection()
                .createQueryBuilder()
                .insert()
                .into(User)
                .values({
                    name: options.name,
                    email: options.email,
                    password: hashedPassword,
                })
                .returning("*")
                .execute();
            user = result.raw[0];
        } catch (err) {
            // duplicate email error
            if (err.code === "23505") {
                return {
                    errors: [
                        {
                            field: "email",
                            message: "email already registered",
                        },
                    ],
                };
            }

            console.log(err)
        }

        // store user id session
        // this will set a cookie on the user
        // keep them logged in
        req.session.userId = user.id;

        return { user };
    }

    @Mutation(() => UserResponse)
    async login(
        @Arg("email") email: string,
        @Arg("password") password: string,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return {
                errors: [
                    {
                        field: "email",
                        message: "email does not exist",
                    },
                ],
            };
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: "password",
                        message: "incorrect password",
                    },
                ],
            };
        }

        req.session.userId = user.id;

        return {
            user,
        };
    }

}
