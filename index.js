const port = process.env.PORT || 5000;

// Required modules 
const express = require("express");
const cors = require('cors');
const loginRouter = require("./controller/login-router.js")
const glossaryRouter = require("./controller/glossary-router.js")

// Start using Express framework
const server = express() 

// Middlewares 
server.use(cors()) // Allows AJAX requests to skip the Same-origin policy and access resources from remote hosts
server.use(express.json()) // Parses JSON. On 'request' object a 'body' object containing the parsed data is populated

// API endpoints 
server.use("/api/login", loginRouter)
server.use("/api/glossary", glossaryRouter)

// Listen for requests from client on servers port
server.listen(port, () => {    
    console.log(`Server running on port ${port}`)
})

module.exports = server; // Exports the code module for utilization in Business layer testing