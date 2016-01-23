'use strict';

// Quizzes controller
angular.module('quizzes').controller('QuizzesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Quizzes', 'CourseInfoFactory',
  function ($scope, $stateParams, $location, Authentication, Quizzes, CourseInfoFactory) {
    $scope.authentication = Authentication;


    $scope.currentLetter = 'A'; //default to A
    $scope.choices = [{letter:'A', description:''}]; //empty array


    // Create new Quiz
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'quizForm');

        return false;
      }

      // Create new Quiz object
      var quiz = new Quizzes({
        title: this.title,
        question: this.question,
        courseID: CourseInfoFactory.getCourseID(),
        choices: $scope.choices
      });

      // Redirect after save
      quiz.$save(function (response) {
        $location.path('quizzes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        console.log('quiz course id' + quiz.courseID);
        console.log(quiz.choices);

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };






    //Add a new choice
    $scope.addChoice = function (letter, description){
      $scope.currentLetter = String.fromCharCode($scope.currentLetter.charCodeAt() + 1);

      $scope.choices.push({letter: $scope.currentLetter, description: ''});


    };

    // Remove existing Quiz
    $scope.remove = function (quiz) {
      if (quiz) {
        quiz.$remove();

        for (var i in $scope.quizzes) {
          if ($scope.quizzes[i] === quiz) {
            $scope.quizzes.splice(i, 1);
          }
        }
      } else {
        $scope.quiz.$remove(function () {
          $location.path('quizzes');
        });
      }
    };

    // Update existing Quiz
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'quizForm');

        return false;
      }

      var quiz = $scope.quiz;

      quiz.$update(function () {
        $location.path('quizzes/' + quiz._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Quizzes
    $scope.find = function () {
      $scope.quizzes = Quizzes.query();
    };

    // Find existing Quiz
    $scope.findOne = function () {
      $scope.quiz = Quizzes.get({
        quizId: $stateParams.quizId
      });
    };
    
  }
]);
