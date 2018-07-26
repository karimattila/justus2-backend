import express from "express";
import compression from "compression";  // compresses requests
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

// Require bodyparser for every request
const bodyParser = require("body-parser");

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
// import * as apiRouter from "./routes/test";
const apiRouter = require("./routes/routes");
console.log(apiRouter);

const session = require ("express-session");
const RedisStore = require("connect-redis")(session);

const pg = require ("pg");

const Pool = require("pg-pool");



// Create a pool once per process and reuse it
const pgPool = new Pool ({
  database: "justus",
  user: "appaccount",
  password: "postgres",
  host: "localhost",
  port: 5432,
  max: 10,
});

app.use(session({
  store: new RedisStore(),
  pool: pgPool,
  secret: SESSION_SECRET,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  resave: true,
  autoreconnect: true,
  saveUninitialized: true,

}));

// CONNECT TO PSQL INSIDE VAGRANT "psql -h 10.10.10.10 -U postgres -d justus"
// psql -h 10.10.10.10 -U appaccount -d justus < node_modules/connect-pg-simple/table.sql

// Import the apiroutes from api/routes file
// const testRouter = require("./api/routes/routes");

app.set("port", 3000);
app.set("views", path.join(__dirname, "../views"));
app.set("view engine", "pug");
app.get("/", homeController.index);
app.use("/", apiRouter);
app.use(expressValidator);
app.use(flash);
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));



export default app;