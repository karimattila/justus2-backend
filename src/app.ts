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

// Create express server
const app = express();

// Setup redis connection
const redis = require("redis");
const client = redis.createClient();

// Check that redis is connected and log it to the console
client.on("error", function() {
  console.log("Error when connecting to redis");
});
client.on("connect", function() {
  console.log("Redis is connected at 6379");
});

// Controllers (route handlers)
import * as homeController from "./controllers/home";

const session = require ("express-session");
// Redis, use for later
// const RedisStore = require("connect-redis")(session);
const pg = require ("pg");

const Pool = require("pg-pool");



// Create a pool once per process and reuse it
const pgPool = new Pool ({
  adapter: "connect-pg-simple",
  database: "justus",
  user: "appaccount",
  password: "postgres",
  host: "localhost",
  port: 5432,
});

app.use(session({
  store: new(require("connect-pg-pool")(session))({
    pool: pgPool
  }),
  secret: SESSION_SECRET,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  resave: true,
  autoreconnect: true,
  saveUninitialized: true,

}));

// CONNECT TO PSQL INSIDE VAGRANT "psql -h 10.10.10.10 -U postgres -d justus"
// psql -h 10.10.10.10 -U appaccount -d justus < node_modules/connect-pg-simple/table.sql

app.set("port", 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.get("/", homeController.index);
app.use(expressValidator);
app.use(flash);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});




// Import fs and ini modules
// const fs = require("fs");
// const ini = require("ini");

// Read ini file for later use
// const dbConfig = ini.parse(fs.readFileSync("/etc/justus-backend.ini", "utf-8"));

// // Use dbSettings.[name] to access wanted variable from the ini file. eg dbSettings.host
// const dbSettings = dbConfig.database;

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



export default app;