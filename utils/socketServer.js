let admin = [];

const socketServer = (socket) => {
  socket.on('joinUser', (user) => {
    if (user.role === 'admin') {
      admin.push({ id: user._id, socketId: socket.id });
    }
  });
  socket.on('joinRoom', (id) => {
    socket.join(id);
  });

  socket.on('leaveRoom', (id) => {
    socket.leave(id);
  });

  socket.on('disconnect', () => {
    console.log(socket.id + ' disconnected.');
  });

  socket.on('createNotification', (data) => {
    admin.forEach((item) => {
      socket.to(item.socketId).emit('createNotificationToClient', data);
    });
  });
};

module.exports = socketServer;
