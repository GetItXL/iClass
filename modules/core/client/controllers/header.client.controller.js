'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });

    $scope.isAdmin = function(){
      return ($scope.authentication.user.roles.indexOf('admin') > -1);
    };

    $scope.isProf = function(){
      return ($scope.authentication.user.roles.indexOf('professor') > -1);
    };

    $scope.isStudent = function(){
      return ($scope.authentication.user.roles.indexOf('user') > -1);
    };

    $scope.initTopHeader = function() {

    
      angular.element('.fa-bars').ready(function () {
        if (angular.element('#sidebar > ul').is(":visible") === true) {
            angular.element('#main-content').css({
                'margin-left': '0px'    
            });
            angular.element('#sidebar').css({
                'margin-left': '-210px'
            });
            angular.element('#sidebar > ul').hide();
            angular.element("#container").addClass("sidebar-closed");
        } else {
            angular.element('#main-content').css({
                'margin-left': '210px'
            });
            angular.element('#sidebar > ul').show();
            angular.element('#sidebar').css({
                'margin-left': '0'
            });
            angular.element("#container").removeClass("sidebar-closed");
        }
      });
    };
    
    $scope.initLeftSidebar = function() {
      if(!$scope.authentication.user){
            angular.element('#main-content').css({
                'margin-left': '0px'
            });
            angular.element('#sidebar').css({
                'margin-left': '-210px'
            });
      }
    };


  
        // $(document).ready(function () {
        // var unique_id = $.gritter.add({
        //     // (string | mandatory) the heading of the notification
        //     title: 'Welcome to Dashgum!',
        //     // (string | mandatory) the text inside the notification
        //     text: 'Hover me to enable the Close Button. You can hide the left sidebar clicking on the button next to the logo. Free version for <a href="http://blacktie.co" target="_blank" style="color:#ffd777">BlackTie.co</a>.',
        //     // (string | optional) the image to display on the left
        //     image: 'assets/img/ui-sam.jpg',
        //     // (bool | optional) if you want it to fade out on its own or just sit there
        //     sticky: true,
        //     // (int | optional) the time you want it to be alive for before fading out
        //     time: '',
        //     // (string | optional) the class name you want to apply to that specific message
        //     class_name: 'my-sticky-class'
        // });

        // return false;
        // });

        // $(document).ready(function () {
        //     $("#date-popover").popover({html: true, trigger: "manual"});
        //     $("#date-popover").hide();
        //     $("#date-popover").click(function (e) {
        //         $(this).hide();
        //     });
        
        //     $("#my-calendar").zabuto_calendar({
        //         action: function () {
        //             return myDateFunction(this.id, false);
        //         },
        //         action_nav: function () {
        //             return myNavFunction(this.id);
        //         },
        //         ajax: {
        //             url: "show_data.php?action=1",
        //             modal: true
        //         },
        //         legend: [
        //             {type: "text", label: "Special event", badge: "00"},
        //             {type: "block", label: "Regular event", }
        //         ]
        //     });
        // });
        
        
        // function myNavFunction(id) {
        //     $("#date-popover").hide();
        //     var nav = $("#" + id).data("navigation");
        //     var to = $("#" + id).data("to");
        //     console.log('nav ' + nav + ' to: ' + to.month + '/' + to.year);
        // }
 
  

  }
]);
