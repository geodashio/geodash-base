geodash.tilemath = {
  "D2R": Math.PI / 180,
  "R2D": 180 / Math.PI
};

geodash.tilemath.point_to_bbox = function(x, y, z, digits)
{
  var radius = geodash.tilemath.point_to_radius(z);
  var e = x + radius; if(digits != undefined && digits >= 0){e = e.toFixed(digits);}
  var w = x - radius; if(digits != undefined && digits >= 0){w = w.toFixed(digits);}
  var s = y - radius; if(digits != undefined && digits >= 0){s = s.toFixed(digits);}
  var n = y + radius; if(digits != undefined && digits >= 0){n = n.toFixed(digits);}
  return [w, s, e, n];
};

geodash.tilemath.point_to_radius = function(z)
{
  return (geodash.config.click_radius || 4.0) / z;
};

geodash.tilemath.tms_to_bbox = function(x, y, z)
{
  var e = geodash.tilemath.tile_to_lon(x+1, z);
  var w = geodash.tilemath.tile_to_lon(x, z);
  var s = geodash.tilemath.tile_to_lat(y+1, z);
  var n = geodash.tilemath.tile_to_lat(y, z);
  return [w, s, e, n];
};


geodash.tilemath.tile_to_lon = function(x, z)
{
  return x / Math.pow(2, z) * 360-180;
};


geodash.tilemath.tile_to_lat = function(y, z)
{
  n = Math.pi - 2 * Math.PI * y / Math.pow(2,z);
  return ( R2D * Math.atan(0.5 * ( Math.exp(n) - Math.exp(-n))));
};
