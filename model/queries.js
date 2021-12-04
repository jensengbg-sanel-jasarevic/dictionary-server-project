const db = require("../dbConfiguration.js");

module.exports = {
  createWord,
  readWords,
  readWordsByLetter,
  readWord,
  updateWord,
  createComment,
  readComments,
  updateCommentVotes,
  createUser,
  readUser,
  readUserById,
  updateUserPassword,
  deleteUser,
};

async function createWord(word) {
  return await db("dictionary").insert(word, ["id"]);
}

async function readWords() {
  return await db("dictionary");
}

async function readWordsByLetter(letter) {
  return await db("dictionary").where({ letter: letter });
}

async function readWord(word) {
  return await db("dictionary").where({ word: word });
}

async function updateWord(word, updatedInfo) {
  return await db("dictionary")
    .where({ word: word })
    .update({ information: updatedInfo })
    .then(() => {
      return readWord(word);
    });
}

async function createComment(comment) {
  return await db("comments").insert(comment, ["id"]);
}

async function readComments() {
  return db("comments").orderBy("id");
}

async function updateCommentVotes(comment) {
  return await db("comments").where({ comment: comment }).increment("votes", 1);
}

async function createUser(user) {
  return await db("users").insert(user, ["id"]);
}

async function readUser(email) {
  return await db("users").where({ email: email });
}

async function readUserById(id) {
  return await db("users").where({ id: id });
}

async function updateUserPassword(email, updatedPassword) {
  return await db("users")
    .where({ email: email })
    .update({ password: updatedPassword })
    .then(() => {
      return readUser(email);
    });
}
async function deleteUser(email) {
  return await db("users")
    .where({ email: email })
    .del()
    .then(() => {
      return readUser(email);
    });
}
