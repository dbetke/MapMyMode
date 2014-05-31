'use strict';

angular.module('trunkApp')
  .controller('NavbarCtrl', function ($scope, $location) {
    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];
    // $scope.transitTypes = [{
    // 	'value': 'Walk',
    // 	''
    // }];
    
    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
