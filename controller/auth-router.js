const queries = require("../model/queries.js");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// POST authentication & authorization
router.post("/", async (req, res) => {
  const credentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const verification = await queries.readUser(credentials.email);

  if (verification.length > 0) {
    const authentication = await bcrypt.compareSync(
      credentials.password,
      verification[0].password
    );
    if (authentication) {
      // Entrance granted. Credentials (email & password) provided is valid. Authentication successful & authorization permitted.
      const token = jwt.sign(
        { email: verification[0].email },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "1h",
          // Reasonable expiration time on the token. Short-lived token requires user to authenticate once again after certain time for security reasons.
          // This minimizes the potential damage if token is stolen, attackers can only use token until it expires (for that reason it should not be valid for a long period of time).
        }
      );
      // Token that is generated here can be used to claim login.
      // This is a public key. This public key is mathematically related with our private key.
      // Client use this public key to access privileges to resources from server.
      // We can ensure it was provided from us via validation with our private key.
      res.status(200).send({ token: token, user: verification[0] });
    } else {
      res
        .status(400)
        .send(
          "Server cannot process request due to a client error. Authentication unsuccessful, lacks valid credentials."
        );
    }
  } else {
    res
      .status(401)
      .send(
        "Unauthorized. Request denied as it lacks valid authentication credentials for target resource."
      );
  }
});

// PATCH authorization
router.patch("/", async (req, res) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    jwt.verify(token, process.env.PRIVATE_KEY);
    res.status(200).json({ message: "The request has succeeded." });
  } catch {
    res
      .status(401)
      .json({
        message:
          "Unauthorized. Request denied as it lacks valid authentication credentials for target resource.",
      });
  }
});

router.post("/authenticateSecurity", async (req, res) => {
  try {
    let email = req.body.email;
    let security = req.body.security;

    const verification = await queries.readUser(email);

    if (
      verification.length > 0 &&
      verification[0].secret != null &&
      verification[0].secret != "undefined"
    ) {
      const authentication = await bcrypt.compareSync(
        security,
        verification[0].secret
      );
      if (authentication) {
        // The user Security is verified
        res.status(200).send({
          user: verification[0],
          message: "User is verified successfully",
        });
      } else {
        res.status(400).json({
          message:
            "Authentication unsuccessful, Security question/answer mismatch.",
        });
      }
    } else {
      res.status(401).json({
        message:
          "Unauthorized. Request denied as it lacks valid authentication credentials for target resource.",
      });
    }
  } catch (err) {
    res
      .status(404)
      .json({ message: "Requested resource could not be completed." });
  }
});

module.exports = router;
