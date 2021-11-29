const queries = require("../model/queries.js")
const express = require ("express");

const router = express.Router() 

// GET comments
router.get("/", (req, res) => {
    queries.readComments()
    
    .then(comments => { 
        res.status(200).json(comments)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation", error: error })
    });
});

// POST comment
router.post("/", async (req, res) => {
     try {
        let comment = await queries.createComment({ 
           // wordUID: `${req.body.wordUID}`,
            author: `${req.body.author}`,
            comment: `${req.body.comment}`
         })
         res.status(200).json(comment)
     } catch(error) {
        res.status(500).json({ message: "Unable to perform operation", error: error })
     }
})

module.exports = router;