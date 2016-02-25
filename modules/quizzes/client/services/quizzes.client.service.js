'use strict';

var myModule = angular.module('quizzes');

//Quizzes service used for communicating with the quizzes REST endpoints
myModule.factory('Quizzes', ['$resource',
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


//Quizzes service used for communicating with the submit quiz REST endpoints
myModule.factory('SubmitQuiz', ['$resource',
  function ($resource) {
    return $resource('api/quizzes/submit/:quizId', {
      quizId: '@_id'
    }, {
      submit: {
        method: 'PUT'
      }
    });
  }
]);

//Quizzes service used for getting quiz object and callback function
myModule.factory('getQuizObject', function ($q, $http) {
      // return {
      //     getQuizObject: function() {
      //         return $http.get('api/quizzes/:quizId')
      //                 .then(function(response) {
      //                     if(typeof response.data === 'object') {
      //                       return response.data;
      //                     } else {
      //                       return $q.reject(response.data);
      //                     }
      //                 }, function(response) {
      //                     return $q.reject(response.data);
      //                 });
      //     }
      //   };
      
  //     var getQuiz = function() {
  //         var deferred  = $q.defer();
  //        function($resource) {
  //           return
  //        }
  //     };

  //     return {
  //       getQuiz: getQuiz
  //     };
  // }
  return false;
});
