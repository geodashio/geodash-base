geodash.handlers["showLayers"] = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.api.getScope("geodash-main");
    var layers = args.layers;
    for(var i = 0; i < layers.length; i++)
    {
      var layer = layers[i];
      if($.inArray(layer, $scope.state.view.featurelayers) == -1)
      {
        $scope.state.view.featurelayers.push(layer);
        $scope.refreshMap($scope.state);
      }
    }
};
