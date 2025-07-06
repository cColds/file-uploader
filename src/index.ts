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
- create my-files route and store root folder and all folders/files there
- create my-files/id subfolder route to store nested folders
- add a modal for new folder and file with a form with a name field 
and maybe dropdown to pick where folder stored in, or root by default
- add multer middleware to handle file creation
- store files in cloudinary database and point postgres db to cdn link
- update prisma schema file schema to include a file url field
- populate homepage with the 10 most recent files
- add error handling on input (add event listener with ejs), not just submission
- fix sign up and login doesn't have single source of truth for error messages
e.g., if username and password have an error it only renders username not found 
and not together with password invalid,
 because validateBody renders before passportjs login 
*/
