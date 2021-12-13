// Required modules
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dictionaryRouter = require("./dictionary-router.js");
const commentsRouter = require("./comments-router.js");
const accountsRouter = require("./accounts-router.js");
const authRouter = require("./auth-router.js");

// Start using Express framework
const server = express();

// Middlewares
server.use(cors()); // Allows AJAX requests to skip the Same-origin policy and access resources from remote hosts.
server.use(express.json()); // Parses JSON. On 'request' object a 'body' object containing the parsed data is populated.
server.use(helmet()) // Improves server applications security by setting numerous HTTP headers. Compatible with Express framework.

// API endpoints
server.get("/", (req, res) => {
  res.send("API Server");
});
server.use("/api/dictionary", dictionaryRouter);
server.use("/api/comments", commentsRouter);
server.use("/api/accounts", accountsRouter);
server.use("/api/auth", authRouter);

module.exports = server; // Exports this code module for utilization in Business layer testing