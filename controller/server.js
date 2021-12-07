const port = process.env.PORT || 5000;

// Required modules
const express = require("express");

// Start using Express framework
const server = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("../controller/user-router.js");
const dictionaryRouter = require("../controller/dictionary-router.js");
const commentsRouter = require("../controller/comments-router.js");
const passport = require("passport");

// Middlewares
server.use(cors()); // Allows AJAX requests to skip the Same-origin policy and access resources from remote hosts
server.use(express.json()); // Parses JSON. On 'request' object a 'body' object containing the parsed data is populated
server.use(cookieParser()); // used to parse the cookie from frontend
server.use(passport.initialize());
server.use(passport.session());
// API endpoints
server.get("/", (req, res) => {
  res.send("Server API");
});
server.use("/api/user", userRouter);
server.use("/api/dictionary", dictionaryRouter);
server.use("/api/comments", commentsRouter);

module.exports = server; // Exports the code module for utilization in Business layer testing
