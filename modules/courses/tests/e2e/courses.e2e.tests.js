'use strict';
// var mongoose = require('mongoose');
// var db = mongoose.createConnection('mongodb://localhost/mean-test');

describe('Courses E2E Tests:', function () {
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

	describe('Test courses create page', function () {

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
      		expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
	      	//expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'professordashboard');
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

	describe('Test course join', function () {
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

	    it('Should be able to display increated passcode', function() {
			
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

	    it('Should be able to join course', function() {
			// Enter passcode
		   browser.get(browser.baseUrl + 'studentdashboard');
		    //redirect to studentdashboard
		   
		    expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'studentdashboard');

	    });
	});
	afterEach(function(){
		//Clear database
		
	});

});
