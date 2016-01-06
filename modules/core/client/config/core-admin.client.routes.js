'use strict';

// Setting up route
angular.module('core.admin.routes').config(['$stateProvider',
  function ($stateProvider) {
    $stateProvider
      .state('admin', {
        abstract: true,
        url: '/admindashboard',
        template: '<ui-view/>',
        //templateUrl: 'modules/users/client/views/dashboard/admin-dashboard.client.view.html',
        data: {
          roles: ['admin']
        }
      });
  }
]);
