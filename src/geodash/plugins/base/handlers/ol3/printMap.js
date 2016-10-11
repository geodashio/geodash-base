geodash.handlers.printMap = function($scope, $interpolate, $http, $q, event, args) {
    console.log('event', event);
    console.log('args', args);
    var $scope = geodash.util.getScope("geodash-main");
    var data = geodash.var.map.getRenderer().canvas_.toDataURL("image/png")
    //window.open(data);
    var newWindow = window.open("", "_blank", "");
    var html = "<a href=\""+data+"\" download=\"sparc.png\"><img src=\""+data+"\"></a>";
    newWindow.document.write(html);
};
