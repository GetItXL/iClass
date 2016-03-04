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
        console.log('=================Connection established test=====================');

        console.log('My Socket List:');
        for(var property in socketClients){
            if(socketClients.hasOwnProperty(property)){
                console.log('userID: ' + property + ' | ' + 'socketID: ' + socketClients[property].id);
            }
        }
        console.log('=================================================================');


    });
    /*************************************/




    socket.on('answerSubmitted', function(data){
        //emit this only to the quiz's professor
        console.log('answerSubmittedBack called!');
        console.log(data.professorID);


        if(data.professorID && socketClients[data.professorID]){
            socketClients[data.professorID].emit('notifyProfQuizSubmission', {
                quizID: data.quizID
            });
        }else{
            console.log('No professor ID passed :(');
        }
    });

    socket.on('quizEnded', function(data){
       //emit only to students in THIS class
        console.log('quizEnded called!');

        var enrolledStudents = data.enrolledStudents;

        for(var property in socketClients){
            if(socketClients.hasOwnProperty(property)){

                if(enrolledStudents.indexOf(property) !== -1){
                    console.log('alert student for quiz ended: ' + socketClients[property]);
                    socketClients[property].emit('alertStudentQuizEnded', {
                        quizID: data.quizID,
                        courseID: data.courseID
                    });
                }



            }
        }

    });


    /*
    socket.on('quizOpened', function(data){
        //emit only to students in THIS class
        console.log('quizOpened called!');

        var enrolledStudents = data.enrolledStudents;

        for(var property in socketClients){
            if(socketClients.hasOwnProperty(property)){

                if(enrolledStudents.indexOf(property) !== -1){
                    console.log('alert student for quiz opened: ' + socketClients[property]);
                    socketClients[property].emit('alertStudentQuizOpened', {
                        quizID: data.quizID,
                        courseID: data.courseID
                    });
                }
            }
        }

    });*/


    /*
    socket.on('quizClosed', function(data){

       //emit only to students in the class
    });*/




    // Emit the status event when a socket client is disconnected
    socket.on('disconnect', function () {

        //fix firefox crashing server bug
        //socket.close();


        console.log('=================Connection destroyed test=====================');
        console.log('ever disconnected?');
        console.log('my socket id: ' + socket.id);
        console.log('my user id: ' + socket.userID);

        //remove from list
        if(socket.userID){
            delete socketClients[socket.userID];
        }


        //test
        console.log('My Socket List:');
        for(var property in socketClients){
            if(socketClients.hasOwnProperty(property)){
                console.log('userID: ' + property + ' | ' + 'socketID: ' + socketClients[property].id);
            }
        }
        console.log('=================================================================');
    });

};
