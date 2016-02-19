'use strict';

// Courses controller
angular.module('users').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Users', 'Quizzes',
  function ($scope, $stateParams, $location, Authentication, Courses, Users, Quizzes) {
    $scope.authentication = Authentication;

    $scope.isAdmin = function(){
      return ($scope.authentication.user.roles.indexOf('admin') > -1);
    };

    $scope.isProf = function(){
      return ($scope.authentication.user.roles.indexOf('professor') > -1);
    };

    $scope.isStudent = function(){
      return ($scope.authentication.user.roles.indexOf('user') > -1);
    };

/*******     professor's dashboard function 	***********/    

    //TODO: may be able to avoid the loop by modifying backend and service
	// Find a list of Courses
    $scope.createdCourseList = function(){

      //professor should only see courses that he/she created
      if($scope.isProf())
      {
        //console.log('current professor id ' + $scope.authentication.user._id);
        var professorCourses = [];

        var courses = Courses.query({}, function(){
          for(var i = 0; i < courses.length; i++){
            //console.log(courses[i].professor._id);
            if(courses[i].professor._id === $scope.authentication.user._id){
              professorCourses.push(courses[i]);
            }
          }
          $scope.courses = professorCourses;
        });
        
      }
      else
      {
        console.log('only professors are able to create course');
      }
    };


    /* This function grabs numStudentsEnrolled in EACH courese in the database
      and store the courseID:numStudentEnrolled pair in $scope.numStudentInCourse
     */
    $scope.findNumStudentEnrolled = function(){

      //$scope.numStudentInCourse = $scope.courses.enrolledStudents.length;
      //console.log("weird");
      //console.log($scope.courses);
      //console.log($scope.courses.numStudents);

      var courseStudentPair = {};

      for(var i = 0; i < $scope.courses.length; i++){
        //courseStudentPair[$scope.courses[i]._id] = 0;
        courseStudentPair[$scope.courses[i]._id] = $scope.courses[i].enrolledStudents.length;
      }

      $scope.numStudentInCourse = courseStudentPair;

      /*
      var courseStudentPair = {};

      //Initialize the array with 0s
      for(var i = 0; i < $scope.courses.length; i++){
        courseStudentPair[$scope.courses[i]._id] = 0;
      }

      //get all users from database
      var allUsers = Users.query(function(res){

        var validStudents = [];

        //extract out those students who joined at least one class
        for(var i = 0; i < allUsers.length; i++){

          if(allUsers[i].enrolledCourses.length !== 0)
            validStudents.push(allUsers[i]);
        }

        //Get num of students enrolled in a class
        for(var k = 0; k < validStudents.length; k++) {
          for (var j = 0; j < $scope.courses.length; j++) {

            if (validStudents[k].enrolledCourses.indexOf($scope.courses[j]._id) !== -1) {
              courseStudentPair[$scope.courses[j]._id]++;
              //console.log($scope.courses[j]._id, courseStudentPair[$scope.courses[j]._id]);
            }
          }
        }

        $scope.numStudentInCourse = courseStudentPair;
       // var associativeArray = {"course._id" : numStudents};


      });*/
    };



/*******     student's dashboard function 	***********/


    $scope.findEnrolledCourses = function(){

      var user = $scope.authentication.user;
      var coursesEnrolled = [];

      
      for(var i = 0; i < user.enrolledCourses.length; i++){
        console.log('enrolled course' + i + ': ' + user.enrolledCourses[i]);

        coursesEnrolled.push(Courses.get({
          courseId: user.enrolledCourses[i]
        }));

      }

      $scope.enrolledCourses = coursesEnrolled;

      //console.log(this.coursesEnrolled);
      //console.log('enrolled' + $scope.enrolledCourses);
    };



    /********************* shared ******************/

    //get the total number of quiz in a

    /* getting all the pairs at once because can't use loop function in ng-repeat*/
    $scope.getNumQuiz = function(){

      var courses;

      if($scope.isAdmin()){
        courses = Courses.query();
      }else if($scope.isProf()){
        courses = $scope.courses;
      }else if($scope.isStudent()){
        courses = $scope.enrolledCourses;

      }

      console.log('there? '+ courses);

      /* TODO: fix display num quiz on student side!!!! */

      var courseQuizPairs = {};

      //Initialize the array with 0s
      for(var k = 0; k < courses.length; k++){
        courseQuizPairs[courses[k]._id] = 0;
        console.log('id ' + courses[k]._id);
      }


      var quizzes = Quizzes.query(function(){
        for(var i = 0; i < quizzes.length; i++){
          for(var j = 0; j < courses.length; j++){

            if(quizzes[i].courseID === courses[j]._id){
              courseQuizPairs[courses[j]._id]++;
            }

          }
        }

        $scope.numQuizzesInCourse = courseQuizPairs;
        console.log($scope.numQuizzesInCourse);

      });
    }; /* TODO: def need better algo later*/



    /********************* collapsed feature *******************/

    $scope.isCollapsed = true;
    
    /**********************************************************/

  }
]);
