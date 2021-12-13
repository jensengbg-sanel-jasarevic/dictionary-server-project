const queries = require("../model/queries.js");
const express = require("express");
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET comments
router.get("/", (req, res) => {
  queries.readComments()
    .then((comments) => {
      res.status(200).json(comments);
    }).catch((error) => {
      res.status(500).json({ message: "Server encountered an unexpected condition which prevented it from fulfilling the request.", error: error });
    });
});

// POST comment
router.post("/", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);
    
    if(req.body.word && req.body.comment && req.body.author) {
      const comment = await queries.createComment({ word: `${req.body.word}`, comment: `${req.body.comment}`, author: `${req.body.author}`});
      res.status(200).json(comment);  
    } else {
      res.status(400).json({ message: "Server cannot process request due to a client error." });
    }    
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

// DELETE comment
router.delete("/", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      const commentID = req.body.id;

      await queries.deleteComment(commentID)
      
      res.status(200).json({ message: "The request has succeeded." });
    } else {
      res.status(403).json({ message: "Client is not permitted the access." }) 
    }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

// PATCH comment votes
router.patch("/", async (req, res) => {
  const commentID = req.body.commentID;
  try {
    await queries.updateCommentVotes(commentID);
    res.status(200).json({ message: "The request has succeeded" });
  } catch (error) {
    res.status(500).json({ message: "Server encountered an unexpected condition which prevented it from fulfilling the request.", error: error });
  }
});

module.exports = router;