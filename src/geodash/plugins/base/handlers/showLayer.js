geodash.handlers["showLayer"] = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.util.getScope("geodash-main");
    var layer = args.layer;
    if($.inArray(layer, $scope.state.view.featurelayers) == -1)
    {
      $scope.state.view.featurelayers.push(layer);
      $scope.refreshMap($scope.state);
    }
};
