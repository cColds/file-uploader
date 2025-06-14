import express from "express";

export const indexRouter = express.Router();

indexRouter.get(
  "/",
  (req, res, next) => {
    if (!req.user) return res.redirect("/log-in");

    next();
  },
  (req, res) => {
    console.log("user: ", req.user);
    // todo: idk why the req.user doesnt include folders
    res.render("index", { activePage: "home" });
  }
);
