require('dotenv').config();
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.ADMIN_SECRET

async function auth(req,res,next){
    const token = req.headers.authorization;
    //decoding auth token to obtain admin's ID
    try{
        const decodedToken = jwt.verify(token,JWT_SECRET);
        if(decodedToken){
            req.adminId = decodedToken.adminId;
            next();
        }else{
            throw new Error(`Unauthorized access! try signing again!`);
        };
    }catch(error){
        res.status(403).json({message : `Invalid session, try signing-in again!`, error : error.message});
    };
};


module.exports = ({
    auth
})