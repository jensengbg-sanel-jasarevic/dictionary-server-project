const queries = require("../model/queries.js")
const express = require ("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const router = express.Router() 

// POST account
router.post("/", async (req, res) => {
    queries.readUser(req.body.email).then((user) => {
        if (user.length) {
            res.status(422).json("Request will not be processed. Record already exists.")
        } else {
            const HASHED_PASSWORD = bcrypt.hashSync(req.body.password, salt)
            const HASHED_SECRET_KEY = bcrypt.hashSync(req.body.secretKey, salt) // For password resets

            const newUser = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: HASHED_PASSWORD,
                secretKey: HASHED_SECRET_KEY,
                role: req.body.role,
                termsAcceptDate: req.body.terms,
            }

            queries.createUser(newUser)
            
            res.status(201).json({user: newUser.email});
        }
    })
})

// PATCH account password
router.patch("/", async (req, res) => {
    const verification = await queries.readUser(req.body.email)
    if(verification.length > 0) { 
        const authentication = await bcrypt.compareSync(req.body.secretKey, verification[0].secretKey)
         if (authentication){
            const HASHED_NEW_PASSWORD = bcrypt.hashSync(req.body.newPassword, salt);
            queries.updateUserPassword(req.body.email, HASHED_NEW_PASSWORD)
            res.status(200).json({ message: "The request has succeeded." });        
         } else {
            res.status(400).send('Server cannot process request due to a client error. Authentication unsuccessful, lacks valid credentials.');
        }
    } else {
        res.status(401).send('Unauthorized. Request denied as it lacks valid authentication credentials for target resource.');
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
                res.status(200).json({ message: "The request has succeeded." });
            } else { 
                res.status(404).json({ message: "Requested resource could not be found." });
            }
        })
    } catch {
        res.status(401).json({ message: "Unauthorized. Request denied as it lacks valid authentication credentials for target resource." })         
    }
});

module.exports = router;