geodash.directives["geodashModalLayerMore"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'geodash_modal_layer_more.tpl.html',
    link: function ($scope, element, attrs){
    }
  };
};
