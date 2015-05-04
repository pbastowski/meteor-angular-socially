var {SetModuleName, Component, View, Inject, bootstrap} = angular2;

SetModuleName('socially', [
  'angular-meteor',
  'ui.router',
  'angularUtils.directives.dirPagination',
  'uiGmapgoogle-maps'
]);

@Component({selector: 'socially-app'})
class socially {
  constructor() {
    // Put any global App initialisation here
  }
}

bootstrap(socially);
