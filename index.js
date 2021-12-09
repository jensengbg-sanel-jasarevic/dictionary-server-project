require("dotenv").config();
const port = process.env.PORT || 5000;
const server = require("./controller/server.js");

// Listen for requests from client on servers port
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});