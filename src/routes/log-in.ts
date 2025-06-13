import { validateBody } from "@/middleware/validateBody";
import { loginSchema } from "@/schemas/loginSchema";
import express from "express";
import passport from "passport";

export const logInRouter = express.Router();

logInRouter.get("/", (req, res) => res.render("log-in", { errors: {} }));

logInRouter.post("/", validateBody(loginSchema), (req, res, next): void => {
  passport.authenticate("local", (err: any, user?: any, info?: any) => {
    if (err) return next(err);

    console.log({ err, user, info });
    if (!user) {
      return res.render("log-in", {
        errors: { [info.field]: info.message },
        formData: req.body,
      });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect("/");
    });
  })(req, res, next);
});
