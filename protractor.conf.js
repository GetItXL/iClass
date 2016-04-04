

'use strict';

var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://localhost/mean-test');

// Protractor configuration
var config = {
	
  	specs: [
  			'modules/users/tests/e2e/users.e2e.tests.js',
  			'modules/courses/tests/e2e/courses.e2e.tests.js'
  			],


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
        // Return a promise when dealing with asynchronous
    },

    onPrepare: function() {
	  browser.driver.manage().window().maximize();
	}
};

if (process.env.TRAVIS) {
  config.capabilities = {
    browserName: 'firefox'
  };
}

exports.config = config;
