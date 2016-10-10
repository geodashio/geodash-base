geodash.handlers["layerLoaded"] = function($scope, $interpolate, $http, $q, event, args) {
    var $scope = geodash.util.getScope("geodash-main");
    var type = args.type;
    var layer = args.layer;
    var visible = args.visible != undefined ? args.visible : true;
    // $scope.state.view.featurelayers is hardcoded on load now
    /*if(type == "featurelayer")
    {
      if(visible)
      {
        $scope.state.view.featurelayers.push(layer);
      }
    }
    else if(type == "baselayer")
    {
      $scope.state.view.baselayer = layer;
    }*/
};
