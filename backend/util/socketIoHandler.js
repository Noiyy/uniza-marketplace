const Message = require("../models/messageModel");

module.exports = function(io) {
    io.on('connection', (socket) => {
      console.log('A user connected:', socket.id);
  
      socket.on('direct-message', async (data) => {
        const message = new Message({ 
            sender: data.senderId, 
            recipient: data.recipientId, 
            content: data.content
        });
        await message.save();
        io.to(data.recipientId).emit('new-message', message);
      });
  
      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });
  };
  