exports.up = function (knex) {
  return knex.schema.createTable("users", (tbl) => {
    tbl.increments();
    tbl.text("firstname");
    tbl.text("lastname");
    tbl.text("email");
    tbl.text("password");
    tbl.text("role");
    tbl.timestamp("termsAcceptDate");
    tbl.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {};
