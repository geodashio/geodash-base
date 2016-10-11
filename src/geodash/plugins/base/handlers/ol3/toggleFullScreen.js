geodash.handlers.toggleFullScreen = function($scope, $interpolate, $http, $q, event, args)
{
    if(ol.control.FullScreen.isFullScreenSupported())
    {
      if(ol.control.FullScreen.isFullScreen())
      {
        ol.control.FullScreen.exitFullScreen();
      }
      else
      {
        var target = angular.isDefined(args.element) ?
          $(args.element).parents(".geodash-map:first") :
          $(".geodash-map");
        if(target.length > 0)
        {
          ol.control.FullScreen.requestFullScreenWithKeys(target[0]);
        }
      }
    }
};
