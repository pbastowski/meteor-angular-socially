var {Component, View, bootstrap} = angular2;

angular.module('socially', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps'
]);

// The name option, below, is itself optional. If you don't supply a component name
// then the selector name will be used instead.
@Component({selector: 'socially-app', name: 'socially'})
@View({ template: '<content></content>' })
class socially {
  constructor() {
    // Put any global App initialisation here
  }
}

bootstrap(socially);
