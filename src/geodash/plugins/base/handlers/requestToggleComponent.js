geodash.handlers["requestToggleComponent"] = function($scope, $interpolate, $http, $q, event, args) {
  geodash.util.getScope("geodash-main").$broadcast("toggleComponent", args);
};
