import { IVerifyOptions, Strategy as LocalStrategy } from "passport-local";
import prisma from "@/db/prismaClient";
import passport from "passport";
import bcrypt from "bcryptjs";

const strategy = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await prisma.user.findFirst({ where: { username } });

    if (!user) {
      return done(null, false, {
        field: "username",
        message: "Username not found",
      } as IVerifyOptions & { field: string });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return done(null, false, {
        field: "password",
        message: "Incorrect password",
      } as IVerifyOptions & { field: string });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export const configurePassport = () => {
  passport.use(strategy);
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};
