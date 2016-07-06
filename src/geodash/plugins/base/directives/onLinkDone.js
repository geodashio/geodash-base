geodash.directives["onLinkDone"] = function(){
  return {
    restriction: 'A',
    link: function($scope, element, attributes ) {
      $scope.$emit(attributes["onLinkDone"] || "link_done", {
        'element': element,
        'attributes': attributes
      });
    }
  };
};
