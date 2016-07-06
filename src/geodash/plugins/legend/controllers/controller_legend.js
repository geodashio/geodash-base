geodash.controllers["controller_legend"] = function(
  $scope,
  $element,
  $controller,
  state,
  map_config,
  live)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));
  //
  $scope.map_config = map_config;
  $scope.state = state;
  //////////////
  // Watch

  $scope.html5data = function()
  {
    var args = arguments;
    var zero_lc = args[0].toLowerCase();
    if(zero_lc == "togglemodal")
    {
      var id = args[1];
      var layerType = args[2];
      var layer = args[3];
      return {
        "id": args[1],
        "static": {
          "layerID": layer.id,
        },
        "dynamic" : {
          "layer": [layerType, layer.id]
        }
      };
    }
    else
    {
      return "";
    }
  };

  $scope.updateVariables = function(){
    var arrayFilter = $scope.map_config.legendlayers;

    if("baselayers" in $scope.map_config && $scope.map_config.baselayers != undefined)
    {
      var baselayers = $.grep($scope.map_config.baselayers,function(x, i){ return $.inArray(x["id"], arrayFilter) != -1; });
      baselayers.sort(function(a, b){ return $.inArray(a["id"], arrayFilter) - $.inArray(b["id"], arrayFilter); });
      $scope.baselayers = baselayers;
    }
    else
    {
      $scope.baselayers = [];
    }

    if("featurelayers" in $scope.map_config && $scope.map_config.featurelayers != undefined)
    {
      //var featurelayers = $.map($scope.map_config.featurelayers, function(item, key){ return {'key': key, 'item': item}; });
      var featurelayers = $.grep($scope.map_config.featurelayers,function(x, i){ return $.inArray(x["id"], arrayFilter) != -1; });
      featurelayers.sort(function(a, b){ return $.inArray(a["id"], arrayFilter) - $.inArray(b["id"], arrayFilter); });
      $scope.featurelayers = featurelayers;
    }
    else
    {
      $scope.featurelayers = [];
    }

  };
  $scope.updateVariables();
  $scope.$watch('map_config.featurelayers', $scope.updateVariables);
  $scope.$watch('map_config.legendlayers', $scope.updateVariables);
  $scope.$watch('state', $scope.updateVariables);
  //////////////
  var jqe = $($element);

  $scope.$on("refreshMap", function(event, args){
    console.log('args: ', args);

    $scope.state = args.state;
    /*
    $scope.$apply(function()
    {
      $scope.state = args.state;
    });*/

  });
};
