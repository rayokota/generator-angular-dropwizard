'use strict';

angular.module('<%= baseName %>')
  .controller('<%= _.capitalize(name) %>Controller', ['$scope', 'resolved<%= _.capitalize(name) %>', '<%= _.capitalize(name) %>',
    function ($scope, resolved<%= _.capitalize(name) %>, <%= _.capitalize(name) %>) {

      $scope.<%= name %>s = resolved<%= _.capitalize(name) %>;

      $scope.create = function () {
        <%= _.capitalize(name) %>.save($scope.<%= name %>,
          function () {
            $scope.<%= name %>s = <%= _.capitalize(name) %>.query();
            $('#save<%= _.capitalize(name) %>Modal').modal('hide');
            $scope.clear();
          });
      };

      $scope.update = function (id) {
        $scope.<%= name %> = <%= _.capitalize(name) %>.get({id: id});
        $('#save<%= _.capitalize(name) %>Modal').modal('show');
      };

      $scope.delete = function (id) {
        <%= _.capitalize(name) %>.delete({id: id},
          function () {
            $scope.<%= name %>s = <%= _.capitalize(name) %>.query();
          });
      };

      $scope.clear = function () {
        $scope.<%= name %> = {
          <% _.each(attrs, function(attr) { %>
          "<%= attr.attrName %>": "",
          <% }); %>
          id: ""
        };
      };
    }]);
