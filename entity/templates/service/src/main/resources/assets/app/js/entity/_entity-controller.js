'use strict';

angular.module('<%= baseName %>')
  .controller('<%= _.capitalize(name) %>Controller', ['$scope', '$modal', 'resolved<%= _.capitalize(name) %>', '<%= _.capitalize(name) %>',
    function ($scope, $modal, resolved<%= _.capitalize(name) %>, <%= _.capitalize(name) %>) {

      $scope.<%= name %>s = resolved<%= _.capitalize(name) %>;

      $scope.create = function () {
        $scope.clear();
        $scope.open();
      };

      $scope.update = function(id) {
        $scope.<%= name %> = <%= _.capitalize(name) %>.get({id: id});
        $scope.open();
      };

      $scope.delete = function (id) {
        <%= _.capitalize(name) %>.delete({id: id},
          function () {
            $scope.<%= name %>s = <%= _.capitalize(name) %>.query();
          });
      };

      $scope.save = function() {
        <%= _.capitalize(name) %>.save($scope.<%= name %>,
            function () {
              $scope.<%= pluralize(name) %> = <%= _.capitalize(name) %>.query();
              $scope.clear();
            });
      };

      $scope.clear = function () {
        $scope.<%= name %> = {
          <% _.each(attrs, function(attr) { %>
          "<%= attr.attrName %>": "",
          <% }); %>
          "id": ""
        };
      };

      $scope.open = function() {
        var <%= name %>Save = $modal.open({
          templateUrl: '<%= name %>-save.html',
          controller: <%= _.capitalize(name) %>SaveController,
          resolve: {
            <%= name %>: function() {
              return $scope.<%= name %>;
            }
          }
        });

        <%= name %>Save.result.then(function (entity) {
          $scope.<%= name %> = entity;
          $scope.save();
        });
      };
    }]);

var <%= _.capitalize(name) %>SaveController =
  function($scope, $modalInstance, <%= name %>) {
    $scope.<%= name %> = <%= name %>;

    $scope.ok = function () {
      $modalInstance.close($scope.<%= name %>);
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  };
