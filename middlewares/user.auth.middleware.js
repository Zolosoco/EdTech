require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.USER_SECRET;


async function auth(req,res,next){
    const token = req.headers.authorization;
    //decoding the token:
    try{
        const decodedToken = jwt.verify(token, JWT_SECRET);
        if(decodedToken){
            req.userId = decodedToken.userId;
            next();
        }else{
            throw new Error(`Invalid session, try signing in again!`);
        }
    }catch(error){
        res.status(403).json({message : `forbidden access!`});
    };
};


module.exports = ({
    auth
});


