geodash.handlers["clickedOnMap"] = function($scope, $interpolate, $http, $q, event, args) {
  console.log('event', event);
  console.log('args', args);
  //
  var $scope = geodash.api.getScope("geodash-main");
  var map = geodash.var.map;
  var z = $scope.state.view.z;
  var visibleFeatureLayers = $scope.state.view.featurelayers;
  console.log("visibleFeatureLayers", visibleFeatureLayers);
  var featurelayers_geojson = [];
  var featurelayers_by_featuretype = {};
  var fields_by_featuretype = {};
  var urls = [];
  for(var i = 0; i < visibleFeatureLayers.length; i++)
  {
    var fl = geodash.api.getFeatureLayer(visibleFeatureLayers[i], {"scope": $scope});
    if(fl.type == "geojson")
    {
      featurelayers_geojson.push(fl.id);
    }
    else if(angular.isDefined(extract("wfs", fl)))
    {
      var params = {
        service: "wfs",
        version: extract("wfs.version", fl, '1.0.0'),
        request: "GetFeature",
        srsName: "EPSG:4326",
      };

      //var targetLocation = new L.LatLng(args.lat, args.lon);
      var targetLocation = geodash.normalize.point(args);
      var bbox = geodash.tilemath.point_to_bbox(args.location.lon, args.location.lat, z, 4).join(",");
      var typeNames = extract('wfs.layers', fl, undefined) || extract('wms.layers', fl, undefined) || [] ;
      if(angular.isString(typeNames))
      {
        typeNames = typeNames.split(",");
      }
      for(var j = 0; j < typeNames.length; j++)
      {
        typeName = typeNames[j];
        var url = fl.wfs.url + "?" + $.param($.extend(params, {typeNames: typeName, bbox: bbox}));
        urls.push(url);
        fields_by_featuretype[typeName.toLowerCase()] = geodash.layers.aggregate_fields(fl);
        featurelayers_by_featuretype[typeName.toLowerCase()] = fl;
        if(!typeName.toLowerCase().startsWith("geonode:"))
        {
          featurelayers_by_featuretype["geonode:"+typeName.toLowerCase()] = fl;
        }
      }
    }
  }

  var featureAndLocation = undefined;
  if(featurelayers_geojson.length > 0)
  {
    featureAndLocation = map.forEachFeatureAtPixel(
      [args.pixel.x, args.pixel.y],
      function(feature, layer){
        return {
          'layer': layer.get('id'),
          'feature': geodash.normalize.feature(feature),
          'location': geodash.normalize.point(ol.proj.toLonLat(map.getCoordinateFromPixel([args.pixel.x, args.pixel.y]), map.getView.getProjection()))
        };
      },
      null,
      function(layer) {
        return $.inArray(layer.get('id'), featurelayers_geojson) != -1;
      }
    );
  }

  if(angular.isDefined(featureAndLocation))
  {
    $scope.broadcast("openPopup", {
      'featureLayer': geodash.api.getFeatureLayer(featureAndLocation.layer),
      'feature': featureAndLocation.feature,
      'location': featureAndLocation.location
    });
  }
  else
  {
    if(urls.length > 0)
    {
      $q.all(geodash.http.build_promises($http, urls)).then(function(responses){
        var features = geodash.http.build_features(responses, fields_by_featuretype);
        console.log("Features: ", features);
        if(features.length > 0 )
        {
          var featureAndLocation = geodash.vecmath.getClosestFeatureAndLocation(features, targetLocation);
          var fl = featurelayers_by_featuretype[featureAndLocation.feature.featuretype] || featurelayers_by_featuretype["geonode:"+featureAndLocation.feature.featuretype];
          $scope.$broadcast("openPopup", {
            'featureLayer': fl,
            'feature': featureAndLocation.feature,
            'location': geodash.normalize.point(featureAndLocation.location)
          });
        }
        else
        {
          $("#popup").popover('destroy');
        }
      });
    }
    else
    {
      $("#popup").popover('destroy');
    }
  }
};
