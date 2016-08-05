geodash.directives["geodashBtn"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'mode': '@mode',
      'target': '@target',
      'info': '@info',
      'placement': '@tooltipPlacement'
    },
    templateUrl: 'geodash_btn.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
