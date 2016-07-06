geodash.directives["geodashModalLayerCarto"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    //scope: {
    //  layer: "=layer"
    //},
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'geodash_modal_layer_carto.tpl.html',
    link: function ($scope, element, attrs){
    }
  };
};
