'use strict';

// Courses controller
angular.module('users').controller('DashboardController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Users',
  function ($scope, $stateParams, $location, Authentication, Courses, Users) {

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


    //Get number of students enrolled in a class
    //Using $scope.courses
    $scope.findNumStudentEnrolled = function(){

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

      });
    };
    /* TODO: more efficient way to do so other than adding enrolledStudents in course model? */
    /* TODO: need more students to test this */


/*******     student's dashboard function 	***********/


    $scope.findEnrolledCourses = function(){

      var user = $scope.authentication.user;
      var coursesEnrolled = [];

      for(var i = 0; i < user.enrolledCourses.length; i++){
        console.log(user.enrolledCourses[i]);

        coursesEnrolled.push(Courses.get({
          courseId: user.enrolledCourses[i]
        }));

      }

      $scope.enrolledCourses = coursesEnrolled;

      //console.log(this.coursesEnrolled);
      console.log($scope.enrolledCourses);
    };



  }
]);
