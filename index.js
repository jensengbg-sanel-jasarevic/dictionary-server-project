require("dotenv").config();
const server = require("./api/server");
const port = process.env.PORT || 5000;


// Listen for requests from client on servers port
server.listen(port, () => {    
    console.log(`Server running on port ${port}`)
})

//odule.exports = server; // Exports the code module for utilization in Business layer testing