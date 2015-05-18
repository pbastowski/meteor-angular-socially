var {Component, View, Events, Inject, bootstrap} = angular2now;

angular.module('socially', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps'
]);

// The bootstrap component's selector name must be the same as the module name.
@Component({selector: 'socially'})
@View({template: '<content></content>'})
@Inject(['$rootScope', '$location'])

class socially {
  constructor ($rootScope, $location) {
    $rootScope.$on("$stateChangeError", function (event, next, previous, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $location.path("/parties");
      }
    })
  }
}

bootstrap(socially);
