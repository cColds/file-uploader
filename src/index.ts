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
import { fileRouter } from "./routes/my-files";
import { requireAuth } from "./middleware/requireAuth";
import { shareRouter } from "./routes/share";

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

// public routes
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);
app.use("/share", shareRouter);

// protected routes
app.use("/", requireAuth, indexRouter);
app.use("/my-files", requireAuth, fileRouter);
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
- add loading state when upload file/folder
- add toasts
 
- customize dates more if less than week old. 
e.g., <1 day = 23 hours ago, 10 mins ago, or at least add time and hour (7:58 pm)
 

*/
