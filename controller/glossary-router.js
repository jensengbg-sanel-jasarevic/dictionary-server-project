const queries = require("../model/queries.js")
const express = require ("express");

const router = express.Router() 

// GET glossary words
router.get("/", async (req, res) => {
    queries.readGlossary()
    
    .then(success => { 
        res.status(200).json(success)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to retrieve glossary" })
    });
})

// POST glossary word
router.post("/", async (req, res) => {
    queries.createWord( {} ) 
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