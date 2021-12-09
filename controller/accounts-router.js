const queries = require("../model/queries.js")
const express = require ("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const router = express.Router() 

// POST new account
router.post("/", async (req, res) => {
    const HASHED_PASSWORD = await bcrypt.hashSync(req.body.password, salt)
    const newUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: HASHED_PASSWORD,
        role: req.body.role,
        termsAcceptDate: req.body.terms,
    }
    queries.readUser(req.body.email).then((user) => {
        if (user.length) {
            res.status(400).json("User with this email already exists")
        } else {
            queries.createUser(newUser)
            res.status(201).json({user: newUser.email});
        }
    })
})

// PATCH account password
router.patch("/", async (req, res) => { 
    const newPassword = await bcrypt.hashSync(req.body.newPassword, salt);
    try {
        const updatePassword = await queries.updateUserPassword(req.body.user.email, newPassword)
        if (updatePassword < 1) {
            res.status(404).json({ message: "User not found in database" });
        } else {
            res.status(200).json({ message: "User password successfully updated" });
        }
    } catch(error) {
        res.status(500).json({ message: "Unable to perform operation" });
    }
});

// DELETE account
router.delete("/", async (req, res) => { 
    try {
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, process.env.PRIVATE_KEY);

        await queries.deleteUser(req.body.email)
        .then(count => { 
            if (count > 0) { 
                res.status(200).json({ message: "Account successfully deleted." });
            } else { 
                res.status(404).json({ message: "Account not found." });
            }
        })
    } catch {
        res.status(401).json({ message: "Unauthorized. Client must authenticate for the request." })         
    }
});

module.exports = router;