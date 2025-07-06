import { getFolders } from "@/db/getFolders";
import express from "express";

export const fileRouter = express.Router();

fileRouter.get("/my-files", async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) {
    res.send(404).json({ error: "User not found" });
    return;
  }

  const folders = await getFolders(userId, null);

  res.render("index", { activePage: "my-files", folders });
});
