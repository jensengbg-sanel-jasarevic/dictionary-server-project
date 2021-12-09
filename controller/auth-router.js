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
                expiresIn: "10h" 
         });
         // Token that is generated here can be used to claim login
         // This is a public key. This public key is mathematically related with our private key.
         // Client use this public key to access rights/privileges to resources on server.
         // We can ensure it was provided from us via validation with our private key.
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
    try {
        const token = req.headers['authorization'].split(' ')[1];
        jwt.verify(token, process.env.PRIVATE_KEY);

        await queries.updateUserState(req.body.user, "inactive")
        res.status(200).json({ message: "Users state switched to inactive" });
    } catch {
        res.status(401).json({ message: "Unauthorized. Client must authenticate for the request." }) 
    }    
});

module.exports = router;