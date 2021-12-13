// Organize which database app will use
// Importing this file will handle all configurations regarding which database management system app is going to use

const dbEngine = process.env.DB_ENVIRONMENT || "development";
const config = require("../knexfile.js")[dbEngine]; // Property accessors provide access to an object's properties by using bracket notation or dot notation
module.exports = require("knex")(config); // Passing variable 'config' as argument to 'knex' module. When it receivs this parameter the module will know which database management system to use