'use strict';

(function () {
  // Quizzes Controller Spec
  describe('Quizzes Controller Tests', function () {
    // Initialize global variables
    var QuizzesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Quizzes,
      mockQuiz;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Quizzes_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Quizzes = _Quizzes_;

      // create mock quiz
      mockQuiz = new Quizzes({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Quiz about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Quizzes controller.
      QuizzesController = $controller('QuizzesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one quiz object fetched from XHR', inject(function (Quizzes) {
      // Create a sample quizzes array that includes the new quiz
      var sampleQuizzes = [mockQuiz];

      // Set GET response
      $httpBackend.expectGET('api/quizzes').respond(sampleQuizzes);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.quizzes).toEqualData(sampleQuizzes);
    }));

    it('$scope.findOne() should create an array with one quiz object fetched from XHR using a quizId URL parameter', inject(function (Quizzes) {
      // Set the URL parameter
      $stateParams.quizId = mockQuiz._id;

      // Set GET response
      $httpBackend.expectGET(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(mockQuiz);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.quiz).toEqualData(mockQuiz);
    }));

    describe('$scope.create()', function () {
      var sampleQuizPostData;

      beforeEach(function () {
        // Create a sample quiz object
        sampleQuizPostData = new Quizzes({
          title: 'An Quiz about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Quiz about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Quizzes) {
        // Set POST response
        $httpBackend.expectPOST('api/quizzes', sampleQuizPostData).respond(mockQuiz);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the quiz was created
        expect($location.path.calls.mostRecent().args[0]).toBe('quizzes/' + mockQuiz._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/quizzes', sampleQuizPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock quiz in scope
        scope.quiz = mockQuiz;
      });

      it('should update a valid quiz', inject(function (Quizzes) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/quizzes/' + mockQuiz._id);
      }));

      it('should set scope.error to error response message', inject(function (Quizzes) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(quiz)', function () {
      beforeEach(function () {
        // Create new quizzes array and include the quiz
        scope.quizzes = [mockQuiz, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockQuiz);
      });

      it('should send a DELETE request with a valid quizId and remove the quiz from the scope', inject(function (Quizzes) {
        expect(scope.quizzes.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.quiz = mockQuiz;

        $httpBackend.expectDELETE(/api\/quizzes\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to quizzes', function () {
        expect($location.path).toHaveBeenCalledWith('quizzes');
      });
    });
  });
}());
