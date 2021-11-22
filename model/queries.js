const db = require("../dbConfiguration.js") 

module.exports = {
    readGlossary,
    createWord
};

function readGlossary() {
    return db("glossary")
}
async function createWord(word) {
    return await db("glossary").insert(word, ['id'])
}