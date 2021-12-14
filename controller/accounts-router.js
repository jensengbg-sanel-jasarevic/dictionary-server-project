const queries = require("../model/queries.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
const router = express.Router();

// POST account
router.post("/", async (req, res) => {
  const HASHED_PASSWORD = await bcrypt.hashSync(req.body.password, salt);
  //user security question should also be encrypted before saving in db
  let security = req.body.security;
  let HASHED_SECRET =
    security != null && security != "undefined" && security != ""
      ? await bcrypt.hashSync(security, salt)
      : "";

  const newUser = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: HASHED_PASSWORD,
    role: req.body.role,
    termsAcceptDate: req.body.terms,
    secret: HASHED_SECRET,
  };

  queries.readUser(req.body.email).then((user) => {
    if (user.length) {
      res
        .status(422)
        .json("Request will not be processed. Record already exists.");
    } else {
      queries.createUser(newUser);
      res.status(201).json({ user: newUser.email });
    }
  });
});

// PATCH account password
router.patch("/", async (req, res) => {
  try {
    let verifiedUser = req.body.verifiedUser;
    if (!verifiedUser) {
      const token = req.headers["authorization"].split(" ")[1];
      jwt.verify(token, process.env.PRIVATE_KEY);
    }
    const newPassword = await bcrypt.hashSync(req.body.newPassword, salt);

    const updatePassword = await queries.updateUserPassword(
      req.body.user.email,
      newPassword
    );
    if (updatePassword < 1) {
      res
        .status(404)
        .json({ message: "Requested resource could not be found." });
    } else {
      res.status(200).json({ message: "The request has succeeded." });
    }
  } catch {
    res.status(401).json({
      message:
        "Request denied as it lacks valid authentication credentials for target resource.",
    });
  }
});

// DELETE account
router.delete("/", async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY);

    await queries.deleteUser(req.body.email).then((count) => {
      if (count > 0) {
        res.status(200).json({ message: "The request has succeeded." });
      } else {
        res
          .status(404)
          .json({ message: "Requested resource could not be found." });
      }
    });
  } catch {
    res.status(401).json({
      message:
        "Unauthorized. Request denied as it lacks valid authentication credentials for target resource.",
    });
  }
});

// PATCH account password
router.patch("/updateSecurity", async (req, res) => {
  try {
    //user Security question should also be encrypted before saving in db
    let email = req.body.email;
    let security = req.body.security;

    if (security != null && security != "undefined" && security != "") {
      let HASHED_SECRET = await bcrypt.hashSync(security, salt);

      const updatedSecret = await queries.updateUserSecret(
        email,
        HASHED_SECRET
      );
      if (updatedSecret < 1) {
        res
          .status(404)
          .json({ message: "Requested resource could not be found." });
      } else {
        res.status(200).json({ message: "The request has succeeded." });
      }
    } else {
      res.status(404).json({ message: "Security values cannot be empty" });
    }
  } catch (err) {
    res
      .status(404)
      .json({ message: "Requested resource could not be completed." });
  }
});

module.exports = router;
