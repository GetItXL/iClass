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


        $scope.submit = function(answer){

            var quiz = $scope.quiz;

            quiz.$update(function () {
                $location.path('quizzes/' + quiz._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
    }
]);
