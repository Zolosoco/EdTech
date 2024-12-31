const {Router} = require('express');
const adminRouter = Router();
const{signIn, signUp, createCourse,myCourses} = require('../controllers/admin.controller');
const{auth} = require('../middlewares/admin.auth.middleware');



adminRouter.post('/signup', signUp);
adminRouter.post('/signin', signIn);
adminRouter.put('/create/course',auth, createCourse);
adminRouter.get('/my/courses', auth, myCourses);



module.exports= ({
    adminRouter
});










