const Message = require("../models/messageModel");
const User = require("../models/userModel");

const { protect } = require("../middleware/authMiddleware");

const onlineUsers = new Set();

module.exports = function(io, app) {
  io.on('connection', (socket) => {
    socket.on('direct-message', async (data) => {
      console.log("hmmm new?", data);

      const message = new Message({ 
          sender: data.senderId, 
          recipient: data.recipientId, 
          content: data.content
      });

      await message.save();
      io.to(data.senderId).emit('new-message', message);
      io.to(data.recipientId).emit('new-message', message);
    });

    socket.on('userConnected', (userId) => {
      if (onlineUsers.has(userId)) return;

      onlineUsers.add(userId);
      console.log("online user", userId);
      socket.join(userId);
      socket.data.userId = userId;

      // Broadcast to all clients that this user is online
      io.emit("userOnline", userId);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (socket.data?.userId) {
        const userId = socket.data.userId;
        onlineUsers.delete(userId);

        io.emit('userOffline', userId);
      }
    });
  });

  app.get("/api/messages/getOnlineUsers", protect, async (req, res) => {
    const userCheck = await User.findById(req.user.id);
    if (!userCheck)
      return res.status(401).json({error: 'Auth user not found'});

    res.json([...onlineUsers]);
  });
};
  