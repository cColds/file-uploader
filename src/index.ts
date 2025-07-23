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

- details should show type: file extension e.g., .png, .zip, .txt
and show detail dimensions if is image, and modified field (updatedAt)


- error handling for rename modal and matches zod schema for files
should prevent file names including < > : " / \ | ? *
 
- add crud to folders and files (maybe with another column in the table to select like one drive)
- clicking on file should show modal with details and download. 
preview files should only work for images, and maybe texts
- add download file
- fix folder constraints not working like spaces dont work, 
idk if special char constriant works
- kinda unhappy with the folder structure at the root
root folder u have to open it in /my-files and creating folder in that route will go in there
- rn kinda jank storing folder/id as data-folder/file-id
cuz grabbing the id have to know which item type. 
should just have data-id and data-file/folder

(less important stuff)
- customize dates more if less than week old. 
e.g., <1 day = 23 hours ago, 10 mins ago, or at least add time and hour (7:58 pm)
- add column named type which shows folder or file icon
- fix icons not loading when not cached yet (file/folder modal btn expands a bunch)
- add another table column with file/folder icon or just in name
- populate homepage with the 10 most recent files
- add error handling on input (add event listener with ejs), not just submission
- fix sign up and login doesn't have single source of truth for error messages
e.g., if username and password have an error it only renders username not found 
and not together with password invalid,
 because validateBody renders before passportjs login 
*/
