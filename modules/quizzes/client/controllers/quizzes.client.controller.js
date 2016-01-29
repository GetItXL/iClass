'use strict';

// Quizzes controller
var app = angular.module('quizzes');
app.controller('QuizzesController', ['$scope', '$stateParams', '$location', 'Authentication',  '$filter', 'Quizzes', 'CourseInfoFactory', 'Courses', '$log',
  function ($scope, $stateParams, $location, Authentication, $filter, Quizzes, CourseInfoFactory, Courses, $log) {
    $scope.authentication = Authentication;

    //keeps track of choices added
    $scope.currentLetter = 'A'; //default to A
    $scope.choices = [{ letter:'A', description:'' }]; //empty array
    $scope.correctAnswer = '';

    //Stores user defined quiz duration
    $scope.quizMin = [0, 1, 2, 3, 4, 5];
    $scope.quizSec = [0, 10, 20, 30, 40, 50];
    $scope.showDuration = false;
    $scope.inputMin = 0;
    $scope.inputSec = 0;
    //$scope.totalMS = 0; //total millisecond


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
        correctAnswer: $scope.correctAnswer,
        quizDuration: $scope.convertToMSec($scope.inputMin, $scope.inputSec)
      });

      // Redirect after save
      quiz.$save(function (response) {
        $location.path('quizzes/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
        console.log(quiz);

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

      $scope.quiz = Quizzes.get({
        quizId: $stateParams.quizId
      });

      getCourseDisplayInfo($scope.quiz.courseID);
    };


    /************ Find existing Quiz in one courses **************/

    $scope.figureOutQuizToDisplay = function (currentCourseID) {
      currentCourseID = '5699e1d7046a38e1126a8c05';
      console.log('build quiz pageaaaa 123 '+currentCourseID);
      var courseQuizzes = [];
console.log('build quiz pageaaaa 1 '+currentCourseID);
        var quizzes = Quizzes.query(function(){
console.log('build quiz pageaaaa 13 ');
          for(var i = 0; i < quizzes.length; i++){
            //console.log(courses[i].professor._id);
            if(quizzes[i].courseID === currentCourseID){
              courseQuizzes.push(quizzes[i]);
              console.log('build quiz page wj '+quizzes[i].courseID);
            }
          }
          $scope.quizzes = courseQuizzes;
        });
    };
  

    /********************/


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
        //  console.log(courses[i]._id + '  ' + $scope.quiz.courseID);
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


    $scope.setDurationVisibility = function(visibility){ //boolean
      if(visibility)
        $scope.showDuration = true;
      else
        $scope.showDuration = false;
    };

    $scope.convertToMSec = function(minute, second){

      console.log(minute + ' ' + second);

      if(minute === 0 && second === 0)
        return -1; //manually end quiz

      return minute * 60 * 1000 + second * 1000;
    };

  }
]);