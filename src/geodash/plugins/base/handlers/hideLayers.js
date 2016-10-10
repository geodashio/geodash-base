geodash.handlers["hideLayers"] = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.util.getScope("geodash-main");
    var layers = args.layers;
    for(var i = 0; i < layers.length; i++)
    {
      var layer = args.layers[i];
      var j = $.inArray(layer, $scope.state.view.featurelayers);
      if(j != -1)
      {
        $scope.state.view.featurelayers.splice(j, 1);
        $scope.refreshMap($scope.state);
      }
    }
};
