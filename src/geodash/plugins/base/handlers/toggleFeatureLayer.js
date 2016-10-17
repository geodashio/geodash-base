geodash.handlers.toggleFeatureLayer = function($scope, $interpolate, $http, $q, event, args)
{
    var $scope = geodash.util.getScope("geodash-main");
    var layer = args.layer;
    var i = $.inArray(layer, $scope.state.view.featurelayers);
    if(i != -1)
    {
      $scope.state.view.featurelayers.splice(i, 1);
    }
    else
    {
      $scope.state.view.featurelayers.push(layer);
    }
    $scope.refreshMap($scope.state);
};
