/* -*- coding:utf-8; mode:javascript; -*- */

'use strict';

(angular
 .module('app', ['ng', 'app.controllers', 'app.directives'])
 .config([
     /******/ '$routeProvider',
     function ($routeProvider) {
         $routeProvider
             .when('/', {controller: 'indexContr', templateUrl: '/templates/index.html'})
             .otherwise({redirectTo: '/'});
     }])
 .run([
     /******/ '$rootScope', '$location',
     function ($rootScope,   $location) {
         $rootScope.location = $location
     }])
);
