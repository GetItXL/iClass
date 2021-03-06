'use strict';

// Courses controller
angular.module('courses').controller('CoursesController', ['$scope', '$stateParams', 'Authentication', 'Courses', 'Users', '$http', '$filter', '$location', 'CourseInfoFactory', 'Quizzes', 'CoursePasscodeFactory', 'Socket',
  function ($scope, $stateParams, Authentication, Courses, Users, $http, $filter, $location, CourseInfoFactory, Quizzes, CoursePasscodeFactory, Socket) {
    //Courses is refering to the service on the client side

    $scope.authentication = Authentication;
   
  /****************    setting for start and end course date  ***************/

    $scope.semesters = ['Spring','Summer','Fall'];
    $scope.years = ['2016','2017','2018'];
   // $scope.selectedItem = $scope.semesters[0];

    $scope.isCorrectDate = function(selectedSemester,selectedYear)
    {
        var today = new Date(); 
        var thisYear = today.getFullYear(); 
        var thisMonth = today.getMonth(); //January is 0, February is 1, and so on.
        console.log(today);
        console.log(thisYear + 'select year is ' + selectedYear);
        console.log(thisMonth + 'selected semester is ' + selectedSemester);

        if(selectedYear > thisYear)
        {
            return true;
        }
        else if(selectedYear < thisYear)
        {
            console.log(selectedYear + ' is invaild');
            return false;
        }
        else
        {
            if(selectedSemester === 'Spring' && thisMonth >'4')   //Jan - March 0-4
            {
              console.log(selectedSemester);
              return false;
            }
            else if(selectedSemester === 'Summer' && thisMonth > '7') //March - Aug 4-7
            {
              console.log(selectedSemester);
              return false;
            }
            else if(selectedSemester === 'Fall' && thisMonth < '7') //Aug- December 7-11
            {
              console.log(selectedSemester + ' is invaild');    //need to add notification to user!!!
              return false;
            }
            else
            {
              console.log(selectedSemester + ' true');
              return true;
            }
        }
    };

    //added course to professor's createdcourse list
    function addtoCreateCourseList(courseID) {

        var professor = new Users(Authentication.user);

        if(!$scope.isStudent()){
          professor.createdCourses.push(courseID);

          professor.$update(function(res){
            $scope.success = true;
            Authentication.user = res;
            console.log(Authentication.user + 'course add to the list');
          }, function(errorRes){
            $scope.error = errorRes.data.message;
          });
        }
        else
        {
          console.log('student cannot create course!');
        }

    } 



    // Create new Course
    $scope.create = function (isValid) {
        $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'courseForm');

            return false;
        }

        console.log('this year is ' + this.year);



        // check if date semester is vaild
        if($scope.isCorrectDate(this.semester,this.year)) {
            // Create new Course object
          var course = new Courses.All({
            name: this.name,
            number: this.number,
            passcode: this.passcode,
            year: this.year,
            semester: this.semester,
            //endDate: $scope.findendDate(this.semester,this.year)  //end date of the semester
            active: this.active,
            enrolledStudents: []
          });
          // Redirect after save
          course.$save(function (response) {
            $location.path('courses/' + response._id);

            // Clear form fields
            $scope.name = '';
            $scope.number = '';
            $scope.passcode = '';
            $scope.year = '';
            $scope.semester = '';
            //$scope.endDate = '';

            addtoCreateCourseList(response._id);
            console.log('Users created course:' + $scope.authentication.user.createdCourses);
          }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
          });
        }
        else{
          return false;
        }
    };

    // Remove existing Course
    $scope.remove = function (course) {

      if (course) {
          removeEnrolledCourseFromStudent(course._id);
          course.$remove();

          for (var i in $scope.courses) {
              if ($scope.courses[i] === course) {
                $scope.courses.splice(i, 1);
              }
          }
      } else {
        removeEnrolledCourseFromStudent($scope.course._id);
        $scope.course.$remove(function () {
          $location.path('courses'); //this redirects us back to the list course page
        });
      }
    };


    function removeEnrolledCourseFromStudent(courseID) {

      var allUsers = Users.query(function(res) {

        for(var i = 0; i < allUsers.length; i++){
          //Check if there is anything to be removed
          if(allUsers[i].createdCourses.indexOf(courseID) !== -1) {//If courseID exists, remove it. admin/prof
            allUsers[i].createdCourses.splice(allUsers[i].createdCourses.indexOf(courseID), 1);
            updateDatabaseAfterRemoveCourse(allUsers[i]);
          }
          else if (allUsers[i].enrolledCourses.indexOf(courseID) !== -1){ //student
            allUsers[i].enrolledCourses.splice(allUsers[i].enrolledCourses.indexOf(courseID), 1);
            updateDatabaseAfterRemoveCourse(allUsers[i]);
          }
        }

      }); //end querying users

    }


    function updateDatabaseAfterRemoveCourse(user){

      //console.log('updating user: ' + user.displayName);

      //update user model in database
      user.$update(function(res){
        $scope.success = true;

      }, function(errorResponse){
        $scope.error = errorResponse.data.message;
      });
    }


    // Update existing Course
    $scope.update = function (isValid) {
      //  $scope.error = null;

        if (!isValid) {
            $scope.$broadcast('show-errors-check-validity', 'courseForm');
            console.log('error update course'); 
            return false;
        }

        var course = $scope.course;

        course.$update(function () {
            //$location.path('courses/' + course._id);
        }, function (errorResponse) {
            $scope.error = errorResponse.data.message;
        });
    };

    // Find a list of Courses
    $scope.find = function () {
        $scope.courses = Courses.All.query();
    };

    // Find existing Course
    $scope.findOne = function () {
        $scope.course = Courses.All.get({
            courseId: $stateParams.courseId
        }, function(){

            if($scope.isStudent()){
                getQuizScoresInClass();
                  studentAvg();
            }

        });

        //      console.log('number of student is ' + $scope.course.year);

      //but $scope.course is undefined here.... because
    /* Since querying the database is a non-blocking operation,
     you cannot expect the function call to return the value from the database immediately.
     Try passing in a callback instead
     (see updateCourseModelUponJoin function down below)
     */

      //page flow: enter course page -> create quiz
        CourseInfoFactory.setCourseID($stateParams.courseId);
    };


    /*********************** Check current user role ********************/
    $scope.isAdmin = function(){
        return ($scope.authentication.user.roles.indexOf('admin') > -1);
    };

    $scope.isProf = function(){
        return ($scope.authentication.user.roles.indexOf('professor') > -1);
    };

    $scope.isStudent = function(){
        return ($scope.authentication.user.roles.indexOf('user') > -1);
    };
    /*******************************************************************/


 /*********** record number of students ***********/


    $scope.correctPasscode = false; 
    
    $scope.joinCourse = function(courseID,course){
        $scope.error = null;
        var passcodeError = $scope.correctPasscode;

      //$scope.course is defined here...

        var student = new Users(Authentication.user);


        console.log('pass1' + $scope.passcode);
        console.log('pass2' + $scope.course.passcode);

        if($scope.passcode !== $scope.course.passcode){
        //  console.log('Wrong passcode');
            $scope.error = 'passcode is not correct!';

        }else if(student.enrolledCourses.indexOf(courseID) === -1){//check if student is already enrolled in the course
          
            passcodeError = true;    
            student.enrolledCourses.push(courseID);

            student.$update(function(res){
                $scope.success = true;
                Authentication.user = res;

                //update CourseModel's enrolledStudents as well
                updateCourseModelUponJoin(courseID, student._id);

                $location.path('studentdashboard');
            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });
        }else{
            console.log('already enrolled in this class');
        /* TODO: display message to user */
        }

      /* message notification */
        CoursePasscodeFactory.prepBroadcast(passcodeError);
     // console.log('end of the function');
      
    };


    function updateCourseModelUponJoin(courseID, enrolledStudentID){

        /* Why Courses.get() without callback function would give you "undefined"
        Since querying the database is a non-blocking operation,
        you cannot expect the function call to return the value from the database immediately.
        Try passing in a callback instead
         */

        //get the course joined
        var course = Courses.Student.get({
            courseId: courseID
        }, function(){ //callback function to ensure that this executes after database query has finished
            course.enrolledStudents.push(enrolledStudentID);

            //update user model in database
            course.$updateEnrolledStudent(function(res){
                $scope.success = true;

            }, function(errorResponse){
                $scope.error = errorResponse.data.message;
            });

        });


    }

    

    // // Check to see if a course has already been enrolled.
    // $scope.isCourseEnrolled = function(enrolledCourseId){

    //   //var student = new Users(Authentication.user);
    //   var user = $scope.authentication.user;

    //   if(user.enrolledCourses.indexOf(enrolledCourseId) === -1)
    //   {
    //     console.log('course not enrolled!');
    //     return false;
    //   }
    //   else
    //   {
    //     console.log('course enrolled!');
    //     return true;
    //   }
    // };

    // //check if this course is created by one user
    $scope.isCourseCreated = function(createdCourseId){

      console.log('Users created course: ' + $scope.authentication.user.createdCourses);
      var user = $scope.authentication.user;

      if($scope.isProf())
      {
        //if(user.createdCourses.indexOf(createdCourseId) === -1)
        for(var i = 0; i < user.createdCourses.length; i++)
        {
          // console.log('length is ' + user.createdCourses.length);
          // console.log('i is ' + i);
          if(user.createdCourses[i] === createdCourseId){
            console.log(user.createdCourses[i]);
            console.log(createdCourseId);
            //console.log('it is my course.');
            return true;
          } 
        }
      }
      else
      {
        //console.log('I am not a professor');
        return false;
      }
    };


