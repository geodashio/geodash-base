geodash.handlers["hideLayer"] = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.util.getScope("geodash-main");
    var layer = args.layer;
    var i = $.inArray(layer, $scope.state.view.featurelayers);
    if(i != -1)
    {
      $scope.state.view.featurelayers.splice(i, 1);
      $scope.refreshMap($scope.state);
    }
};
