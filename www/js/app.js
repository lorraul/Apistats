angular.module('starter', ['ionic', 'crypto.resources', 'crypto.controllers', 'crypto.services'])

.run(function($ionicPlatform,$localStorage) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      
    $localStorage.remove('balances');
  });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('index', {
        cache: false,
        url: '/index',
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    })
    .state('response', {
        cache: false,
        url: '/response/:address',
        templateUrl: 'templates/response.html',
        controller: 'ResponseCtrl'
    });
    $urlRouterProvider.otherwise('/index');
}); 