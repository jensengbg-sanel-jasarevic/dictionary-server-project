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
      res.status(500).json({ message: "Server encountered an unexpected condition which prevented it from fulfilling the request.", error: error });
    });
});

// GET all words by specific letter
router.get("/words/:letter", async (req, res) => {
  await queries.readWordsByLetter(req.params.letter)
    .then((success) => {
      res.status(200).json(success);
    }).catch((error) => {
      res.status(500).json({ message: "Server encountered an unexpected condition which prevented it from fulfilling the request.", error: error });
    });
});

// GET word
router.get("/:word", async (req, res) => {
  await queries.readWord(req.params.word)
    .then((success) => {
      if (success.length > 0) {
        res.status(200).json(success);
      } else {
        res.status(404).json({ message: "Record not found." });
      }
    }).catch((error) => {
      res.status(500).json({ message: "Server encountered an unexpected condition which prevented it from fulfilling the request.", error: error });
    });
});

// POST word
router.post("/:word", async (req, res) => {
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      // Collect form values
      const letter = req.params.word.charAt(0).toLowerCase();
      const word = req.params.word.toUpperCase();
      const definition = req.body.definition;
      const author = req.body.author;

      await queries.createWord({ letter: letter, word: word, definition: definition, author: author })
      res.status(201).json({ message: "Request has been fulfilled. New resource created." });
      } else {
        res.status(403).json({ message: "Client is not permitted the access." }) 
      }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

// PUT word
router.put("/:word", async (req, res) => { 
  try {
    const token = req.headers['authorization'].split(' ')[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    if (req.body.role === "admin") {
      await queries.updateWord(req.body.updateDefinition)
      res.status(200).json({ message: "Request has been fulfilled." });
    } else {
      res.status(403).json({ message: "Client is not permitted the access." }) 
    }   
  } catch {
    res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
  }
});

module.exports = router;