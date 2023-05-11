const messageModel = require('../Models/messageModel');

//createMessage

exports.createMessage = async( req, res)=>{
  const { chatId, senderId , text } = req.body ;

  const messge = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await messageModel.save();
    res.status(200).json(response);
    
  } catch (error) {
    res.status(500).json(error);
  }
}