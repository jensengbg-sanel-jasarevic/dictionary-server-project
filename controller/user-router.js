const queries = require("../model/queries.js");
const express = require("express");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const passport = require("passport");
const passportConfig = require("../passport");
const sessionSection = process.env.SESSION_SECRET;
const jwt = require("jsonwebtoken");
const router = express.Router();

const signToken = (email) => {
  return jwt.sign({ sub: email }, sessionSection);
};

//method called when the user is first registered. Does not need any authentication as it is register
router.post("/register", (req, res) => {
  let userReq = req.body;
  let passwordReq = userReq.password;
  queries.readUser(userReq.email).then((user) => {
    if (Object.keys(user).length != 0) {
      res.status(500).json({
        message: "User with this email already exists",
      });
    } else {
      const newUser = {
        firstname: `${userReq.firstname}`,
        lastname: `${userReq.lastname}`,
        email: `${userReq.email}`,
        role: `${userReq.role}`,
        termsAcceptDate: `${userReq.terms}`,
        password: bcrypt.hashSync(passwordReq),
      };
      queries.createUser(newUser).then((createdUser) => {
        res.status(200).json({
          user: createdUser,
          message: "Succesfully Registered",
        });
      });
    }
  });
});

//method called when the user logs in. Need to be authenticated if the user and password match
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user;
      const token = signToken(user.email);
      res.cookie("access_token", token, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      });
      res.status(200).send({
        isAuthenticated: true,
        user: user,
        message: "Succesfully logged in",
        token: token,
      });
    } else {
      console.log("Not authorized");
      res.status(401).json({
        message: "Not authorized",
      });
    }
  }
);

//method called when the user logs out. Need to be authenticated if actual user is
//logging out using passport of rule type 'user-local'
router.post(
  "/logout",
  passport.authenticate("user-local", { session: false }),
  (req, res) => {
    //  console.log("here");
    if (req.isAuthenticated()) {
      res.clearCookie("access_token");
      res.status(200).json({ user: { email: "", role: "" }, success: true });
    } else {
      res.status(500).json({
        message: "Logout failed as the user is not authenticated",
        success: false,
      });
    }
  }
);

router.post(
  "/updateUserPassword",
  passport.authenticate("user-local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.body.user;
      const newPassword = bcrypt.hashSync(req.body.newPassword);
      queries
        .updateUserPassword(JSON.parse(user).email, newPassword)
        .then((updatedUser) => {
          if (Object.keys(user).length == 0) {
            res.status(500).json({
              message: "Update failed",
            });
          } else {
            res.status(200).json({
              user: updatedUser,
              message: "Succesfully updated",
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

router.post(
  "/deleteUser",
  passport.authenticate("user-local", { session: false }),
  (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.body;
      queries.deleteUser(user.email).then((deletedUser) => {
        if (Object.keys(deletedUser).length == 0) {
          res.clearCookie("access_token");
          res.status(200).json({
            user: { email: "", role: "" },
            success: true,
            message: "Successfully deleted",
          });
        } else {
          res.status(500).json({
            user: deletedUser,
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
