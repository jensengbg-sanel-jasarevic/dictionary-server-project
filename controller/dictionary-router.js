const queries = require("../model/queries.js");
const express = require("express");
const passport = require("passport");
const passportConfig = require("../passport");

const router = express.Router();

// GET all words
router.get("/words", async (req, res) => {
  await queries
    .readWords()

    .then((success) => {
      res.status(200).json(success);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Unable to retrieve the dictionary", error: error });
    });
});

// GET all words by specific letter
router.get("/words/:letter", async (req, res) => {
  await queries
    .readWordsByLetter(req.params.letter)

    .then((success) => {
      res.status(200).json(success);
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Unable to perform the operation", error: error });
    });
});

// GET specific word
router.get("/:word", async (req, res) => {
  await queries
    .readWord(req.params.word)

    .then((success) => {
      if (success.length > 0) {
        res.status(200).json(success);
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "Unable to perform the operation", error: error });
    });
});

// POST specific word
router.post(
  "/:word",
  passport.authenticate("admin-local", { session: false }),
  async (req, res) => {
    //Check if the user from request is authorized admin user else send 401 error
    if (req.isAuthenticated()) {
      // Collect form values
      const letter = req.params.word.charAt(0).toLowerCase();
      const word = req.params.word.toUpperCase();
      const information = req.body.information;
      const author = req.body.author;

      await queries
        .createWord({
          letter: letter,
          word: word,
          information: information,
          author: author,
        })
        // Method is passed a argument as a value.
        // Method receives a value as a parameter.

        .then((success) => {
          res.status(200).json(success);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Unable to perform the operation", error: error });
        });
    } else {
      res.status(401).json({
        message: "Create failed as the user is not authorized",
        success: false,
      });
    }
  }
);

// PUT specific word
router.put(
  "/:word",
  passport.authenticate("admin-local", { session: false }),
  async (req, res) => {
    //Check if the user from request is authorized admin user else send 401 error
    if (req.isAuthenticated()) {
      const reformInformation = req.body;
      await queries
        .updateWord(reformInformation)
        .then((success) => {
          res.status(200).json(success);
        })
        .catch((error) => {
          res
            .status(500)
            .json({ message: "Unable to perform the operation", error: error });
        });
    } else {
      res.status(401).json({
        message: "Update failed as the user is not authorized",
        success: false,
      });
    }
  }
);

router.delete(
  "/",
  passport.authenticate("admin-local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const word = req.body;
      queries.deleteUser(word).then((deletedWord) => {
        if (Object.keys(deletedWord).length == 0) {
          res.status(200).json({
            success: true,
            message: "Successfully deleted",
          });
        } else {
          res.status(500).json({
            message: "Delete failed",
          });
        }
      });
    } else {
      console.log("Not authorized");
      res.status(401).json({
        message: "Not authorized",
      });
    }
  }
);

module.exports = router;
