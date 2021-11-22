// When this file imported it will handle all configurations regarding which database management system app should use.

const dbEngine = process.env.DB_ENVIRONMENT || "development";
const config = require("./knexfile.js")[dbEngine]; // Property accessors provide access to an object's properties by using bracket notation or dot notation.
module.exports = require("knex")(config); // Passing variable 'config' as argument to 'knex' module. When it receives it as a parameter it will recognize which database management system to use.