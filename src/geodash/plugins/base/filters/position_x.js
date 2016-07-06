geodash.filters["position_x"] = function()
{
    return function(domain, index, containerWidth, padding)
    {
      var parse_container_width = function(w)
      {
        return $.isNumeric(w) ? w : parseInt(w.substring(0, w.indexOf('px')), 10);
      };
      var actualWidth = parse_container_width(containerWidth) - (padding * 2);
      return padding + (actualWidth * index / domain);
    };
};
