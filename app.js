require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 9001;
const mongoose = require('mongoose');
const URL = process.env.MONGO_URL;
const {userRouter} = require('./routes/userRouter');

app.use(express.json());
main();


app.use('/user',userRouter);
// app.use('/admin', adminRouter);
// app.use('/course',courseRouter);


async function main(){
    try{
        await mongoose.connect(URL);
        app.listen(port, () => {
            console.log(`The server started listening in on port : ${port}`);
        });
    }catch(error){
        console.error(error);
    }
};

