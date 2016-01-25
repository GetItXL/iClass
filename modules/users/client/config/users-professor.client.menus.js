'use strict';

// Configuring the Articles module
angular.module('users.professor').run(['Menus',
  function (Menus) {
    Menus.addSubMenuItem('topbar', 'professor', {
      title: 'Dashboard',
      state: 'professor.dashboard'
    });
  }
]);