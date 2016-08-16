geodash.directives["geodashTabs"]= function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'geodash_tabs.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
