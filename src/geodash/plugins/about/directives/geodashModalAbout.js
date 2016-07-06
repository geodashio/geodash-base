geodash.directives["geodashModalAbout"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'geodash_modal_about.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
