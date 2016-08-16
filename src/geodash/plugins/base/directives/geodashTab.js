geodash.directives["geodashTab"] = function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'target': '@target',
      'label': '@label',
      'active': '@active',
      'height': '@height'
    },  // Inherit exact scope from parent controller
    templateUrl: 'geodash_tab.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
