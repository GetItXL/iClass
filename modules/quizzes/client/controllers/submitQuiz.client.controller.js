'use strict';

// Quizzes controller
var app = angular.module('quizzes');
app.controller('SubmitQuizController', ['$scope', '$stateParams', '$location', 'Authentication',  '$filter', 'Quizzes', 'SubmitQuiz', 'CourseInfoFactory', 'Courses', '$modal', '$log', 'Socket',
    function ($scope, $stateParams, $location, Authentication, $filter, Quizzes, SubmitQuiz, CourseInfoFactory, Courses, $modal, $log, Socket) {
        $scope.authentication = Authentication;


        //TODO: get rid of this code redundancy
        /*********************** Check current user role ********************/
        $scope.isAdmin = function(){
          return ($scope.authentication.user.roles.indexOf('admin') > -1);
        };

        $scope.isProf = function(){
          return ($scope.authentication.user.roles.indexOf('professor') > -1);
        };

        $scope.isStudent = function(){
          return ($scope.authentication.user.roles.indexOf('user') > -1);
        };
        /*******************************************************************/


        // Find existing Quiz
        $scope.findOne = function () {
            console.log("calling SubmitQuizController");

            $scope.quiz = SubmitQuiz.get({
                quizId: $stateParams.quizId
            });

            getCourseDisplayInfo($scope.quiz.courseID);
            console.log($scope.quiz);
        };

        function getCourseDisplayInfo(courseID){

            //not sure why Courses.get() does not work

            var courses = Courses.All.query(function(){
                var course;

                for(var i = 0; i < courses.length; i++){
                    //  console.log(courses[i]._id + '  ' + $scope.quiz.courseID);
                    if(courses[i]._id === $scope.quiz.courseID){
                        course = courses[i];
                    }
                }

                $scope.courseDisplayInfo = course;
            });

        }

        $scope.submit = function(answer){

            console.log('my submitted answer is ' + answer);

            //if(!alreadySubmitted()){
                var quiz = $scope.quiz;
                quiz.scores.push({studentID : $scope.authentication.user._id, selectedAnswer : answer, quizScore : 0});


                quiz.$submit(function () {
                    $location.path('courses/' + $scope.courseDisplayInfo._id);
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            //}

        };


        //Check if the student has already submitted the quiz answer
        function alreadySubmitted(){

            var quiz = $scope.quiz;

            for (var i = 0; i < quiz.scores.length; i++){
                if(quiz.scores[i].studentID.toString() === $scope.authentication.user._id.toString()){
                    return true;
                }
            }

            return false;
        }

        /* try to use watch instand of reload page */
        $scope.isOpen = function(quiz){

            $scope.$watch('quizOpen', function() {
             // console.log('checking passcode error');
            //   $scope.correctPasscode = CoursePasscodeFactory.correctPasscode;
            //   var passcodeNoError = $scope.correctPasscode;
            //  //  console.log('checking passcode error ' + passcodeNoError);
            //   if(quizIsOpen) {
            //       $modalInstance.close($scope.course);
            //       //$state.reload();

            //     //  console.log('passcode correct');
            //   }
            //   else
            //      console.log('passcode error');
            // //console.log('end of checking passcode error');
          });
        };




        // Make sure the Socket is connected
        if (!Socket.socket) {
            Socket.connect();
        }

        // Add an event listener to the 'chatMessage' event
        Socket.on('userJoined', function (message) {
            console.log('SOCKET: USER JOINED: ' + message.username);
        });



    }
]);
