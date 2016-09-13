(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function(x)
{
  var y = {};
  if(angular.isArray(x))
  {
    for(var i = 0; i < x.length; i++)
    {
      y[x[i].name] = x[i].value;
    }
  }
  return y;
}

},{}],2:[function(require,module,exports){
module.exports = function(event, args)
{
  var mainScope = geodash.api.getScope("geodash-main");
  //
  var id = args["id_target"] || args["id_show"] || args["id"];
  var sourceScope = event.targetScope;
  var scope_new = {
    "state": mainScope.state,
    "meta": geodash.meta
  };
  if(angular.isDefined(args))
  {
    if("static" in args)
    {
      scope_new = $.extend(scope_new, args["static"]);
    }
    if("dynamic" in args)
    {
      $.each(args["dynamic"],function(key, value){
        if(angular.isString(value))
        {
          if(value == "map_config")
          {
            scope_new[key] = mainScope.map_config;
          }
          else if(value == "state")
          {
            scope_new[key] = mainScope.state;
          }
        }
        else if(angular.isArray(value))
        {
          var value_0_lc = value[0].toLowerCase();
          if(value_0_lc == "source")
          {
            scope_new[key] = extract(expand(value.slice(1)), event.targetScope);
          }
          else if(value_0_lc == "baselayer" || value_0_lc == "bl")
          {
              scope_new[key] = geodash.api.getBaseLayer(value[1]) || undefined;
          }
          else if(value_0_lc == "featurelayer" || value_0_lc == "fl")
          {
              scope_new[key] = geodash.api.getFeatureLayer(value[1]) || undefined;
          }
          else
          {
            if(value_0_lc == "map_config")
            {
              scope_new[key] = extract(expand(value.slice(1)), mainScope.map_config);
            }
            else if(value_0_lc == "state")
            {
              scope_new[key] = extract(expand(value.slice(1)), mainScope.state);
            }
          }
        }
        else
        {
          scope_new[key] = value;
        }
      });
    }
  }
  return $.extend(true, {}, scope_new);  // Returns a deep copy of variables
};

},{}],3:[function(require,module,exports){
//module.exports = function(field_flat, value, target)
module.exports = function(keyChain, target)
{
  // Update map_config
  if(angular.isString(keyChain))
  {
    keyChain = keyChain.split("__");
  }

  if(keyChain.length == 1)
  {
    delete target[keyChain[0]];
  }
  else
  {
    for(var j = 0; j < keyChain.length -1 ; j++)
    {
      var newKey = keyChain[j];
      if(!(newKey in target))
      {
        var iTest = -1;
        try{iTest = parseInt(keyChain[j+1], 10);}catch(err){iTest = -1;};
        target[newKey] = iTest >= 0 ? [] : {};
      }
      target = target[newKey];
    }
    var finalKey = keyChain[keyChain.length-1];
    delete target[finalKey];
  }
};

},{}],4:[function(require,module,exports){
module.exports = function(x)
{
  if(Array.isArray(x))
  {
    return $.extend(true, [], x);
  }
  else if(angular.isString(x) || angular.isNumber(x))
  {
    return x;
  }
  else if(angular.isDefined(x))
  {
    return $.extend(true, {}, x);
  }
};

},{}],5:[function(require,module,exports){
module.exports = function(obj, prefix)
{
  var newObject = {};
  $.each(obj, function(key, value){
    var newKey = prefix != undefined ? prefix+"__"+key : key;
    if(
      (value === undefined) ||
      (value === null) ||
      angular.isString(value) ||
      angular.isNumber(value) ||
      (typeof value == "boolean")
    )
    {
      newObject[newKey] = value;
    }
    else if(angular.isArray(value))
    {
      $.each(geodash.api.flatten(value, newKey), function(key2, value2){
        newObject[""+key2] = value2;
      });
    }
    else
    {
      $.each(geodash.api.flatten(value, newKey), function(key2, value2){
        newObject[key2] = value2;
      });
    }
  });
  return newObject;
};

},{}],6:[function(require,module,exports){
module.exports = function(id, options)
{
  var config = geodash.api.getDashboardConfig(options);
  return geodash.api.getLayer(id, config.baselayers);
};

},{}],7:[function(require,module,exports){
module.exports = function(options)
{
  var scope = geodash.api.getOption(options, '$scope') ||
    geodash.api.getOption(options, 'scope') ||
    geodash.api.getScope("geodash-main");
  return scope.map_config;
};

},{}],8:[function(require,module,exports){
module.exports = function(name)
{
  return geodash.initial_data.data.endpoints[name];
};

},{}],9:[function(require,module,exports){
module.exports = function(id, options)
{
  var config = geodash.api.getDashboardConfig(options);
  return geodash.api.getLayer(id, config.featurelayers);
};

},{}],10:[function(require,module,exports){
module.exports = function(id, layers)
{
  var layer = undefined;
  var matches = $.grep(layers, function(x, i){ return x.id == id; });
  if(matches.length == 1)
  {
    layer = matches[0];
  }
  return layer;
};

},{}],11:[function(require,module,exports){
module.exports = function(options, name)
{
  if(options != undefined && options != null)
  {
    return options[name];
  }
  else
  {
    return undefined;
  }
};

},{}],12:[function(require,module,exports){
module.exports = function(id, options)
{
  var config = geodash.api.getDashboardConfig(options);
  var matches = $.grep(config.pages, function(x, i){return x.id == id;});
  if(matches.length == 1)
  {
    return matches[0]["url"];
  }
  else
  {
    return undefined;
  }
};

},{}],13:[function(require,module,exports){
module.exports = function(id)
{
  return angular.element("#"+id).isolateScope() || angular.element("#"+id).scope();
};

},{}],14:[function(require,module,exports){
module.exports = function(id, options)
{
  var config = geodash.api.getDashboardConfig(options);
  return geodash.api.hasLayer(id, config.baselayers);
};

},{}],15:[function(require,module,exports){
module.exports = function(id, options)
{
  var config = geodash.api.getDashboardConfig(options);
  return geodash.api.hasLayer(id, config.featurelayers);
};

},{}],16:[function(require,module,exports){
module.exports = function(id, layers)
{
  var layer = undefined;
  var matches = $.grep(layers, function(x, i){ return x.id == id; });
  return matches.length == 1;
};

},{}],17:[function(require,module,exports){
'use strict';
//var getScope = require("./getScope");
module.exports = {
  arrayToObject: require("./arrayToObject"),
  buildScope: require("./buildScope"),
  clearValue: require("./clearValue"),
  deepCopy: require("./deepCopy"),
  flatten: require("./flatten"),
  getBaseLayer: require("./getBaseLayer"),
  getDashboardConfig: require("./getDashboardConfig"),
  getEndpoint: require("./getEndpoint"),
  getFeatureLayer: require("./getFeatureLayer"),
  getLayer: require("./getLayer"),
  getOption: require("./getOption"),
  getPage: require("./getPage"),
  getScope: require("./getScope"),
  hasBaseLayer: require("./hasBaseLayer"),
  hasFeatureLayer: require("./hasFeatureLayer"),
  hasLayer: require("./hasLayer"),
  intend: require("./intend"),
  listBaseLayers: require("./listBaseLayers"),
  listFeatureLayers: require("./listFeatureLayers"),
  listServers: require("./listServers"),
  listTegolaServers: require("./listTegolaServers"),
  listWMSServers: require("./listWMSServers"),
  opt_b: require("./opt_b"),
  opt_i: require("./opt_i"),
  opt_j: require("./opt_j"),
  opt_s: require("./opt_s"),
  opt: require("./opt"),
  parseTrue: require("./parseTrue"),
  setValue: require("./setValue"),
  unpack: require("./unpack"),
  updateValue: require("./updateValue"),
  welcome: require("./welcome")
};

},{"./arrayToObject":1,"./buildScope":2,"./clearValue":3,"./deepCopy":4,"./flatten":5,"./getBaseLayer":6,"./getDashboardConfig":7,"./getEndpoint":8,"./getFeatureLayer":9,"./getLayer":10,"./getOption":11,"./getPage":12,"./getScope":13,"./hasBaseLayer":14,"./hasFeatureLayer":15,"./hasLayer":16,"./intend":18,"./listBaseLayers":19,"./listFeatureLayers":20,"./listServers":21,"./listTegolaServers":22,"./listWMSServers":23,"./opt":24,"./opt_b":25,"./opt_i":26,"./opt_j":27,"./opt_s":28,"./parseTrue":29,"./setValue":30,"./unpack":31,"./updateValue":32,"./welcome":33}],18:[function(require,module,exports){
/**
 * Used for intents (requesting and action), such as opening modals, zooming the map, etc.
 * @param {string} name of the intent (toggleModal, refreshMap, filterChanged)
 * @param {object} JSON package for intent
 * @param {object} Angular Scope object for emiting the event up the DOM.  This should correspond to an element's paranet controller.
*/
module.exports = function(name, data, scope)
{
  scope.$emit(name, data);
};

},{}],19:[function(require,module,exports){
module.exports = function(options)
{
  var config = geodash.api.getDashboardConfig(options);
  return extract("baselayers", config, []);
};

},{}],20:[function(require,module,exports){
module.exports = function(options)
{
  var config = geodash.api.getDashboardConfig(options);
  return extract("featurelayers", config, []);
};

},{}],21:[function(require,module,exports){
module.exports = function(options)
{
  var config = geodash.api.getDashboardConfig(options);
  return extract("servers", config, []);
};

},{}],22:[function(require,module,exports){
module.exports = function(options)
{
  var config = geodash.api.getDashboardConfig(options);
  var servers = extract("servers", config, [])
  return $.grep(servers, function(x, i){
    return extract("type", x, undefined) == "tegola";
  });
};

},{}],23:[function(require,module,exports){
module.exports = function(options)
{
  var config = geodash.api.getDashboardConfig(options);
  var servers = extract("servers", config, [])
  return $.grep(servers, function(x, i){
    return extract("type", x, undefined) == "wms";
  });
};

},{}],24:[function(require,module,exports){
module.exports = function(options, names, fallback, fallback2)
{
  if(options != undefined)
  {
    if($.isArray(names))
    {
      var value = undefined;
      for(var i = 0; i < names.length; i++)
      {
        value = options[names[i]];
        if(value != undefined)
            break;
      }
      return value || fallback || fallback2;
    }
    else
        return options[names] || fallback ||  fallback2;
  }
  else
      return fallback || fallback2;
};

},{}],25:[function(require,module,exports){
module.exports = function(options, names, fallback)
{
  return geodash.api.opt(options, names, fallback, false);
};

},{}],26:[function(require,module,exports){
module.exports = function(options, names, fallback)
{
  return geodash.api.opt(options, names, fallback, 0);
};

},{}],27:[function(require,module,exports){
module.exports = function(options, names, fallback)
{
  return geodash.api.opt(options, names, fallback, {});
};

},{}],28:[function(require,module,exports){
module.exports = function(options, names, fallback)
{
  return geodash.api.opt(options, names, fallback, "");
};

},{}],29:[function(require,module,exports){
module.exports = function(value)
{
  return ['on', 'true', 't', '1', 1, true].indexOf(value) != -1;
};

},{}],30:[function(require,module,exports){
//module.exports = function(field_flat, value, target)
module.exports = function(keyChain, value, target)
{
  // Update map_config
  if(angular.isString(keyChain))
  {
    keyChain = keyChain.split("__");
  }

  if(keyChain.length == 1)
  {
    target[keyChain[0]] = value;
  }
  else
  {
    for(var j = 0; j < keyChain.length -1 ; j++)
    {
      var newKey = keyChain[j];
      if(!(newKey in target))
      {
        var iTest = -1;
        try{iTest = parseInt(keyChain[j+1], 10);}catch(err){iTest = -1;};
        target[newKey] = iTest >= 0 ? [] : {};
      }
      target = target[newKey];
    }
    var finalKey = keyChain[keyChain.length-1];
    if(angular.isArray(target))
    {
      if(finalKey >= target.length)
      {
        var zeros = finalKey - target.length;
        for(var k = 0; k < zeros; k++ )
        {
          target.push({});
        }
        target.push(value);
      }
    }
    else
    {
      target[finalKey] = value;
    }
  }
};

},{}],31:[function(require,module,exports){
module.exports = function(obj)
{
  var newObject = {};
  $.each(obj, function(key, value){
    if(key.indexOf("__") == -1)
    {
      newObject[key] = value;
    }
    else
    {
      var keyChain = key.split("__");
      var target = obj;
      for(var j = 0; j < keyChain.length; j++)
      {
        var newKey = keyChain[j];
        if(!(newKey in target))
        {
          target[newKey] = {};
        }
        target = target[newKey];
      }
      target[keyChain[keyChain.length-1]] = value;
    }
  });
  return newObject;
};

},{}],32:[function(require,module,exports){
module.exports = function(field_flat, source, target)
{
  // Update map_config
  if(field_flat.indexOf("__") == -1)
  {
    target[field_flat] = source[field_flat];
  }
  else
  {
    var keyChain = field_flat.split("__");
    for(var j = 0; j < keyChain.length -1 ; j++)
    {
      var newKey = keyChain[j];
      if(!(newKey in target))
      {
        var iTest = -1;
        try{iTest = parseInt(keyChain[j+1], 10);}catch(err){iTest = -1;};
        target[newKey] = iTest >= 0 ? [] : {};
      }
      target = target[newKey];
    }
    var finalKey = keyChain[keyChain.length-1];
    if(angular.isArray(target))
    {
      if(finalKey >= target.length)
      {
        var zeros = finalKey - target.length;
        for(var k = 0; k < zeros; k++ )
        {
          target.push({});
        }
        target.push(source[field_flat]);
      }
    }
    else
    {
      target[finalKey] = source[field_flat];
    }
  }
};

},{}],33:[function(require,module,exports){
module.exports = function(options)
{
  options = options || {};
  var scope = options['$scope'] || options['scope'] || angular.element("#geodash-main").scope();
  var intentData = {
    "id": "geodash-modal-welcome",
    "dynamic": {},
    "static": {
      "welcome": scope.map_config["welcome"]
    }
  };
  geodash.api.intend("toggleModal", intentData, scope);
};

},{}],34:[function(require,module,exports){
module.exports = function(x, length, fallback)
{
  if(x === undefined || x === "")
  {
    return fallback;
  }
  else if(angular.isString(x))
  {
    x = x.split(",");
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
  else if(angular.isArray(x))
  {
    if(x.length == length)
    {
      return x;
    }
    else
    {
      return fallback;
    }
  }
};

},{}],35:[function(require,module,exports){
'use strict';
module.exports = {
  array_length: require("./array_length")
};

},{"./array_length":34}],36:[function(require,module,exports){
module.exports = function(baselayers)
{
  var bloodhoundData = [];

  baselayers = baselayers || geodash.api.listBaseLayers();
  if(angular.isDefined(baselayers))
  {
    bloodhoundData = bloodhoundData.concat($.map(baselayers, function(x, i){
      return {'id': x.id, 'text': x.id};
    }));
  }

  return bloodhoundData;
};

},{}],37:[function(require,module,exports){
module.exports = function(response, url)
{
  var encoded = [];

  var dashboards = response.dashboards;
  for(var i = 0; i < dashboards.length; i++)
  {
    var dashboard = dashboards[i];
    var id = dashboard.id;
    var slug = dashboard.slug;
    var title = dashboard.title;
    var x = {
      'id': id,
      'slug': slug,
      'text': title,
    };
    encoded.push(x);
  }

  return encoded;
};

},{}],38:[function(require,module,exports){
module.exports = function(response, url)
{
  var layers = [];

  var tegolaMaps = response.maps;
  for(var i = 0; i < tegolaMaps.length; i++)
  {
    var tegolaMap = tegolaMaps[i];
    var name = tegolaMap.name;
    var newLayer = {
      'id': name,
      'text': name,
      'obj': {
        'id': name,
        'title': name,
        'description': name,
        'type': 'wms',
        'tegola': {
          'map': name,
          'url': extract("tegola.base", geodash.codec.parseURL(url, 'tegola'), ""),
          'debug': false
        }
      }
    };
    layers.push(newLayer);
  }

  return layers;
};

},{}],39:[function(require,module,exports){
module.exports = function(response, url)
{
  var layers = [];
  $(response).find('Capability').children('Layer').children('Layer').each(function(){
      //var f = $(this).find(typeName.indexOf(":") != -1 ? typeName.substring(typeName.indexOf(":") + 1) : typeName);
      var name = $(this).children('Name').text();
      var bbox = [
        $(this).children('EX_GeographicBoundingBox').children("westBoundLongitude").text(),
        $(this).children('EX_GeographicBoundingBox').children("southBoundLongitude").text(),
        $(this).children('EX_GeographicBoundingBox').children("eastBoundLongitude").text(),
        $(this).children('EX_GeographicBoundingBox').children("northBoundLongitude").text()
      ].join(",");
      var thumbnail = extract("wms.base", geodash.codec.parseURL(url, 'wms'), "") +
        "/reflect?" +
        [
          "format=image/png",
          "width=40",
          "height=40",
          "TIME=-99999999999-01-01T00:00:00.0Z/99999999999-01-01T00:00:00.0Z",
          "layers="+name
        ].join("&");
      var title = $(this).children('Title').text();
      var newLayer = {
        'id': name,
        'text': title,
        'obj': {
          'id': name,
          'title': title,
          'description': $(this).children('Abstract').text(),
          'type': 'wms',
          'wms': {
            'layers': name,
            'url': extract("wms.base", geodash.codec.parseURL(url, 'wms'), "")
          },
          'wfs': {
            'layers': name,
            'url': extract("wfs.base", geodash.codec.parseURL(url, 'wms'), "")
          }
        },
        'extra': {
          'bbox': bbox,
          'thumbnail': thumbnail
        }
      };
      layers.push(newLayer);
  });
  return layers;
};

},{}],40:[function(require,module,exports){
'use strict';
module.exports = {
  GeoDashCapabilities: require("./GeoDashCapabilities"),
  TegolaCapabilities: require("./TegolaCapabilities"),
  WMSCapabilities: require("./WMSCapabilities")
};

},{"./GeoDashCapabilities":37,"./TegolaCapabilities":38,"./WMSCapabilities":39}],41:[function(require,module,exports){
module.exports = function(d)
{
  return Bloodhound.tokenizers.whitespace(d.text);
};

},{}],42:[function(require,module,exports){
module.exports = function(local, prefetch, remote)
{
  var options = {
    identify: geodash.bloodhound.identify,
    datumTokenizer: geodash.bloodhound.datumTokenizer,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    local: local,
    prefetch: prefetch,
    remote: remote
  };
  var engine = new Bloodhound(options);
  return engine;
};

},{}],43:[function(require,module,exports){
module.exports = function(featurelayers)
{
  var bloodhoundData = [];

  featurelayers = featurelayers || geodash.api.listFeatureLayers();
  if(angular.isDefined(featurelayers))
  {
    bloodhoundData = bloodhoundData.concat($.map(featurelayers, function(x, i){
      return {'id': x.id, 'text': x.id};
    }));
  }

  return bloodhoundData;
};

},{}],44:[function(require,module,exports){
module.exports = function(obj) {
  return obj['text'];
};

},{}],45:[function(require,module,exports){
'use strict';
module.exports = {
  baselayers: require("./baselayers"),
  codec: require("./codec"),
  datumTokenizer: require("./datumTokenizer"),
  local: require("./local"),
  engine: require("./engine"),
  layers: require("./layers"),
  featurelayers: require("./featurelayers"),
  identify: require("./identify"),
  prefetch: require("./prefetch"),
  remote: require("./remote"),
  wfs: require("./wfs"),
  wms: require("./wms")
};

},{"./baselayers":36,"./codec":40,"./datumTokenizer":41,"./engine":42,"./featurelayers":43,"./identify":44,"./layers":46,"./local":47,"./prefetch":48,"./remote":49,"./wfs":50,"./wms":51}],46:[function(require,module,exports){
module.exports = function(featurelayers, baselayers)
{
  var bloodhoundData = [];

  featurelayers = featurelayers || geodash.api.listFeatureLayers();
  if(angular.isDefined(featurelayers))
  {
    bloodhoundData = bloodhoundData.concat($.map(featurelayers, function(x, i){
      return {
        'id': x.id,
        'text': x.title,
        'obj': x
      };
    }));
  }

  baselayers = baselayers || geodash.api.listBaseLayers();
  if(angular.isDefined(baselayers))
  {
    bloodhoundData = bloodhoundData.concat($.map(baselayers, function(x, i){
      return {
        'id': x.id,
        'text': x.title,
        'obj': x
      };
    }));
  }

  return bloodhoundData;
};

},{}],47:[function(require,module,exports){
module.exports = function(initialData, featurelayers, baselayers, servers)
{
  var bloodhoundData = undefined;

  if(angular.isString(initialData))
  {
    if(initialData == "layers")
    {
      bloodhoundData = geodash.bloodhound.layers(featurelayers, baselayers);
    }
    else if(initialData == "featurelayers")
    {
      bloodhoundData = geodash.bloodhound.featurelayers(featurelayers);
    }
    else if(initialData == "baselayers")
    {
      bloodhoundData = geodash.bloodhound.baselayers(baselayers);
    }
    else if(initialData == "wms")
    {
      bloodhoundData = geodash.bloodhound.wms(servers);
    }
    else if(initialData.length > 0)
    {
      bloodhoundData = [].concat(geodash.initial_data["data"][initialData]);
      for(var i = 0; i < bloodhoundData.length; i++)
      {
        if(angular.isString(bloodhoundData[i]))
        {
          bloodhoundData[i] = {'id': bloodhoundData[i], 'text': bloodhoundData[i]};
        }
      }
    }
    else
    {
      bloodhoundData = undefined;
    }
  }
  else if(Array.isArray(initialData))
  {
    bloodhoundData = [].concat(initialData);
    for(var i = 0; i < bloodhoundData.length; i++)
    {
      if(angular.isString(bloodhoundData[i]))
      {
        bloodhoundData[i] = {'id': bloodhoundData[i], 'text': bloodhoundData[i]};
      }
    }
  }
  else
  {
    bloodhoundData = undefined;
  }

  if(angular.isDefined(bloodhoundData))
  {
    bloodhoundData.sort(function(a, b){
      var textA = a.text.toLowerCase();
      var textB = b.text.toLowerCase();
      if(textA < textB){ return -1; }
      else if(textA > textB){ return 1; }
      else { return 0; }
    });
  }

  return bloodhoundData;
};

},{}],48:[function(require,module,exports){
module.exports = function(options)
{
  if(angular.isDefined(options))
  {
    if(angular.isString(options))
    {
      return undefined;
    }
    else if(angular.isArray(options))
    {
      return undefined;
    }
    else if(angular.isString(options.url))
    {
      var url = options.url;
      var codecs = options.codecs || [geodash.bloodhound.codec];
      var codec = undefined;
      for(var i = 0; i < codecs.length; i++)
      {
        codec = extract(options.codec, codecs[i], undefined);
        if(angular.isDefined(codec))
        {
          break;
        }
      }
      var data = {
        'url': url,
        'dataType': extract('dataType', options, 'json'),
        'transform': codec,
        'wildcard': extract('wildcard', options, '%QUERY'),
        'cache': extract('cache', options, false)
      };
      return data;
    }
    else
    {
      return undefined;
    }
  }
  else
  {
    return undefined;
  }
};

},{}],49:[function(require,module,exports){
module.exports = function(options)
{
  if(angular.isDefined(options))
  {
    if(angular.isString(options))
    {
      return undefined;
    }
    else if(angular.isArray(options))
    {
      return undefined;
    }
    else if(angular.isString(options.url))
    {
      var url = options.url;
      var codecs = options.codecs || [geodash.bloodhound.codec];
      var codec = undefined;
      for(var i = 0; i < codecs.length; i++)
      {
        codec = extract(options.codec, codecs[i], undefined);
        if(angular.isDefined(codec))
        {
          break;
        }
      }
      var data = {
        'url': url,
        'dataType': extract('dataType', options, 'json'),
        'transform': codec,
        'wildcard': extract('wildcard', options, '%QUERY'),
        'rateLimitWait': extract('rate', options, 1000)
      };
      return data;
    }
    else
    {
      return undefined;
    }
  }
  else
  {
    return undefined;
  }
};

},{}],50:[function(require,module,exports){
module.exports = function(servers)
{
  var bloodhoundData = [];

  servers = servers || geodash.api.listServers();
  if(angular.isDefined(servers))
  {
    servers = $.grep(servers, function(x, i){
      return (extract("type", x, undefined) == "wms") && (extract('wfs.url', x, '').length > 0);
    });
    bloodhoundData = bloodhoundData.concat($.map(servers, function(x, i){
      var url = extract('wfs.url', x, '');
      return { 'id': url, 'text': url };
    }));
  }

  return bloodhoundData;
};

},{}],51:[function(require,module,exports){
module.exports = function(servers)
{
  var bloodhoundData = [];

  servers = servers || geodash.api.listServers();
  if(angular.isDefined(servers))
  {
    servers = $.grep(servers, function(x, i){
      return extract("type", x, undefined) == "wms";
    });
    bloodhoundData = bloodhoundData.concat($.map(servers, function(x, i){
      var url = extract('wms.url', x, '');
      return { 'id': url, 'text': url };
    }));
  }

  return bloodhoundData;
};

},{}],52:[function(require,module,exports){
module.exports = function(path, obj, fallback)
{
  var result = fallback || '';
  var x = extract(path, obj);
  if(Array.isArray(x))
  {
    result = x.join(",");
  }
  else if(angular.isString(x))
  {
    result = x;
  }
  return result;
};

},{}],53:[function(require,module,exports){
'use strict';
module.exports = {
  formatArray: require("./formatArray"),
  parseAttributes: require("./parseAttributes"),
  parseFeatures: require("./parseFeatures"),
  parseGeometry: require("./parseGeometry"),
  parseURL: require("./parseURL")
};

},{"./formatArray":52,"./parseAttributes":54,"./parseFeatures":55,"./parseGeometry":56,"./parseURL":57}],54:[function(require,module,exports){
module.exports = function(element, fields)
{
  var attributes = {};
  if(fields != undefined)
  {
    for(var k = 0; k < fields.length; k++)
    {
      var field = fields[k];
      var attributeName = field['output'] || field['attribute'];
      attributes[attributeName] = undefined;
      var inputName = field['attribute'] || field['input'];
      var inputNames = inputName != undefined ? [inputName] : field['inputs'];
      if(inputNames!= undefined)
      {
        for(var l = 0; l < inputNames.length; l++)
        {
          var inputName = inputNames[l];
          if(element.find("geonode\\:"+inputName).length > 0)
          {
            attributes[attributeName] = element.find("geonode\\:"+inputName).text();
            break;
          }
        }
      }
    }
  }
  return attributes;
};

},{}],55:[function(require,module,exports){
module.exports = function(response, fields_by_featuretype)
{
  var features = [];
  //features = new ol.format.GML3().readFeatures(response)
  $(response).find('gml\\:featuremember').each(function(){
      //var f = $(this).find(typeName.indexOf(":") != -1 ? typeName.substring(typeName.indexOf(":") + 1) : typeName);
      var f = $(this).children();
      var typeName = f.prop("tagName").toLowerCase();
      var attributes = geodash.codec.parseAttributes(f, fields_by_featuretype[typeName]);
      var geom = geodash.codec.parseGeometry(f);
      var newFeature = {
        'featuretype': typeName,
        'attributes': attributes,
        'geometry': geom
      };
      features.push(newFeature);
  });
  return features;
};

},{}],56:[function(require,module,exports){
module.exports = function(element)
{
  var geom = undefined;

  var attribute = element.find("geonode\\:shape");
  if(attribute.length == 0){ attribute = element.find("geonode\\:the_geom"); }

  if(attribute.find("gml\\:point").length > 0)
  {
    var coords = attribute.find("gml\\:point").find("gml\\:coordinates").text().split(",");
    //(new ol.format.GML3().readFeatures(response),
    if(typeof ol != "undefined")
    {
      geom = new ol.geom.Point([parseFloat(coords[0]), parseFloat(coords[1])]);
    }
    else
    {
      geom = new L.LatLng(parseFloat(coords[1]), parseFloat(coords[0]));
    }
  }
  else if(attribute.find("gml\\:multilinestring").length > 0)
  {
    var coords = attribute.find("gml\\:multilinestring")
      .find("gml\\:linestringmember")
      .find("gml\\:linestring")
      .find("gml\\:coordinates")
      .text().split(" ");
    coords = $.map(coords, function(x, i){
      var a = x.split(",");
      return [[parseFloat(a[0]), parseFloat(a[1])]];
    });
    var geojson = [{"type": "LineString","coordinates": coords}];
    geom = new L.GeoJSON(geojson, {});
  }
  else if(attribute.find("gml\\:multipolygon").length > 0)
  {
    var coords = attribute.find("gml\\:multipolygon")
      .find("gml\\:polygonmember")
      .find("gml\\:polygon")
      .find("gml\\:outerboundaryis")
      .find("gml\\:linearring")
      .find("gml\\:coordinates")
      .text().split(" ");
    coords = $.map(coords, function(x, i){
      var a = x.split(",");
      return [[parseFloat(a[0]), parseFloat(a[1])]];
    });
    var ring = [coords];
    var multipolygon = [ring];
    var geojson = [{
      "type": "MultiPolygon",
      "coordinates": multipolygon
    }];
    geom = new L.GeoJSON(geojson, {});
  }
  return geom;
};

},{}],57:[function(require,module,exports){
module.exports = function(url, serverType)
{
  if(angular.isString(url))
  {
    var data = undefined;
    if(serverType == "wms")
    {
      data = {
        'domain': url.replace('http://','').replace('https://','').split(/[/?#]/)[0],
        'wms': {
          'base': url.substring(0, url.indexOf("?"))
        },
        'wfs': {
          'base': url.substring(0, url.indexOf("?")).replace('/wms', '/wfs')
        }
      };
    }
    else if(serverType == "tegola")
    {
      data = {
        'domain': url.replace('http://','').replace('https://','').split(/[/?#]/)[0],
        'tegola': {
          'base': url.substring(0, url.indexOf("/capabilities"))
        }
      };
    }
    else if(serverType == "geojson")
    {
      data = {
        'domain': url.replace('http://','').replace('https://','').split(/[/?#]/)[0]
      };
    }
    else if(serverType == "tiles")
    {
      data = {
        'domain': url.replace('http://','').replace('https://','').split(/[/?#]/)[0]
      };
    }
    return data;
  }
  else
  {
    return undefined;
  }
};

},{}],58:[function(require,module,exports){
'use strict';
module.exports = {
  test: require("./test")
};

},{"./test":59}],59:[function(require,module,exports){
module.exports = function(f, state, map_config, options)
{
  var idx = parseInt(f.id_.split(".")[1],10);
  var colors = [
    'lightBlue',
    'coral',
    'darkOrange',
    'deepPink',
    'green',
    'indigo'
  ];
  var delta = {
    'fillColor': colors[idx % colors.length]
  };
  return delta;
};

},{}],60:[function(require,module,exports){
module.exports = function(responses, fields_by_featuretype)
{
  var features = [];
  for(var i = 0; i < responses.length; i++)
  {
    var response = responses[i];
    if(response.status == 200)
    {
      var data = response.data;
      features = features.concat(geodash.codec.parseFeatures(data, fields_by_featuretype));
    }
  }
  return features;
};

},{}],61:[function(require,module,exports){
module.exports = function($http, urls)
{
  var promises = [];
  for(var i = 0; i < urls.length; i++)
  {
    var url = urls[i];
    var config = {};
    var promise = $http.get(url, config);
    promises.push(promise);
  }
  return promises;
};

},{}],62:[function(require,module,exports){
'use strict';
module.exports = {
  build_promises: require("./build_promises"),
  build_features: require("./build_features")
};

},{"./build_features":60,"./build_promises":61}],63:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  api: require("./api"),
  assert: require("./assert"),
  bloodhound: require("./bloodhound"),
  codec: require("./codec"),
  dynamicStyleFn: require("./dynamicStyleFn"),
  http: require("./http"),
  controllers: {},
  directives: {},
  filters: {},
  handlers: {},
  init: require("./init"),
  layers: require("./layers"),
  listeners: require("./listeners"),
  log: require("./log"),
  normalize: require("./normalize"),
  popup: require("./popup"),
  style: require("./style"),
  tilemath: require("./tilemath"),
  typeahead: require("./typeahead"),
  ui: require("./ui"),
  vecmath: require("./vecmath"),
  var: {
    logs: {}
  }
};

},{"./api":17,"./assert":35,"./bloodhound":45,"./codec":53,"./dynamicStyleFn":58,"./http":62,"./init":70,"./layers":78,"./listeners":91,"./log":97,"./normalize":102,"./popup":108,"./style":110,"./tilemath":115,"./typeahead":129,"./ui":139,"./vecmath":149}],64:[function(require,module,exports){
module.exports = function(that, app, controller)
{
  var controllerName = that.data('controllerName') || that.attr('geodash-controller') || that.attr('name') || that.attr('id');
  if(controllerName == undefined || controllerName == null || controllerName == "")
  {
    console.log("Error: Could not load controller for element, because name could not be resolved");
    console.log(that, controller);
  }
  else
  {
    app.controller(controllerName, controller || geodash.controllers.GeoDashControllerBase);
  }
};

},{}],65:[function(require,module,exports){
module.exports = function(app)
{
  app.controller("GeoDashControllerBase", geodash.controllers.controller_base);
};

},{}],66:[function(require,module,exports){
module.exports = function(that, app, controllers)
{
  for(var i = 0; i < controllers.length; i++)
  {
    var c = controllers[i];
    $(c.selector, that).each(function(){
        try
        {
          geodash.init.controller($(this), app, c.controller);
        }
        catch(err)
        {
          console.log("Could not load GeoDash Controller \""+c.selector+"\"", err);
        }
    });
  }
};

},{}],67:[function(require,module,exports){
module.exports = function(app)
{
  if(geodash.directives != undefined)
  {
    geodash.meta.directives = [];
    $.each(geodash.directives, function(name, dir){
      geodash.meta.directives.push(name);
      app.directive(name, dir);
    });
  }
};

},{}],68:[function(require,module,exports){
module.exports = function(app)
{

  app.factory('state', function(){return angular.extend({}, geodash.initial_state);});
  app.factory('stateschema', function(){return angular.extend({}, geodash.state_schema);});
  app.factory('map_config', function(){return angular.extend({}, geodash.map_config);});
  app.factory('live', function(){
    return {
      "map": undefined,
      "baselayers": {},
      "featurelayers": {}
    };
  });

};

},{}],69:[function(require,module,exports){
module.exports = function(app)
{
  if(geodash.filters != undefined)
  {
    geodash.meta.filters = [];
    $.each(geodash.filters, function(name, func){
      geodash.meta.filters.push(name);
      app.filter(name, func);
    });
  }
};

},{}],70:[function(require,module,exports){
'use strict';
module.exports = {
  controller_base: require("./controller_base"),
  controller: require("./controller"),
  controllers: require("./controllers"),
  directives: require("./directives"),
  factory: require("./factory"),
  filters: require("./filters"),
  listeners: require("./listeners"),
  map_leaflet: require("./map_leaflet"),
  map_ol3: require("./map_ol3"),
  state: require("./state"),
  templates: require("./templates"),
  typeahead: require("./typeahead")
};

},{"./controller":64,"./controller_base":65,"./controllers":66,"./directives":67,"./factory":68,"./filters":69,"./listeners":71,"./map_leaflet":72,"./map_ol3":73,"./state":74,"./templates":75,"./typeahead":76}],71:[function(require,module,exports){
module.exports = function()
{
  $('body').on('click', '.btn-clear', function(event) {
    // "this" doesn't always point to what you think it does,
    // that's why need to use event.currentTarget
    var selector = $(event.currentTarget).attr('data-target');

    try{ $(selector).typeahead('close'); }catch(err){};

    $(selector).each(function(){
      var input = $(this);
      input.val(null);
      // Update Typeahead backend if exists
      if(input.data('backend') != undefined)
      {
        var backend = $('#'+input.data('backend'));
        backend.val(null);
        backend.trigger('input');
        backend.change();
      }
    });
  });
  $('body').on('click', '.btn-off', function(event) {
    var selector = $(event.currentTarget).attr('data-target');
    $(selector).each(function(){
      var input = $(this);
      input.val("false");
      input.trigger('input');
      input.change();
    });
  });
  $('body').on('click', '.btn-on', function(event) {
    var selector = $(event.currentTarget).attr('data-target');
    $(selector).each(function(){
      var input = $(this);
      input.val("true");
      input.trigger('input');
      input.change();
    });
  });

  $('body').on('click', '.geodash-intent', function(event) {
    event.preventDefault();  // For anchor tags
    var that = $(this);
    //var scope = angular.element('[ng-controller='+that.data('intent-ctrl')+']').scope();
    var scope = geodash.api.getScope(that.attr('data-intent-ctrl'));
    if(that.hasClass('geodash-toggle'))
    {
      var intentData = JSON.parse(that.attr('data-intent-data')); // b/c jquery data not updated by angular
      if(that.hasClass('geodash-off'))
      {
        that.removeClass('geodash-off');
        geodash.api.intend(that.attr('data-intent-names')[0], intentData, scope);
      }
      else
      {
        that.addClass('geodash-off');
        geodash.api.intend(that.attr('data-intent-names')[1], intentData, scope);
      }
    }
    else if(that.hasClass('geodash-radio'))
    {
      var siblings = that.parents('.geodash-radio-group:first').find(".geodash-radio").not(that);
      if(!(that.hasClass('geodash-on')))
      {
        that.addClass('geodash-on');
        if(that.data("intent-class-on"))
        {
          that.addClass(that.data("intent-class-on"));
          siblings.removeClass(that.data("intent-class-on"));
        }
        siblings.removeClass('geodash-on');
        if(that.data("intent-class-off"))
        {
          that.removeClass(that.data("intent-class-off"));
          siblings.addClass(that.data("intent-class-off"));
        }
        var intentName = that.attr('data-intent-name');
        var intentData = JSON.parse(that.attr('data-intent-data')); // b/c jquery data not updated by angular
        geodash.api.intend(intentName, intentData, scope);
      }
    }
    else
    {
      var intentName = that.attr('data-intent-name');
      var intentData = JSON.parse(that.attr('data-intent-data'));
      geodash.api.intend(intentName, intentData, scope);
    }
  });
};

},{}],72:[function(require,module,exports){
module.exports = function(opts)
{
  var map = L.map('map',
  {
    attributionControl: geodash.api.opt_b(opts, "attributionControl", false),
    zoomControl: geodash.api.opt_b(opts, "zoomControl", false),
    minZoom: geodash.api.opt_i(opts, "minZoom", 3),
    maxZoom: geodash.api.opt_i(opts, "maxZoom", 18)
  });

  map.setView(
    [geodash.api.opt_i(opts,["latitude", "lat"],0), geodash.api.opt_i(opts,["longitude", "lon", "lng", "long"], 0)],
    geodash.api.opt_i(opts, ["zoom", "z"], 0));

  $.each(geodash.api.opt_j(opts, "listeners"), function(e, f){
    map.on(e, f);
  });

  return map;
};

},{}],73:[function(require,module,exports){
module.exports = function(opts)
{
  var lonlat = [
    geodash.api.opt_i(opts,["longitude", "lon", "lng", "long"], 0),
    geodash.api.opt_i(opts,["latitude", "lat"], 0)];
  var zoom = geodash.api.opt_i(opts, ["zoom", "z"], 0);

  var map = new ol.Map({
    target: 'map',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    overlays: [
      new ol.Overlay({element: document.getElementById('popup')})
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat(lonlat),
      zoom: zoom,
      minZoom: geodash.api.opt_i(opts, "minZoom", 3),
      maxZoom: geodash.api.opt_i(opts, "maxZoom", 18)
    })
  });
  //var map = ol.Map('map',
  //{
  //  attributionControl: geodash.api.opt_b(opts, "attributionControl", false),
  //  zoomControl: geodash.api.opt_b(opts, "zoomControl", false),
  //});

  $.each(geodash.api.opt_j(opts, "listeners"), function(e, f){
    map.on(e, f);
  });

  return map;
};

},{}],74:[function(require,module,exports){
/**
 * init_state will overwrite the default state from the server with params in the url.
 * @param {Object} state - Initial state from server
 */
module.exports = function(state, stateschema)
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

},{}],75:[function(require,module,exports){
module.exports = function(app)
{
  if(geodash.templates != undefined)
  {
    geodash.meta.templates = [];
    $.each(geodash.templates, function(name, template){
      geodash.meta.templates.push(name);
      app.run(function($templateCache){$templateCache.put(name,template);});
    });
  }
};

},{}],76:[function(require,module,exports){
module.exports = function($element, featurelayers, baselayers, servers, datasetOptions, codecOptions)
{
  datasetOptions = datasetOptions || [geodash.typeahead.datasets];
  codecOptions = codecOptions || [geodash.bloodhound.codec];

  $('.typeahead', $element).each(function(){

    var datasets = [];
    var engine = undefined;

    var s = $(this);
    var placeholder = s.data('placeholder');
    var w = s.data('width');
    var h = s.data('height');
    var css = 'geodashserver-welcome-select-dropdown';
    var template_empty = s.data('template-empty');

    if(angular.isString(s.attr('data-typeahead-datasets')) && s.attr('data-typeahead-datasets').length > 0)
    {
      var datasetsName = s.attr('data-typeahead-datasets');
      var datasetsFn = undefined;
      for(var i = 0; i < datasetOptions.length; i++)
      {
        datasetsFn = extract(datasetsName, datasetOptions[i]);
        if(angular.isDefined(datasetsFn))
        {
          break;
        }
      }
      datasets = datasetsFn(s, featurelayers, baselayers, servers, codecOptions);
    }
    else
    {
      var datasetsFn = extract('default', geodash.typeahead.datasets);
      datasets = datasetsFn(s, featurelayers, baselayers, servers, codecOptions);
    }

    if(datasets.length > 0)
    {
      s.typeahead('destroy','NoCached');
      var typeahead = s.typeahead(null, datasets);
      s.data('datasets', datasets);

      typeahead.on('blur', geodash.typeahead.listeners.blur);
      typeahead.on('typeahead:change', geodash.typeahead.listeners.change);
      typeahead.on('typeahead:select typeahead:autocomplete typeahead:cursorchange', geodash.typeahead.listeners.select);

      /*typeahead.on('typeahead:change', function(event, value) {
        console.log("Event: ", event, value);
        if(angular.isDefined($(this).data('datasets')))
        {
          var results = geodash.typeahead.getResultsFromDatasets($(this).data('datasets'), value);
          var resultIndex = $(this).attr('data-search-output')|| 'id';
          var newValue = results.length == 1 ? extract(resultIndex, results[0]) : null;
          if(angular.isString($(this).data('backend')))
          {
            var backend = $('#'+$(this).data('backend'))
              .val(angular.isString(newValue) ? newValue : JSON.stringify(newValue))
              .trigger('input')
              .change();
          }
          else if(angular.isString($(this).attr('data-typeahead-scope')))
          {
            var $scope = geodash.api.getScope($(this).attr('data-typeahead-scope'));
            $scope.$apply(function(){
              $scope.setValue($scope.path_flat, newValue, $scope.workspace);
              $.each($scope.workspace_flat, function(key, value){
                if(key.startsWith($scope.path_flat+"__"))
                {
                  $scope.workspace_flat[key] = $scope.stack.head.workspace_flat[key] = undefined;
                }
              });
              if(angular.isDefined(newValue) && newValue != null)
              {
                $.each(geodash.api.flatten(newValue), function(i, x){
                  $scope.workspace_flat[$scope.path_flat+"__"+i] = $scope.stack.head.workspace_flat[$scope.path_flat+"__"+i] = x;
                });
              }
            });
          }
        }
      });

      typeahead.on('typeahead:select typeahead:autocomplete typeahead:cursorchange', function(event, obj) {
        console.log("Event: ", event, obj);
        var resultIndex = $(this).attr('data-search-output')|| 'id';
        var newValue = extract(resultIndex, obj, null)
        if(angular.isString($(this).data('backend')))
        {
          var backend = $('#'+$(this).data('backend'))
            .val(angular.isString(newValue) ? newValue : JSON.stringify(newValue))
            .trigger('input')
            .change();
        }
        else if(angular.isString($(this).attr('data-typeahead-scope')))
        {
          var $scope = geodash.api.getScope($(this).attr('data-typeahead-scope'));
          $scope.$apply(function(){
            $scope.setValue($scope.path_flat, newValue, $scope.workspace);
            $.each($scope.workspace_flat, function(key, value){
              if(key.startsWith($scope.path_flat+"__"))
              {
                $scope.workspace_flat[key] = $scope.stack.head.workspace_flat[key] = undefined;
              }
            });
            if(angular.isDefined(newValue) && newValue != null)
            {
              $.each(geodash.api.flatten(newValue), function(i, x){
                $scope.workspace_flat[$scope.path_flat+"__"+i] = $scope.stack.head.workspace_flat[$scope.path_flat+"__"+i] = x;
              });
            }
          });
        }
      });
      */

    }

  });

};

},{}],77:[function(require,module,exports){
module.exports = function(featureLayer)
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

},{}],78:[function(require,module,exports){
'use strict';
module.exports = {
  aggregate_fields: require("./aggregate_fields"),
  init_baselayers_leaflet: require("./init_baselayers_leaflet"),
  init_baselayers_ol3: require("./init_baselayers_ol3"),
  init_featurelayer_geojson: require("./init_featurelayer_geojson"),
  init_featurelayer_heatmap: require("./init_featurelayer_heatmap"),
  init_featurelayer_post: require("./init_featurelayer_post"),
  init_featurelayer_post_ol3: require("./init_featurelayer_post_ol3"),
  init_featurelayer_tegola: require("./init_featurelayer_tegola"),
  init_featurelayer_wms: require("./init_featurelayer_wms"),
  init_featurelayer_wmts: require("./init_featurelayer_wmts"),
  init_featurelayer: require("./init_featurelayer"),
  init_featurelayers: require("./init_featurelayers")
};

},{"./aggregate_fields":77,"./init_baselayers_leaflet":79,"./init_baselayers_ol3":80,"./init_featurelayer":81,"./init_featurelayer_geojson":82,"./init_featurelayer_heatmap":83,"./init_featurelayer_post":84,"./init_featurelayer_post_ol3":85,"./init_featurelayer_tegola":86,"./init_featurelayer_wms":87,"./init_featurelayer_wmts":88,"./init_featurelayers":89}],79:[function(require,module,exports){
module.exports = function(map, baselayers)
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

},{}],80:[function(require,module,exports){
module.exports = function(map, baselayers)
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
          url = "http://{a-c}.tiles.mapbox.com/v4/"+mb_layers+"/{z}/{x}/{y}.png?access_token="+mb_access_token;
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
        layers[bl.id] = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: url
          })
        });
        /*layers[bl.id] = L.tileLayer(url, {
            id: bl.id,
            attribution: attribution
        });*/
      }catch(err){console.log("Could not add baselayer "+i);}
  }
  return layers;
};

},{}],81:[function(require,module,exports){
module.exports = function(id, layerConfig, $scope, live, map_config)
{
  if(layerConfig.enabled == undefined || layerConfig.enabled == true)
  {
    var t = extract("type", layerConfig, "").toLowerCase();
    if(t == "geojson")
    {
      if(angular.isDefined(extract("heatmap", layerConfig, undefined)))
      {
        geodash.layers.init_featurelayer_heatmap($scope, live, map_config, id, layerConfig);
      }
      else
      {
        geodash.layers.init_featurelayer_geojson($scope, live, map_config, id, layerConfig);
      }
    }
    else if(t == "wms")
    {
      if(angular.isDefined(extract("heatmap", layerConfig, undefined)))
      {
        geodash.layers.init_featurelayer_heatmap($scope, live, map_config, id, layerConfig);
      }
      else
      {
        geodash.layers.init_featurelayer_wms($scope, live, map_config, id, layerConfig);
      }
    }
    else if(t == "tegola")
    {
      geodash.layers.init_featurelayer_tegola($scope, live, map_config, id, layerConfig);
    }
    else if(t == "wmts")
    {
      geodash.layers.init_featurelayer_wmts($scope, live, map_config, id, layerConfig);
    }
  }
};

},{}],82:[function(require,module,exports){
module.exports = function($scope, live, map_config, id, layerConfig)
{
  var url = extract("geojson.url", layerConfig);
  if(! angular.isDefined(url))
  {
    if(angular.isDefined(extract("wfs.url", layerConfig)))
    {
      var srs = "EPSG%3A4326";
      var layers = extract('wfs.layers', layerConfig) || extract('wms.layers', layerConfig);
      var params = [
        "srsName="+srs,
        "typename="+layers,
        "outputFormat=json",
        "version=1.0.0",
        "service=WFS",
        "request=GetFeature"
      ];
      url = extract("wfs.url", layerConfig)+"?"+params.join("&")
    }
  }
  var source = new ol.source.Vector({
    url: url,
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON()
  });
  var styleFn = (function(layerID, styleFnWorkspaces){
    return function(feature, resolution) {
      return geodash.style.ol3(feature, resolution, layerID, styleFnWorkspaces);
    };
  })(id, extract('dynamicStyleFunctionWorkspaces', geodash.config, [geodash.dynamicStyleFn]));
  var fl = new ol.layer.Vector({
    id: id,
    source: source
  });
  fl.setStyle(styleFn);
  live["featurelayers"][id] = fl;
  geodash.layers.init_featurelayer_post_ol3($scope, live, id, fl, layerConfig.visible);
};

},{}],83:[function(require,module,exports){
module.exports = function($scope, live, map_config, id, layerConfig)
{
  var url = extract("geojson.url", layerConfig);
  if(! angular.isDefined(url))
  {
    //srsName=EPSG%3A4326&typename=geonode%3ASyria_RefugeeSites_2016Jan21_HIU_DoS0&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature
    if(angular.isDefined(extract("wfs.url", layerConfig)))
    {
      var srs = "EPSG%3A4326";
      var layers = extract('wfs.layers', layerConfig) || extract('wms.layers', layerConfig);
      url = extract("wfs.url", layerConfig)+"?srsName="+srs+"&typename="+layers+"&outputFormat=json&version=1.0.0&service=WFS&request=GetFeature"
    }
  }
  var fl = undefined;
  var source = new ol.source.Vector({
    url: url,
    projection: 'EPSG:4326',
    format: new ol.format.GeoJSON()
  });
  var fl = new ol.layer.Heatmap({
    source: source,
    blur: extract('heatmap.blur', layerConfig, 15),
    radius: extract('heatmap.radius', layerConfig, 5),
    weight: extract('heatmap.weight', layerConfig, undefined)
  });
  live["featurelayers"][id] = fl;
  geodash.layers.init_featurelayer_post_ol3($scope, live, id, fl, layerConfig.visible);
};

},{}],84:[function(require,module,exports){
module.exports = function($scope, live, id, fl, visible)
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

},{}],85:[function(require,module,exports){
module.exports = function($scope, live, id, fl, visible)
{
  if(fl != undefined)
  {
    if(visible != undefined ? visible : true)
    {
      live["map"].addLayer(fl);
    }
    geodash.api.intend("layerLoaded", {'type':'featurelayer', 'layer': id, 'visible': visible}, $scope);
  }
  else
  {
    console.log("Could not add featurelayer "+id+" because it is undefined.");
  }
};

},{}],86:[function(require,module,exports){
module.exports = function($scope, live, map_config, id, layerConfig)
{
  var url = layerConfig.tegola.url+"/maps/"+layerConfig.tegola.map+"/{z}/{x}/{y}.vector.pbf";
  if(extract('tegola.debug', layerConfig, False))
  {
    url += "?debug=true"
  }
  var options = {
    attributions: '',
    format: new ol.format.MVT(),
    tileGrid: ol.tilegrid.createXYZ({maxZoom: 18}),
    tilePixelRatio: 16,
    url: url
  };
  var source = new ol.source.VectorTile(options);
  var fl = new ol.layer.VectorTile({
    source: source
  });
  live["featurelayers"][id] = fl;
  geodash.layers.init_featurelayer_post_ol3($scope, live, id, fl, layerConfig.visible);
};

},{}],87:[function(require,module,exports){
module.exports = function($scope, live, map_config, id, layerConfig)
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
        var params = {
          "LAYERS": geodash.codec.formatArray('layers', w, ''),
          "STYLES": geodash.codec.formatArray('styles', w, ''),
          "buffer": w.buffer || 0,
          "version": w.version || "1.1.1",
          "format": w.format || "image/png",
          transparent: extract('transparent', w, true)
        };
        var cql_filter = extract('cql_filter', w, undefined);
        if(angular.isDefined(cql_filter))
        {
          params["CQL_FILTER"] = cql_filter;
        }
        var options = {
          url: w.url,
          params: params,
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        };
        var source = new ol.source.ImageWMS(options);
        var fl = new ol.layer.Image({
          source: source
        });
        live["featurelayers"][id] = fl;
        geodash.layers.init_featurelayer_post_ol3($scope, live, id, fl, layerConfig.visible);
      }
    });
  }
  else
  {
    var params = {
      "LAYERS": geodash.codec.formatArray('layers', w, ''),
      "STYLES": geodash.codec.formatArray('styles', w, ''),
      "buffer": w.buffer || 0,
      "version": w.version || "1.1.1",
      "format": w.format || "image/png",
      transparent: extract('transparent', w, true)
    };
    var cql_filter = extract('cql_filter', w, undefined);
    if(angular.isDefined(cql_filter))
    {
      params["CQL_FILTER"] = cql_filter;
    }
    var options = {
      url: w.url,
      params: params,
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    };
    var source = new ol.source.ImageWMS(options);
    var fl = new ol.layer.Image({
      source: source
    });
    live["featurelayers"][id] = fl;
    geodash.layers.init_featurelayer_post_ol3($scope, live, id, fl, layerConfig.visible);
  }
};

},{}],88:[function(require,module,exports){
module.exports = function($scope, live, map_config, id, layerConfig)
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
          layers: geodash.codec.formatArray('layers', w, ''),
          styles: geodash.codec.formatArray('styles', w, ''),
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
      layers: geodash.codec.formatArray('layers', w, ''),
      styles: geodash.codec.formatArray('styles', w, ''),
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

},{}],89:[function(require,module,exports){
module.exports = function(featureLayers, $scope, live, map_config)
{
  $.each(featureLayers, function(i, layerConfig){
    geodash.layers.init_featurelayer(layerConfig.id, layerConfig, $scope, live, map_config);
  });
};

},{}],90:[function(require,module,exports){
module.exports = function(event, args)
{
  var id = args["id_hide"] || args["id"];
  try {
    $("#"+id).modal('hide');
    var modal_scope = geodash.api.getScope(id);
    var aClear = args["clear"];
    if("clear" in args && args["clear"] != undefined)
    {
      modal_scope.$apply(function () {
        $.each(aClear,function(i, x){
          modal_scope[x] = undefined;
        });
      });
    }
  }
  catch(err){};
};

},{}],91:[function(require,module,exports){
'use strict';
module.exports = {
  hideModal: require("./hideModal"),
  saveAndHide: require("./saveAndHide"),
  showModal: require("./showModal"),
  switchModal: require("./switchModal"),
  toggleModal: require("./toggleModal")
};

},{"./hideModal":90,"./saveAndHide":92,"./showModal":93,"./switchModal":94,"./toggleModal":95}],92:[function(require,module,exports){
module.exports = function(event, args)
{
  geodash.listeners.hideModal(event, args);
  //
  var target = args["id_target"] || args["id"];
  var modal_scope_target = geodash.api.getScope(target);
  var modal_scope_new = geodash.api.buildScope(event, args);
  modal_scope_target.$apply(function () {
    $.each(modal_scope_new, function(key, value){
      modal_scope_target[key] = value;
    });
    // OR
    //$.extend(modal_scope_target, modal_scope_new);
  });
};
/*
geodash.listeners.saveAndSwitch = function(event, args)
{
  geodash.listeners.hideModal(event, args);
  //
  var target = args["id_show"] || args["id"];
  var modal_scope_target = geodash.api.getScope(target);
  var modal_scope_new = geodash.api.buildScope(event, args);
  modal_scope_target.$apply(function () {
    $.each(modal_scope_new, function(key, value){ modal_scope_target[key] = value; });
  });
};*/

},{}],93:[function(require,module,exports){
module.exports = function(event, args)
{
    console.log('event', event);
    console.log('args', args);
    //
    var id = args["id_show"] || args["id"];
    var modal_scope = geodash.api.getScope(id);
    var modal_scope_new = geodash.api.buildScope(event, args);
    var modalOptions = args['modal'] || {};
    modalOptions['show'] = false;
    modal_scope.$apply(function () {
        // Update Scope
        //modal_scope = $.extend(modal_scope, modal_scope_new);
        //$.each(modal_scope_new, function(key, value){ modal_scope[key] = value; });
        /////////////////
        modal_scope.push(modal_scope_new);// Pushes New Scope to Modal's Stack
        /////////////////
        setTimeout(function(){
          // Update Modal Tab Selection
          // See https://github.com/angular-ui/bootstrap/issues/1741
          var modalElement = $("#"+id);
          var targetTab = modal_scope.tab;
          if(targetTab != undefined)
          {
            modalElement.find('.nav-tabs li').each(function(){
              var that = $(this);
              var thisTab = that.find('a').attr('href').substring(1);
              if(targetTab == thisTab)
              {
                  that.addClass('active');
              }
              else
              {
                  that.removeClass('active');
              }
            });
            modalElement.find('.tab-pane').each(function(){
              var that = $(this);
              if(targetTab == that.attr('id'))
              {
                  that.addClass('in active');
              }
              else
              {
                  that.removeClass('in active');
              }
            });
          }
          else
          {
            modalElement.find('.nav-tabs li').slice(0, 1).addClass('active');
            modalElement.find('.nav-tabs li').slice(1).removeClass('active');
            modalElement.find('.tab-pane').slice(0, 1).addClass('in active');
            modalElement.find('.tab-pane').slice(1).removeClass('in active');
          }
          geodash.ui.update(id);
          $("#"+id).modal(modalOptions);
          $("#"+id).modal('toggle');
        },0);
    });
};

},{}],94:[function(require,module,exports){
module.exports = function(event, args)
{
  geodash.listeners.hideModal(event, args);
  geodash.listeners.showModal(event, args);
};

},{}],95:[function(require,module,exports){
module.exports = function(event, args)
{
  geodash.listeners.showModal(event, args);
};

},{}],96:[function(require,module,exports){
module.exports = function(name, messages)
{
  if(!Array.isArray(geodash.var.logs[name]))
  {
    geodash.var.logs[name] = [];
  }
  if(Array.isArray(messages))
  {
    for(var i = 0; i < messages.length; i++)
    {
      geodash.var.logs[name].push({level: 'error', message: messages[i]});
    }
  }
  else if(angular.isString(messages))
  {
    geodash.var.logs[name].push({level: 'error', message: messages});
  }

};

},{}],97:[function(require,module,exports){
'use strict';
module.exports = {
  error: require("./error"),
  info: require("./info"),
  print: require("./print")
};

},{"./error":96,"./info":98,"./print":99}],98:[function(require,module,exports){
module.exports = function(name, messages)
{
  if(!Array.isArray(geodash.var.logs[name]))
  {
    geodash.var.logs[name] = [];
  }
  if(Array.isArray(messages))
  {
    for(var i = 0; i < messages.length; i++)
    {
      geodash.var.logs[name].push({level: 'info', message: messages[i]});
    }
  }
  else if(angular.isString(messages))
  {
    geodash.var.logs[name].push({level: 'info', message: messages});
  }

};

},{}],99:[function(require,module,exports){
module.exports = function(name)
{
  if(angular.isDefined(name))
  {
    var log = extract('var.logs.'+name, geodash);
    if(Array.isArray(log))
    {
      console.group('GeoDash Log: '+name);
      for(var i = 0; i < log.length; i++)
      {
        var message = log[i];
        if(message.level == "error")
        {
          console.warn(message.message);
        }
        else
        {
          console.log(message.message);
        }
      }
      console.groupEnd();
    }
  }
  else
  {
    $.each(geodash.var.logs, function(name, log){
      console.group("Printing log "+name+"...");
      for(var i = 0; i < log.length; i++)
      {
        var message = log[i];
        if(message.level == "error")
        {
          console.warn(message.message);
        }
        else
        {
          console.log(message.message);
        }
      }
      console.groupEnd();
    });
  }
};

},{}],100:[function(require,module,exports){
module.exports = function(feature)
{
  return {
    'attributes': feature.attributes || feature.properties,
    'geometry': feature.geometry
  };
};

},{}],101:[function(require,module,exports){
module.exports = function(x, fallback)
{
  if(angular.isNumber(x))
  {
    return x;
  }
  else if(angular.isString(x))
  {
    if(x.length > 0)
    {
      return parseFloat(x);
    }
    else
    {
      return fallback;
    }
  }
  else
  {
    return fallback;
  }
};

},{}],102:[function(require,module,exports){
'use strict';

module.exports = {
  feature: require("./feature"),
  point: require("./point"),
  float: require("./float")
};

},{"./feature":100,"./float":101,"./point":103}],103:[function(require,module,exports){
module.exports = function(point)
{
  if("flatCoordinates" in point)
  {
    var coords = point.flatCoordinates;
    return {
      'lat': coords[1],
      'lon': coords[0]
    };
  }
  else
  {
    return {
      'lat': point.lat,
      'lon': (point.lon || point.lng || point.long || 0.0)
    };
  }
};

},{}],104:[function(require,module,exports){
module.exports = function(chart, layer, feature, state)
{
  var html = "";
  html += "<div style=\"text-align:center;\"><b>"+chart.label+"</b></div><br>";
  html += "<div id=\""+chart.id+"\" class=\"geodash-popup-chart\"></div>";
  return html;
};

},{}],105:[function(require,module,exports){
module.exports = function(field, layer, feature, state)
{
  var output = field["output"] || field["attribute"];
  var html = undefined;
  var bInclude = false;
  if(field.when != undefined)
  {
    if(field.when.toLowerCase() == "defined")
    {
      if(feature.attributes[output] != undefined)
      {
        bInclude = true;
      }
    }
    else
    {
      bInclude = true;
    }
  }
  else
  {
    bInclude = true;
  }

  if(bInclude)
  {
    if(field.type == "link")
    {
      var value = field.value != undefined ? field.value : "{{ feature.attributes." + output + " }}";
      html = "<span><b>"+ field.label +":</b> <a target=\"_blank\" href=\""+field.url+"\">";
      html += value;
      html += "</a></span>";
    }
    else
    {
      var value = undefined;
      if(field.value != undefined)
      {
        value = field.value;
      }
      else
      {
        if(field.type == "date")
        {
          var format = field.format || "medium";
          value = "feature.attributes." + output + " | date:'"+format+"'"
        }
        else
        {
          value = "feature.attributes." + output
        }
        if(field.fallback)
        {
          value = "("+value+") || '"+field.fallback+"'"
        }
        value = "{{ "+value +" }}";
      }
      html = "<span><b>"+ field.label +":</b> "+value+"</span>";
    }
  }
  return html;
};

},{}],106:[function(require,module,exports){
module.exports = function($interpolate, featureLayer, feature, state)
{
  var popupTemplate = geodash.popup.buildPopupTemplate(featureLayer.popup, featureLayer, feature, state);
  var ctx = {
    'layer': featureLayer,
    'feature': feature,
    'state': state
  };
  var content = $interpolate(popupTemplate)(ctx);
  var title = angular.isString(featureLayer.popup.title) ? $interpolate(featureLayer.popup.title)(ctx) : "";
  return { 'content': content, 'title': title }
};

},{}],107:[function(require,module,exports){
module.exports = function(popup, layer, feature, state)
{
  var panes = popup.panes;
  var popupTemplate = "";
  //////////////////
  if(geodash.mapping_library != "ol3" && angular.isString(popup.title))
  {
    popupTemplate += "<h5 style=\"word-wrap:break-word;text-align:center;\">"+popup.title+"</h5>";
  }
  //////////////////
  var paneContents = [];
  if(Array.isArray(panes))
  {
    for(var i = 0; i < panes.length; i++)
    {
      var pane = panes[i];
      var popupFields = [];
      var popupCharts = [];
      if("fields" in pane)
      {
        for(var j = 0; j < pane.fields.length; j++)
        {
          var popupField = geodash.popup.buildField(pane.fields[j], layer, feature, state);
          if(popupField != undefined)
          {
            popupFields.push(popupField);
          }
        }
      }
      if("charts" in pane)
      {
        for(var j = 0; j < pane.charts.length; j++)
        {
          var popupChart = geodash.popup.buildChart(pane.charts[j], layer, feature, state);
          if(popupChart != undefined)
          {
            popupCharts.push(popupChart);
          }
        }
      }
      var paneContent = popupFields.join("<br>");
      if(popupCharts.length > 0)
      {
        paneContent += "<hr>" + popupCharts.join("<br>");
      }
      paneContents.push(paneContent);
    }
    //////////////////
    if(panes.length > 1)
    {
      var tabs = [];
      var pane = panes[0];
      var html_tab ="<li class=\"active\"><a data-toggle=\"tab\" href=\"#"+pane.id+"\">"+pane.tab.label+"</a></li>";
      tabs.push(html_tab);
      for(var i = 1; i < panes.length; i++)
      {
        pane = panes[i];
        html_tab = "<li><a data-toggle=\"tab\" href=\"#"+pane.id+"\">"+pane.tab.label+"</a></li>"
        tabs.push(html_tab);
      }
      var html_tabs = "<ul class=\"nav nav-tabs nav-justified\">"+tabs.join("")+"</ul>";
      ///////////////
      var paneContentsWithWrapper = [];
      var html_pane = "<div id=\""+panes[0].id+"\" class=\"tab-pane fade in active\" style=\"padding: 4px;\">"+paneContents[0]+"</div>";
      paneContentsWithWrapper.push(html_pane);
      for(var i = 1; i < panes.length; i++)
      {
        html_pane = "<div id=\""+panes[i].id+"\" class=\"tab-pane fade\" style=\"padding: 4px;\">"+paneContents[i]+"</div>";
        paneContentsWithWrapper.push(html_pane);
      }
      ///////////////
      popupTemplate += html_tabs + "<div class=\"tab-content\">"+paneContentsWithWrapper.join("")+"</div>";
    }
    else
    {
      popupTemplate += paneContents[0];
    }
  }
  return popupTemplate;
};

},{}],108:[function(require,module,exports){
'use strict';
module.exports = {
  buildChart: require("./buildChart"),
  buildField: require("./buildField"),
  buildPopupTemplate: require("./buildPopupTemplate"),
  buildPopupContentAndTitle: require("./buildPopupContentAndTitle"),
  openPopup: require("./openPopup")
};

},{"./buildChart":104,"./buildField":105,"./buildPopupContentAndTitle":106,"./buildPopupTemplate":107,"./openPopup":109}],109:[function(require,module,exports){
module.exports = function($interpolate, featureLayer, feature, location, map, state)
{
  var popupContentAndTitle = geodash.popup.buildPopupContentAndTitle($interpolate, featureLayer, feature, state);
  if(geodash.mapping_library = "ol3")
  {
    var popup = map.getOverlays().item(0);
    var element = $("#popup");
    element.popover('destroy');
    popup.setPosition(ol.proj.fromLonLat([location.lon, location.lat], map.getView().getProjection()));
    element.popover({
      'container': 'body',
      'placement': 'top',
      'animation': false,
      'html': true,
      'content': popupContentAndTitle.content,
      'title': popupContentAndTitle.title
    });
    element.popover('show');
  }
  else
  {
    var popup = new L.Popup({maxWidth: (featureLayer.popup.maxWidth || 400)}, undefined);
    popup.setLatLng(new L.LatLng(location.lat, location.lon));
    popup.setContent(popupContentAndTitle.content);
    map.openPopup(popup);
  }
};

},{}],110:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  ol3: require("./ol3"),
  leaflet: require("./leaflet"),
  translate: require("./translate")
};

},{"./leaflet":111,"./ol3":112,"./translate":113}],111:[function(require,module,exports){
module.exports = function(f, layer)
{
  //
  //var state = angular.element(document.body).injector().get('state');
  var $scope = angular.element("#geodash-main").scope();
  var state = $scope.state;
  var map_config = angular.element(document.body).injector().get('map_config');
  //
  var style = {};
  var popatrisk = geodash.api.getFeatureLayer("popatrisk", {"$scope": $scope});
  if(angular.isDefined(popatrisk))
  {
    var style_static = extract(["cartography", 0, "styles", "default", "static"], popatrisk);
    $.extend(style, style_static);
    var style_dynamic = extract(["cartography", 0, "styles", "default", "dynamic", "func"], popatrisk);
    var options = extract(["cartography", 0, "styles", "default", "dynamic", "options"], popatrisk);
    var delta = angular.isFunction(geodash[style_dynamic]) ? geodash[style_dynamic](f, state, map_config, options) : undefined;
    if(delta != undefined)
    {
      $.extend(style, delta);
    }
  }
  return style;
};

},{}],112:[function(require,module,exports){
module.exports = function(f, resolution, layerID, styleFnWorkspaces)
{
  var styles = [];
  //var layerID = this.layerID;
  var mainScope = geodash.api.getScope("geodash-main");
  var fl = geodash.api.getFeatureLayer(layerID);
  if(angular.isDefined(fl))
  {
    var currentStyle = 0;
    var geometryType = f.getGeometry().getType();
    var symbolizers = extract(["carto", "styles", currentStyle, "symbolizers"], fl, []);
    for(var i = 0; i < symbolizers.length; i++)
    {
      var symbolizer = symbolizers[i];
      var style_static = extract(["static", "properties"], symbolizer);
      var style_dynamic_fn_name = extract(["dynamic", "func"], symbolizer);
      var style_dynamic_fn = undefined;
      if(angular.isDefined(style_dynamic_fn_name))
      {
        for(var j = 0; j < styleFnWorkspaces.length; j++)
        {
          style_dynamic_fn = extract(style_dynamic_fn_name, styleFnWorkspaces[j]);
          if(angular.isFunction(style_dynamic_fn))
          {
            break;
          }
        }
      }
      style = geodash.style.translate.ol3({
        'feature': f,
        'state': mainScope.state,
        'map_config': mainScope.map_config,
        'style_static': style_static,
        'style_dynamic_fn': style_dynamic_fn,
        'style_dynamic_options': extract(["dynamic", "options"], symbolizer)
      });
      styles.push(new ol.style.Style(style))
    }

    //$.extend(style, style_static);

    /*
    var style_dynamic = extract(["cartography", 0, "styles", "default", "dynamic", "func"], popatrisk);
    var options = extract(["cartography", 0, "styles", "default", "dynamic", "options"], popatrisk);
    var delta = angular.isFunction(geodash[style_dynamic]) ? geodash[style_dynamic](f, state, map_config, options) : undefined;
    if(delta != undefined)
    {
      $.extend(style, delta);
    }*/
  }
  return styles;
};

},{}],113:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */
module.exports = {
  ol3: require("./ol3")
};

},{"./ol3":114}],114:[function(require,module,exports){
//module.exports = function(f, style_static, style_dynamic_fn, style_dynamic_options)
module.exports = function(options)
{
  var style = {};
  var f = extract('feature', options) || extract('f', options);
  var state = extract('state', options);
  var config = extract('map_config', options) || extract('config', options);
  var style_static = angular.isArray(extract('style_static', options)) ? geodash.api.arrayToObject(extract('style_static', options)) : {};
  var style_dynamic_fn = extract('style_dynamic_fn', options);
  var style_dynamic_options = extract('style_dynamic_options', options);
  ////
  var styleStaticAndDynamic = {};
  angular.extend(styleStaticAndDynamic, style_static);
  if(angular.isFunction(style_dynamic_fn))
  {
    var delta = style_dynamic_fn(f, state, config, style_dynamic_options);
    if(angular.isDefined(delta))
    {
      angular.extend(styleStaticAndDynamic, delta);
    }
  }

  var geometryType = f.getGeometry().getType();

  if(geometryType == "Point")
  {
    var circleOptions = {
        radius: geodash.normalize.float(extract("radius", styleStaticAndDynamic, 5.0))
    };
    if(angular.isDefined(extract("strokeColor", style_static)))
    {
      circleOptions["stroke"] = new ol.style.Stroke({
        color: extract("strokeColor", styleStaticAndDynamic),
        width: geodash.normalize.float(extract("strokeWidth", styleStaticAndDynamic, 1.0))
      });
    }
    if(angular.isDefined(extract("fillColor", styleStaticAndDynamic)))
    {
      circleOptions["fill"] = new ol.style.Fill({
        color: extract("fillColor", styleStaticAndDynamic, undefined)
      })
    }
    style["image"] = new ol.style.Circle(circleOptions);
  }

  if(geometryType == "Polygon" || geometryType == "MultiLineString" || geometryType == "MultiPolygon")
  {
    if(angular.isDefined(extract("strokeColor", styleStaticAndDynamic)))
    {
      style["stroke"] = new ol.style.Stroke({
        color: extract("strokeColor", styleStaticAndDynamic),
        width: geodash.normalize.float(extract("strokeWidth", styleStaticAndDynamic, 1.0))
      });
    }
  }

  if(geometryType == "Polygon" || geometryType == "MultiPolygon")
  {
    if(angular.isDefined(extract("fillColor", styleStaticAndDynamic)))
    {
      style["fill"] = new ol.style.Fill({
        color: extract("fillColor", styleStaticAndDynamic)
      })
    }
  }

  return style;
};

},{}],115:[function(require,module,exports){
'use strict';
module.exports = {
  D2R: (Math.PI / 180),
  R2D: (180 / Math.PI),
  point_to_bbox: require("./point_to_bbox"),
  point_to_radius: require("./point_to_radius"),
  tile_to_lat: require("./tile_to_lat"),
  tile_to_lon: require("./tile_to_lon"),
  tms_to_bbox: require("./tms_to_bbox")
};

},{"./point_to_bbox":116,"./point_to_radius":117,"./tile_to_lat":118,"./tile_to_lon":119,"./tms_to_bbox":120}],116:[function(require,module,exports){
module.exports = function(x, y, z, digits)
{
  var radius = geodash.tilemath.point_to_radius(z);
  var e = x + radius; if(digits != undefined && digits >= 0){e = e.toFixed(digits);}
  var w = x - radius; if(digits != undefined && digits >= 0){w = w.toFixed(digits);}
  var s = y - radius; if(digits != undefined && digits >= 0){s = s.toFixed(digits);}
  var n = y + radius; if(digits != undefined && digits >= 0){n = n.toFixed(digits);}
  return [w, s, e, n];
};

},{}],117:[function(require,module,exports){
module.exports = function(z)
{
  return (geodash.config.click_radius || 4.0) / z;
};

},{}],118:[function(require,module,exports){
module.exports = function(y, z)
{
  n = Math.pi - 2 * Math.PI * y / Math.pow(2,z);
  return ( R2D * Math.atan(0.5 * ( Math.exp(n) - Math.exp(-n))));
};

},{}],119:[function(require,module,exports){
module.exports = function(x, z)
{
  return x / Math.pow(2, z) * 360-180;
};

},{}],120:[function(require,module,exports){
module.exports = function(x, y, z)
{
  var e = geodash.tilemath.tile_to_lon(x+1, z);
  var w = geodash.tilemath.tile_to_lon(x, z);
  var s = geodash.tilemath.tile_to_lat(y+1, z);
  var n = geodash.tilemath.tile_to_lat(y, z);
  return [w, s, e, n];
};

},{}],121:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecs)
{
  var datasets = [];
  var template_suggestion = extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion);
  var url = geodash.api.getEndpoint("geodash_capabilities_json");
  var local = undefined;
  var prefetchOptions = {
    url: url,
    dataType: 'json',
    codec: "GeoDashCapabilities",
    cache: false,
    codecs: codecs
  };
  var prefetch = geodash.bloodhound.prefetch(prefetchOptions);
  var remoteOptions = {
    url: url,
    dataType: 'json',
    codec: "GeoDashCapabilities",
    rate: 1000,
    codecs: codecs
  };
  var remote = geodash.bloodhound.remote(remoteOptions);
  var engine = geodash.bloodhound.engine(local, prefetch, remote);
  var templates = {
    suggestion: template_suggestion
  };
  var dataset = {
    name: "geodash",
    engine: engine,
    minLength: 0,
    limit: 10,
    hint: false,
    highlight: true,
    display: geodash.typeahead.displayFn,
    source: function (query, syncResults, asyncResults)
    {
      // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
      // http://pastebin.com/adWHFupF
      //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
      this.engine.ttAdapter()(query, syncResults, asyncResults);
    },
    templates: templates
  };
  datasets.push(dataset);

  return datasets;
};

},{}],122:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecs)
{
  var datasets = [];
  var template_suggestion = extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion);
  var tegolaservers = geodash.api.listTegolaServers();
  for(var i = 0; i < tegolaservers.length; i++)
  {
    var server = wmsservers[i];
    var url = extract('wms.url', server)+'/capabilities';
    var local = undefined;
    var prefetchOptions = {
      url: url,
      dataType: 'json',
      codec: "TegolaCapabilities",
      cache: false,
      codecs: codecs
    };
    var prefetch = geodash.bloodhound.prefetch(prefetchOptions);
    var remoteOptions = {
      url: url,
      dataType: 'json',
      codec: "TegolaCapabilities",
      rate: 1000,
      codecs: codecs
    };
    var remote = geodash.bloodhound.remote(remoteOptions);
    var engine = geodash.bloodhound.engine(local, prefetch, remote);
    var templates = {
      header: '<h3 style="margin: 0 20px 5px 20px; padding: 3px 0; border-bottom: 1px solid #ccc;">'+ extract('title' || 'id', server, "") +'</h3>',
      suggestion: template_suggestion
    };
    var dataset = {
      name: extract('id', server, 'server_'+i),
      engine: engine,
      minLength: 0,
      limit: 10,
      hint: false,
      highlight: true,
      display: geodash.typeahead.displayFn,
      source: function (query, syncResults, asyncResults)
      {
        // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
        // http://pastebin.com/adWHFupF
        //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
        this.engine.ttAdapter()(query, syncResults, asyncResults);
      },
      templates: templates
    };
    datasets.push(dataset);
  }

  return datasets;
};

},{}],123:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecs)
{
  var datasets = [];
  var template_suggestion = extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion);
  var wmsservers = geodash.api.listWMSServers();
  for(var i = 0; i < wmsservers.length; i++)
  {
    var server = wmsservers[i];
    var url = extract('wms.url', server)+'?service=wms&request=GetCapabilities';
    var local = undefined;
    var prefetchOptions = {
      url: url,
      dataType: 'xml',
      codec: "WMSCapabilities",
      cache: false,
      codecs: codecs
    };
    var prefetch = geodash.bloodhound.prefetch(prefetchOptions);
    var remoteOptions = {
      url: url,
      dataType: 'xml',
      codec: "WMSCapabilities",
      rate: 1000,
      codecs: codecs
    };
    var remote = geodash.bloodhound.remote(remoteOptions);
    var engine = geodash.bloodhound.engine(local, prefetch, remote);
    var templates = {
      header: '<h3 style="margin: 0 20px 5px 20px; padding: 3px 0; border-bottom: 1px solid #ccc;">'+ extract('title' || 'id', server, "") +'</h3>',
      suggestion: template_suggestion
    };
    var dataset = {
      name: extract('id', server, 'server_'+i),
      engine: engine,
      minLength: 0,
      limit: 10,
      hint: false,
      highlight: true,
      display: geodash.typeahead.displayFn,
      source: function (query, syncResults, asyncResults)
      {
        // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
        // http://pastebin.com/adWHFupF
        //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
        this.engine.ttAdapter()(query, syncResults, asyncResults);
      },
      templates: templates
    };
    datasets.push(dataset);
  }

  return datasets;
};

},{}],124:[function(require,module,exports){
module.exports = function(element, featurelayers, baselayers, servers, codecOptions)
{
  var datasets = [];
  var local = geodash.bloodhound.local(
    element.data('localData'),
    featurelayers,
    baselayers,
    servers);
  var prefetchOptions = element.data('prefetchData');
  var prefetch = geodash.bloodhound.prefetch(
    prefetchOptions,
    featurelayers,
    baselayers,
    servers,
    codecOptions);
  var remoteOptions = element.data('remoteData');
  var remote = geodash.bloodhound.remote(
    remoteOptions,
    featurelayers,
    baselayers,
    servers,
    codecOptions);

  if((angular.isDefined(local) && local.length > 0) || angular.isDefined(prefetch) || angular.isDefined(remote))
  {
    // Twitter Typeahead with
    //https://github.com/bassjobsen/typeahead.js-bootstrap-css
    var engine = geodash.bloodhound.engine(local, prefetch, remote);

    var templates = {
      empty: element.attr('data-template-empty'),
      suggestion: extract(element.data('template-suggestion') || 'default', geodash.typeahead.templates.suggestion),
      footer: geodash.typeahead.footer
    };
    var dataset = {
      name: element.attr('name'),
      engine: engine,
      minLength: 0,
      limit: 10,
      hint: false,
      highlight: true,
      display: geodash.typeahead.displayFn,
      source: function (query, syncResults, asyncResults)
      {
        // https://github.com/twitter/typeahead.js/pull/719#issuecomment-43083651
        // http://pastebin.com/adWHFupF
        //query == "" ? cb(data) : engine.ttAdapter()(query, cb);
        this.engine.ttAdapter()(query, syncResults, asyncResults);
      },
      templates: templates
    };
    datasets.push(dataset);
  }
  return datasets;
};

},{}],125:[function(require,module,exports){
'use strict';
module.exports = {
  default: require("./default"),
  GeoDashDashboards: require("./GeoDashDashboards"),
  TegolaServers: require("./TegolaServers"),
  WMSServers: require("./WMSServers")
};

},{"./GeoDashDashboards":121,"./TegolaServers":122,"./WMSServers":123,"./default":124}],126:[function(require,module,exports){
module.exports = function(data)
{
  return data.text || data.id;  // Order is critically important to have dataset.engine.get work
};

},{}],127:[function(require,module,exports){
module.exports = function (data)
{
  if(! angular.isDefined(data.query))
  {
    return "";
  }
  else if(data.query.length == 0)
  {
    return "";
  }
  else
  {
    return '<div>Searched for <strong>' + data.query + '</strong></div>';
  }
};

},{}],128:[function(require,module,exports){
module.exports = function(datasets, value)
{
  var results = [];
  for(var i = 0; i < datasets.length; i++)
  {
    var x = datasets[i].engine.get(value);
    if(Array.isArray(x))
    {
      results = results.concat(x);
    }
  }
  return results;
};

},{}],129:[function(require,module,exports){
'use strict';
module.exports = {
  datasets: require("./datasets"),
  displayFn: require("./displayFn"),
  footer: require("./footer"),
  templates: require("./templates"),
  listeners: require("./listeners"),
  getResultsFromDatasets: require("./getResultsFromDatasets")
};

},{"./datasets":125,"./displayFn":126,"./footer":127,"./getResultsFromDatasets":128,"./listeners":132,"./templates":134}],130:[function(require,module,exports){
module.exports = function(event)
{
  if(angular.isDefined($(this).data('datasets')))
  {
    var valueFromInput = $(this).val();
    var datasets = $(this).data('datasets');
    //
    var results = geodash.typeahead.getResultsFromDatasets(datasets, valueFromInput);
    var resultIndex = $(this).attr('data-search-output')|| 'id';
    var newValue = results.length == 1 ? extract(resultIndex, results[0]) : null;
    if(angular.isString($(this).data('backend')))
    {
      var backend = $('#'+$(this).data('backend'))
        .val(angular.isString(newValue) ? newValue : JSON.stringify(newValue))
        .trigger('input')
        .change();
    }
    else if(angular.isString($(this).attr('data-typeahead-scope')))
    {
      var $scope = geodash.api.getScope($(this).attr('data-typeahead-scope'));
      $scope.$apply(function(){
        $scope.setValue($scope.path_array, newValue, $scope.workspace);
        $.each($scope.workspace_flat, function(key, value){
          if(key.startsWith($scope.path_flat+"__"))
          {
            $scope.workspace_flat[key] = $scope.stack.head.workspace_flat[key] = undefined;
          }
        });
        if(angular.isDefined(newValue) && newValue != null)
        {
          $.each(geodash.api.flatten(newValue), function(i, x){
            $scope.workspace_flat[$scope.path_flat+"__"+i] = $scope.stack.head.workspace_flat[$scope.path_flat+"__"+i] = x;
          });
        }
      });
    }
  }
};

},{}],131:[function(require,module,exports){
module.exports = function(event, value)
{
  console.log("Event: ", event, value);
  if(angular.isDefined($(this).data('datasets')))
  {
    var datasets = $(this).data('datasets');
    //
    var results = geodash.typeahead.getResultsFromDatasets(datasets, value);
    var resultIndex = $(this).attr('data-search-output')|| 'id';
    var newValue = results.length == 1 ? extract(resultIndex, results[0]) : null;
    if(angular.isString($(this).data('backend')))
    {
      var backend = $('#'+$(this).data('backend'))
        .val(angular.isString(newValue) ? newValue : JSON.stringify(newValue))
        .trigger('input')
        .change();
    }
    else if(angular.isString($(this).attr('data-typeahead-scope')))
    {
      var $scope = geodash.api.getScope($(this).attr('data-typeahead-scope'));
      $scope.$apply(function(){
        $scope.setValue($scope.path_array, newValue, $scope.workspace);
        $.each($scope.workspace_flat, function(key, value){
          if(key.startsWith($scope.path_flat+"__"))
          {
            $scope.workspace_flat[key] = $scope.stack.head.workspace_flat[key] = undefined;
          }
        });
        if(angular.isDefined(newValue) && newValue != null)
        {
          $.each(geodash.api.flatten(newValue), function(i, x){
            $scope.workspace_flat[$scope.path_flat+"__"+i] = $scope.stack.head.workspace_flat[$scope.path_flat+"__"+i] = x;
          });
        }
      });
    }
  }
};

},{}],132:[function(require,module,exports){
'use strict';
module.exports = {
  blur: require("./blur"),
  change: require("./change"),
  select: require("./select")
};

},{"./blur":130,"./change":131,"./select":133}],133:[function(require,module,exports){
module.exports = function(event, obj) {
  console.log("Event: ", event, obj);
  //
  var resultIndex = $(this).attr('data-search-output')|| 'id';
  var newValue = extract(resultIndex, obj, null)
  if(angular.isString($(this).data('backend')))
  {
    var backend = $('#'+$(this).data('backend'))
      .val(angular.isString(newValue) ? newValue : JSON.stringify(newValue))
      .trigger('input')
      .change();
  }
  else if(angular.isString($(this).attr('data-typeahead-scope')))
  {
    var $scope = geodash.api.getScope($(this).attr('data-typeahead-scope'));
    $scope.$apply(function(){
      $scope.setValue($scope.path_array, newValue, $scope.workspace);
      $.each($scope.workspace_flat, function(key, value){
        if(key.startsWith($scope.path_flat+"__"))
        {
          $scope.workspace_flat[key] = $scope.stack.head.workspace_flat[key] = undefined;
        }
      });
      if(angular.isDefined(newValue) && newValue != null)
      {
        $.each(geodash.api.flatten(newValue), function(i, x){
          $scope.workspace_flat[$scope.path_flat+"__"+i] = $scope.stack.head.workspace_flat[$scope.path_flat+"__"+i] = x;
        });
      }
    });
  }
};

},{}],134:[function(require,module,exports){
'use strict';
module.exports = {
  suggestion: require("./suggestion")
};

},{"./suggestion":138}],135:[function(require,module,exports){
module.exports = function(data)
{
  if(extract('obj.type', data) == "geojson")
  {
    return '<p><strong>' + (extract('obj.title', data) || extract('obj.id', data)) + '</strong> ('+extract('obj.id', data)+')<br><span style="color:#00C;">' + (extract('obj.type', data) || extract('obj.source.type', data)) + '</span> | <span style="color:#00C;">' + geodash.codec.parseURL(extract('obj.geojson.url', data), 'geojson').domain + '</p>';
  }
  else if(extract('obj.type', data) == "wms")
  {
    return '<p><strong>' + (extract('obj.title', data) || extract('obj.id', data)) + '</strong> ('+extract('obj.id', data)+')<br><span style="color:#00C;"> wms </span> | <span style="color:#00C;">' + geodash.codec.parseURL(extract('obj.wms.url', data), 'wms').domain + '</p>';
  }
  else if(extract('obj.source.type', data) == "tiles")
  {
    return '<p><strong>' + (extract('obj.title', data) || extract('obj.id', data)) + '</strong> ('+extract('obj.id', data)+')<br><span style="color:#00C;"> tiles </span> | <span style="color:#00C;">' + geodash.codec.parseURL(extract('obj.source.tile.url', data), 'tiles').domain + '</p>';
  }
  else
  {
    return '<p><strong>' + (extract('obj.title', data) || extract('obj.id', data)) + '</strong> ('+extract('obj.id', data)+')<br><span style="color:#00C;">' + (extract('obj.type', data) || extract('obj.source.type', data)) + '</span></p>';
  }
};

},{}],136:[function(require,module,exports){
module.exports = function(data)
{
  return '<p><img src="'+data.extra.thumbnail+'" width="40" height="40" style="margin-right: 4px;"><strong>' + data.text + '</strong></p>';
};

},{}],137:[function(require,module,exports){
module.exports = function(data)
{
  if(data.text == data.id)
  {
    if(data.text != undefined)
    {
      return '<p><strong>' + data.text + '</strong></p>';
    }
    else
    {
      return "";
    }
  }
  else
  {
    return '<p><strong>' + data.text + '</strong> (' + data.id + ')</p>';
  }
};

},{}],138:[function(require,module,exports){
'use strict';
module.exports = {
  default: require("./default"),
  GeoDashLayer: require("./GeoDashLayer"),
  WMSLayer: require("./WMSLayer")
};

},{"./GeoDashLayer":135,"./WMSLayer":136,"./default":137}],139:[function(require,module,exports){
'use strict';
module.exports = {
  toggleOptions: require("./toggleOptions"),
  showOptions: require("./showOptions"),
  init_slider_label: require("./init_slider_label"),
  init_slider_slider: require("./init_slider_slider"),
  update_slider_label: require("./update_slider_label"),
  update: require("./update")
};

},{"./init_slider_label":140,"./init_slider_slider":141,"./showOptions":142,"./toggleOptions":143,"./update":144,"./update_slider_label":145}],140:[function(require,module,exports){
module.exports = function($interpolate, that, type, range, value)
{
  if(type=="ordinal")
  {
    var ctx = {"value": value};
    that.data('label').html($interpolate(that.data('label-template'))(ctx));
  }
  else if(type=="continuous")
  {
    if(($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true"))
    {
      var ctx = {"values": [value[0], value[1]]};
      that.data('label').html($interpolate(that.data('label-template'))(ctx));
    }
    else if(range=="min" || range=="max")
    {
      var ctx = {"value": value};
      that.data('label').html($interpolate(that.data('label-template'))(ctx));
    }
  }
};

},{}],141:[function(require,module,exports){
module.exports = function($interpolate, $scope, that, type, range, value, minValue, maxValue, step)
{
  if(type=="ordinal")
  {
    that.slider({
      range: (($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true")) ? true : range,
      value: value,
      min: 0,
      max: maxValue,
      step: 1,
      slide: function(event, ui) {
          geodash.ui.update_slider_label.apply(this, [$interpolate, event, ui]);
          var output = that.data('output');
          var newValue = that.data('options')[ui.value];
          var filter = {};
          filter[output] = newValue;
          geodash.api.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
      }
    });
  }
  else if(type=="continuous")
  {
    if(($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true"))
    {
      that.slider({
        range: true,
        values: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geodash.ui.update_slider_label.apply(this, [$interpolate, event, ui]);
            var output = that.data('output');
            var newValue = ui.values;
            var filter = {};
            filter[output] = newValue;
            geodash.api.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
    else if(range=="min" || range=="max")
    {
      that.slider({
        range: range,
        value: value,
        min: minValue,
        max: maxValue,
        step: step,
        slide: function(event, ui) {
            geodash.ui.update_slider_label.apply(this, [$interpolate, event, ui]);
            var output = that.data('output');
            var newValue = ui.value / 100.0;
            var filter = {};
            filter[output] = newValue;
            geodash.api.intend("filterChanged", {"layer":"popatrisk", "filter":filter}, $scope);
        }
      });
    }
  }
};

},{}],142:[function(require,module,exports){
module.exports = function($event, selector)
{
  try{
    var input = $(selector);
    input.typeahead('open');
    input.data('ttTypeahead').menu.update.apply(input.data('ttTypeahead').menu, [""]);
    var engine = input.data('engine');
    engine.search.apply(engine, [""])
  }catch(err){};
};

},{}],143:[function(require,module,exports){
module.exports = function($event, selector)
{
  //var selector = $(event.currentTarget).attr('data-target');
  //try{ $(selector).typeahead('close'); }catch(err){};
  return geodash.ui.showOptions($event, selector);
};

},{}],144:[function(require,module,exports){
module.exports = function(id)
{
  var element = $("#"+id);
  var $scope = geodash.api.getScope(id);

  $('[data-toggle="tooltip"]', element).tooltip();

  geodash.init.typeahead(
    element,
    extract('workspace.config.featurelayers', $scope),
    extract('workspace.config.baselayers', $scope),
    extract('workspace.config.servers', $scope)
  );
};

},{}],145:[function(require,module,exports){
module.exports = function($interpolate, event, ui)
{
  var that = $(this);
  var type = that.data('type');
  var range = that.data('range');

  if(type=="ordinal")
  {
    var ctx = {"value": that.data('options')[ui.value]};
    that.data('label').html($interpolate(that.data('label-template'))(ctx));
  }
  else if(type=="continuous")
  {
    if(($.type(range) == "boolean" && range ) || (range.toLowerCase() == "true"))
    {
      var ctx = {"values": [ui.values[0], ui.values[1]]};
      that.data('label').html($interpolate(that.data('label-template'))(ctx));
    }
    else if(range=="min" || range=="max")
    {
      var ctx = {"value": (ui.value / 100.0)};
      that.data('label').html($interpolate(that.data('label-template'))(ctx));
    }
  }
};

},{}],146:[function(require,module,exports){
module.exports = function(a, b)
{
  if(b.toString != undefined && b.toString().startsWith('LatLng'))
  {
    return b;
  }
  else if(b.getType != undefined && b.getType() == 'Point')
  {
    return b;
  }
  else
  {
    if(typeof L != "undefined")
    {
      var p = L.Projection.SphericalMercator;
      var minDistance = undefined;
      var closestPoint = undefined;
      $.each(b._layers, function(id, layer)
      {
        var rings = [];
        if(layer.feature.geometry.type == "MultiPolygon")
        {
          for(var i = 0; i < layer._latlngs.length; i++)
          {
            for(var j = 0; j < layer._latlngs[i].length; j++)
            {
              rings.push(layer._latlngs[i][j]);
            }
          }
        }
        else
        {
          rings.push(layer._latlngs);
        }
        for(var r = 0; r < rings.length; r++)
        {
          var verticies = rings[r];
          var i = 0;
          if(minDistance == undefined)
          {
            minDistance = L.LineUtil.pointToSegmentDistance(
              p.project(a),
              p.project(verticies[i]),
              p.project(verticies[i+1]));
            closestPoint = L.LineUtil.closestPointOnSegment(
              p.project(a),
              p.project(verticies[i]),
              p.project(verticies[i+1]));
            i++;
          }
          for(; i < verticies.length -1; i++)
          {
            var d = L.LineUtil.pointToSegmentDistance(
              p.project(a),
              p.project(verticies[i]),
              p.project(verticies[i+1]));
            if(d < minDistance)
            {
              minDistance = d;
              closestPoint = L.LineUtil.closestPointOnSegment(
                p.project(a),
                p.project(verticies[i]),
                p.project(verticies[i+1]));
            }
          }
        }
      });
      return p.unproject(closestPoint);
    }
    else
    {
      return undefined;
    }
  }
};

},{}],147:[function(require,module,exports){
module.exports = function(a, b)
{
  var minDistance = undefined;
  if(b.toString != undefined && b.toString().startsWith('LatLng'))
  {
    var p = L.Projection.SphericalMercator;
    minDistance = (p.project(a)).distanceTo(p.project(b));
  }
  else if(b.getType != undefined && b.getType() == 'Point')
  {
    minDistance = ol.sphere.WGS84.haversineDistance([a.lon, a.lat], b.flatCoordinates);
  }
  else
  {
    if(typeof L != "undefined")
    {
      $.each(b._layers, function(id, layer)
      {
        var rings = [];
        if(layer.feature.geometry.type == "MultiPolygon")
        {
          for(var i = 0; i < layer._latlngs.length; i++)
          {
            for(var j = 0; j < layer._latlngs[i].length; j++)
            {
              rings.push(layer._latlngs[i][j]);
            }
          }
        }
        else
        {
          rings.push(layer._latlngs);
        }
        for(var r = 0; r < rings.length; r++)
        {
          var verticies = rings[r];
          var i = 0;
          if(minDistance == undefined)
          {
            minDistance = L.LineUtil.pointToSegmentDistance(
              p.project(a),
              p.project(verticies[i]),
              p.project(verticies[i+1]));
            i++;
          }
          for(; i < verticies.length -1; i++)
          {
            var d = L.LineUtil.pointToSegmentDistance(
              p.project(a),
              p.project(verticies[i]),
              p.project(verticies[i+1]));
            if(d < minDistance)
            {
              minDistance = d;
            }
          }
        }
      });
    }
    else if(typeof ol != "undefined")
    {
      minDistance = undefined;
    }
  }
  return minDistance;
};

},{}],148:[function(require,module,exports){
module.exports = function(nearbyFeatures, target)
{
  var closestFeature = undefined;
  var closestDistance = 0;
  var closestLocation = undefined;
  if(nearbyFeatures != undefined)
  {
    if(nearbyFeatures.length > 0)
    {
      closestFeature = nearbyFeatures[0];
      closestDistance = geodash.vecmath.distance(target, nearbyFeatures[0].geometry);
      closestLocation = geodash.vecmath.closestLocation(target, nearbyFeatures[0].geometry);
      for(var i = 1; i < nearbyFeatures.length ;i++)
      {
        var f = nearbyFeatures[i];
        if(geodash.vecmath.distance(target, f.geometry) < closestDistance)
        {
          closestFeature = f;
          closestDistance = geodash.vecmath.distance(target, f.geometry);
          closestLocation = geodash.vecmath.closestLocation(target, f.geometry);
        }
      }
    }
  }
  return {'feature': closestFeature, 'location': closestLocation};
};

},{}],149:[function(require,module,exports){
'use strict';
module.exports = {
  closestLocation: require("./closestLocation"),
  distance: require("./distance"),
  getClosestFeatureAndLocation: require("./getClosestFeatureAndLocation")
};

},{"./closestLocation":146,"./distance":147,"./getClosestFeatureAndLocation":148}],150:[function(require,module,exports){
'use strict';
/*global require, window, console, jQuery, $, angular, Bloodhound, location */

var expand = function(x)
{
  var newArray = [];
  if(Array.isArray(x))
  {
    for(var i = 0; i < x.length; i++)
    {
      var value = x[i];
      if(angular.isString(value))
      {
        if(value.indexOf(".") != -1)
        {
          newArray = newArray.concat(value.split("."));
        }
        else
        {
          newArray.push(value);
        }
      }
      else
      {
        newArray.push(value);
      }
    }
  }
  else if(angular.isString(x))
  {
    newArray = x.split(".");
  }
  return newArray;
};

var extract = function(keyChain, node, fallback)
{
  if(angular.isString(keyChain))
  {
    keyChain = keyChain.split(".");
  }

  var obj = undefined;

  if(node != undefined && node != null)
  {
    if(keyChain.length==0)
    {
      obj = node;
    }
    else
    {
      var newKeyChain = keyChain.slice(1);
      if(newKeyChain.length == 0)
      {
        if(angular.isString(keyChain[0]) && keyChain[0].toLowerCase() == "length")
        {
          if(Array.isArray(node))
          {
            obj = node.length;
          }
          else if(angular.isDefined(node))
          {
            obj = node["length"];
          }
          else
          {
            obj = 0;
          }
        }
      }

      if(obj == undefined && angular.isDefined(node))
      {
        if(Array.isArray(node))
        {
          var index = angular.isString(keyChain[0]) ?
            parseInt(keyChain[0], 10) :
            keyChain[0];
          obj = extract(newKeyChain, node[index], fallback);
        }
        else
        {
          obj = extract(newKeyChain, node[""+keyChain[0]], fallback);
        }
      }
  	}
  }
  else
  {
    obj = fallback;
  }
	return obj;
};

var extractArrayLength = function(keyChain, node, fallback)
{
  var value = extract(keyChain, node, undefined);
  return Array.isArray(value) ? value.length : fallback;
};

var getHashValue = function(keys, type)
{
    var value = undefined;
    if(typeof keys === 'string')
    {
      keys = [keys.toLowerCase()];
    }
    else
    {
      keys = $.map(keys,function(value, i){return value.toLowerCase();});
    }
    var hash_lc = location.hash.toLowerCase();
    for(var i = 0; i < keys.length; i++)
    {
      var key = keys[i];
      var keyAndHash = hash_lc.match(new RegExp(key + '=([^&]*)'));
      if(keyAndHash)
      {
          value = keyAndHash[1];
          if(value != undefined && value != null && value != "")
          {
            break;
          }
      }
    }

    if(type != undefined)
    {
        if(type == "integer")
        {
          value = (value != undefined && value != null && value != "") ? parseInt(value, 10) : undefined;
        }
        else if(type == "stringarray")
        {
          if(value != undefined)
          {
            var newValue = value.split(",");
            value = newValue;
          }
        }
        else if(type == "integerarray")
        {
          if(value != undefined)
          {
            var sValue = value.split(",");
            var newValue = [];
            for(var i = 0; i < sValue.length; i++)
            {
              var v = sValue[i];
              newValue.push((v != undefined && v != null && v != "") ? parseInt(v, 10) : undefined);
            }
            value = newValue;
          }
        }
        else if(type == "float")
        {
          value = (value != undefined && value != null && value != "") ? parseFloat(value) : undefined;
        }
        else if(type == "floatarray")
        {
          if(value !=undefined)
          {
            var sValue = value.split(",");
            var newValue = [];
            for(var i = 0; i < sValue.length; i++)
            {
              var v = sValue[i];
              newValue.push((v != undefined && v != null && v != "") ? parseFloat(v) : undefined);
            }
            value = newValue;
          }
        }
    }
    return value;
};

var hasHashValue = function(keys)
{
    var value = getHashValue(keys);
    return value != undefined && value != null && value != "";
};
var getHashValueAsStringArray = function(keys)
{
  return getHashValue(keys, "stringarray");
};
var getHashValueAsInteger = function(keys)
{
  return getHashValue(keys, "integer");
};
var getHashValueAsIntegerArray = function(keys)
{
  return getHashValue(keys, "integerarray");
};
var getHashValueAsFloat = function(keys)
{
  return getHashValue(keys, "float");
};
var sortLayers = function(layers, reverse)
{
  var renderLayers = $.isArray(layers) ? layers : $.map(layers, function(layer){return layer;});
  renderLayers = renderLayers.sort(function(a, b){
      return a.options.renderOrder - b.options.renderOrder;
  });
  if(reverse === true)
    renderLayers.reverse();
  return renderLayers;
};
var updateRenderOrder = function(layers)
{
    for(var i = 0; i < layers.length; i++)
    {
        layers[i].bringToFront();
    }
};
var layersAsArray = function(layers)
{
  return $.map(layers, function(layer, id){return {'id':id, 'layer':layer};});
};


window.expand = expand;
window.extract = extract;
window.extractArrayLength = extractArrayLength;
window.getHashValue = getHashValue;
window.hasHashValue = hasHashValue;
window.getHashValueAsStringArray = getHashValueAsStringArray;
window.getHashValueAsInteger = getHashValueAsInteger;
window.getHashValueAsIntegerArray = getHashValueAsIntegerArray;
window.getHashValueAsFloat = getHashValueAsFloat;
window.sortLayers = sortLayers;
window.updateRenderOrder = updateRenderOrder;
window.layersAsArray = layersAsArray;
window.geodash = require("./geodash");

},{"./geodash":63}]},{},[150]);
