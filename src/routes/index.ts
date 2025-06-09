import express from "express";

export const indexRouter = express.Router();

indexRouter.get(
  "/",
  (req, res, next) => {
    console.log("user", req.user);
    if (!req.user) return res.render("index");

    next();
  },
  (req, res) => res.render("indexAuthenticated")
);
