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
        templateUrl: 'modules/quizzes/client/views/list-quizzes.client.view.html',
        data: {
          roles: ['user', 'professor', 'admin']
        }
      })
      .state('quizzes.create', {
        url: '/create',
        templateUrl: 'modules/quizzes/client/views/create-quiz.client.view.html',
        data: {
          roles: ['professor', 'admin']
        }
      })
      .state('quizzes.view', {
        url: '/:quizId',
        templateUrl: 'modules/quizzes/client/views/view-quiz.client.view.html',
        data: {
          roles: ['professor', 'admin']
        }
      })
      .state('quizzes.close', {
        url: '/close/:quizId',
        templateUrl: 'modules/quizzes/client/views/close-quiz.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('quizzes.open', {
        url: '/open/:quizId',
        templateUrl: 'modules/quizzes/client/views/open-quiz.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('quizzes.edit', {
        url: '/edit/:quizId',
        templateUrl: 'modules/quizzes/client/views/edit-quiz.client.view.html',
        data: {
          roles: ['professor', 'admin']
        }
      })

    ;
  }
]);
