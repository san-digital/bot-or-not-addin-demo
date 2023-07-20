/* global require, console */

import fs from "fs";

const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, _res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

server.post("/calc", (req, res) => {
  console.log(req);
  var data = JSON.parse(fs.readFileSync("data/example.json", "utf-8"));

  // const response: BotOrNotResults = import("data/example.json");

  res.jsonp(data);
});

// Use default router
server.use(router);
const port = 3001;

server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});
