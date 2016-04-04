'use strict';

describe('Quizzes E2E Tests:', function () {
	var user1 = {
	    firstName: 'professor',
	    lastName: 'user',
	    email: 'test.user@ufl.edu',
	    username: 'testUser',
	    password: 'P@$$w0rds!!'
	   //username: 'testpro',
	   //password: 'ASDFasdf!@#$1234'
	};

  	var user2 = {
	    firstName: 'student',
	    lastName: 'user2',
	    email: 'test.user2@ufl.edu',
	    username: 'testUser2',
	    password: 'P@$$w0rd!!'
  	};

  	var quiz1 = {
  		name: 'test quiz',
  		number: 'COP35055',
  		passcode : '123456',
  		semester: 'spring',
  		year: '2017'
  	};


  	var signout = function () {
    // Make sure user is signed out first
	    browser.get(browser.baseUrl + 'authentication/signout');
	    // Delete all cookies
	    browser.driver.manage().deleteAllCookies();
	};
  	describe('Test quizzes page', function () {

	    it('Should report missing credentials', function () {
	      	browser.get('http://localhost:3001/quizzes');
	      	expect(element.all(by.repeater('quiz in quizzes')).count()).toEqual(0);
	    });

	    it('Verify that the professor logged in', function() {
			//Make sure user is signed out first
			signout();
			//Sign in
			browser.get(browser.baseUrl + 'authentication/signin');
			// Enter UserName
			element(by.model('credentials.username')).sendKeys(user1.username);
			// Enter Password
			element(by.model('credentials.password')).sendKeys(user1.password);
			// Click Submit button
			element(by.css('button[type="submit"]')).click();
			expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'professordashboard');
		});
  	});
});
