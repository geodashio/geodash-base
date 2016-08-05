geodash.handlers["switchBaseLayer"] = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.api.getScope("geodash-main");
    $scope.state.view.baselayer = args.layer;
    $scope.refreshMap($scope.state);
};
