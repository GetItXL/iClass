'use strict';

// Setting up route
angular.module('quizzes').config(['$stateProvider',
  function ($stateProvider) {
    // Quizzes state routing
    $stateProvider
      .state('quizzes', {
        abstract: true,
        url: '/quizzes',
        template: '<ui-view/>'
      })
      .state('quizzes.list', {
        url: '',
        templateUrl: 'modules/quizzes/client/views/list-quizzes.client.view.html'
      })
      .state('quizzes.create', {
        url: '/create',
        templateUrl: 'modules/quizzes/client/views/create-quiz.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('quizzes.view', {
        url: '/:quizId',
        templateUrl: 'modules/quizzes/client/views/view-quiz.client.view.html'
      })
      .state('quizzes.edit', {
        url: '/:quizId/edit',
        templateUrl: 'modules/quizzes/client/views/edit-quiz.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);
