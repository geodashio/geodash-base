geodash.directives["geodashBtnClose"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'dismiss': '@target'
    },
    templateUrl: 'geodash_btn_close.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
