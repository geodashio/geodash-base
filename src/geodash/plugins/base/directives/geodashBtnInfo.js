geodash.directives["geodashBtnInfo"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'placement': '@placement',
      'info': '@info'
    },
    templateUrl: 'geodash_btn_info.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
