geodash.directives["geodashBtnClear"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'target': '@target'
    },
    templateUrl: 'geodash_btn_clear.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
