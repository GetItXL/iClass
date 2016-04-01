'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();
    //$scope.popoverMsgforEmail = PasswordValidator.getPopoverMsgforEmail();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;

   // If user is signed in then redirect back dashboard
    if ($scope.authentication.user) {
      //$location.path('/');
      if($scope.authentication.user.roles.indexOf('admin') > -1)
          $location.path('/admindashboard');
      else if($scope.authentication.user.roles.indexOf('professor') > -1)
          $location.path('/professordashboard');
      else 
          $location.path('/studentdashboard');
    }
  
  // If user is not signed in then redirect back to signin page
    // if (!$scope.authentication.user) {
    //     $location.path('/authentication/signin');
    // }

    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {

        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        console.log('who am i?' + $scope.authentication.user);

        angular.element('#main-content').css({
                'margin-left': '210px'
        });
        // And redirect to the previous or home page
        //$state.go($state.previous.state.name || 'home', $state.previous.params);
        if($scope.authentication.user.roles.indexOf('admin') > -1)
          $location.path('/admindashboard');
        else if($scope.authentication.user.roles.indexOf('professor') > -1)
          $location.path('/professordashboard');
        else 
          $location.path('/studentdashboard');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        //$state.go($state.previous.state.name || 'home', $state.previous.params);

        // and redirect to the pdashboard page
         angular.element('#main-content').css({
                'margin-left': '210px'
            });
        if($scope.authentication.user.roles.indexOf('admin') > -1)
          $location.path('/admindashboard');
        else if($scope.authentication.user.roles.indexOf('professor') > -1)
          $location.path('/professordashboard');
        else 
          $location.path('/studentdashboard');
       
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };
  }
]);