/******************  active course list and in active course list functions ***********************/

//$scope.active = [ {'text': 'Active', 'active': true}, {'text': 'Deactive', 'active': false}];
    //$scope.checkActive = {active: true, deactive: false};
    $scope.checkActivation = [];
    $scope.switchStatu = "";
    // $scope.changeActiveState = function(value, key){

    // };

  
   
    $scope.isActive = function(course){
      if(course.active) {
        console.log('is active course now .........');
        $scope.checkActivation.push('activated');
        $scope.switchStatu = "switch-on";
      }  
      else {
        console.log('is deactive course now .........');
        $scope.checkActivation.push('deactive');
        $scope.switchStatu = "switch-off";
      }
    };

    $scope.switchOn = function(course){
        if($scope.switchStatu === "switch-off") {
          console.log(' switch onnnnnnnn');
            $scope.switchStatu = "switch-on";
            course.active = true;
        }
        else{
          console.log(' switch oofffff');
            $scope.switchStatu = "switch-off";
            course.active = false;
        }
    };




    /****** Finds all quizzes in a class *******/
    $scope.quizzesInCourse = [];
    $scope.figureOutNewQuiz = function () {
      

      var currentCourseId = CourseInfoFactory.getCourseID();
      var courseQuizzes = [];
      console.log("currentCourseId is " + currentCourseId);
      var quizzesInCourse = Quizzes.query(function(){

        for(var i = 0; i < quizzesInCourse.length; i++){
            if(quizzesInCourse[i].courseID === currentCourseId){
              courseQuizzes.push(quizzesInCourse[i]);
            }
        }
        $scope.quizzesInCourse = courseQuizzes;
        console.log("quizinCourse is " + $scope.quizzesInCourse );
         latestQuiz();
        
        if($scope.isStudent(findQuizTaken())){
            findQuizTaken();
          
        }
      });
     
    };

    $scope.newQuiz = 0;
    function latestQuiz() {
        //alert("new quiz checking!!!!! " +  $scope.quizzesInCourse.length);
        console.log("new quiz checking!!!!! " +  $scope.quizzesInCourse.length);
        var newquiz = 0;

        var nowdate = new Date();


        var newQuizinTenDay = 10;
        for(var i = 0; i <  $scope.quizzesInCourse.length; i++) {
            var inputDate =  $scope.quizzesInCourse[i].created;
            var date = new Date(inputDate);
            var currentDate = new Date();
            var numberOfDaysToAdd = 10;
          //  alert("now  date is " + someDate );
            console.log("now  date is " + currentDate );
            currentDate.setDate(currentDate.getDate() - numberOfDaysToAdd); 
           //  alert("now  date is " + someDate );
              console.log("new date should be in " + currentDate );

           // alert("new  quiz date is " + date );
            console.log("new  quiz date is " + date );
            if (currentDate.getTime() > date.getTime()) {
            }
            else{
              newquiz = newquiz+1;
            }
        }
       $scope.newQuiz = newquiz;

    }
