'use strict';

//Quizzes service used for communicating with the quizzes REST endpoints
angular.module('quizzes').factory('Quizzes', ['$resource',
  function ($resource) {
    return $resource('api/quizzes/:quizId', {
      quizId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
