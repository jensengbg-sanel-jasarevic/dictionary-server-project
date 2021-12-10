const queries = require("../model/queries.js");
const express = require("express");
const jwt = require('jsonwebtoken');

const router = express.Router();

// GET all words
router.get("/words", async (req, res) => {
  await queries.readWords()
    .then((success) => {
      res.status(200).json(success);
    }).catch((error) => {
      res.status(500).json({ message: "Unable to retrieve the dictionary", error: error });
    });
});

// GET all words by specific letter
router.get("/words/:letter", async (req, res) => {
  await queries.readWordsByLetter(req.params.letter)
    .then((success) => {
      res.status(200).json(success);
    }).catch((error) => {
      res.status(500).json({ message: "Unable to perform the operation", error: error });
    });
});

// GET specific word
router.get("/:word", async (req, res) => {
  await queries.readWord(req.params.word)
    .then((success) => {
      if (success.length > 0) {
        res.status(200).json(success);
      } else {
        res.status(404).json({ message: "Record not found" });
      }
    }).catch((error) => {
      res.status(500).json({ message: "Unable to perform the operation", error: error });
    });
});

// POST specific word
router.post("/:word", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      // Collect form values
      const letter = req.params.word.charAt(0).toLowerCase();
      const word = req.params.word.toUpperCase();
      const information = req.body.information;
      const author = req.body.author;

      await queries.createWord({ letter: letter, word: word, information: information, author: author })
      res.status(201).json({ message: "Request has been fulfilled. New resource created." });
      } else {
        res.status(403).json({ message: "Client does not have access rights" }) 
      }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

// PUT specific word
router.put("/:word", async (req, res) => { 
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      await queries.updateWord(req.body.payload)
      res.status(201).json({ message: "Word information successfully updated" });
    } else {
      res.status(403).json({ message: "Client does not have access rights" }) 
    }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

module.exports = router;