/****** find number of quizzes one student have taken ********/
    $scope.quizTaken = 0;
    function findQuizTaken() {

        var user = $scope.authentication.user;
        var numQuizTaken = 0;
       
        var quizTaken = user.quizzesTaken;
            for(var i = 0; i < quizTaken.length; i++) {
                for(var j = 0; j < $scope.quizzesInCourse.length; j++) {
                      if(quizTaken[i].quizID === $scope.quizzesInCourse[j]._id) {
                           numQuizTaken++;
                      } 
                }
            }
      
         $scope.quizTaken = numQuizTaken;
    }

/********** student course average score ********/
  $scope.stuCourseAvg = 0;
  function studentAvg() {
      console.log("score length is " + $scope.scoresInClass.length);
      var score = 0;
      var avg = 0;
      var stuScore = 0;
      for(var i=0; i < $scope.scoresInClass.length; i++) {
        score = score+1;
        stuScore = stuScore + $scope.scoresInClass[i].quizScore;
        console.log("student score is " + $scope.scoresInClass[i].quizScore);
        console.log(" score is " + score);
      }
      if(score === 0){
        score = 1;
      }
     // avg = $filter('number')((stuScore/score)*100, (stuScore/score)) + '%';
      avg = $filter('number')((stuScore/score)*100, 1) + '%';
      $scope.stuCourseAvg = avg;
      console.log(" average is " + avg);
  }

    /********** find number of student in a course and quiz in course ********/
    $scope.findNumStudentEnrolled = function(){

        var courseStudentPair = {};

        for(var i = 0; i < $scope.courses.length; i++){
          //courseStudentPair[$scope.courses[i]._id] = 0;
          courseStudentPair[$scope.courses[i]._id] = $scope.courses[i].enrolledStudents.length;
        }

        $scope.numStudentInCourse = courseStudentPair;

    };

    /************* find number of quizzes in a course  ********/
    $scope.getNumQuiz = function() {
          var user = $scope.authentication.user;
          var courses;

      if($scope.isProf())
      {
        courses = user.createdCourses;
      }else if($scope.isStudent()){
        courses = user.enrolledCourses;
      }
      else {

        console.log('om admin');
        // Courses.All.query(function (data) {
        //  $scope.courses = data;
      
        // });
       // courses = $scope.courses;
      }
        var courseQuizPairs = {};

      //Initialize the array with 0s
      for(var k = 0; k < courses.length; k++){
        console.log('length ' + courses.length);
        courseQuizPairs[courses[k]] = 0;
        console.log('id ' + courses[k]);
      }


      var quizzes = Quizzes.query(function(){
        //console.log('try' + quizzes.length);

        for(var i = 0; i < quizzes.length; i++){
          for(var j = 0; j < courses.length; j++){

            if(quizzes[i].courseID === courses[j]){
              courseQuizPairs[courses[j]]++;
            }

          }
        }

        $scope.numQuizzesInCourse = courseQuizPairs;
        console.log($scope.numQuizzesInCourse);
        
      });

      
    };


    if (!Socket.socket) {
      //connect whenever in course taking page?
      Socket.connect();

    }

    Socket.on('testUserSocketPair', function(data){
      console.log('test user socket pair recieved by front');
      Socket.emit('testUserSocketPairBack', {data: 'hi'});
    });

  $scope.scoresInClass = 0;
      //used by students only
    function getQuizScoresInClass(){

      var scores = $scope.authentication.user.quizzesTaken;

      var scoresInClass = [];
      for(var i = 0; i < scores.length; i++){
          if(scores[i].courseID === $scope.course._id){
              scoresInClass.push(scores[i]);
              //console.log("ADDED SCORE");
          }
      }

      $scope.scoresInClass = scoresInClass;

    }

