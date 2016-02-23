'use strict';

// Setting up route
angular.module('users.professor.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('professor.dashboard', {
        url: '/professordashboard',
        templateUrl: 'modules/users/client/views/dashboard/professor-dashboard.client.view.html',
        data: {
            roles: ['professor']
        }
      })
      // .state('professor.user', {
      //   url: '/users/:userId',
      //   templateUrl: 'modules/users/client/views/admin/view-user.client.view.html',
      //   controller: 'UserController',
      //   resolve: {
      //     userResolve: ['$stateParams', 'Professor', function ($stateParams, Admin) {
      //       return Professor.get({
      //         userId: $stateParams.userId
      //       });
      //     }]
      //   }
      // })
      // .state('professor.user-edit', {
      //   url: '/users/:userId/edit',
      //   templateUrl: 'modules/users/client/views/admin/edit-user.client.view.html',
      //   controller: 'UserController',
      //   resolve: {
      //     userResolve: ['$stateParams', 'Admin', function ($stateParams, Admin) {
      //       return Professor.get({
      //         userId: $stateParams.userId
      //       });
      //     }]
      //   }
      // })
      ;
  }
]);
