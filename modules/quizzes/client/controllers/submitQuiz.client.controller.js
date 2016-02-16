'use strict';

// Quizzes controller
var app = angular.module('quizzes');
app.controller('SubmitQuizController', ['$scope', '$stateParams', '$location', 'Authentication',  '$filter', 'Quizzes', 'SubmitQuiz', 'CourseInfoFactory', 'Courses', '$modal', '$log',
    function ($scope, $stateParams, $location, Authentication, $filter, Quizzes, SubmitQuiz, CourseInfoFactory, Courses, $modal, $log) {
        $scope.authentication = Authentication;


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

            var courses = Courses.query(function(){
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



    }
]);
