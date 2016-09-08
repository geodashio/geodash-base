geodash.handlers["toggleComponent"] = function($scope, $interpolate, $http, $q, event, args) {
  console.log('event', event);
  console.log('args', args);
  //
  var component = args.component;
  var position = args.position;
  var classes = component+"-open "+component+"-"+position+"-open";
  $(args.selector).toggleClass(classes);
  setTimeout(function(){
    $scope.live["map"].updateSize();
  },2000);
};
