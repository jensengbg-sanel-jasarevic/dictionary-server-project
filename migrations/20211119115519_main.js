exports.up = function(knex) {
    return knex.schema
    .createTable("glossary", tbl => { 
        tbl.increments() // This is for identifying a resource. The URI (Uniform Resource Identifier).
        tbl.text("letter")
        tbl.text("word")
        tbl.text("information")
        tbl.text("author")
      })
      .createTable("comments", tbl => { 
        tbl.increments()
        tbl.text("author")
        tbl.text("comment")
        tbl.integer("like")
      })      
};

exports.down = function(knex) {
};