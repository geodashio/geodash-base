/**
 * init_state will overwrite the default state from the server with params in the url.
 * @param {Object} state - Initial state from server
 */
geodash.init_state = function(state, stateschema)
{
  var newState = $.extend({}, state);

  // Update View
  var lat = getHashValueAsFloat(["latitude", "lat", "y"]) || state["lat"] || 0.0;
  var lon = getHashValueAsFloat(["longitude", "lon", "long", "lng", "x"]) || state["lon"] || 0.0;
  var z = getHashValueAsInteger(["zoom", "z"]) || state["z"] || 3;
  var delta = {'lat': lat, 'lon': lon, 'z': z};
  newState["view"] = newState["view"] != undefined ? $.extend(newState["view"], delta) : delta;

  // Update Filters
  if(newState["filters"] != undefined)
  {
    $.each(newState["filters"], function(layer_id, layer_filters){
      $.each(layer_filters, function(filter_id, filer_value){
        var type = stateschema["filters"][layer_id][filter_id].toLowerCase();
        var value = getHashValue(layer_id+":"+filter_id, type);
        if(value != undefined && value != "")
        {
          newState["filters"][layer_id][filter_id] = value;
        }
      });
    });
  }

  // Update Filters
  if(newState["styles"] != undefined)
  {
    /*
    $.each(newState["styles"], function(layer_id, layer_style){
      var type = stateschema["filters"][layer_id][filter_id].toLowerCase();
      var value = getHashValue("style:"+layer_id, type);
      if(value != undefined && value != "")
      {
        newState["filters"][layer_id][filter_id] = value;
      }
    });*/
  }

  return newState;
};
