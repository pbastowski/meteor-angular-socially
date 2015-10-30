// In this file we define the Socially app's bootstrap component.
// In index.html socially is knows as the HTML element "<socially></socially>".
//
import {Component, View, Inject, bootstrap} from "angular2now";

@Component('socially')
@View('client/socially/socially.ng.html')
@Inject('$rootScope', '$state')

// The bootstrap component's constructor replaces the angular.module().run() 
// method.
// If you really need to configure some old service in the "config()" function
// then it can still be accessed through "angular.module('socially').config()".
// 
class App {
    constructor($rootScope, $state) {
        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireUser promise is rejected
            // and redirect the user back to the main page
            if (error === 'AUTH_REQUIRED') {
                $state.go('parties');
            }
        });
    }
}


// And now we bootstrap the app. Actually, the bootstrap is queued at this 
// stage, but occurs only after all of the document has been loaded by 
// the browser. 
bootstrap(App);

console.log('! socially');
