import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import lusca from "lusca";
import dotenv from "dotenv";
import flash from "express-flash";
import path from "path";
import expressValidator from "express-validator";
import { SESSION_SECRET } from "./util/secrets";


// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env.example" });

// Controllers (route handlers)
import * as homeController from "./controllers/home";

// Import fs and ini modules
const fs = require("fs");
const ini = require("ini");

// Read ini file for later use
const dbConfig = ini.parse(fs.readFileSync("/etc/justus-backend.ini", "utf-8"));

// Use dbSettings.[name] to access wanted variable from the ini file. eg dbSettings.host
const dbSettings = dbConfig.database;

// Testing if ini file parsing/reading works
console.log("\n" + dbSettings.host + "\nINI settings test");

// Create Express server
const app = express();

// Connect to Postgres
const session = require("express-session");

// Connection details
const connectionObject = {
  host: dbSettings.host,
  port: parseInt(dbSettings.port),
  name: dbSettings.name,
  user: dbSettings.user,
  pass: dbSettings.pass
};
const pgSession = require("connect-pg-simple")(session);
const pgStoreConfig = {
  pgPromise: require("pg-promise")({ promiseLib: require("bluebird") })({
                     connectionObject }),
  };
  app.set("port", process.env.port || 3000);
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");
  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(expressValidator());
  app.use(flash());
  app.use(lusca.xframe("SAMEORIGIN"));
  app.use(lusca.xssProtection(true));
  app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

  app.use(session({
    store: new pgSession(pgStoreConfig),
    secret: SESSION_SECRET,
    resave: true,
    autoreconnect: true,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }
  }));

// Express configuration
// app.set("port", process.env.port || 3000);
// app.set("views", path.join(__dirname, "../views"));
// app.set("view engine", "pug");
// app.use(compression());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   store: new (require("connect-pg-simple")(session))(),
//   resave: true,
//   autoreconnect: true,
//   saveUninitialized: true,
//   secret: SESSION_SECRET,
// }));
// app.use(expressValidator());
// app.use(flash());
// app.use(lusca.xframe("SAMEORIGIN"));
// app.use(lusca.xssProtection(true));
// app.use((req, res, next) => {
//   res.locals.user = req.user;
//   next();
// });

//  app.use(
//    express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
//  );

/**
 * Primary app routes.
 */
app.get("/", homeController.index);



export default app;