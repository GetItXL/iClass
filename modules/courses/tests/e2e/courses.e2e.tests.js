'use strict';
// var mongoose = require('mongoose');
// var db = mongoose.createConnection('mongodb://localhost/mean-test');

describe('Professor role courses E2E Tests:', function () {
	var user1 = {
	    firstName: 'professor',
	    lastName: 'user',
	    email: 'test.user@ufl.edu',
	    username: 'testUser',
	    password: 'P@$$w0rds!!'
	   //username: 'testpro',
	   //password: 'ASDFasdf!@#$1234'
	};

  	var course1 = {
  		name: 'test course',
  		number: 'COP35055',
  		passcode : '123456',
  		semester: 'spring',
  		year: '2017'
  	};

  	var items;
	var signout = function () {
    // Make sure user is signed out first
	    browser.get(browser.baseUrl + 'authentication/signout');
	    // Delete all cookies
	    browser.driver.manage().deleteAllCookies();
	};

	describe('Test courses create page', function () {
		it('should be able to sleep for 5000 ms', function()  {
	        browser.sleep(5000);
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

	    it('Should be able to click create course button', function() {
		    
		    element(by.css('a[id="submit"]')).click();
		    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl +  'courses/create');
	    });

	    it('should display semester and year error', function () {
	      	browser.get(browser.baseUrl + 'courses/create');
	      	// Enter number
		    element(by.model('number')).sendKeys(course1.number);
		    // Enter name
		    element(by.model('name')).sendKeys(course1.name);
		    // Enter passcode
		    element(by.model('passcode')).sendKeys(course1.passcode);
		    // Click Submit button
      		element(by.css('button[type=submit]')).click();
      		// Course Semester and Year Error
	      	expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Semester and years are required!');
	    });

	    it('should display missing course number error', function () {
	      	browser.get(browser.baseUrl + 'courses/create');
		    // Enter name
		    element(by.model('name')).sendKeys(course1.name);
		    // Enter passcode
		    element(by.model('passcode')).sendKeys(course1.passcode);
		    // Select semester
		    element(by.model('semester')).$('[value="2"]').click();
		    // Select year
		    element(by.model('year')).$('[value="2"]').click(); 
		    // Click Submit button
      		element(by.css('button[type=submit]')).click();
      		// Course Semester and Year Error
	      	expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Course number is required.');
	    });

	    it('should display missing course name error', function () {
	      	browser.get(browser.baseUrl + 'courses/create');
		    // Enter number
		    element(by.model('number')).sendKeys(course1.number);
		    // Enter passcode
		    element(by.model('passcode')).sendKeys(course1.passcode);
		    // Select semester
		    element(by.model('semester')).$('[value="2"]').click();
		    // Select year
		    element(by.model('year')).$('[value="2"]').click();
		    // Click Submit button
      		element(by.css('button[type=submit]')).click();
      		// Course Semester and Year Error
	      	expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Course name is required.');
	    });
	    /*  TODO: still unable to create course */

	    it('should be able to create course ', function () {
	      	browser.get(browser.baseUrl + 'courses/create');
	      	 // Enter name
		    element(by.model('name')).sendKeys(course1.name);
		    // Enter number
		    element(by.model('number')).sendKeys(course1.number);
		    // Enter passcode
		    element(by.model('passcode')).sendKeys(course1.passcode);
		    // Select semester
		    element(by.model('semester')).$('[value="2"]').click();
		    // Select year
		    element(by.model('year')).$('[value="2"]').click();
		    // Click Submit button
      		element(by.css('button[type=submit]')).click();
      		// Goes to course view page
      		expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
	      	//expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'professordashboard');
	    });

	    it('should be able to see course in professordashboard', function () {
	      	browser.get(browser.baseUrl + 'professordashboard');
	      	// count number of course in the active list
	      	items = element.all(by.css('.col-lg-6 .list-group a'));
      		
	      	expect(items.count()).toBe(1);
	    });

	});

	describe('Test courses edit course', function () {
		it('Should be able to open edit course modal', function() {
			//course list page
		    browser.get(browser.baseUrl + 'courses');
			//Click Edit Button
			element(by.css('button[id="edit"]')).click();
			//expect the modal window
		    expect(element(by.css('.modal-content')));
	    });

	    it('Should not be able to change course (number is empty)', function() {
			// clear number file
		    element(by.css('input[id="number"]')).clear(); 
		    //update button should be disable
		    expect(element(by.id('ok')).isEnabled()).toBe(false);

	    });

	    it('Should not be able to change course (name is empty)', function() {
			// clear name file
		    element(by.css('input[id="name"]')).clear(); 
		    //update button should be disable
		    expect(element(by.id('ok')).isEnabled()).toBe(false);

	    });

	    it('Should be able to update course', function() {
	    	element(by.model('course.name')).sendKeys(course1.name);
		    // Enter number
		    element(by.model('course.number')).sendKeys(course1.number);
		    //click update button
		   	//browser.sleep(5000);
		   	element(by.css('button[id="ok"]')).click();

	    });

	     it('update course should be successful', function() {
	     	//course list page
		    browser.get(browser.baseUrl + 'courses');

	     	element(by.css('button[id="edit"]')).click();
		   	//course name should changed
		   	expect(element(by.model('course.name')).getAttribute('value')).toBe(course1.name);

	    });

	});




});
