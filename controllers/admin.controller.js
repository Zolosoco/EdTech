require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.ADMIN_SECRET;
const bcrypt = require('bcrypt');
const {z} = require('zod');
const {adminModel , courseModel } = require('../models/db');



async function signUp(req,res){
    const {email , password, firstName, lastName} = req.body;
    //input validation with zod:
    const adminSchema = z.object({
        email : z.string().email({message : `Enter a valid email ID`}),
        password : z.string().min(1, {message : `Enter valid password!`}),
        firstName : z.string().min(1,{message : `Enter valid first-name!`}),
        lastName : z.string().min(1,{message : `Enter valid last Name`})
    });

    // verifying schema:
    try{
        const validAdmin = adminSchema.parse({
            email,
            password,
            firstName,
            lastName
        });

        if(validAdmin){
            const encryptedPassword = await bcrypt.hash(password, 5);
            if(encryptedPassword){
                //creating data in the db:
                await adminModel.create({
                    email,
                    password : encryptedPassword,
                    firstName,
                    lastName
                });

                res.json({message : `${firstName}, signed-up succesfully!`});

            }else{
                throw Error
            }
        }else{
            throw new Error (`Please enter valid credentials, and try-again!`);
        };
    }catch(error){
        res.status(500).json({message:`Internal server error!`, error : error.message});
    };
};





async function signIn (req,res){
    const {email, password} = req.body;
    //input validation with db verification:
    try{
        const response = await adminModel.findOne({
            email : email
        });

        if(response){
            const decryptedPassword = await bcrypt.compare(password, response.password);
            if(decryptedPassword){
                const token = jwt.sign({
                    adminId : response._id.toString()
                }, JWT_SECRET);
                res.set('authorization', token);
                res.json({message : `${response.firstName}, welcome back!`});
            }else{
                throw new Error(`Invalid password! please try signing in again!`);
            }

            
        }else{
            throw new Error(`Invalid email, please try signing-up!`);
        };
    }catch(error){
        res.status(403).json({message : `data not found!`, error: error.message});
    };
};



// post auth middlewares, depending upon req object's data!


async function createCourse(req,res){
    const adminId = req.adminId;
    const {title, description, price, imageUrl} = req.body;
    //input validation with zod:
    const courseSchema = z.object({
        title : z.string(),
        description : z.string(),
        price : z.number(),
        imageUrl :  z.string()
    });

    if(adminId){
        try{
            const validCourse = courseSchema.parse({
                title,
                description,
                price,
                imageUrl
            });
            
            if(validCourse){
                const newCourse = await courseModel.create({
                    title,
                    description,
                    price,
                    imageUrl,
                    courseCreatedBy : adminId
                });

                if(newCourse){
                    const adminReference = await adminModel.findOneAndUpdate(
                        { _id : adminId},
                        {$push : {myCourses : newCourse._id}}
                    );

                    res.status(200).json({message : `Course created succesfully!`})
                }else{
                    throw new Error(`something went wrong, admin_not_found! try signing in again!`);
                };
            }else{
                throw new Error(`enter valid course details!`);
            };
        }catch(error){
            res.status(500).json({message : `Internal server error!`, error : error.message});
        };
    }else{
        res.status(403).json({message : `Unauthorized access! please signin as an admin and try again!`});
    };
};




async function myCourses(req,res){
    const adminId = req.adminId;
    //fetching data from db:
    try{
        const response = await adminModel.findOne({
            _id : adminId
        });

        if(response){
            res.send(response.myCourses);
        }else{
            throw new Error(`ADMIN DATA NOT FOUND`)
        }
    }catch(error){
        res.status(500).json({message : `internal server error`, error: error.message});
    };
};

module.exports = ({
    signUp,
    signIn,
    createCourse,
    myCourses
});

