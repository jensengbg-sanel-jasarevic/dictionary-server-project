exports.up = function(knex) {
    return knex.schema
    .createTable("dictionary", tbl => { 
        tbl.increments() // For identifying a resource. The URI (Uniform Resource Identifier).
        tbl.text("letter")
        tbl.text("word")
        tbl.text("information")
        tbl.text("author")
      })
      .createTable("comments", tbl => { 
        tbl.increments()
        tbl.text("word")
        tbl.text("comment")
        tbl.text("author")
        tbl.integer("votes").defaultTo(0)
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
      })      
      .createTable("users", tbl => { 
        tbl.increments()
        tbl.text("firstname")
        tbl.text("lastname")
        tbl.text("email")
        tbl.text("password")
        tbl.text("role")
        tbl.timestamp("termsAcceptDate")
        tbl.timestamp('created_at').defaultTo(knex.fn.now())
      })    
};

exports.down = function(knex) {
};