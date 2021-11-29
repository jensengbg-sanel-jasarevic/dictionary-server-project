const db = require("../dbConfiguration.js") 

module.exports = {
    readWords,
    readWordsByLetter,
    readWord,
    createWord,
    updateWord,
    readComments,
    createComment
};

async function readWords() {
    return await db("glossary")
}

async function readWordsByLetter(letter) {
    return await db("glossary").where({ letter: letter })
}

async function readWord(word) {
    return await db("glossary").where({ word: word })
}

async function createWord(word) {
    return await db("glossary").insert(word, ['id'])
}

async function updateWord(word, updatedInfo) {
    return await db("glossary").where({ word: word })
    .update({ information: updatedInfo })
    .then(() => {  
        return readWord(word);
    });
}

async function readComments() {
    return db("comments")
}

async function createComment(comment) {
    return await db("comments").insert(comment, ['id'])
}