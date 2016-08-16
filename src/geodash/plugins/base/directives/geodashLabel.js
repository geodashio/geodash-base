geodash.directives["geodashLabel"]= function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: {
      'target': '@target',
      'content': '@content'
    },
    templateUrl: 'geodash_label.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
