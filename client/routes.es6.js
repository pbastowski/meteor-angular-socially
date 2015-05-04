angular.module("socially").run(function ($rootScope, $location) {
  $rootScope.$on("$stateChangeError", function (event, next, previous, error) {
    // We can catch the error thrown when the $requireUser promise is rejected
    // and redirect the user back to the main page
    if (error === "AUTH_REQUIRED") {
      $location.path("/parties");
    }
  });
});

angular.module("socially").config(function ($urlRouterProvider, $stateProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $stateProvider
    .state('parties', {
      url:      '/parties',
      template: '<parties-list></parties-list>'
    })
    .state('partyDetails', {
      url:      '/parties/:partyId',
      template: '<party-details></party-details>',
      resolve:  {
        "currentUser": function ($meteor) {
          return $meteor.requireUser();
        }
      }
    });

  $urlRouterProvider.otherwise("/parties");
});
