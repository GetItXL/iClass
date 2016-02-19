'use strict';

// Courses controller
angular.module('courses').controller('CoursesListController', ['$state', 'Users','Authentication', '$scope', '$filter', 'Courses', '$modal', '$log', 'CoursePasscodeFactory', 
  function ($state, Users, Authentication, $scope, $filter, Courses, $modal, $log, CoursePasscodeFactory) {
    $scope.authentication = Authentication;


    Courses.All.query(function (data) {
      $scope.courses = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 3;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.courses, {
        $: $scope.search //need to add | filter:{active: true} to here, look for syntax.
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };


  /*********  modal window update course *******************/

    $scope.modalUpdate = function(size, selectedCourse) {


      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard :false,
        templateUrl: 'modules/courses/client/views/edit-course.client.view.html',
        controller: ModalUpdateCtrl,
        size: size,

        resolve: {
          course: function() {
            return selectedCourse;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalUpdateCtrl = function($scope, $modalInstance, course) {
        $scope.course = course;
        //console.log("I am update modal window " + Authentication.user.displayName);
        $scope.ok = function() {
            $modalInstance.close($scope.course);
            $state.reload();
    
        };


        $scope.cancel = function() {
          $modalInstance.dismiss('cancel');
          $state.reload();
        };
    };

    /*********  modal window remove course *******************/

    $scope.modalRemove = function(size, selectedCourse) {

      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard :false,
        templateUrl: 'modules/courses/client/views/remove-course.client.view.html',
        controller: ModalRemoveCtrl,
        size: size,
        resolve: {
          course: function() {
            return selectedCourse;
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

    var ModalRemoveCtrl = function($scope, $modalInstance, course) {
      $scope.course = course;

      $scope.ok = function() {
        //console.log('user click ok');
        $modalInstance.close($scope.course);
        $state.reload();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        //$state.reload();
      };
    };

    /*************  modal window join course *******************/
    
    $scope.modalJoin = function(size, selectedCourse) {
     

      var modalInstance = $modal.open({
        backdrop : 'static',
        keyboard : false,
        templateUrl: 'modules/courses/client/views/join-courses.client.view.html',
        controller: ModalJoinCtrl,
        size: size,
        resolve: {
          course: function() {
            return selectedCourse;
          }
        }
      });

      modalInstance.result.then(function(selectedItem) {
        $scope.selected = selectedItem;
      }, function() {
       // console.log('Modal dismissed at: ' + new Date());
       // $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalJoinCtrl = function($scope, $modalInstance, course, CoursePasscodeFactory) {
      $scope.course = course;

      $scope.ok = function() {
       // console.log('checking passcode error');
          $scope.$watch('handleBroadcast', function() {
             // console.log('checking passcode error');
              $scope.correctPasscode = CoursePasscodeFactory.correctPasscode;
              var passcodeNoError = $scope.correctPasscode;
             //  console.log('checking passcode error ' + passcodeNoError);
              if(passcodeNoError) {
                  $modalInstance.close($scope.course);
                  //$state.reload();

                //  console.log('passcode correct');
              }
              else
                 console.log('passcode error');
            //console.log('end of checking passcode error');
          });
           //console.log('there');
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        //$state.reload();
      };
    };
    

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

    // $scope.joinCourse = function(courseID){

    //   var student = new Users(Authentication.user);

    //   console.log($scope.passcode);
    //   console.log($scope.course.passcode);

    //   if($scope.passcode !== $scope.course.passcode){
    //     console.log('Wrong passcode');
    //   }else if(student.enrolledCourses.indexOf(courseID) === -1){//check if student is already enrolled in the course
    //     student.enrolledCourses.push(courseID);

    //     student.$update(function(res){
    //       $scope.success = true;
    //       Authentication.user = res;
    //       //$scope.authentication = Authenticaton; ?

    //       //$location.path('studentdashboard');

    //       console.log(Authentication.user);
    //     }, function(errorResponse){
    //       $scope.error = errorResponse.data.message;
    //     });
    //   }else{
    //     console.log('already enrolled in this class');

    //     /* TODO: display message to user */
    //   }
    // };
    

    // Check to see if a course has already been enrolled.
    $scope.isCourseEnrolled = function(enrolledCourseId){

      //var student = new Users(Authentication.user);
       //console.log('enrolled:'+enrolledCourseId);
      var user = $scope.authentication.user;

      if(user.enrolledCourses.indexOf(enrolledCourseId) === -1)
      {
      //  console.log('course not enrolled!');
        return false;
      }
      else
      {
      //  console.log('course enrolled!');
        return true;
      }
    };

    //check if this course is created by one user
    $scope.isCourseCreated = function(createdCourseId){

      //console.log('isCourseCreated function Users created course: ' + $scope.authentication.user.createdCourses);
     // console.log('isCourseCreated function Users created course');

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
        //console.log('I am not a professor');
        return false;
      }
    };

  }
]);
