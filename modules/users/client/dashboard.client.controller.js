'use strict';

angular.module('users').controller('DashboardController', ['$scope', '$http', '$location', '$state', '$log', 'Users', 'Authentication', 'Courses',
    function($scope, $http, $location, $state, $log, Users, Authentication, Courses) {
        $scope.authentication = Authentication;

        // Debug info for Chrome Dev Tools inspect the scope using MY_SCOPE!
        window.MY_SCOPE = $scope;

        // If user is not signed in then redirect back home
        if (!Authentication.user) $location.path('/');

        $scope.courses = [];

        $scope.grabUsersCourses = function() {
            for (var i = 0; i < Authentication.user.enrolledCourses.length; i++) {
                this.courses.push(
                    Courses.get({
                        courseId: Authentication.user.enrolledCourses[i].courseId
                    })
                );
            }
        };


        // $scope.usersList = function() {
        //     $scope.users = Users.query();
        // };


    $scope.isAdmin = function(){
      return ($scope.authentication.user.roles.indexOf('admin') > -1);
    };

    $scope.isProf = function(){
      return ($scope.authentication.user.roles.indexOf('professor') > -1);
    };

    $scope.isStudent = function(){
      return ($scope.authentication.user.roles.indexOf('user') > -1);
    };

    $scope.joinCourse = function(courseID){

      var student = new Users(Authentication.user);

      console.log($scope.passcode);
      console.log($scope.course.passcode);

      if($scope.passcode !== $scope.course.passcode){
        console.log("Wrong passcode");
      }else if(student.enrolledCourses.indexOf(courseID) === -1){//check if student is already enrolled in the course
        student.enrolledCourses.push(courseID);

        student.$update(function(res){
          $scope.success = true;
          Authentication.user = res;

          console.log(Authentication.user);
        }, function(errorResponse){
          $scope.error = errorResponse.data.message;
        });

      }else{
        console.log('already enrolled in this class');

        /* TODO: display message to user */
      }
    };

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