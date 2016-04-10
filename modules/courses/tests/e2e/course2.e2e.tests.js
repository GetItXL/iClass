'use strict';
// var mongoose = require('mongoose');
// var db = mongoose.createConnection('mongodb://localhost/mean-test');

describe('Student role courses E2E Tests:', function () {


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

	var signout = function () {
    // Make sure user is signed out first
	    browser.get(browser.baseUrl + 'authentication/signout');
	    // Delete all cookies
	    browser.driver.manage().deleteAllCookies();
	};

	describe('Test course join', function () {

	    it('should be able to sleep for 10000 ms', function()  {
	        browser.sleep(13000);
	    });
	    it('should be able to sleep for 10000 ms', function()  {
	        browser.sleep(5000);
	    });

		it('Verify that the student logged in', function() {
		      //Make sure user is signed out first
		      signout();
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

	    it('Should be able to open join course modal', function() {
			//course list page
		    browser.get(browser.baseUrl + 'courses');
			//Click Edit Button
			element(by.css('button[id="purchase"]')).click();
			//expect the modal window
		    expect(element(by.css('.modal-content')));
		});

	    it('Should not be able to click join button', function() {
		    //click join button
		   //element(by.css('button[id="ok"]')).click();
		    //update button should be disable
		   expect(element(by.id('ok')).isEnabled()).toBe(false);

	    });

	    it('Should be able to display incorrect passcode', function() {
			
			// Enter passcode
		    element(by.model('passcode')).sendKeys(user2.username);
		    //click join button
		    //browser.sleep(5000);
		    element(by.css('button[id="ok"]')).click();
		    //update button should be disable
		    expect(element.all(by.binding('error')).get(0).getText()).toBe('passcode is not correct!');

	    });

	    it('Should be able to join course', function() {
	    	element(by.css('input[type="passcode"]')).clear();
			// Enter passcode
		    element(by.model('passcode')).sendKeys(course1.passcode);
		    //click join button
		    element(by.css('button[id="ok"]')).click();
		    //redirect to studentdashboard
		   // browser.sleep(5000);
		    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'studentdashboard');

	    });

	    it('Should be able to see course in the dashboard', function() {
			// Enter passcode
		   	browser.get(browser.baseUrl + 'studentdashboard');
		    //redirect to studentdashboard
		   	var items = element.all(by.css('.list-group a'));
      		
	      	expect(items.count()).toBe(1);
		   //expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'studentdashboard');

	    });


	});


});
