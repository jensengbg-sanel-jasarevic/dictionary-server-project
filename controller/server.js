// Required modules
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dictionaryRouter = require("./dictionary-router.js");
const commentsRouter = require("./comments-router.js");
const accountsRouter = require("./accounts-router.js");
const authRouter = require("./auth-router.js");

// Start using Express framework
const server = express();

// Middlewares
server.use(cors()); // Allows AJAX requests to skip the Same-origin policy and access resources from remote hosts
server.use(express.json()); // Parses JSON. On 'request' object a 'body' object containing the parsed data is populated
server.use(cookieParser()); // used to parse the cookie from frontend

// API endpoints
server.get("/", (req, res) => {
  res.send("Server API");
});
server.use("/api/dictionary", dictionaryRouter);
server.use("/api/comments", commentsRouter);
server.use("/api/accounts", accountsRouter);
server.use("/api/auth", authRouter);

module.exports = server; // Exports the code module for utilization in Business layer testing