const queries = require("../model/queries.js")
const express = require ("express");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router() 

// POST authentication & authorization
router.post("/", async (req, res) => {
    const credentials = {
     email: req.body.email,
     password: req.body.password
    }

    const verification = await queries.readUser(credentials.email)

    if(verification.length > 0) { 
        const authentication = await bcrypt.compareSync(credentials.password, verification[0].password)
         if (authentication){
            // Entrance granted. Credentials (email & password) provided is valid. Authentication successful & authorization permitted.
            const userActive = await queries.updateUserState(verification[0].email, "active") 
            const token = jwt.sign({ email: userActive[0].email }, process.env.PRIVATE_KEY, { 
                expiresIn: "30s" 
         });
         // Variable 'token' is a public key. The function makes private key to have a connection with the value that 'token' variable gets.
         // When receiving this token from client, its possible to ensure it was provided from us with validation via private key.
            res.status(200).send({ token: token, user: verification[0] }) 
         } else {
            res.status(401).send('Authentication unsuccessful. Lacks valid credentials');
        }
    } else {
        res.status(403).send('Authorization unsuccessful. Lacks valid credentials');
    }
})

// PATCH authorization
router.patch("/", async (req, res) => { 
    await queries.updateUserState(req.body.user, "inactive")
   .then(info => {
       res.status(200).json({ message: "Users state switched to inactive", user: info });
   })
   .catch(error => {
       res.status(500).json({ message: "Unable to perform request.", error: error });
   });
});

module.exports = router;