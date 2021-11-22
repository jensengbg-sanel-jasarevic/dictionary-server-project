// In this file we configurate the database we are going to interact with & location of database.

// Generate migration file: 'npx knex migrate:make [filename]'. Schema builder is there. All tables should be defined in schema.
// Run 'npx knex migrate:latest' to drop schema builder (all tables).

module.exports = {
    development: {
      client: 'sqlite3', // Determine which database management system to use.
      useNullAsDefault: true, 
      connection: {
        filename: "./model/data/main.db3", // This file is the database. Filename extensions for SQLite are '.db3' & '.sqlite3'. 
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
      // Requirements from Knex documentation. 
      pool: {
        min: 2,
        max: 10,
      },
      migrations: {
        tablename: "knex_migrations",
        directory: "./migrations",
      },
  };