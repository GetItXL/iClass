'use strict';

// Configuring the Quizzes module
angular.module('quizzes').run(['Menus',
  function (Menus) {
    // Add the quizzes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Quizzes',
      state: 'quizzes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'quizzes', {
      title: 'List Quizzes',
      state: 'quizzes.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'quizzes', {
      title: 'Create Quizzes',
      state: 'quizzes.create',
      roles: ['user']
    });
  }
]);
