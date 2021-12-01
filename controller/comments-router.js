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
            word: `${req.body.word}`,
            comment: `${req.body.comment}`,
            author: `${req.body.author}`
         })
         res.status(200).json(comment)
     } catch(error) {
        res.status(500).json({ message: "Unable to perform operation", error: error })
     }
})

// PATCH comment votes
router.patch("/", async (req, res) => {
    let comment = req.body.comment
    await queries.updateCommentVotes(comment)
    .then(comments => { 
        console.log(comments)
        res.status(200).json(comments)
    })
    .catch(error => { 
        res.status(500).json({ message: "Unable to perform operation", error: error })
    });
})

module.exports = router;