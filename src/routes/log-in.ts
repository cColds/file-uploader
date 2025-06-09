import express from "express";
import passport from "passport";

export const logInRouter = express.Router();

logInRouter.get("/", (req, res) => res.render("log-in"));

logInRouter.post(
  "/",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureMessage: true,
  })
);
