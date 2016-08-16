geodash.directives["geodashMapOverlays"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'editable': '@editable'
    },  // Inherit exact scope from parent controller
    templateUrl: 'map_overlays.tpl.html',
    link: function ($scope, element, attrs){

      $scope.map_config = $scope.$parent.map_config;
      $scope.map_config_flat = $scope.$parent.map_config_flat;

      $scope.style = function(type, overlay)
      {
        var styleMap = {};

        $.extend(styleMap,{
          "top": extract("position.top", overlay, 'auto'),
          "bottom": extract("position.bottom", overlay, 'auto'),
          "left": extract("position.left", overlay, 'auto'),
          "right": extract("position.right", overlay, 'auto'),
          "padding": extract("padding", overlay, '0'),
          "background": extract("background", overlay, 'transparent'),
          "opacity": extract("opacity", overlay, '1.0'),
          "width": extract("width", overlay, 'initial'),
          "height": extract("height", overlay, 'initial')
        });

        if(type == "text")
        {
          $.extend(styleMap, {
            "font-family": extract("text.font.family", overlay, 'Arial'),
            "font-size": extract("text.font.size", overlay, '12px'),
            "font-style": extract("text.font.style", overlay, 'normal'),
            "text-shadow": extract("text.shadow", overlay, 'none')
          });
        }
        else if(type == "image")
        {

        }
        return $.map(styleMap, function(value, style){
          return style+": "+value
        }).join(";") +";";
      };

      if(geodash.api.parseTrue($scope.editable))
      {
        $(element).on('mouseenter', '.geodash-map-overlay', function(event, args){
          $(this).draggable('enable');
          $('.geodash-map-grid').addClass('on');
        });

        $(element).on('mouseleave', '.geodash-map-overlay', function(event, args){
          $(this).draggable('disable');
          $('.geodash-map-grid').removeClass('on');
        });

        $scope.$on("overlayLoaded", function(event, args) {

          console.log("overlayLoaded", event, args);
          var overlayType = args.attributes.overlayType;
          var overlayElement = $(args.element);

          var container = overlayElement.parents(".geodash-map:first");

          if(overlayType == "text")
          {
            /*overlayElement.resizable({
              "containment": container,
              "helper": "ui-resizable-helper"
            });*/
          }
          else if(overlayType == "image")
          {
            //See: http://stackoverflow.com/questions/10703450/draggable-and-resizable-in-jqueryui-for-an-image-is-not-working
            /*$("img", overlayElement).resizable({
              "containment": container,
              "helper": "ui-resizable-helper"
            });*/
          }

          overlayElement.draggable({
            "containment": container,
            start: function(event, args) {
              // http://www.w3schools.com/cssref/pr_class_cursor.asp
              $(this).css('cursor', '-webkit-grabbing');
            },
            drag: function(event, args) {

            },
            stop: function(event, args) {
              // http://www.w3schools.com/cssref/pr_class_cursor.asp
              $(this).css('cursor', 'pointer');
              console.log(event, args);
              var newPosition = args.position;
              var overlayIndex = $(this).data('overlay-index');
              var scope = geodash.api.getScope("geodash-sidebar-right");
              if(scope != undefined)
              {
                var mapWidth = container.width();
                var mapHeight = container.height();

                scope.map_config_flat["overlays__"+overlayIndex+"__position__top"] = newPosition.top < (mapHeight / 2.0) ? newPosition.top+'px' : 'auto';
                scope.map_config_flat["overlays__"+overlayIndex+"__position__bottom"] = newPosition.top >= (mapHeight / 2.0) ? (mapHeight - newPosition.top)+'px' : 'auto';
                scope.map_config_flat["overlays__"+overlayIndex+"__position__left"] = newPosition.left < (mapWidth / 2.0) ? newPosition.left+'px' : 'auto';
                scope.map_config_flat["overlays__"+overlayIndex+"__position__right"] = newPosition.left >= (mapWidth / 2.0) ? (mapWidth - newPosition.left)+'px' : 'auto';

                setTimeout(function(){
                  scope.validateFields([
                    "overlays__"+overlayIndex+"__position__top",
                    "overlays__"+overlayIndex+"__position__bottom",
                    "overlays__"+overlayIndex+"__position__left",
                    "overlays__"+overlayIndex+"__position__right"
                  ])
                }, 0);
              }
            }
          });
        });

      }
    }
  };
};
