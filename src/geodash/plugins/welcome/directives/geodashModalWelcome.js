geodash.directives["geodashModalWelcome"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,  // Inherit exact scope from parent controller
    templateUrl: 'geodash_modal_welcome.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
