geodash.directives["geodashTabs"]= function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    /*scope: {
      'ui': '@ui'
    },*/
    templateUrl: 'geodash_tabs.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
