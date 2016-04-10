'use strict';

describe('Student Quizzes E2E Tests:', function () {

    var user2 = {
      firstName: 'student',
      lastName: 'user2',
      email: 'test.user2@ufl.edu',
      username: 'testUser2',
      password: 'P@$$w0rd!!'
    };

    var course1 = {
        name: 'test course',
        number: 'COP35055',
        passcode : '123456',
        semester: 'spring',
        year: '2017'
    };

    var quiz1 = {
        title: 'test quiz',
        question: 'how many choice here?',
        choiceIn1: '1',
        choiceIn2: '2',
        choiceIn3: '3'
    };
    var courseUrl;
    var quizCreated = 0;

    var signout = function () {
    // Make sure user is signed out first
      browser.get(browser.baseUrl + 'authentication/signout');
      // Delete all cookies
      browser.driver.manage().deleteAllCookies();
    };
  
    describe('Test quizzes page attendence ', function () {

        // it('Should report missing credentials', function () {
        //    browser.get('http://localhost:3001/quizzes');
        //    quizCreated = element.all(by.repeater('quiz in quizzes')).count();
        //   // expect(element.all(by.repeater('quiz in quizzes')).count()).toEqual(0);
        // });

        it('Verify that the student logged in', function() {
        //Make sure user is signed out first
        signout();
        browser.sleep(2000);
        //Sign in
        browser.get(browser.baseUrl + 'authentication/signin');
        // Enter UserName
        element(by.model('credentials.username')).sendKeys(user2.username);
        // Enter Password
        element(by.model('credentials.password')).sendKeys(user2.password);
        // Click Submit button
        element(by.css('button[type="submit"]')).click();
        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'studentdashboard');
      });


      it('should be able to see visit course view page', function() {
        // Enter passcode
        browser.get(browser.baseUrl + 'studentdashboard');
          //click first item in course list
         element(by.repeater('course in enrolledCourses').row(0)).$('a').click();
        //course name should changed
        expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
      });

      it('should be able to see quiz in course', function() {

          element.all(by.css('[ng-show="isStudent"]')).isDisplayed().then(function (isVisible) {
              if (isVisible) {
                  var items = element.all(by.css('.list-group .studentview a'));
                 
                  expect(items.count()).toBe(1);
              } else {
              // element is not visible
              }
          });
         
      });

      it('should be able to visit quiz open page', function() {
        element.all(by.css('[ng-show="isStudent"]')).isDisplayed().then(function (isVisible) {
              if (isVisible) {
                 // element(by.repeater('quiz in quizzesInCourse ').row(0)).$('a').click();
                  element(by.css('.list-group .studentview a')).click();
                  //browser.sleep(5000);
                  expect(element.all(by.css('[ng-show="!quiz.quizOpen"]')).isDisplayed()).toBeTruthy();
              } else {
              // element is not visible
              }
          });
      });

      it('should be able to sleep for 6000 ms', function()  {
          browser.sleep(6000);
      });

      it('should be able to see open quiz', function() {
       
          expect(element.all(by.css('[ng-show="quiz.quizOpen"]')).isDisplayed()).toBeTruthy();
             
      });

      it('should be able to take open quiz', function() {
        
         // browser.wait(EC.alertIsPresent(), 3000);
          browser.sleep(2000);
          element(by.css('.radio')).click();
          element(by.css('input[type="submit"]')).click();
          
          browser.driver.switchTo().alert().then(
              function (alert) { alert.accept(); },
              function (err) { }
          );
         // browser.switchTo().alert().accept();
          expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
          //expect(element.all(by.css('[ng-show="quiz.quizOpen"]')).isDisplayed()).toBeTruthy();
             
      });

      it('should not able to goes to previous quiz', function()  {
          element.all(by.css('[ng-show="isStudent"]')).isDisplayed().then(function (isVisible) {
              if (isVisible) {
                 // element(by.repeater('quiz in quizzesInCourse ').row(0)).$('a').click();
                  element(by.css('.list-group .studentview a')).click();
                  browser.sleep(1000);
                 // expect model window
                  expect(element.all(by.css('.modal-content')));
              } else {
              // element is not visible
              }
          });
      });

      it('should be able to sleep for 10000 ms', function()  {
          element(by.css('button[id="OK"]')).click();
          browser.sleep(13000);
      });

      it('should be able to see visit course view page', function() {
          browser.sleep(10000);
          browser.get(browser.baseUrl + 'studentdashboard');
          //click first item in course list
          element(by.repeater('course in enrolledCourses').row(0)).$('a').click();
          //course name should changed
          expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
      });


      // it('should be able to see 2 quizzes in the course page', function()  {
          
      //     //refresh page
      //     // browser.driver.navigate().refresh();
      //     // browser.refresh();
      //     browser.sleep(2000);
      //     element.all(by.css('[ng-show="isStudent"]')).isDisplayed().then(function (isVisible) {
      //         if (isVisible) {
      //             var items = element.all(by.css('.list-group .studentview a'));
      //            // browser.sleep(3000);
      //             expect(items.count()).toBe(2);
      //         } else {
      //         // element is not visible
      //         }
      //     });
         
      // });

      



      // it('should be able to sleep for 5000 ms', function()  {
      //     browser.sleep(5000);
      // });

      // it('should be able to see quiz open', function() {
      //     expect(element.all(by.css('[ng-show="!quiz.quizOpen"]')).isDisplayed()).toBeTruthy();
      // });
  });

 
});
