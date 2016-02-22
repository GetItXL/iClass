'use strict';

// Create the chat configuration
module.exports = function (io, socket, socketClients) {
    /* socket emitted from back will only be received by the front
        socket emitted from the front will only be received in the back
     */

    /* The socket in your browser and the socket in the server won't share the same properties if you set them.!!
        so only the socket in the back share the same property and only the ones in the front share the same property
     */

    /******** for testing purpose **********/
    io.emit('testUserSocketPair', {});

    socket.on('testUserSocketPairBack', function(data){
       console.log(socketClients.length);
        for(var i = 0; i < socketClients.length; i++){
            console.log(socketClients[i].userID);
            console.log(socketClients[i].socketID);
        }
    });
    /*************************************/





    socket.on('answerSubmitted', function(data){
        //emit this only to the quiz's professor

        //io.emit('')

    });


    socket.on('quizClosed', function(data){

       //emit only to students in the class
    });




    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function () {

        console.log('ever disconnected?');
        console.log('my socket id: ' + socket.id);

        var toBeRemoved;
        for(var i = 0; i < socketClients.length; i++){
            if(socketClients[i].socketID === socket.id){
                toBeRemoved = socketClients[i];
                socketClients.splice(i, 1);
                break;
            }

        }

        console.log('to be removed');
        console.log('socket id ' + toBeRemoved.socketID);
        console.log('userid' + toBeRemoved.userID);

    });

};
