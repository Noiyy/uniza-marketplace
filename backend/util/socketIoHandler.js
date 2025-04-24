const express = require('express');
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const onlineUsers = new Set();

module.exports = function(io, app) {
  io.on('connection', async (socket) => {

    const sockets = await io.of("/").allSockets(); // Returns a Set of socket IDs
    console.log("hm",sockets); // Set { 'socketid1', 'socketid2', ... }

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
      console.log("User connected:", userId, "sId:", socket.id);
      console.log(onlineUsers);

      socket.join(userId);
      socket.data.userId = userId;

      // Broadcast to all clients that this user is online
      io.emit("userOnline", userId);
    });

    socket.on('disconnect', () => {
      console.log(socket.data);
      console.log('User disconnected:', socket.data?.userId , "sId:", socket.id);
      if (socket.data?.userId) {
        const userId = socket.data.userId;
        onlineUsers.delete(userId);
        console.log(onlineUsers);

        io.emit('userOffline', userId);
      }
    });

    socket.on('kick-user', async (userIdToKick) => {
      const sockets = await io.in(userIdToKick).fetchSockets();
      sockets.forEach(s => {
        s.disconnect(true);
        io.emit('userOffline', userIdToKick);
      });
    });

    socket.on("updateOnlineUsers", () => {
      socket.emit("onlineUsers", Array.from(onlineUsers));
    });

  });

  router.get("/api/messages/getOnlineUsers", protect, async (req, res) => {
    try {
      const userCheck = await User.findById(req.user.id);
      if (!userCheck)
        return res.status(401).json({error: 'Auth user not found'});
  
      res.json([...onlineUsers]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({error: err});
    }
  });

  app.use("", router);
};
  