const queries = require("../model/queries.js");
const express = require("express");

const router = express.Router();

// GET comments
router.get("/", (req, res) => {
  queries
    .readComments()
    .then((comments) => {
      res.status(200).json(comments);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Unable to perform the operation", error: error });
    });
});

// POST comment
router.post("/", async (req, res) => {
  try {
    let comment = await queries.createComment({
      word: `${req.body.word}`,
      comment: `${req.body.comment}`,
      author: `${req.body.author}`,
    });
    res.status(200).json(comment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to perform the operation", error: error });
  }
});

// DELETE comment
router.delete("/", async (req, res) => {
  const commentID = req.body.id;
  await queries
    .deleteComment(commentID)
    .then((count) => {
      if (count > 0) {
        // Knex returns number of affected rows deleted.
        res.status(200).json({ message: "Comment successfully deleted." });
      } else {
        res.status(404).json({ message: "Record not found." });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Unable to perform the operation.", error: error });
    });
});

// PATCH comment votes
router.patch("/", async (req, res) => {
  const commentID = req.body.commentID;
  try {
    await queries.updateCommentVotes(commentID);
    res.status(200).json({ message: "Operation succesfull" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Unable to perform operation", error: error });
  }
});

module.exports = router;
