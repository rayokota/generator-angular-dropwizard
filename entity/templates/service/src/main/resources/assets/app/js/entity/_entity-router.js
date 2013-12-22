'use strict';

angular.module('<%= baseName %>')
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/<%= pluralName %>', {
        templateUrl: 'views/<%= name %>/<%= pluralName %>.html',
        controller: '<%= _.capitalize(name) %>Controller',
        resolve:{
          resolved<%= _.capitalize(name) %>: ['<%= _.capitalize(name) %>', function (<%= _.capitalize(name) %>) {
            return <%= _.capitalize(name) %>.query();
          }]
        }
      })
    }]);
