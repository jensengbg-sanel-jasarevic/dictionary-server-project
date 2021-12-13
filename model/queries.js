const db = require("./index-db.js");

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
  updateUserPassword,
  updateUserState,
  deleteUser
};

async function createWord(word) {
  return await db("dictionary").insert(word, ["id"]);
}

async function readWords() {
  return await db("dictionary");
}

async function readWordsByLetter(letter) {
  return await db("dictionary").where({ letter: letter }).orderBy("word");
}

async function readWord(word) {
  return await db("dictionary").where({ word: word });
}

async function updateWord(payload) {
  return await db("dictionary")
    .where({ word: payload.word })
    .update({
      definition: payload.updateDefinition,
      author: payload.author
    })
    .then(() => {
      return readWord(payload.word);
    });
}

async function deleteWord(word) {
  return await db("dictionary").where({ word: word }).del();
}

async function createComment(comment) {
  return await db("comments").insert(comment, ["id"]);
}

async function readComments() {
  return await db("comments").orderBy("id");
}

async function updateCommentVotes(commentID) {
  return await db("comments").where({ id: commentID }).increment("votes", 1);
}

async function deleteComment(commentID) {
  return await db("comments").where({ id: commentID }).del();
}

async function createUser(user) {
  return await db("users").insert(user, ["id"]);
}

async function readUser(email) {
  return await db("users").where({ email: email });
}

async function updateUserPassword(email, updatedPassword) {
  return await db("users").where({ email: email }).update({ password: updatedPassword })
}

async function updateUserState(email, state) {
  return await db("users")
  .where({ email: email })
  .update({ state: state })
  .then(() => {  
      return readUser(email);
  });
}

async function deleteUser(email) {
  return await db("users").where({ email: email }).del()
}