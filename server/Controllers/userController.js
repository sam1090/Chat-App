const  {asyncHandle}  = require('async-handler-express');
const User = require('../Models/userModel');
const factory = require('./handlerFactory');

exports.getUser = (async(req,res)=>{
const {id} = req.params; 
try {
  const user = await User.findById(id);

  res.status(200).json(user);
} catch (error) {
  throw new Error(error);
}

})


exports.getAllUsers = (async(req,res)=>{
  try {
    const user = await User.find();
  
    res.status(200).json(user);
  } catch (error) {
    throw new Error(error);
  }
  
  })
