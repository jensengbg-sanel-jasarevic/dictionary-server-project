const db = require("../dbConfiguration.js") 

module.exports = {
    createWord,
    readWords,
    readWordsByLetter,
    readWord,
    updateWord,
    createComment,
    readComments,
    updateCommentVotes,
    deleteComment
};

async function createWord(word) {
    return await db("dictionary").insert(word, ['id'])
}

async function readWords() {
    return await db("dictionary")
}

async function readWordsByLetter(letter) {
    return await db("dictionary").where({ letter: letter })
}

async function readWord(word) {
    return await db("dictionary").where({ word: word })
}

async function updateWord(reformInformation) {
    return await db("dictionary").where({ word: reformInformation.word })
    .update({ information: reformInformation.comment, author: reformInformation.author })
    .then(() => {  
        return readWord(reformInformation.word);
    });
}

async function createComment(comment) {
    return await db("comments").insert(comment, ['id'])
}

async function readComments() {
    return db("comments").orderBy('id')
}

async function updateCommentVotes(commentID) {
    return await db("comments").where({ id: commentID })
    .increment('votes', 1)
}

function deleteComment(commentID) {
    return db("comments").where({ id: commentID }).del()
}