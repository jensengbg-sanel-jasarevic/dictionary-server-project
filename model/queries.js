const db = require("../dbConfiguration.js") 

module.exports = {
    createWord,
    readWords,
    readWordsByLetter,
    readWord,
    updateWord,
    createComment,
    readComments,
    updateCommentVotes
};

async function createWord(word) {
    return await db("glossary").insert(word, ['id'])
}

async function readWords() {
    return await db("glossary")
}

async function readWordsByLetter(letter) {
    return await db("glossary").where({ letter: letter })
}

async function readWord(word) {
    return await db("glossary").where({ word: word })
}

async function updateWord(word, updatedInfo) {
    return await db("glossary").where({ word: word })
    .update({ information: updatedInfo })
    .then(() => {  
        return readWord(word);
    });
}

async function createComment(comment) {
    return await db("comments").insert(comment, ['id'])
}

async function readComments() {
    return db("comments")
}

async function updateCommentVotes(comment) {
    return await db("comments").where({ comment: comment })
    .increment('votes', 1)
}