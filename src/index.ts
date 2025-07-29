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
app.use("/", fileRouter);
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

- error handling for rename modal and matches zod schema for files
should prevent file names including < > : " / \ | ? *
- fix only .png, .txt files can submit
- add share btn
- add loading state when upload file/folder
- add toasts
 
- customize dates more if less than week old. 
e.g., <1 day = 23 hours ago, 10 mins ago, or at least add time and hour (7:58 pm)
- add column named type which shows folder or file icon
- add another table column with file/folder icon or just in name
- populate homepage with the 10 most recent files


*/
