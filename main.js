require("dotenv").config();
const port = process.env.PORT || 5000;
const server = require("./controller/index-api.js");

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
