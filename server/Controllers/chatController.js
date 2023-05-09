const chatModel = require('../Models/chatModel');

//createChat
exports.createChat = async (req, res) => {
  const { firstId, secondId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (chat) res.status(200).json(chat);

    const newChat = new chatModel({
      members: { firstId, secondId }
    });

    const response = await newChat.save();

    res.status(200).json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }

  
};

//getUserChat
exports.findUserChat = async( req, res )=>{
  const userId = req.params.userId;
  console.log(userId);
try{
  const chats = await chatModel.find({
    members: { $in: [userId] },
  });
  console.log(chats);
  res.status(200).json(chats);

} catch (error) {
  console.log(error);
  res.status(500).json(error);
}
}



//findChat
exports.findChat = async( req, res )=>{
  const {firstId , secondId} = req.params;
try{
  const chat = await chatModel.findOne({
    members: { $all: [firstId, secondId ] },
  });

  res.status(200).json(chat);

} catch (error) {
  console.log(error);
  res.status(500).json(error);
}
}



