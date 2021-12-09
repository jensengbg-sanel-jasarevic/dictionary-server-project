// Database configuration for development & production. The app will interact with one of these databases.
// Settings for organizing where database file should be stored locally & on Internet

module.exports = {
    development: {
      client: 'sqlite3', // Determine which database management system to use
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

// Generate migration file: 'npx knex migrate:make [filename]'. 
// Database schema builder, tables will be created there.
// Run 'npx knex migrate:latest' to drop the schema builder (with all tables)