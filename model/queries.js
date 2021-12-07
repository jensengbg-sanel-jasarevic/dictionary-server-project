const db = require("../dbConfiguration.js");

module.exports = {
  createWord,
  readWords,
  readWordsByLetter,
  readWord,
  updateWord,
  deleteWord,
  createComment,
  readComments,
  updateCommentVotes,
  deleteComment,
  createUser,
  readUser,
  readUserById,
  readAdminUser,
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

async function updateWord(reformInformation) {
  return await db("dictionary")
    .where({ word: reformInformation.word })
    .update({
      information: reformInformation.comment,
      author: reformInformation.author,
    })
    .then(() => {
      return readWord(reformInformation.word);
    });
}

function deleteWord(word) {
  return db("dictionary").where({ word: word }).del();
}

async function createComment(comment) {
  return await db("comments").insert(comment, ["id"]);
}

async function readComments() {
  return db("comments").orderBy("id");
}

async function updateCommentVotes(commentID) {
  return await db("comments").where({ id: commentID }).increment("votes", 1);
}

function deleteComment(commentID) {
  return db("comments").where({ id: commentID }).del();
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

async function readAdminUser(email) {
  return await db("users").where({ email: email }).andWhere({ role: "admin" });
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
