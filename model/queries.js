const db = require("../dbConfiguration.js") 

module.exports = {
    readWords,
    readWord,
    createWord
};

function readWords() {
    return db("glossary")
}

async function readWord(word) {
    return await db("glossary").where({ word: word })
}

async function createWord(word) {
    return await db("glossary").insert(word, ['id'])
}