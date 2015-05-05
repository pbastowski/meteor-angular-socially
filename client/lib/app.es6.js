var {SetModuleName, Component, View, Inject, bootstrap} = angular2;

SetModuleName('socially', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps'
]);

// The name option, below, is itself optional. If you don't supply a component name
// then the camelCased selector name will be used. If the selector name is not supplied then
// the current module name, as specified in SetModuleName, will be used
// to bootstrap the app.
@Component({selector: 'socially-app', name: 'socially'})
class socially {
  constructor() {
    // Put any global App initialisation here
  }
}

bootstrap(socially);
