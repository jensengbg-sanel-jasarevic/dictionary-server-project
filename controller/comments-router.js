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
      res.status(500).json({ message: "Unable to perform the operation", error: error });
    });
});

// POST comment
router.post("/", async (req, res) => {
  try {
    const comment = await queries.createComment({
      word: `${req.body.word}`,
      comment: `${req.body.comment}`,
      author: `${req.body.author}`,
    });
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: "Unable to perform the operation", error: error });
  }
});

// DELETE comment
router.delete("/", async (req, res) => {
  const token = req.headers['authorization'].split(' ')[1];

  try {
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      const commentID = req.body.id;
      await queries.deleteComment(commentID)
      res.status(200).json({ message: "Record successfully deleted" });
    } else {
      res.status(403).json({ message: "Client does not have access rights" }) 
    }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Client must authenticate to get the requested response." }) 
  }
});

// PATCH comment votes
router.patch("/", async (req, res) => {
  const commentID = req.body.commentID;
  try {
    await queries.updateCommentVotes(commentID);
    res.status(200).json({ message: "Operation succesfull" });
  } catch (error) {
    res.status(500).json({ message: "Unable to perform operation", error: error });
  }
});

module.exports = router;