require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.USER_SECRET;
const bcrypt = require('bcrypt');
const {z} = require('zod');
const {userModel, courseModel} = require('../models/db');

async function signUp(req,res){
    const {email, password, firstName , lastName} = req.body;
    //input validtion with zod:
    const userSchema = z.object({
        email : z.string().email({message : `enter a valid email!`}),
        password : z.string().min(4, {"message" : `The password should be atleast longer than 4 chars`}),
        firstName : z.string().min(1, {message : `Enter a valid first-name`}),
        lastName : z.string().min(1, {message : `Enter valid last-name`})
    });

    try{
        const validUser = userSchema.parse({
            email,
            password,
            firstName,
            lastName
        });

        if(validUser){
            const encryptedPassword = await bcrypt.hash(password, 5);

            await userModel.create({
                email,
                password : encryptedPassword,
                firstName,
                lastName
            });

            res.json({message : `${firstName}, signed-up succesfully`});
        }else{
            throw new Error(`invalid input credentials, please try again!`);
        };
    }catch(error){
        res.json({message :`Something went wrong!`, error : error.message}).status(500);
    };
};



async function signIn(req,res){
    const {email, password} = req.body;
    //input validation :
    try{
        const response = await userModel.findOne({
            email 
        });

        if(response){
            const decryptedPassword = await bcrypt.compare(password, response.password)
            if(decryptedPassword){
                const token = jwt.sign({
                    userId : response._id.toString()
                }, JWT_SECRET);
                res.set('authorization', token);
                res.json({message : `Welcome back! ${response.firstName}`});
            }else{
                throw new Error(`Inccorect Password! please try again!`);
            };
        }else{
            throw new Error(`Invalid email, please provide a valid email!`);
        };
    }catch(error){
        res.status(403).json({message : `Unauthorized access! please enter valid credentials`});
    };
};


//post auth functions:

async function purchaseCourse(req,res){
    const userId = req.userId;
    const {courseId} = req.body;

    try{
         const isCourse = await courseModel.findOne({
            _id : courseId 
         });

         if(isCourse){
            const user = await userModel.findOneAndUpdate(
                {_id : userId},
                {$push : {purchasedCourses : courseId}}
            );

            if(!user){
                throw new Error(`user not found, try signing-up!`);
            }else{
                res.send(`succesfully boutght course : ${courseId}`);
            };
         }else{
            throw new Error(`Course not found!`);
         };


    }catch(error){
        res.status(500).json({message : `Internal server error!`, error : error.message});
    };

};


async function myCourses(req,res){
    const userId = req.userId ;
    //fetching data from db;
    try{
        const response = await userModel.findOne({
            _id : userId
        }); 

        if(response){
            res.json({
                courses : response.purchasedCourses
            });
        }else{
            throw new Error(`user not found try signing-up!`);
        };
    }catch(error){
        res.status(404).json({message : `course not found!`, error : error.message});
    };
};







module.exports = ({
    signUp,
    signIn,
    purchaseCourse,
    myCourses
});