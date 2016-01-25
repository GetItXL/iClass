'use strict';

// Configuring the Quizzes module
angular.module('quizzes').run(['Menus',
  function (Menus) {
    // Add the quizzes dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Quizzes',
      state: 'quizzes',
      type: 'dropdown',
      roles: ['admin, user, professor']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'quizzes', {
      title: 'List Quizzes',
      state: 'quizzes.list',
      roles: ['admin, user, professor']
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'quizzes', {
      title: 'Create Quizzes',
      state: 'quizzes.create',
      roles: ['admin'] //TODO: get rid of this after making course clickable (enter create quiz page) on admin panel */
    });
  }
]);
