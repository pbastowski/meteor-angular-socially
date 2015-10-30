// Here we create the angular module that will hold all the 
// components, services and filters created by angular2-now.
// This file needs to execute before any other JS files that
// use angular2-now.
//
import {SetModule} from "angular2now";

SetModule('socially', [
    'angular-meteor',
    'ui.router',
    'angularUtils.directives.dirPagination',
    'uiGmapgoogle-maps',
    'ui.bootstrap'
]);

// This debug is there so that we can see which order our components
// are created in. Look in the dev console and see for yourself.
console.log('! app');
