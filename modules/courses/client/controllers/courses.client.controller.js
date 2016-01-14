'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Users',
  function ($scope, $stateParams, $location, Authentication, Courses, Users) {
    //Courses is refering to the service on the client side

    $scope.authentication = Authentication;

    // Create new Course
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'courseForm');

        return false;
      }

      // Create new Course object
      var course = new Courses({
        name: this.name,
        number: this.number,
        passcode: this.passcode
      });

      // Redirect after save
      course.$save(function (response) {
        $location.path('courses/' + response._id);
        //console.log(course.professor);

        // Clear form fields
        $scope.name = '';
        $scope.number = '';
        $scope.passcode = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Course
    $scope.remove = function (course) {
      if (course) {
        course.$remove();

        for (var i in $scope.courses) {
          if ($scope.courses[i] === course) {
            $scope.courses.splice(i, 1);
          }
        }
      } else {
        $scope.course.$remove(function () {
          $location.path('courses');
        });
      }
    };

    // Update existing Course
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'courseForm');

        return false;
      }

      var course = $scope.course;

      course.$update(function () {
        $location.path('courses/' + course._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Courses
    $scope.find = function () {

      //professor should only see courses that he/she created
      if($scope.isProf()){
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
        
      }else{
        $scope.courses = Courses.query();
      }
    };

    // Find existing Course
    $scope.findOne = function () {
      $scope.course = Courses.get({
        courseId: $stateParams.courseId
      });
    };

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

      //Need to check user's role? (view already handled that)

      //check if student is already enrolled in the course
      if(student.enrolledCourses.indexOf(courseID) === -1){
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
        /* TODO: passcode verification */
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



    /* TODO: delete enrolled course from user if the course if removed by admin from database */

  }
]);
