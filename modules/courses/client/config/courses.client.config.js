'use strict';

// Configuring the Courses module
angular.module('courses').run(['Menus',
  function (Menus) {
    // Add the courses dropdown item
    Menus.addMenuItem('topbar', {
      title: 'Courses',
      state: 'courses',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'List Courses',
      state: 'courses.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'courses', {
      title: 'Create Courses',
      state: 'courses.create',
      roles: ['user']
    });
  }
]);
