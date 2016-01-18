'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Courses', 'Users',
  function ($scope, $stateParams, $location, Authentication, Courses, Users) {
    //Courses is refering to the service on the client side

    $scope.authentication = Authentication;

  /****************    setting for start and end course date  ***************/

    $scope.semesters = ['Spring','Summer','Fall'];
    $scope.years = ['2015','2016','2017','2018'];
   // $scope.selectedItem = $scope.semesters[0];

    $scope.isCorrectDate = function(selectedSemester,selectedYear)
    {
      var today = new Date(); 
      var thisYear = today.getFullYear(); 
      var thisMonth = today.getMonth(); //January is 0, February is 1, and so on.
      console.log(today);
      console.log(thisYear + 'select year is ' + selectedYear);
      console.log(thisMonth + 'selected semester is ' + selectedSemester);

      if(selectedYear > thisYear)
      {
        return true;
      }
      else if(selectedYear < thisYear)
      {
        console.log(selectedYear + ' is invaild');
        return false;
      }
      else
      {
        if(selectedSemester === 'Spring' && thisMonth >'4')   //Jan - March 0-4
        {
          console.log(selectedSemester);
          return false;
        }
        else if(selectedSemester === 'Summer' && thisMonth > '7') //March - Aug 4-7
        {
          console.log(selectedSemester);
          return false;
        }
        else if(selectedSemester === 'Fall' && thisMonth < '7') //Aug- December 7-11
        {
          console.log(selectedSemester + ' is invaild');    //need to add notification to user!!!
          return false;
        }
        else
        {
          console.log(selectedSemester + ' true');
          return true;
        }
      }
      // else if(selectedYear > thisYear)
      // { return true;}
      // else
      // {
      //   console.log(selectedYear + ' is invaild');
      //   return false;
      // }

    };

    $scope.findendDate = function(selectedSemester,selectedYear){
      var today = new Date();
      today.setFullYear(selectedYear);
      console.log('today is change to ' + today);
      if(selectedSemester === 'Spring') 
      {
        today.setMonth(4,30);
        return today;
      } 
      else if (selectedSemester === 'Summer') 
      {
        today.setMonth(7,10);
        return today;
      }
      else
      {
        today.setMonth(11,30);
        return today;
      }

    };

    //added course to professor's createdcourse list
    $scope.addtoCreateCourseList = function(courseID){

      var professor = new Users(Authentication.user);

      if(!$scope.isStudent()){
        professor.createdCourses.push(courseID);

        professor.$update(function(res){
          $scope.success = true;
          Authentication.user = res;
          console.log(Authentication.user + 'course add to the list');
        }, function(errorRes){
          $scope.error = errorRes.data.message;
        });
      }
      else
      {
        console.log('student cannot create course!');
      }

    };


    // Create new Course
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'courseForm');

        return false;
      }

      console.log('this year is ' + this.year);
      // check if date semester is vaild
      if($scope.isCorrectDate(this.semester,this.year)) {
          // Create new Course object
        var course = new Courses({
          name: this.name,
          number: this.number,
          passcode: this.passcode,
          year: this.year,
          semester: this.semester,
          endDate: $scope.findendDate(this.semester,this.year)  //need to write a function to find it.
        });
        // Redirect after save
        course.$save(function (response) {
          $location.path('courses/' + response._id);

          // Clear form fields
          $scope.name = '';
          $scope.number = '';
          $scope.passcode = '';
          $scope.year = '';
          $scope.semester = '';
          $scope.endDate = '';

          $scope.addtoCreateCourseList(response._id);
        }, function (errorResponse) {
          $scope.error = errorResponse.data.message;
        });
        

      }
      else{
        return false;
      }
    };
      /*
        // Create new Course object
      var course = new Courses({
        name: this.name,
        number: this.number,
        passcode: this.passcode
       //   year: this.year;
       //   semester: this.semester;
         // endDate: this.endDate;  //need to write a function to find it.
      });
      // Redirect after save
      course.$save(function (response) {
        $location.path('courses/' + response._id);
        //console.log(course.professor);

        // Clear form fields
        $scope.name = '';
        $scope.number = '';
        $scope.passcode = '';
      //  $scope.year = '';
      //  $scope.semester = '';
      //  $scope.endDate = '';

        $scope.addtoCreateCourseList(response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      
    };
*/
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
      $scope.courses = Courses.query();

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

      console.log($scope.passcode);
      console.log($scope.course.passcode);

      if($scope.passcode !== $scope.course.passcode){
        console.log('Wrong passcode');
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

    // Check to see if a course has already been enrolled.

    $scope.isCourseEnrolled = function(enrolledCourseId){

      //var student = new Users(Authentication.user);
      var user = $scope.authentication.user;

      if(user.enrolledCourses.indexOf(enrolledCourseId) === -1)
      {
        console.log('course not enrolled!');
        return false;
      }
      else
      {
        console.log('course enrolled!');
        return true;
      }
      
    };

    //check if this course is created by one user
    $scope.isCourseCreated = function(createdCourseId){

      var user = $scope.authentication.user;
      if($scope.isProf())
      {
        //if(user.createdCourses.indexOf(createdCourseId) === -1)

        for(var i = 0; i < user.createdCourses.length; i++)
        {
          console.log('length is ' + user.createdCourses.length);
          console.log('i is ' + i);
          if(user.createdCourses[i] === createdCourseId){
            console.log(user.createdCourses[i]);
            console.log(createdCourseId);
            console.log('it is my course.');
            return true;
          }
          
        }
        
      }
      else
      {
        console.log('I am not a professor');
        return false;
      }
      
    };

  


    //Returns the number of students enrolled in a class
   // $scope.findNumStudents = function(courseID){
    //  var allUsers = Users.query();

    //Returns the number of students enrolled in a class
   // $scope.findNumStudents = function(courseID){
    //  var allUsers = Users.query();

      /*
      var numStudentsEnrolled = 0;

      for(var i = 0; i < allUsers.length; i++){
        if(allUsers[i].enrolledCourses.indexOf(courseID) !== -1)
          numStudentsEnrolled++;
      }

      $scope.numEnrolled = numStudentsEnrolled;

      console.log($scope.numEnrolled);*/

    //};



    /* TODO: delete enrolled course from user if the course if removed by admin from database */

  }
]);
