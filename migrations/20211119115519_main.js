exports.up = function(knex) {
    return knex.schema
    .createTable("glossary", tbl => { 
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
};

exports.down = function(knex) {
};