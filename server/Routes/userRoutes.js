const express = require('express');
const userController = require('../Controllers/userController');
const authController = require('../Controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/forgotPassword', authController.forgotPassword);
// router.patch(
//   '/updateMyPassword',
//   authController.protect,
//   authController.updatePassword
// );
// router.patch('/resetPassword/:token', authController.resetPassword);

// router.use(authController.protect);

// router.route('/').get(userController.getMe, userController.getUser);
// router.patch('/updateMe', userController.updateMe);
// router.delete('/deleteMe', userController.deleteMe);

// router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);
//   .post(userController.createUser);

router.route('/getUser/:id').get(userController.getUser);
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);

module.exports = router;
