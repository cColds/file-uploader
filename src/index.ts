import express, { Express } from "express";
import expressSession from "express-session";
import bodyParser from "body-parser";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import path from "path";
import { configurePassport } from "./auth/configurePassport";
import { signUpRouter } from "./routes/sign-up";
import { logInRouter } from "./routes/log-in";
import passport from "passport";
import { indexRouter } from "./routes";

const app: Express = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(bodyParser.json());

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());

configurePassport();

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.post("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// todo:
/*
 
- style home page (header, log out btn, table of folders/files )
- add modal for creating files and folders
- homepage will feature recent files
- my files page will have the root folder and files/folders in it
 

- add create/new folder (creating folders should be a nested cycle)
e.g, folder a > folder b > folder c (folder a is root, and folder b is child of a, etc.)

- upload files (should be stored in a specified folder)
- maybe add default folder calledd home or <username> or desktop
- add base header app name and login/sign up  to all html 
*/
