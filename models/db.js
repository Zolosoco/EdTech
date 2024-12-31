const mongoose = require('mongoose');
const Schema = mongoose.Schema ;
const ObjectId = mongoose.Types.ObjectId;



const User = new Schema ({
    email : {type : String, unique: true},
    name : String,
    password : String,
    firstName : String,
    lastName : String,
    purchasedCourses : [{
        type : String,
        ref : 'Course'
    }]

});


const Admin = new Schema ({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
    myCourses : [{
        type : String,
        ref : 'Course'
    }]
});



const Course = new Schema({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    courseCreatedBy : [{
        type: ObjectId,
        ref : 'Admin'
    }]
});



//models of the schema to implement functional methods;

const userModel = mongoose.model('user', User);
const adminModel = mongoose.model('admin', Admin);
const courseModel = mongoose.model('course',Course);

//exporting the models:

module.exports = ({
    userModel,
    adminModel,
    courseModel
});

