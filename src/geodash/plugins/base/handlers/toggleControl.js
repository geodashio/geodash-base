geodash.handlers.toggleControl = function($scope, $interpolate, $http, $q, event, args)
{
    var $scope = geodash.util.getScope("geodash-main");
    var control = args.control;
    var i = $.inArray(control, $scope.state.view.controls);
    if(i != -1)
    {
      $scope.state.view.controls.splice(i, 1);
    }
    else
    {
      $scope.state.view.controls.push(control);
    }
    $scope.refreshMap($scope.state);
};
