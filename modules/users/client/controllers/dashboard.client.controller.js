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