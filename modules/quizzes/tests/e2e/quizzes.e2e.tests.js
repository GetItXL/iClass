'use strict';

describe('professor Quizzes E2E Tests:', function () {
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
  
  	describe('Test quizzes page create attendence ', function () {

        // it('Should report missing credentials', function () {
        //    browser.get('http://localhost:3001/quizzes');
        //    quizCreated = element.all(by.repeater('quiz in quizzes')).count();
        //   // expect(element.all(by.repeater('quiz in quizzes')).count()).toEqual(0);
        // });

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

	    it('should be able to visit course page', function() {
	      // Enter passcode
	        browser.get(browser.baseUrl + 'professordashboard');
	        //click first item in course list
	       element(by.repeater('course in courses').row(0)).$('a').click();
	      //course name should changed
	        expect(element.all(by.css('.title')).get(0).getText()).toBe(course1.number + ' '+ course1.name);
	    });

	    it('should be able to click create quiz button', function() {
	      //click join button
	        element(by.css('button[id="createQuiz"]')).click();
	      //course name should changed
	        expect(browser.getCurrentUrl()).toEqual(browser.baseUrl + 'quizzes/create');
	    });

	    it('should be able to create attendence', function() {
	      //click attancance button
	        element(by.css('button[id="attendance"]')).click();
	       // browser.sleep(5000);
	        //click submit button
	        element(by.css('button[type="submit1"]')).click();
	        
	      	quizCreated = quizCreated +1;
	      //1 quiz should be created

	      //back to course view page  
	      //browser.get(courseUrl);
	      //browser.sleep(5000);
	          //expect(element.all(by.repeater('quiz in quizzes')).count()).toEqual(quizCreated);
	    });

	    it('should be able to vist open quiz view', function() {
	      //click attancance button
	        element(by.css('a[id="back"]')).click();
	        browser.sleep(5000);
	        
	        expect(element(by.css('button[type="start"]')));

	    });

	    it('should be able to sleep for 8000 ms', function()  {
	        browser.sleep(8000);
	    });

	    it('should be able to open quiz ', function() {
	    	browser.ignoreSynchronization = true;
	
	      //click attancance button
	        element(by.css('button[type="start"]')).click();
	        
	        expect(element.all(by.css('[ng-show="quiz.quizOpen"]')).isDisplayed()).toBeTruthy();

	    });

	    it('should be able to sleep for 3000 ms', function()  {
	        browser.sleep(5000);
	    });

		it('should be able to close quiz ', function() {
			browser.ignoreSynchronization = true;
	      //click attancance button
	        element(by.css('button[type="end"]')).click();
	        
	        expect(element.all(by.css('[ng-show="!quiz.quizOpen"]')).isDisplayed()).toBeTruthy();

	    });

	    it('should be able to see student submit', function() {
			browser.ignoreSynchronization = true;
	        expect(element.all(by.css('.border-head .ng-binding')).get(0).getText()).toBe('result total submission: 1');
	    });

	});

	describe('Test quizzes page create multiple choice ', function () {
	    it('should be able to create multiply choice quiz', function() {

	      browser.get(browser.baseUrl + 'quizzes/create');
	      //click join button
	        element(by.css('button[id="multiple"]')).click();
	      //quiz-option is display
	        //expect(element.all(by.css('[ng-show="error"]')).isDisplayed()).toBeTruthy();
	        expect(element.all(by.css('[ng-show="showQuizOption"]')).isDisplayed()).toBeTruthy();
	    });

	    it('should display missing quiz title error', function () {
	      browser.get(browser.baseUrl + 'quizzes/create');
	      //click multiply quiz button
	        element(by.css('button[id="multiple"]')).click();
	        // Enter title
	        //element(by.model('title')).sendKeys(quiz1.title);
	        // Enter question
	        element(by.model('question')).sendKeys(quiz1.question);
	        //select choice button
	        element(by.repeater('choice in choices').row(0)).element(by.tagName('input')).sendKeys(quiz1.choiceIn1);
	        // click answer button
	        element(by.id('answer')).click();
	        // Click Submit button
	        element(by.css('button[type=submit2]')).click();
	          //display quiz title error
	        expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Quiz title is required.');
	    });

	    it('should display missing quiz question error', function () {
	        browser.get(browser.baseUrl + 'quizzes/create');
	      //click multiply quiz button
	        element(by.css('button[id="multiple"]')).click();
	        // Enter title
	        element(by.model('title')).sendKeys(quiz1.title);
	        // Enter question
	        //element(by.model('question')).sendKeys(quiz1.question);
	        //select choice button
	        element(by.repeater('choice in choices').row(0)).element(by.tagName('input')).sendKeys(quiz1.choiceIn1);
	        // click answer button
	        element(by.id('answer')).click();
	        // Click Submit button
	        element(by.css('button[type=submit2]')).click();
	          //display quiz title error
	          //expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Quiz title is required.');
	        expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Quiz question is required.');
	    });

	     it('should display missing quiz choice error', function () {
	      	browser.get(browser.baseUrl + 'quizzes/create');
	      //click multiply quiz button
	        element(by.css('button[id="multiple"]')).click();
	        // Enter title
	        element(by.model('title')).sendKeys(quiz1.title);
	        // Enter question
	        element(by.model('question')).sendKeys(quiz1.question);
	        //select choice button
	        //element(by.repeater('choice in choices').row(0)).element(by.tagName('input')).sendKeys(quiz1.choiceIn1);
	        // click answer button
	        element(by.id('answer')).click();
	        // Click Submit button
	        element(by.css('button[type=submit2]')).click();
	          //display quiz title error
	        expect(element.all(by.css('.error-text')).get(0).getText()).toBe('Quiz choice is required.');
	    });

	    it('should display select answer error', function () {
	        browser.get(browser.baseUrl + 'quizzes/create');
	      //click multiply quiz button
	        element(by.css('button[id="multiple"]')).click();
	        // Enter title
	        element(by.model('title')).sendKeys(quiz1.title);
	        // Enter question
	        element(by.model('question')).sendKeys(quiz1.question);
	        //select choice button
	        element(by.repeater('choice in choices').row(0)).element(by.tagName('input')).sendKeys(quiz1.choiceIn1);
	        // click answer button
	        //element(by.id('answer')).click();
	        // Click Submit button
	        element(by.css('button[type=submit2]')).click();
	          //display quiz answer error
	        expect(element.all(by.css('[ng-show="error"]')).isDisplayed()).toBeTruthy();
	    });

	    //  it('should be able to create quiz', function () {
	    //     browser.get(browser.baseUrl + 'quizzes/create');
	    //   //click multiply quiz button
	    //     element(by.css('button[id="multiple"]')).click();
	    //     // Enter title
	    //     element(by.model('title')).sendKeys(quiz1.title);
	    //     // Enter question
	    //     element(by.model('question')).sendKeys(quiz1.question);
	    //     //select choice button
	    //     element(by.repeater('choice in choices').row(0)).element(by.tagName('input')).sendKeys(quiz1.choiceIn1);
	    //     // click answer button
	    //     element(by.id('answer')).click();
	    //     // Click Submit button
	    //     element(by.css('button[type=submit2]')).click();
	          
	    // });
    });
	// beforeEach(function() {
	//     browser.ignoreSynchronization = true;
	//  });
});
