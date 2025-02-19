const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');

let io;

function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Client connected: ${socket.id}`);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`User Joined: ID=${userId}, Type=${userType}, Socket=${socket.id}`);

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
                } else if (userType === 'captain') {
                    await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
                }
            } catch (error) {
                console.error('Error updating socketId:', error);
                socket.emit('error', { message: 'Database update failed' });
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;

            if (!location?.ltd || !location?.lng) {
                return socket.emit('error', { message: 'Invalid location data' });
            }

            try {
                await captainModel.findByIdAndUpdate(userId, {
                    location: {
                        ltd: location.ltd,
                        lng: location.lng
                    }
                });
            } catch (error) {
                console.error('Error updating location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('disconnect', async () => {
            console.log(`Client disconnected: ${socket.id}`);
            
            try {
                await userModel.updateOne({ socketId: socket.id }, { socketId: null });
                await captainModel.updateOne({ socketId: socket.id }, { socketId: null });
            } catch (error) {
                console.error('Error clearing socketId on disconnect:', error);
            }
        });
    });
}

const sendMessageToSocketId = (socketId, messageObject) => {
    if (!io) {
        console.log('Socket.io not initialized.');
        return;
    }

    if (!socketId) {
        console.log('Invalid socket ID.');
        return;
    }

    console.log('Sending message:', messageObject);

    io.to(socketId).emit(messageObject.event, messageObject.data);
};

module.exports = { initializeSocket, sendMessageToSocketId };
