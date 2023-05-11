const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
   chatId : String, 
   senderId: String, 
   text: String,
},{
  timestamps: true,
});

//Export the model
module.exports = mongoose.model('Message', messageSchema);