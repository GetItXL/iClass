'use strict';


module.exports = function(app) {
	//require('../../../users/server/routes/users.server.routes.js')(app);
	var users = require('../../../users/server/controllers/users.server.controller');
	var courses = require('../controllers/courses.server.controller');
	// Courses Routes
	app.route('/courses')
		.get(courses.list)
		.post(users.requiresLogin, courses.create);

	app.route('/courses/:courseId')
		.get(courses.read)
		.put(users.requiresLogin, courses.hasAuthorization, courses.update)
		.delete(users.requiresLogin, courses.hasAuthorization, courses.delete);

	// Finish by binding the Course middleware
	app.param('courseId', courses.courseByID);
};
