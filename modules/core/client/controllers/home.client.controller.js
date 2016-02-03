'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
     

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

    $scope.isAdmin = function(){
    return ($scope.authentication.user.roles.indexOf('admin') > -1);
    };

    $scope.isProf = function(){
      return ($scope.authentication.user.roles.indexOf('professor') > -1);
    };

    $scope.isStudent = function(){
      return ($scope.authentication.user.roles.indexOf('user') > -1);
    };
// for calendar feature 
        angular.element(document).ready(function () {
            angular.element("#date-popover").popover({html: true, trigger: "manual"});
            angular.element("#date-popover").hide();
            angular.element("#date-popover").click(function (e) {
                angular.element(this).hide();
            });

            var url = "assets/js/zabuto_calendar.js";
			angular.element.getScript( url, function() {
			  	angular.element("#my-calendar").zabuto_calendar({
		            action: function () {
		               //return myDateFunction(this.id, false);
		            },
		            action_nav: function () {
		               return myNavFunction(this.id);
		            },
		            ajax: {
		                url: "show_data.php?action=1",
		                modal: true
		            },
		            legend: [
		                {type: "text", label: "Special event", badge: "00"},
		                {type: "block", label: "Regular event", }
		            ]
	            });


			 });
		});
        
	        
	        // angular.element("#my-calendar").zabuto_calendar({
	        //     action: function () {
	        //        return myDateFunction(this.id, false);
	        //     },
	        //     action_nav: function () {
	        //        return myNavFunction(this.id);
	        //     },
	        //     ajax: {
	        //         url: "show_data.php?action=1",
	        //         modal: true
	        //     },
	        //     legend: [
	        //         {type: "text", label: "Special event", badge: "00"},
	        //         {type: "block", label: "Regular event", }
	        //     ]
         //    });
        // });
             
        function myNavFunction(id) {
            angular.element("#date-popover").hide();
            var nav = angular.element("#" + id).data("navigation");
            var to = angular.element("#" + id).data("to");
            console.log('nav ' + nav + ' to: ' + to.month + '/' + to.year);
        }


// for menu dropdown    
        // angular.element(function() {
        // $scope.subMenu = function() {
		    angular.element('#nav-accordion').dcAccordion({
		        eventType: 'click',
		        autoClose: true,
		        saveState: true,
		        disableLink: true,
		        speed: 'slow',
		        showCount: false,
		        autoExpand: true,
		//        cookie: 'dcjq-accordion-1',
		        classExpand: 'dcjq-current-parent'
		    });

		  //  console.log('in sss dcAccordion');


		//});
		//}; 



  }
]);


// var url = "https://code.jquery.com/color/jquery.color.js";
// $.getScript( url, function() {
//   $( "#go" ).click(function() {
//     $( ".block" )
//       .animate({
//         backgroundColor: "rgb(255, 180, 180)"
//       }, 1000 )
//       .delay( 500 )
//       .animate({
//         backgroundColor: "olive"
//       }, 1000 )
//       .delay( 500 )
//       .animate({
//         backgroundColor: "#00f"
//       }, 1000 );
//   });
