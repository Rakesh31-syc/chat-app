const io = require('socket.io')(5000, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

let activeUsers = [];

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', (username) => {
        console.log('User joined:', username);
        const user = {
            username: username,
            socketId: socket.id
        };
        
        // Remove any existing instances of this username
        activeUsers = activeUsers.filter(u => u.username !== username);
        // Add the new user
        activeUsers.push(user);
        
        // Broadcast updated user list to all clients
        io.emit('updateUserList', activeUsers);
        console.log('Active users:', activeUsers);
    });

    socket.on('send_private_message', (data) => {
        console.log('Private message:', data);
        const { sender, receiver, message } = data;
        
        // Find the receiver's socket ID
        const receiverUser = activeUsers.find(user => user.username === receiver);
        
        if (receiverUser) {
            // Send to receiver
            io.to(receiverUser.socketId).emit('receive_private_message', {
                sender,
                receiver,
                message,
                timestamp: new Date()
            });
            
            // Send confirmation back to sender
            socket.emit('message_sent', {
                success: true,
                messageData: data
            });
            
            console.log(`Message sent from ${sender} to ${receiver}`);
        } else {
            console.log(`Receiver ${receiver} not found`);
            socket.emit('message_sent', {
                success: false,
                error: 'User not found or offline'
            });
        }
    });

    socket.on('typing', ({ user, receiver }) => {
        const receiverUser = activeUsers.find(u => u.username === receiver);
        if (receiverUser) {
            io.to(receiverUser.socketId).emit('user_typing', { user });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        io.emit('updateUserList', activeUsers);
        console.log('Updated active users:', activeUsers);
    });
});

// Add error handling
io.on('error', (error) => {
    console.error('Socket.IO Error:', error);
});

// Log when server starts
console.log('Socket.IO server running on port 5000');