geodash.controllers.GeoDashControllerBase = function(
  $scope, $element, $controller, $interpolate, $timeout, state, map_config, live)
{
  $scope.setValue = geodash.api.setValue;
  $scope.clearValue = geodash.api.clearValue;

  $scope.stack = {
    'head': undefined, //backtrace[0]
    'prev': undefined, //backtrace[1]
    'backtrace': [] // Full list to include states from other modals
  };

  $scope.clear_field = function(field_flat, field_index)
  {
    if(angular.isDefined(field_flat))
    {
      var fullpath_array = $scope.path_array.concat(field_flat.split("__"));
      $scope.clearValue(fullpath_array, $scope.workspace);
      $.each($scope.workspace_flat, function(key, value){
        if(key.startsWith(fullpath_array.join("__")))
        {
          delete $scope.workspace_flat[key];
          delete $scope.stack.head.workspace_flat[key];
        }
      });
    }
  };

  $scope.update_stack = function(backtrace)
  {
    if(angular.isDefined(backtrace))
    {
      $scope.stack.backtrace = geodash.api.deepCopy(backtrace);
    }
    if($scope.stack.backtrace.length >= 2)
    {
      $scope.stack.head = $scope.stack.backtrace[0];
      $scope.stack.prev = $scope.stack.backtrace[1];
    }
    else if($scope.stack.backtrace.length == 1)
    {
      $scope.stack.head = $scope.stack.backtrace[0];
      $scope.stack.prev = undefined;
    }
    else
    {
      $scope.stack.head = undefined;
      $scope.stack.prev = undefined;
    }
  };

  $scope.update_main = function(removed)
  {
    if(angular.isDefined($scope.stack.head))
    {
      if(angular.isDefined(removed))
      {
        if($scope.stack.head.modal == removed.modal)
        {
          $.each($scope.stack.head, function(key, value){ $scope[key] = value;});
        }
      }
      else
      {
        $.each($scope.stack.head, function(key, value){ $scope[key] = value;});
      }
    }
  };

  $scope.expand = function(x)
  {
    if(angular.isDefined(x))
    {
      if(angular.isDefined(x.schemapath))
      {
        x.schemapath_flat = x.schemapath.replace(new RegExp("\\.", "gi"), "__");
        x.schemapath_array = x.schemapath.split(".");
      }

      if(angular.isDefined(x.basepath))
      {
        x.basepath_array = x.basepath.split(".");
        if(angular.isDefined(x.schemapath))
        {
          x.object_fields = extract(x.schemapath_array.concat(["schema", "fields"]), x.schema, []);
        }
        else
        {
          x.object_fields = extract(x.basepath_array.concat(["schema", "fields"]), x.schema, []);
        }
        if(angular.isDefined(x.objectIndex))
        {
          x.path = x.basepath + "." + x.objectIndex;
          x.path_flat = x.path.replace(new RegExp("\\.", "gi"), "__");
          x.path_array = x.basepath_array.concat([x.objectIndex]);
        }
        else
        {
          x.path = x.basepath;
          x.path_flat = x.path.replace(new RegExp("\\.", "gi"), "__");
          x.path_array = x.path.length > 0 ? x.path.split(".") : [];
        }
      }
      else if(angular.isDefined(x.path))
      {
        x.path_flat = x.path.replace(new RegExp("\\.", "gi"), "__");
        x.path_array = x.path.length > 0 ? x.path.split(".") : []
      }
      if(angular.isDefined(x.workspace))
      {
        x.workspace_flat = geodash.api.flatten(x.workspace);
      }
      if(angular.isDefined(x.schema))
      {
        x.schema_flat = geodash.api.flatten(x.schema);
      }
    }
    return x;
  };

  $scope.api = function(name)
  {
    if(angular.isDefined($scope.workspace))
    {
      var slug = geodash.api.getScope('geodash-main')['state']['slug'];
      if(angular.isString(slug) && slug.length > 0)
      {
        var template = geodash.api.getEndpoint(name);
        if(template != undefined)
        {
          return $interpolate(template)({ 'slug': slug });
        }
      }
      else
      {
        return "#";
      }
    }
    else
    {
      return "#";
    }
  };

  $scope.includeTypeaheadForField = function(field)
  {
    var include = false;
    if(angular.isDefined(field))
    {
      if(extract("options", field, []).length > 0)
      {
        include = true;
      }
      else if(extract("search.local", field, "").length > 0)
      {
        include = true;
      }
      else if(angular.isDefined(extract("search.remote", field, undefined)))
      {
        include = true;
      }
    }
    return include;
  };

  $scope.localDataForField = function(field)
  {
    var localData = "";

    if(! angular.isDefined(field))
    {
      field = extract($scope.schemapath, $scope.schema, undefined);
    }

    if(angular.isDefined(field))
    {
      localData = extract("options", field, "");
      if(localData.length == 0)
      {
        localData = extract("search.local", field, "");
      }
    }
    return localData;
  };
  $scope.remoteDataForField = function(field)
  {
    var data = "";

    if(! angular.isDefined(field))
    {
      field = extract($scope.schemapath, $scope.schema, undefined);
    }

    if(angular.isDefined(field))
    {
      data = extract("search.remote", field, {});
    }
    return data;
  };

  $scope.localDataForSearch = function()
  {
    var data = "";
    return data;
  };
  $scope.remoteDataForSearch = function()
  {
    var data = "";
    var schema = extract($scope.schemapath, $scope.schema, undefined);
    if(angular.isDefined(schema))
    {
      data = extract("search.remote", schema, {});
    }
    return data;
  };
  $scope.outputForSearch = function()
  {
    var data = "";
    var schema = extract($scope.schemapath, $scope.schema, undefined);
    if(angular.isDefined(schema))
    {
      data = extract("search.output", schema, "");
    }
    return data;
  };
  $scope.datasetsForSearch = function()
  {
    var data = "";
    var schema = extract($scope.schemapath, $scope.schema, undefined);
    if(angular.isDefined(schema))
    {
      data = extract("search.datasets", schema, "");
    }
    return data;
  };
};
