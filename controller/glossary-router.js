const queries = require("../model/queries.js")
const express = require ("express");

const router = express.Router() 

// GET all words
router.get("/words", async (req, res) => {
   await queries.readWords()
    
    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => {
        res.status(500).json({ message: "Unable to retrieve glossary", error: error })
    });
})

// GET all words by specific letter
router.get("/words/:letter", async (req, res) => { 
    await queries.readWordsByLetter(req.params.letter)

    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation", error: error })
    });
});

// GET specific word
router.get("/:word", async (req, res) => { 
    await queries.readWord(req.params.word)

    .then(success => {
        if (success.length > 0) {
            res.status(200).json(success);
        } 
        else { 
            res.status(404).json({ message: "Record not found" });
        }
    })
    .catch(error => {
        res.status(500).json({ message: "Unable to perform operation", error: error });
    });
});

// POST specific word
router.post("/:word", async (req, res) => {
    // Collect form values.
    const letter = req.params.word.charAt(0).toLowerCase()
    const word = req.params.word
    const information = req.body.information

    await queries.createWord({ letter: letter, word: word, information: information }) 
    // Method is passed a argument as a value.
    // Method receives a value as a parameter.
    
    .then(success => { 
        res.status(201).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation", error: error })
    });
})

// PATCH specific word
router.patch("/:word", async (req, res) => { 
    const word = req.params.word
    const updatedInfo = req.body.information

    await queries.updateWord(word, updatedInfo)

    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation", error: error })
    });
});

module.exports = router;