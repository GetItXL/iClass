'use strict';

// Setting up route
angular.module('core.professor.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('professor', {
        abstract: true,
        url: '/professordashboard',
       // template: '<ui-view/>',
        templateUrl: 'modules/users/client/views/dashboard/professor-dashboard.client.view.html',
        data: {
          roles: ['professor']
        }
      });
  }
]);
