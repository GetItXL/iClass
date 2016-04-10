

'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/mean-test');

// Protractor configuration
var config = {
	
  	specs: [
  			'modules/users/tests/e2e/users.e2e.tests.js',
        'modules/users/tests/e2e/users2.e2e.tests.js',
  			'modules/courses/tests/e2e/courses.e2e.tests.js',
        'modules/courses/tests/e2e/course2.e2e.tests.js',
  			'modules/quizzes/tests/e2e/quizzes.e2e.tests.js',
        'modules/quizzes/tests/e2e/quizzes2.e2e.tests.js'
  			],

    // multiCapabilities: [{
    //   'browserName': 'chrome'
    // }, {
    //   'browserName': 'firefox'
    // }],
    capabilities: {
        browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 2
    },

    baseUrl: "http://localhost:3001/",

    beforeLaunch: function() {
        console.log("Starting setup...");

        // Return a promise when dealing with asynchronous
        // functions here (like creating users in the database)
    },

    afterLaunch: function() {
        console.log("Starting cleanup...");
        //drop database
        db.db.dropDatabase();
    },

    onPrepare: function() {
	  browser.driver.manage().window().maximize();
	}
};

if (process.env.TRAVIS) {
  config.capabilities = {
    //browserName: 'firefox'
    browserName: 'chrome',
        shardTestFiles: true,
        maxInstances: 2
  };
}

exports.config = config;
