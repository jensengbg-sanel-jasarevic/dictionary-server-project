const port = process.env.PORT || 5000;

// Required modules 
const express = require("express");
const loginRouter = require("./controller/login-router.js")
const glossaryRouter = require("./controller/glossary-router.js")

// Start using Express framework
const server = express() 

// Middlewares 


// API routes
server.use("/api/login", loginRouter)
server.use("/api/glossary", glossaryRouter)


// Listen for requests from client on servers port
server.listen(port, () => {    
    console.log(`Server running on port ${port}`)
})