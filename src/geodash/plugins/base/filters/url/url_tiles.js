
geodash.filters["url_tiles"] = function()
{
    return function(layer)
    {
        var url = "";
        if("gwc" in layer)
        {
          var typename = "";
          if("layers" in layer.wms)
          {
            typename = layer.wms.layers[0];
          }
          else if("layers" in layer.wfs)
          {
            typename = layer.wfs.layers[0];
          }
          url = layer.gwc.url.replace("{typename}", encodeURIComponent(typename));
        }
        return url;
    };
};
