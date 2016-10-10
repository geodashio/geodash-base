geodash.handlers["stateChanged"] = function($scope, $interpolate, $http, $q, event, args) {
  console.log('event', event);
  console.log('args', args);
  $scope.$apply(function () {
    $scope.state = $.extend($scope.state, args);
    var url = buildPageURL($interpolate, $scope.dashboard, $scope.state);
    if(url != undefined)
    {
      history.replaceState($scope.state, "", url);
    }
    $scope.refreshMap($scope.state);
  });
};
