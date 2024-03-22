// Name: Soh Jian Min
// Class: DIT/FT/1B/04
// Admission Number: 2238856

const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyFn = {
    verifyToken : function(req, res, next){
        console.log(req.headers);
        // retrieve the authorization header's content
        const authHeader = req.headers['authorization'];
        console.log(authHeader);
        // if authHeader does not exist or
        // auuthHeader does not have the word, Bearer
        if(!authHeader||!authHeader.includes('Bearer')){
            res.status(403);
            return res.send('Please login to perform this action!');
        }else{
            // Retrieve the token
            const token = authHeader.replace('Bearer ', '');
            console.log(token);
            // verify the token and it extract the payload
            jwt.verify(token, config.key, function(err, payload){
                if(err){
                    res.status(403);
                    return res.send('Please login to perform this action!');
                }
                // token is good
                else{
                    // store payload in the req.body
                    req.body.payload = payload;
                    next();
                }
            })
        }
    },
    verifyAdmin: function(req, res, next){
        const role= req.body.payload.role;
        console.log(role);
        if(role=='admin'){
            next();
        }else{
            res.status(403);
            return res.send('You are not an admin!');
        }
    },
}

module.exports=verifyFn;