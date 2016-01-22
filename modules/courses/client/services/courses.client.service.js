'use strict';

var myModule = angular.module('courses');


//Courses service used for communicating with the courses REST endpoints
myModule.factory('Courses', ['$resource',
  function ($resource) {
    return $resource('api/courses/:courseId', {
      courseId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
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
