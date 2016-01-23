'use strict';

// Quizzes controller
angular.module('quizzes').controller('QuizzesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Quizzes', 'CourseInfoFactory', 'Courses',
  function ($scope, $stateParams, $location, Authentication, Quizzes, CourseInfoFactory, Courses) {
    $scope.authentication = Authentication;

    //keeps track of choices added
    $scope.currentLetter = 'A'; //default to A
    $scope.choices = [{ letter:'A', description:'' }]; //empty array
    $scope.correctAnswer = '';



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
        choices: $scope.choices,
        correctAnswer: $scope.correctAnswer
      });

      // Redirect after save
      quiz.$save(function (response) {
        $location.path('quizzes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    //Add a new choice
    $scope.addChoice = function (){
      //console.log($scope.choices);
      $scope.currentLetter = String.fromCharCode($scope.currentLetter.charCodeAt() + 1);

      $scope.choices.push({ letter: $scope.currentLetter, description: '' });

    };
    /* TODO: delete from end for now. Later add delete button to each choice */
    $scope.deleteChoice = function(){
      $scope.currentLetter = String.fromCharCode($scope.currentLetter.charCodeAt() - 1);
      $scope.choices.splice($scope.choices.length-1, 1);
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
      console.log('Iam ere');
      $scope.quiz = Quizzes.get({
        quizId: $stateParams.quizId
      });

      getCourseDisplayInfo($scope.quiz.courseID);
    };

    $scope.updateChoices = function(){
      $scope.choices = $scope.quiz.choices;
      $scope.correctAnswer = $scope.quiz.correctAnswer;
      $scope.currentLetter = $scope.choices[$scope.choices.length-1].letter;
    };


    function getCourseDisplayInfo(courseID){

      //not sure why Courses.get() does not work

      var courses = Courses.query(function(){
        var course;

        for(var i = 0; i < courses.length; i++){
          console.log(courses[i]._id + '  ' + $scope.quiz.courseID);
          if(courses[i]._id === $scope.quiz.courseID){
            course = courses[i];
          }
        }

        $scope.courseDisplayInfo = course;
      });

    }


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

  }
]);
