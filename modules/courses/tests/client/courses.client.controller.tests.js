'use strict';

(function () {
  // Courses Controller Spec
  describe('Courses Controller Tests', function () {
    // Initialize global variables
    var CoursesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Courses,
      mockCourse;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Courses_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Courses = _Courses_;

      // create mock course
      mockCourse = new Courses({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Course about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Courses controller.
      CoursesController = $controller('CoursesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one course object fetched from XHR', inject(function (Courses) {
      // Create a sample courses array that includes the new course
      var sampleCourses = [mockCourse];

      // Set GET response
      $httpBackend.expectGET('api/courses').respond(sampleCourses);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.courses).toEqualData(sampleCourses);
    }));

    it('$scope.findOne() should create an array with one course object fetched from XHR using a courseId URL parameter', inject(function (Courses) {
      // Set the URL parameter
      $stateParams.courseId = mockCourse._id;

      // Set GET response
      $httpBackend.expectGET(/api\/courses\/([0-9a-fA-F]{24})$/).respond(mockCourse);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.course).toEqualData(mockCourse);
    }));

    describe('$scope.create()', function () {
      var sampleCoursePostData;

      beforeEach(function () {
        // Create a sample course object
        sampleCoursePostData = new Courses({
          title: 'An Course about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Course about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Courses) {
        // Set POST response
        $httpBackend.expectPOST('api/courses', sampleCoursePostData).respond(mockCourse);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the course was created
        expect($location.path.calls.mostRecent().args[0]).toBe('courses/' + mockCourse._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/courses', sampleCoursePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock course in scope
        scope.course = mockCourse;
      });

      it('should update a valid course', inject(function (Courses) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/courses\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/courses/' + mockCourse._id);
      }));

      it('should set scope.error to error response message', inject(function (Courses) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/courses\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(course)', function () {
      beforeEach(function () {
        // Create new courses array and include the course
        scope.courses = [mockCourse, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/courses\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCourse);
      });

      it('should send a DELETE request with a valid courseId and remove the course from the scope', inject(function (Courses) {
        expect(scope.courses.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.course = mockCourse;

        $httpBackend.expectDELETE(/api\/courses\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to courses', function () {
        expect($location.path).toHaveBeenCalledWith('courses');
      });
    });
  });
}());
