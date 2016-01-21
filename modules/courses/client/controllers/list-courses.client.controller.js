'use strict';

// Courses controller
angular.module('courses').controller('CoursesListController', ['$state', 'Users','Authentication', '$scope', '$filter', 'Courses', '$modal', '$log',
  function ($state, Users, Authentication, $scope, $filter, Courses, $modal, $log) {
    


    Courses.query(function (data) {
      $scope.courses = data;
      $scope.buildPager();
    });

    $scope.buildPager = function () {
      $scope.pagedItems = [];
      $scope.itemsPerPage = 2;
      $scope.currentPage = 1;
      $scope.figureOutItemsToDisplay();
    };

    $scope.figureOutItemsToDisplay = function () {
      $scope.filteredItems = $filter('filter')($scope.courses, {
        $: $scope.search
      });
      $scope.filterLength = $scope.filteredItems.length;
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage);
      var end = begin + $scope.itemsPerPage;
      $scope.pagedItems = $scope.filteredItems.slice(begin, end);
    };

    $scope.pageChanged = function () {
      $scope.figureOutItemsToDisplay();
    };

        // Open a modal window to update a single course record
    $scope.modalUpdate = function(size, selectedCourse) {

      var modalInstance = $modal.open({
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

      $scope.ok = function() {
        $modalInstance.close($scope.course);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $state.reload();
      };
    };

        // Open a modal window to Remove a single course record
    $scope.modalRemove = function(size, selectedCourse) {

      var modalInstance = $modal.open({
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
        $log.info('Modal dismissed at: ' + new Date());
      });
    };

    var ModalRemoveCtrl = function($scope, $modalInstance, course) {
      $scope.course = course;

      $scope.ok = function() {
        $modalInstance.close($scope.course);
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
        $state.reload();
      };
    };

    
  //   // Open a modal window to View a single course record
  //   $scope.modalView = function(size, selectedCourse) {

  //           var modalFlag = true;

  //           if (Authentication.user) {
  //               if (Authentication.user.roles.indexOf('instructor') > -1 ||
  //                   Authentication.user.roles.indexOf('admin') > -1) {
  //                   modalFlag = false;
  //                   $location.path('course/' + selectedCourse._id);
  //               } else {
  //                   for (var i = 0; i < Authentication.user.enrolledCourses.length; i++) {
  //                       if (Authentication.user.enrolledCourses[i].courseId === selectedCourse._id) {
  //                           modalFlag = false;
  //                           $location.path('course/' + selectedCourse._id);
  //                       }
  //                   }
  //               }
  //           }
  //           if (modalFlag) {
  //               var modalInstance = $modal.open({
  //                   templateUrl: 'modules/courses/client/views/view-course.client.view.html',
  //                   controller: ModalViewCtrl,
  //                   size: size,
  //                   resolve: {
  //                       course: function() {
  //                           return selectedCourse;
  //                       }
  //                   }
  //               });

  //               modalInstance.result.then(function(selectedItem) {
  //                   $scope.selected = selectedItem;
  //               }, function() {
  //                   $log.info('Modal dismissed at: ' + new Date());
  //               });
  //           }
  //   };

  //   var ModalViewCtrl = function($scope, $modalInstance, course) {
  //           $scope.course = course;

  //           $scope.ok = function() {
  //               $modalInstance.close($scope.course);
  //           };

  //           $scope.cancel = function() {
  //               $modalInstance.dismiss('cancel');
  //           };
  //       };

  }
]);
