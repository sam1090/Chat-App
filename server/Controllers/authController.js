const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../Models/userModel');
// const sendEmail = require('../utils/email');
const validator = require('validator');
const asyncHandler= require('async-handler-express');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),

    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    data: {
      token,
      user,
    },
  });
};

exports.signup = async (req, res, next) => {
  try{
  let user = await User.findOne({email: req.body.email});

  if(user)
  return res.status(400).json("User with the given email already exists");

  if(!req.body.name || !req.body.email || !req.body.password ){
    throw new Error(" All fields are required");
  }

  if(!validator.isEmail(req.body.email))
  return res.status(400).json("Email must be a valid email");


  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    
  });

  createSendToken(newUser, 201, res);
}catch(error){
  throw new Error(error);
}
};

//handle the crash error when any error occurs
exports.login = async (req, res) => {
  const { email, password } = req.body;

  //check if the entries are field

  if (!email || !password) {
    res.status(401).json({error:'You are not logged in ! Login to get access '});
  }
  // check if user exists and password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    res.status(401).json({error:'Incorrect email id or password '});
  }
  // if everything is ok , send token to client
  createSendToken(user, 200, res);
}
;
 
// exports.protect = catchAsync(async (req, res, next) => {
//   //getting token and checking if its there
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith('Bearer')
//   ) {
//     token = req.headers.authorization.split(' ')[1];
//   } else if (req.cookies.jwt) {
//     token = req.cookies.jwt;
//   }

//   if (!token) {
//     return next(
//       new AppError('You are not logged in ! Login to get access', 401)
//     );
//   }

//   //2) verifying token
//   const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
//   // console.log(decoded);

//   //3) check if user still exists
//   const currentUser = await User.findById(decoded.id);

//   if (!currentUser) {
//     return next(
//       new AppError(`the user belonging to this token no longer not exist`, 401)
//     );
//   }

//   //4) check if the password is changed
//   if (currentUser.changedPasswordAfter(decoded.iat)) {
//     return next(
//       new AppError(
//         'The password is changed ! log in again with updated password',
//         401
//       )
//     );
//   }
//   // GRant access to protected route
//   req.user = currentUser;
//   console.log(req.user);
//   next();
// });

// exports.restrictTo =
//   (...roles) =>
//   (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return next(
//         new AppError('you do not have permission to perform this action  ', 403)
//       );
//     }
//     next();
//   };

// //fix this
// exports.forgotPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on POSTed email
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError('There is no user with email address.', 404));
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   // 3) Send it to user's email
//   const resetURL = `${req.protocol}://${req.get(
//     'host'
//   )}/api/v1/users/resetPassword/${resetToken}`;

//   const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: 'Your password reset token (valid for 10 min)',
//       message,
//     });

//     res.status(200).json({
//       status: 'success',
//       message: 'Token sent to email!',
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     return next(
//       new AppError('There was an error sending the email. Try again later!'),
//       500
//     );
//   }
// });

// exports.resetPassword = async (req, res, next) => {
//   //1- get user based on token
//   const hashedtoken = crypto
//     .createHash('sha256')
//     .update(req.params.token)
//     .digest('hex');

//   const user = await User.findOne({
//     passwordResetToken: hashedtoken,
//     passwordResetExpires: { $gt: Date.now() },
//   });
//   console.log(user);

//   //2) If token is not expired and there is user, set the new password
//   if (!user) {
//     return next(new AppError('the token is invalid or has expired', 400));
//   }
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();
//   //3) update passwordChangeAt property of user

//   // 4) LOg the user in , send JWT
//   createSendToken(user, 201, res);
// };

// exports.updatePassword = async (req, res, next) => {
//   //1) get user from collection
//   const user = await User.findById(req.user._id).select('+password');

//   //2) check if POSTed password is correct
//   if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
//     return next(new AppError(' the password entered is not correct ', 401));
//   }
//   //3) if so, then update password
//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   await user.save();

//   //4) log user in, send JWT
//    reateSendToken(user, 201, res);
// };
