geodash.handlers["clickedOnMap"] = function($scope, $interpolate, $http, $q, event, args) {
  console.log('event', event);
  console.log('args', args);
  //
  var $scope = geodash.api.getScope("geodash-main");
  var z = $scope.state.view.z;
  var visibleFeatureLayers = $scope.state.view.featurelayers;
  console.log("visibleFeatureLayers", visibleFeatureLayers);
  var featurelayers_by_featuretype = {};
  var fields_by_featuretype = {};
  var urls = [];
  for(var i = 0; i < visibleFeatureLayers.length; i++)
  {
    var fl = geodash.api.getFeatureLayer(visibleFeatureLayers[i], {"scope": $scope});
    if("wfs" in fl && fl.wfs != undefined)
    {
      var params = {
        service: "wfs",
        version: extract("wfs.version", fl, '1.0.0'),
        request: "GetFeature",
        srsName: "EPSG:4326",
      };

      //var targetLocation = new L.LatLng(args.lat, args.lon);
      var targetLocation = geodash.normalize.point(args);
      var bbox = geodash.tilemath.point_to_bbox(args.lon, args.lat, z, 4).join(",");
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
  });
};
