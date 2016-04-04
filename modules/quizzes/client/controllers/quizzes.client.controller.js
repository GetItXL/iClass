'use strict';

// Quizzes controller
var app = angular.module('quizzes');
app.controller('QuizzesController', ['$scope', '$state','$stateParams', '$location', '$interval', 'Authentication',  '$filter', 'Quizzes', 'CourseInfoFactory', 'Courses', '$modal', '$log', 'Socket', 'Users',
  function ($scope, $state, $stateParams, $location, $interval, Authentication, $filter, Quizzes, CourseInfoFactory, Courses, $modal, $log, Socket, Users) {
    $scope.authentication = Authentication;

    //keeps track of choices added
    $scope.currentLetter = 'A'; //default to A
    $scope.choices = [{ letter:'A', description:'' }]; //empty array
    $scope.correctAnswer = '';

    //Stores user defined quiz duration
    $scope.quizMin = [0, 1, 2, 3, 4, 5];
    $scope.quizSec = [0, 10, 20, 30, 40, 50];
    $scope.showDuration = false;
    $scope.showQuizOption = false;
    $scope.inputMin = 0;
    $scope.inputSec = 0;
    //$scope.totalMS = 0; //total millisecond



    // Create new Quiz
    $scope.create = function (isValid, isAttendenceQuiz) {
      $scope.error = null;

      //TODO: modify later to get rid of required question + answer
      if(isAttendenceQuiz){
        this.title = "Attendence_" + new Date().toJSON().slice(0, 10);
        this.question = "This is an attendence quiz";
        $scope.choices = [{ letter:'A', description:'I am in class!' }];
        $scope.correctAnswer = 'A';
        $scope.inputMin = 0;
        $scope.inputSec = 0;
      }


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
        quizDuration: $scope.convertToMSec($scope.inputMin, $scope.inputSec),
        quizOpen: false,
        quizEnded: false
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
      if($scope.choices.length > 1){
        $scope.currentLetter = String.fromCharCode($scope.currentLetter.charCodeAt() - 1);
        $scope.choices.splice($scope.choices.length-1, 1);
      }
    };

    // Remove existing Quiz
    $scope.remove = function (quiz) {

      var removedQuizCourseID;

      if (quiz) {
        removedQuizCourseID = quiz.courseID;
        quiz.$remove();

        for (var i in $scope.quizzes) {
          if ($scope.quizzes[i] === quiz) {
            $scope.quizzes.splice(i, 1);
          }
        }
      } else {
        removedQuizCourseID = $scope.quiz.courseID;
        $scope.quiz.$remove(function () {
          $location.path('courses/'+removedQuizCourseID);
        });
      }
    };

    // Update existing Quiz - for professor / admin
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'quizForm');

        return false;
      }


      /* TODO: since student will update quiz model when submitting answer,
        we may need to call findone() to update $scope.quiz before updating quiz status
       */


      var quiz = $scope.quiz;


      quiz.$update(function () {
        $location.path('quizzes/' + quiz._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };


    //Function used to update quiz status, where things will not be passed in by input fields
    $scope.updateQuizStatus = function (isQuizOpen, isQuizEnded) {

       // TODO: since student will update quiz model when submitting answer,
       // we may need to call findone() to update $scope.quiz before updating quiz status
       
      $scope.quiz.quizOpen = isQuizOpen;
      $scope.quiz.quizEnded = isQuizEnded;
      var quiz = $scope.quiz;


      quiz.$update(function () {
        //$location.path('quizzes/' + quiz._id);

        //update quiz
        $scope.quiz = quiz;
        $state.reload();

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    function addAbsentStudentScores(){
        var quiz = $scope.quiz;
        var scores = quiz.scores;

        var absentStuID = [];

        var course = Courses.All.get({courseId : quiz.courseID}, function(){
           var studentsEnrolled = course.enrolledStudents;

            for(var i = 0; i < studentsEnrolled.length; i++){
                var takenQuizFlag = false;

                for(var j = 0; j < scores.length; j++){
                    if(studentsEnrolled[i] === scores[j].studentID){
                        takenQuizFlag = true;
                    }
                }

                if(!takenQuizFlag){
                    absentStuID.push(studentsEnrolled[i]);
                    //console.log('ABS STU ID ADDED: ' + studentsEnrolled[i]);
                }
            }


            var users = Users.query(function(){
                var absentStudents = [];

                for(var i = 0; i < users.length; i++){
                    for(var j = 0; j < absentStuID.length; j++){
                        if(absentStuID[j] === users[i]._id){
                            absentStudents.push(users[i]);
                        }
                    }
                }

                for(var k = 0; k < absentStudents.length; k++){
                    //console.log('absent STUS: ' + absentStudents[k].displayName);
                    quiz.scores.push({studentID : absentStudents[k]._id, student : absentStudents[k], selectedAnswer : '', quizScore : 0});
                    //console.log('PUSH QUIZ SCORE: ' + quiz.scores[quiz.scores.length-1].student.displayName);

                    var student = new Users(absentStudents[k]);
                    student.quizzesTaken.push({quizName : quiz.title, courseID : course._id, quizID : quiz._id, submittedAnswer : '', quizScore : 0});

                    student.$update();
                }


                quiz.$update(function () {
                    $scope.quiz = quiz;
                    //console.log('ABS QUIZ UPDATED');
                    //console.log('ABS QUIZ UPDATED SCORE: ' + $scope.quiz.scores[$scope.quiz.scores.length-1].student.displayName);
                    //$state.reload();
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            });


        });
    }


  function getUserByID(idList){
      var userList = [];

      var users = Users.query(function(){

          for(var i = 0; i < users.length; i++){
              for(var j = 0; j < idList.length; j++){
                  if(idList[j] === users[i]._id){
                      userList.push(users[i]);
                  }
              }
          }
      });

      return userList;
  }



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

    
    $scope.updateChoices = function(){
      $scope.choices = $scope.quiz.choices;
      $scope.correctAnswer = $scope.quiz.correctAnswer;
      $scope.currentLetter = $scope.choices[$scope.choices.length-1].letter;
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



    $scope.convertToMSec = function(minute, second){

      console.log(minute + ' ' + second);

      if(minute === 0 && second === 0)
        return -1; //manually end quiz

      return minute * 60 * 1000 + second * 1000;
    };

 


    /********  check quiz avaliablity **********/

     


    $scope.isOpen = function(quiz) {

        var userID = $scope.authentication.user._id;
        var studentTaken = [];
        var quizOpen = true;
        
        console.log('number of student takes the quiz: ' +  quiz.scores.length);
       
        for(var i = 0; i < quiz.scores.length; i++){
           // console.log('quiz taken' + i + ': ' + user.quizzesTaken[i].quizID);

            // quizTaken.push(Courses.All.get({
            //   quizID: user.quizzesTaken[i].quizID
            // }));

            studentTaken.push(quiz.scores[i].studentID);
            console.log('current studentID ' + userID);
            console.log('taken student ID is ' + studentTaken[i]);
            if(quiz.scores[i].studentID === userID) {
                quizOpen = false;
                console.log('this quiz is already taken!');
            }


        }
      console.log('quiz open is ' + quiz.quizOpen);
    
    /*  need to fix refresh page in order to take quiz bug  */
    
          if(!quizOpen) {
            $scope.modalQuizNotOpen('sm' ,quiz );
            // $location.path('quizzes/close/'+quiz._id);
          }
          else {
            //$location.path('quizzes/'+quiz._id+'/open');
            $location.path('quizzes/open/'+quiz._id);
          }
      

    };

     /*********  modal window quiz not open  *******************/

    $scope.modalQuizNotOpen = function(size, selectedQuiz) {


      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard :false,
        templateUrl: 'modules/quizzes/client/views/close-quiz.client.view.html',
        controller: modalQuizNotOpenCtrl,
        size: size,
        resolve: {
          quiz: function() {
            return selectedQuiz;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var modalQuizNotOpenCtrl = function($scope, $modalInstance, quiz) {
       $scope.quiz = quiz;
      //console.log("I am update modal window " + Authentication.user.displayName);
      $scope.ok = function() {
        $modalInstance.close($scope.quiz);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };
    };


    //Quiz status - open or closed
    $scope.setQuizStart = function(){
      //$scope.isQuizOpen = true;
      //$scope.isQuizEnded = false;
      $scope.updateQuizStatus(true, false);



        //TODO: callback here is not working but is it needed?


      var course = Courses.All.get({courseId: $scope.quiz.courseID}, function(){

          console.log('open the quiz on the professor side');

          Socket.emit('quizOpened', {
              courseID : $scope.quiz.courseID,
              quizID : $scope.quiz._id,
              enrolledStudents: course.enrolledStudents
          });

      });


    };

    //Call to manully end the quiz
    $scope.setQuizFinished = function(){
      //$scope.isQuizEnded = true;
      //$scope.isQuizOpen = false;

        $scope.updateQuizStatus(false, true);
        //TODO: callback here is not working but is it needed?

        $scope.interval = 0;

        //alert to all students in THIS class
        var course = Courses.All.get({courseId: $scope.quiz.courseID}, function(){

            console.log('ending the quiz on the professor side');

            Socket.emit('quizEnded', {
                courseID : $scope.quiz.courseID,
                quizID : $scope.quiz._id,
                enrolledStudents: course.enrolledStudents
            });

        });

        addAbsentStudentScores();


    };

/************ figure selecte number of choices (bar chart)   *************/

    $scope.labels = [];
    $scope.series = [];
    $scope.data = [];
    $scope.numChoiceQuiz = [];
    // correcting quiz letter 
    // $scope.figureoutchoice = function(currentQuizChoices) {
    //     $scope.labels.push(currentQuizChoices.letter);
    //     console.log('labels '+$scope.labels);
    // };

    // correcting quiz result;
    $scope.figureOutChoicesNum = function(currentQuiz){
        var choiceNum = currentQuiz.choices;
        var QuizzesChoice = [];
      

            //var choice = []
           // var numChoice = []
           
        for(var i = 0; i < choiceNum.length; i++){
               // console.log('choice number length ' + choiceNum.length);
                QuizzesChoice[choiceNum[i].letter] = 0;
               
        }  

        for(var j = 0; j < choiceNum.length; j++){
            for(var k = 0; k < currentQuiz.scores.length; k++) {
                        //  console.log(courses[i]._id + '  ' + $scope.quiz.courseID);
                if(choiceNum[j].letter === currentQuiz.scores[k].selectedAnswer) {
                      QuizzesChoice[choiceNum[j].letter]++;
                }
                    //console.log(choiceNum[i].letter + '  ' + currentQuiz.scores[k].selectedAnswer);
             }
        }  


        $scope.numChoiceQuiz = QuizzesChoice;

            
    }; 

    $scope.average=[];
    $scope.figureoutchoice1 = function() {
         console.log('numChoiceQuiz '+ $scope.numChoiceQuiz);
      var eachscore = 0;
      var totalScore = 0;
        var quiz = Quizzes.get({
            quizId: $stateParams.quizId //Quizzes.choices: $scope.quiz.choices;
        }, function(){ //callback function to ensure that this executes after database query has finished
              var numChoice = quiz.choices;
              var tempData = [];
              for(var z = 0; z < numChoice.length; z++) {
                  $scope.labels.push(numChoice[z].letter);
                  tempData[z] = $scope.numChoiceQuiz[numChoice[z].letter];
                  // console.log('num Choice  '+ $scope.numChoiceQuiz[numChoice[z].letter]);
              }
              $scope.data.push(tempData);
                 console.log('tempData '+ tempData);
                 console.log('choices '+ numChoice);
                //   console.log('labels '+$scope.labels);
                //     console.log('data '+$scope.data);
                $scope.series.push(quiz.title);
              for(var j = 0; j < quiz.scores.length; j++) {
                 eachscore = quiz.scores[j].quizScore;
                   
                      totalScore = 1+ totalScore;
              }
              if(totalScore === 0) {
                totalScore = 1;
              }
               var result = $filter('number')((eachscore/totalScore)*100, 2) + '%';
                console.log("average scores is " +  result);
              $scope.average.push(result);
        });
        // console.log('choices '+ numChoice);
                  console.log('labels '+$scope.labels);
                    console.log('data '+$scope.data);

    };

/*********  modal window update quiz *******************/

    $scope.modalUpdate = function(size, selectedQuiz) {


      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard :false,
        templateUrl: 'modules/quizzes/client/views/edit-quiz.client.view.html',
        controller: ModalUpdateCtrl,
        size: size,

        resolve: {
          quiz: function() {
            return selectedQuiz;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalUpdateCtrl = function($scope, $modalInstance, quiz) {
        $scope.quiz = quiz;
        //console.log("I am update modal window " + Authentication.user.displayName);
        $scope.ok = function() {
            $modalInstance.close($scope.quiz);
            $state.reload();
    
        };


        $scope.cancel = function() {
          //$modalInstance.dismiss('cancel');
          $state.reload();
        };
    };

    /*********  modal window remove quiz *******************/

    $scope.modalRemove = function(size, selectedQuiz) {

      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard :false,
        templateUrl: 'modules/quizzes/client/views/delete-quiz.client.view.html',
        controller: ModalRemoveCtrl,
        size: size,
        resolve: {
          quiz: function() {
            return selectedQuiz;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        //console.log('Modal dismissed at: ' + new Date());
       // $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalRemoveCtrl = function($scope, $modalInstance, quiz) {
      $scope.quiz = quiz;

      $scope.ok = function() {
        //console.log('user click ok');
        $modalInstance.close($scope.quiz);
       // $state.reload();
        var removedQuizCourseID = $scope.quiz.courseID;
        $location.path('courses/'+removedQuizCourseID);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        //$state.reload();
      };
    };


/************* timer *******************/

    $scope.timerSeconds = 0;

    $scope.$on('timer-tick', function(event, value) {
          $scope.timerSeconds = $scope.quiz.quizDuration/1000- (Math.floor(value.millis / 1000)) ;
          if( $scope.timerSeconds === -1)
              $scope.setQuizFinished();
    });
    $scope.interval = 0;
    $interval(function() {}, 1000);


    // $scope.openTimer = function(){
    //     var quiz = Quizzes.get({
    //         quizId: $stateParams.quizId //Quizzes.choices: $scope.quiz.choices;
    //     }, function(){ //callback function to ensure that this executes after database query has finished
    //          //if(quiz.quizDuration)


              
    //           // $interval(function() {
    //           //   $scope.interval++; 
    //           //   if($scope.interval === quiz.quizDuration/1000){


    //           //   }
    //           //      console.log($scope.interval + " interval");
    //           //     console.log(quiz.quizDuration/1000+ " quizDuration");
                    
    //           // }, 1000);

    //     });

    // };

/**************** nvd3 data and options ***************/

        // $scope.options = {  
        //     chart: {
        //         type: 'discreteBarChart',
        //         height: 450,
        //         margin : {
        //             top: 20,
        //             right: 20,
        //             bottom: 60,
        //             left: 55
        //         },
        //         x: function(d){ return d.label; },
        //         y: function(d){ return d.value; },
        //         showValues: true,
        //         valueFormat: function(d){
        //             return d3.format(',.4f')(d);
        //         },
        //         transitionDuration: 1000,
        //         xAxis: {
        //             axisLabel: 'choices'
        //         },
        //         yAxis: {
        //             axisLabel: 'student',
        //             axisLabelDistance: 30
        //         }
        //     }
        // };

        // $scope.datas = [{
        //     key: "Cumulative Return",
        //     values: [
        //         { "label" : "C" , "value" : 32.807804682612 },
        //         { "label" : "D" , "value" : 16.45946739256 },
        //         { "label" : "E" , "value" : 0.19434030906893 },
        //         { "label" : "H" , "value" : 0 }
        //     ]
        // }];

// $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  //$scope.series = ['Series A'];

  //$scope.data = [ [65, 59, 80, 81, 56, 55, 40]];    //array of data
  


/*
    Socket.on('notifyProfQuizSubmission', function(data){
      //query database and then update totalParticipant number on the view

      //query db
      var quiz = Quizzes.get({
        quizId: data.quizID
      });


    });*/
/************* figure out scores student ****/

  //$scope.checkStudent = function (currentScore){

     // var quiz = Quizzes.get({
     //        quizId: $stateParams.quizId //Quizzes.choices: $scope.quiz.choices;
     //    }, function(){ //callback function to ensure that this executes after database query has finished
     //            var student = currentScore.student.get({
     //                userId: data.userId
     //            } function() {
     //              console.log('student name is '+ student.displayName);
     //            });
     //            console.log('student name is '+ student.displayName);
     //    });
              
     

  
  //};


      //put here for testing before separating pages
      Socket.on('notifyProfQuizSubmission', function(data){
          //query database and then update totalParticipant number on the view

          console.log('notifyProfQuizSubmission recieved');


          //query db
          var quiz = Quizzes.get({
              quizId: data.quizID
          }, function(){
              $scope.quiz = quiz;
          });

          //console.log($scope.quiz.totalParticipant);

      });
  }
]);
