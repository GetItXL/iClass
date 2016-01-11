'use strict';

// Setting up route
angular.module('courses').config(['$stateProvider',
  function ($stateProvider) {
    // Courses state routing
    $stateProvider
      .state('courses', {
        abstract: true,
        url: '/courses',
        template: '<ui-view/>'
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
          roles: ['user', 'admin', 'professor'] //only user/professor and admins are allowed to manipulate course
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
          roles: ['user', 'admin', 'professor']
        }
      });
  }
]);
