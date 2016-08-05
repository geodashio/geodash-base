geodash.directives["geodashSidebarToggleLeft"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      "selector": "@selector"
    },
    templateUrl: 'geodash_sidebar_toggle_left.tpl.html',
    link: function ($scope, $element, attrs){
      setTimeout(function(){

        $('[data-toggle="tooltip"]', $element).tooltip();

      },10);
    }
  };
};
