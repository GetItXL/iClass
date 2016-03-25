'use strict';

var myModule = angular.module('courses');


//Courses service used for communicating with the courses REST endpoints
myModule.factory('Courses', ['$resource',
  function ($resource) {
    return{
        All: $resource('api/courses/:courseId', {
                      courseId: '@_id'
                  }, {
                      update: {
                          method: 'PUT'
                      }
                  }),

        Student: $resource('/api/courses/enrolledStu/:courseId', {
                    courseId: '@_id'
                }, {
                    updateEnrolledStudent: {
                        method: 'PUT'
                    }
                })
    };
  }
]);


//Pass values b\w course and quiz
myModule.factory('CourseInfoFactory', function(){

  var service = {};
  var courseID = '';

  service.getCourseID = function(){
    return courseID;
  };

  service.setCourseID = function(currentCourseID){
    courseID = currentCourseID;
  };

  return service;

});

myModule.factory('CoursePasscodeFactory', function($rootScope){

    var service = {};

    service.correctPasscode = false;

    service.prepBroadcast = function(passcodeError) {
        this.correctPasscode = passcodeError;
        this.broadcastItem();
    };

    service.broadcastItem = function() {
      $rootScope.$broadcast('handleBroadcast');
    };

    return service;

});

// myModule.directive('mydirective', function(){
//   return{
//     restrict: 'EA',
//     replace: true,
//     scope: {
//       ngModel: '='
//     },
//     template: '<button popover-trigger="mouseenter" popover-placement="right" uib-popover="hahaha">Popover</button>',
//     link: function(scope, iElement, iAttrs) {
//       }
//   };
// });

// myModule.directive('mydirectiveuib', function(){
//   return{
//     restrict: 'EA',
//     replace: true,
//     scope: {
//       ngModel: '='
//     },
//     template: '<a href="#" uib-popover-template="\'remove-course.client.view.html\'" popover-placement="right" popover-trigger="mouseenter">Popover</a>',
//     link: function(scope, iElement, iAttrs) {
//     }
//   };
// });