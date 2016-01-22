'use strict';

// Setting up route
angular.module('courses').config(['$stateProvider',
  function ($stateProvider) {
    // Courses state routing
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>',
      })
      .state('courses.list', {
        url: '',
        templateUrl: 'modules/courses/client/views/list-courses.client.view.html',
        data: {
          roles: ['user', 'admin', 'professor'] 
        }
      })
      .state('courses.create', {
        url: '/create',
        templateUrl: 'modules/courses/client/views/create-course.client.view.html',
        data: {
          roles: ['admin', 'professor'] //only user/professor and admins are allowed to manipulate course
        }
      })
      .state('courses.remove', {
        url: '/:courseId/remove',
        templateUrl: 'modules/courses/client/views/remove-course.client.view.html',
        data: {
          roles: ['admin'] //only admin be able to remove course
        }
      })
      .state('courses.join', {
        url: '/:courseId/join',
        templateUrl: 'modules/courses/client/views/join-courses.client.view.html',
        data: {
          roles: ['user'] //only user be able to join course
        }
      })
      .state('courses.view', {
        url: '/:courseId',
        templateUrl: 'modules/courses/client/views/view-course.client.view.html',
        data: {
          roles: ['user', 'admin', 'professor'] //only user/professor and admins are allowed to manipulate course
        }
      })
      .state('courses.edit', {
        url: '/:courseId/edit',
        templateUrl: 'modules/courses/client/views/edit-course.client.view.html',
        data: {
          roles: ['admin', 'professor']
        }
      });
  }
]);
