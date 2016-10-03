geodash.handlers["toggleComponent"] = function($scope, $interpolate, $http, $q, event, args) {
  console.log('event', event);
  console.log('args', args);
  //
  var component = args.component;
  var position = args.position;
  var classes = component+"-open "+component+"-"+position+"-open";
  $(args.selector).toggleClass(classes);
  setTimeout(function(){

    if(geodash.mapping_library == "ol3")
    {
      setTimeout(function(){

        var m = geodash.var.map;
        m.renderer_.dispose();
        m.renderer_ = new ol.renderer.canvas.Map(m.viewport_, m);
        m.updateSize();
        m.renderSync();

      }, 0);
    }
    else if(geodash.mapping_library == "leaflet")
    {
      setTimeout(function(){ geodash.var.map._onResize(); }, 0);
    }

  },2000);
};