/************* display student overall scores ***************/

  $scope.totalQuizScore = [];
  $scope.data = [];
  $scope.series = [];
  $scope.labels =[];


  $scope.overallScore = function() {
    //TODO: get each quiz total score and add them together.
    var currentCourseId = CourseInfoFactory.getCourseID();
      var courseQuizzes = [];

      var eachscore = 0;  //each quiz total score
      var tempdata = [];
      //var quizScore = [];
      console.log("currentCourseId is " + currentCourseId);
      var quizzesInCourse = Quizzes.query(function(){
        console.log("quizzesInCourse length is " + quizzesInCourse.length);
        for(var i = 0; i < quizzesInCourse.length; i++){
          /*
if(quizzesInCourse[i].courseID === currentCourseId){
                courseQuizzes.push(quizzesInCourse[i]);
             // quizScore.push(i+1);
                $scope.AverageLabels.push(quizzesInCourse[i].title);
          */
            //find quizzes that is belong to current course
            if(quizzesInCourse[i].courseID === currentCourseId){
                courseQuizzes.push(quizzesInCourse[i]);
             // quizScore.push(i+1);
             //push quiz name to the label
                $scope.labels.push(quizzesInCourse[i].title);
                //find all scores in quiz
                for(var j = 0; j < quizzesInCourse[i].scores.length; j++) {
                    eachscore = quizzesInCourse[i].scores[j].quizScore+eachscore;
                }
                tempdata.push(eachscore);
                eachscore = 0;
            }
        }
        $scope.data.push(tempdata);
        $scope.quizzesInCourse = courseQuizzes;
        console.log("quizinCourse is " + $scope.quizzesInCourse );
       //console.log("quizScore is " + quizScore);
        console.log("data is " +  $scope.data[0] );
        console.log("labels is " + $scope.labels);


      //  $scope.labels = quizScore;
      });
      var course = Courses.All.get({
          courseId: $stateParams.courseId //Quizzes.choices: $scope.quiz.choices;
      }, function(){ //callback function to ensure that this executes after database query has finished
                  $scope.series.push(course.name);
              });
  };

  //$scope.totalQuizScore = [];
  $scope.averageData = [];
  $scope.courseName = [];
  $scope.AverageLabels =[];

  $scope.averageScore = function() {
    //TODO: get each quiz total score and add them together.
    var currentCourseId = CourseInfoFactory.getCourseID();
      var courseQuizzes = [];

      var eachscore = 0;
      var totalScore = 0;
      var tempdata = [];
      //var quizScore = [];
    //  console.log("currentCourseId is " + currentCourseId);
      var quizzesInCourse = Quizzes.query(function(){
        //console.log("quizzesInCourse length is " + currentCourseId);
        for(var i = 0; i < quizzesInCourse.length; i++){
            if(quizzesInCourse[i].courseID === currentCourseId){
                courseQuizzes.push(quizzesInCourse[i]);
             // quizScore.push(i+1);
                $scope.AverageLabels.push(quizzesInCourse[i].title);
                for(var j = 0; j < quizzesInCourse[i].scores.length; j++) {
                    eachscore = quizzesInCourse[i].scores[j].quizScore + eachscore;
                    totalScore = 1+ totalScore;
                    
                }
                if(totalScore === 0) {
                    totalScore = 1;
                }

                //var result = $filter('number')((eachscore/totalScore)*100, (eachscore/totalScore)) + '%';
                //console.log("average scores is" +  result);
                //tempdata.push(result);
                var result = (eachscore/totalScore);
                console.log("average scores is" +  result);
                tempdata.push(result);
                totalScore = 0;
                eachscore = 0;
            }
           
        }
        $scope.averageData.push(tempdata);
       // $scope.quizzesInCourse = courseQuizzes;
       // console.log("quizinCourse is " + $scope.quizzesInCourse );
       //console.log("quizScore is " + quizScore);
        console.log("data is " +  $scope.averageData[0] );
        console.log("labels is " + $scope.AverageLabels);


      //  $scope.labels = quizScore;
      });

  };


  }
]);




