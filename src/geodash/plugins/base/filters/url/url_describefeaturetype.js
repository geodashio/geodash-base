geodash.filters["url_describefeaturetype"] = function()
{
    return function(layer)
    {
        var url = "";
        if("wfs" in layer)
        {
          var version = layer.wfs.version || "1.0.0";
          var params = {
            "service": "WFS",
            "request": "DescribeFeatureType",
            "version": version,
            "outputFormat": "application/json"
          };

          var typename = "";
          if("layers" in layer.wms)
          {
            typename = layer.wms.layers.unique().join(",");
          }
          else if("layers" in layer.wfs)
          {
            typename = layer.wfs.layers.unique().join(",");
          }
          if(version == "1.1.0" || version == "1.0.0")
          {
            params["typeName"] = typename;
          }
          else
          {
            params["typeNames"] = typename;
          }

          var querystring = $.map(params, function(v, k){return encodeURIComponent(k) + '=' + encodeURIComponent(v);}).join("&");
          url = layer.wfs.url + "?" + querystring;
        }
        return url;
    };
};
