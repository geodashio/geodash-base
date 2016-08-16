geodash.layers = {};

geodash.layers.aggregate_fields = function(featureLayer)
{
  var fields = [];
  var panes = extract("popup.panes", featureLayer, undefined);
  if(panes != undefined)
  {
    for(var i = 0; i < panes.length; i++)
    {
      fields = fields.concat(panes[i].fields);
    }
  }
  return fields;
};
geodash.layers.init_baselayers = function(map, baselayers)
{
  var layers = {};
  for(var i = 0; i < baselayers.length; i++)
  {
      var bl = baselayers[i];
      var type = extract("source.type", bl, 'tile');
      var attribution = extract("source.attribution", bl, undefined);
      var url = undefined;
      if(type.toLowerCase() == "mapbox")
      {
        var mb_layers = extract("source.mapbox.layers", bl, undefined);
        var mb_access_token = extract("source.mapbox.access_token", bl, undefined);
        if(mb_layers == undefined || mb_access_token == undefined)
        {
          console.log("MapBox Layers missing config.", bl);
        }
        else
        {
          url = "http://{s}.tiles.mapbox.com/v4/"+mb_layers+"/{z}/{x}/{y}.png?access_token="+mb_access_token;
        }
      }
      else if(type.toLowerCase() == "gwc")
      {
        var gwc_url = extract("source.gwc.url", bl, undefined);
        var gwc_layers = extract("source.gwc.layers", bl, undefined);
        if(gwc_url == undefined || gwc_layers == undefined)
        {
          console.log("GWC Layers missing config.", bl);
        }
        else
        {
          url = gwc_url+(gwc_url.endsWith("/")?'':'/')+"service/tms/1.0.0/"+gwc_layers+"@EPSG:900913@png/{z}/{x}/{y}.png";
        }
      }
      else if(type.toLowerCase() in ["tile", "tiles"])
      {
        url = extract("source.tile.url", bl, undefined);
      }
      url = url || extract("source.url", bl, undefined);
      try{
        layers[bl.id] = L.tileLayer(url, {
            id: bl.id,
            attribution: attribution
        });
      }catch(err){console.log("Could not add baselayer "+i);}
  }
  return layers;
};
geodash.layers.init_featurelayer_post = function($scope, live, id, fl, visible)
{
  if(fl != undefined)
  {
    if(visible != undefined ? visible : true)
    {
      fl.addTo(live["map"]);
    }
    geodash.api.intend("layerLoaded", {'type':'featurelayer', 'layer': id, 'visible': visible}, $scope);
  }
  else
  {
    console.log("Could not add featurelayer "+id+" because it is undefined.");
  }
};
geodash.layers.init_featurelayer_wms = function($scope, live, map_config, id, layerConfig)
{
  var w = layerConfig.wms;
  if(extract("auth", layerConfig, "") == "basic")
  {
    var auth_url = w.url + (w.url.indexOf("?") != -1 ? '&' : '?') + "SERVICE=WMS&REQUEST=GetCapabilities"
    $.ajax({
      url: auth_url,
      type: "GET",
      dataType: "jsonp",
      jsonp: "callback",
      beforeSend: function(xhr){
        xhr.setRequestHeader("Authorization", "Basic "+btoa("null:null"));
        console.log(xhr);
      },
      error: function(){},
      success: function(){},
      complete: function(response){
        var fl = L.tileLayer.wms(w.url, {
          renderOrder: $.inArray(id, map_config.renderlayers),
          buffer: w.buffer || 0,
          version: w.version || "1.1.1",
          layers: (Array.isArray(w.layers) ? w.layers.join(",") : w.layers),
          styles: angular.isDefined(w.styles) ? w.styles.join(",") : '',
          format: w.format || 'image/png',
          transparent: angular.isDefined(w.transparent) ? w.transparent : true,
          attribution: extract("source.attribution", layerConfig, undefined)
        });
        live["featurelayers"][id] = fl;
        geodash.layers.init_featurelayer_post($scope, live, id, fl, layerConfig.visible);
      }
    });
  }
  else
  {
    var fl = L.tileLayer.wms(w.url, {
      renderOrder: $.inArray(id, map_config.renderlayers),
      buffer: w.buffer || 0,
      version: w.version || "1.1.1",
      layers: (Array.isArray(w.layers) ? w.layers.join(",") : w.layers),
      styles: angular.isDefined(w.styles) ? w.styles.join(",") : '',
      format: w.format || 'image/png',
      transparent: angular.isDefined(w.transparent) ? w.transparent : true,
      attribution: extract("source.attribution", layerConfig, undefined)
    });
    live["featurelayers"][id] = fl;
    geodash.layers.init_featurelayer_post($scope, live, id, fl, layerConfig.visible);
  }
};
geodash.layers.init_featurelayer_wmts = function($scope, live, map_config, id, layerConfig)
{
  var w = layerConfig.wmts;
  if(extract("auth", layerConfig, "") == "basic")
  {
    var auth_url = w.url + (w.url.indexOf("?") != -1 ? '&' : '?') + "SERVICE=WMS&REQUEST=GetCapabilities"
    $.ajax({
      url: auth_url,
      type: "GET",
      dataType: "jsonp",
      jsonp: "callback",
      beforeSend: function(xhr){
        xhr.setRequestHeader("Authorization", "Basic "+btoa("null:null"));
      },
      error: function(){},
      success: function(){},
      complete: function(response){
        var fl = L.tileLayer.wmts(w.url, {
          renderOrder: $.inArray(id, map_config.renderlayers),
          version: w.version || "1.0.0",
          layer: (Array.isArray(w.layers) ? w.layers.join(",") : w.layers),
          styles: angular.isDefined(w.styles) ? w.styles.join(",") : '',
          format: w.format || 'image/png',
          transparent: angular.isDefined(w.transparent) ? w.transparent : true,
          attribution: extract("source.attribution", layerConfig, undefined),
          tilematrixSet: "EPSG:3857",
          minZoom: extract("view.minZoom", layerConfig, 0),
          maxZoom: extract("view.maxZoom", layerConfig, 18),
          maxNativeZoom: extract("source.maxZoom", layerConfig, null)
        });
        live["featurelayers"][id] = fl;
        geodash.layers.init_featurelayer_post($scope, live, id, fl, layerConfig.visible);
      }
    });
  }
  else
  {
    var fl = L.tileLayer.wmts(w.url, {
      renderOrder: $.inArray(id, map_config.renderlayers),
      version: w.version || "1.0.0",
      layer: (Array.isArray(w.layers) ? w.layers.join(",") : w.layers),
      styles: angular.isDefined(w.styles) ? w.styles.join(",") : '',
      format: w.format || 'image/png',
      transparent: angular.isDefined(w.transparent) ? w.transparent : true,
      attribution: extract("source.attribution", layerConfig, undefined),
      tilematrixSet: "EPSG:3857",
      minZoom: extract("view.minZoom", layerConfig, 0),
      maxZoom: extract("view.maxZoom", layerConfig, 18),
      maxNativeZoom: extract("source.maxZoom", layerConfig, null)
    });
    live["featurelayers"][id] = fl;
    geodash.layers.init_featurelayer_post($scope, live, id, fl, layerConfig.visible);
  }
};
geodash.layers.init_featurelayer_geojson = function($scope, live, map_config, id, layerConfig)
{
  var url = extract("geojson.url", layerConfig) || extract("source.url", layerConfig) || extract("url", layerConfig);
  $.ajax({
    url: url,
    dataType: "json",
    success: function(response){
      var fl = undefined;
      if(layerConfig.transform == "heatmap")
      {
        var heatLayerData = [];
        var maxIntensity = 0;
        for(var i = 0; i < response[0]["features"].length; i++)
        {
          var intensity = ("attribute" in layerConfig["heatmap"] && layerConfig["heatmap"]["attribute"] != "") ? response[0]["features"][i]["properties"][layerConfig["heatmap"]["attribute"]] : 1.0;
          heatLayerData.push([
            response[0]["features"][i]["geometry"]["coordinates"][1],
            response[0]["features"][i]["geometry"]["coordinates"][0],
            intensity
          ]);
          if(intensity > maxIntensity)
          {
            maxIntensity = intensity;
          }
        }
        for(var i = 0; i < heatLayerData.length; i++)
        {
          heatLayerData[i][2] = heatLayerData[i][2] / maxIntensity;
        }

        var canvas = L.heatCanvas();
        fl = L.heatLayer(heatLayerData, {
          "renderer": canvas,
          "attribution": layerConfig["source"]["attribution"],
          "radius": (layerConfig["heatmap"]["radius"] || 25),
          "blur": (layerConfig["heatmap"]["blur"] || 15),
          "max": (layerConfig["heatmap"]["max"] || 1.0),
          "minOpacity": (layerConfig["heatmap"]["minOpacity"] || 0.5)
        });
      }
      else
      {
        fl = L.geoJson(response, {
          attribution: layerConfig.source.attribution
        });
      }
      live["featurelayers"][id] = fl;
      geodash.layers.init_featurelayer_post($scope, live, id, fl, layerConfig.visible);
    }
  });
};
geodash.layers.init_featurelayer = function(id, layerConfig, $scope, live, map_config)
{
  if(layerConfig.enabled == undefined || layerConfig.enabled == true)
  {
    if(layerConfig.type.toLowerCase() == "geojson")
    {
      geodash.layers.init_featurelayer_geojson($scope, live, map_config, id, layerConfig);
    }
    else if(layerConfig.type.toLowerCase() == "wms")
    {
      geodash.layers.init_featurelayer_wms($scope, live, map_config, id, layerConfig);
    }
    else if(layerConfig.type.toLowerCase() == "wmts")
    {
      geodash.layers.init_featurelayer_wmts($scope, live, map_config, id, layerConfig);
    }
  }
};
geodash.layers.init_featurelayers = function(featureLayers, $scope, live, map_config)
{
  $.each(featureLayers, function(i, layerConfig){
    geodash.layers.init_featurelayer(layerConfig.id, layerConfig, $scope, live, map_config);
  });
};
