// Required modules 
const express = require("express");
const cors = require('cors');
const loginRouter = require("./login-router.js")
const dictionaryRouter = require("./dictionary-router.js")
const commentsRouter = require("./comments-router.js")

// Start using Express framework
const server = express() 

// Middlewares 
server.use(cors()) // Allows AJAX requests to skip the Same-origin policy and access resources from remote hosts
server.use(express.json()) // Parses JSON. On 'request' object a 'body' object containing the parsed data is populated

// API endpoints 
server.get("/", (req, res) => {res.send("Server API")})
server.use("/api/login", loginRouter)
server.use("/api/dictionary", dictionaryRouter)
server.use("/api/comments", commentsRouter)

module.exports = server; // Exports the code module for utilization in Business layer testing