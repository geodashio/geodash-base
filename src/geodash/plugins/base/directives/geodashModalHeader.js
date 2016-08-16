geodash.directives["geodashModalHeader"]= function(){
  return {
    restrict: 'EA',
    replace: true,
    scope: true,
    templateUrl: 'geodash_modal_header.tpl.html',
    link: function ($scope, element, attrs){}
  };
};
