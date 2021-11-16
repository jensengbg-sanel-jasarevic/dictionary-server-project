// Required modules 
const express = require("express");
const loginRouter = require("../controller/login-router")

// Start using Express framework
const server = express() 

// Middlewares 


// API routes
server.use("/api", loginRouter)


module.exports = server;