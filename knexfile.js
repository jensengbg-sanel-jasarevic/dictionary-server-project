// Database configuration for development & production. App will interact with one of these databases

module.exports = {
    development: {
      client: 'sqlite3', // Database management system to use
      useNullAsDefault: true, 
      connection: {
        filename: "./model/data/main.db3", // File extension suffix '.db3' indicates that the data in this type of file format is organized in a way that SQLite software can open it
      },
      pool: {
        afterCreate: (conn, done) => {
          conn.run("PRAGMA foreign_keys = ON", done);
        },
      },
    },
    production: {
      client: "pg", 
      connection: { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    },  
      // Requirements from Knex documentation
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tablename: "knex_migrations",
        directory: "./migrations",
      },
  };

// Generate migration file: 'npx knex migrate:make [filename]'
// Schema builder for database will be in migration file. The plan for how the database will be constructed will be created there
// To run a migration: 'npx knex migrate:latest'