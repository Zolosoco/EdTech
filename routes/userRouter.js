const {Router}  = require('express');
const userRouter = Router();
const {signIn,signUp,purchaseCourse,myCourses} = require('../controllers/user.controller');
const {auth} = require('../middlewares/user.auth.middleware');

userRouter.post('/signup', signUp);
userRouter.post('/signin', signIn);
userRouter.put('/purchase/courses',auth, purchaseCourse);
userRouter.get('/my/courses', auth , myCourses);


module.exports = ({
    userRouter
});




