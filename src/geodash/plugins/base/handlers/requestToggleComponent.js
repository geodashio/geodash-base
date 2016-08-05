geodash.handlers["requestToggleComponent"] = function($scope, $interpolate, $http, $q, event, args) {
  geodash.api.getScope("geodash-main").$broadcast("toggleComponent", args);
};
