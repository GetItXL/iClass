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
            //console.log("findOne() is called");
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

            var quiz = $scope.quiz;

            quiz.$update(function () {
                $location.path('courses/' + $scope.courseDisplayInfo._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }
]);
