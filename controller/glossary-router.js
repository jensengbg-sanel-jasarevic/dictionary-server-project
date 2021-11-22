const queries = require("../model/queries.js")
const express = require ("express");

const router = express.Router() 

// GET words
router.get("/words", async (req, res) => {
    queries.readWords()
    
    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to retrieve glossary" })
    });
})

// GET word
router.get("/:word", async (req, res) => { 
    await queries.readWord(req.params.word)

    .then(success => {
        if (success.length > 0) {
            res.status(200).json({ message: "Operation successful"});
        } 
        else { 
            res.status(404).json({ message: "Record not found" });
        }
    })
    .catch(error => {
        res.status(500).json({ message: "Unable to perform operation" });
    });
});

// POST word
router.post("/:word", async (req, res) => {
    const word = req.body.word
    const definition = req.body.definition

    queries.createWord({ word: word, definition: definition }) 
    // Method is passed a argument as a value.
    // Method receives a value as a parameter.
    
    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation" })
    });
})

module.exports = router;