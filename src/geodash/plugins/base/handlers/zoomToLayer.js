geodash.handlers["zoomToLayer"] = function($scope, $interpolate, $http, $q, event, args) {
    var $scope = geodash.api.getScope("geodash-main");
    var layer = args.layer;
    var i = $.inArray(layer, $scope.state.view.featurelayers);
    if(i != -1)
    {
      $scope.$broadcast("changeView", {'layer': layer});
    }
};
