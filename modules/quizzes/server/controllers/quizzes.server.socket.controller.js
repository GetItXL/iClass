'use strict';

// Create the chat configuration
module.exports = function (io, socket) {

    // Emit the status event when a new socket client is connected
    io.emit('userJoined', {
        type: 'status',
        text: 'Is now connected',
        created: Date.now(),
        username: socket.request.user.username
    });

};
