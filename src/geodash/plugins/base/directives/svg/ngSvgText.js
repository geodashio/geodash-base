geodash.directives.ngSvgText = function()
{
  return {
    scope: true,
    link: function ($scope, $element, attrs){
      $element.text(attrs.ngSvgText);
    }
  };
};
