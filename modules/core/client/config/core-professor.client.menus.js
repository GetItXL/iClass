'use strict';

angular.module('core.professor').run(['Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', {
      title: 'Professor',
      state: 'professor',
      type: 'dropdown',
      roles: ['professor']
    });
  }
]);