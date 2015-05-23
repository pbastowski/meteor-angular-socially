var {Component, View, Events, Inject, bootstrap, Filter} = angular2now;

// Tell angular2-now to set controllerAs to "vm", instead of the default componentName
// This is mostly because "vm" is shorter to type :)
angular2now.options({ controllerAs: 'vm' })

angular.module('socially', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps'
]);

// The bootstrap component's selector name must be the same as the module name.
@Component({selector: 'socially'})
@View({ templateUrl: 'client/app/app.html' })
@Inject(['$rootScope', '$state'])

class socially {
  constructor ($rootScope, $state) {
    $rootScope.$on("$stateChangeError",
      function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireUser promise is rejected
      // and redirect the user back to the main page
      if (error === "AUTH_REQUIRED") {
        $state.go('parties');
      }
    })

    $rootScope.$watch('currentUser', function(nv, ov) {
      // user logout - redirect to parties-list
      if (!nv && ov) {
        $state.go('parties');
      }
    });

  }
}

bootstrap(socially);
