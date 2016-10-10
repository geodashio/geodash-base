geodash.directives.geodashBase = function(){
  return {
    controller: geodash.controllers.GeoDashControllerBase,
    restrict: 'EA',
    replace: false,
    transclude: true,
    scope: true,
    template: "<div ng-transclude></div>",
    link: function ($scope, element, attrs, controllers){}
  };
};
