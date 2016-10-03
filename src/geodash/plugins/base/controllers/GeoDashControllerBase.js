geodash.controllers.GeoDashControllerBase = function(
  $scope, $element, $controller, $interpolate, $timeout,
  state, map_config, live)
{
  $scope.setValue = geodash.api.setValue;
  $scope.clearValue = geodash.api.clearValue;

  $scope.stack = {
    'head': undefined, //backtrace[0]
    'prev': undefined, //backtrace[1]
    'backtrace': [] // Full list to include states from other modals
  };

  /*
  * ng-click="clear_field(object_field_id, objectFieldIndex)"
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
  };*/

  $scope.asset = function(id)
  {
    return geodash.api.getAsset(id);
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
        if(! angular.isDefined(x.basepath_array)){ x.basepath_array = x.basepath.split("."); }
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
        x.path_array = x.path.length > 0 ? x.path.split(".") : [];
      }
      else if(angular.isDefined(x.objectIndex))
      {
        x.basepath_array = []
        x.path = x.objectIndex;
        x.path_flat = x.path.replace(new RegExp("\\.", "gi"), "__");
        x.path_array = [x.objectIndex];
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

  $scope.push = function(x, backtrace)
  {
    $scope.clear(); // Clean Old Values
    x = $scope.expand(x)
    $scope.update_stack([x].concat(backtrace || $scope.stack.backtrace));
    $.each($scope.stack.head, function(key, value){ $scope[key] = value; });
    $scope.update_breadcrumbs();
  };

  $scope.update_breadcrumbs = function()
  {
    var breadcrumbs = [];
    if(angular.isDefined(extract('stack.backtrace', $scope)))
    {
      for(var i = $scope.stack.backtrace.length - 1; i >= 0; i--)
      {
        var x = $scope.stack.backtrace[i];
        if(angular.isDefined(x.objectIndex))
        {
          var obj = extract(x.path_array, x.workspace);
          var content = extract('title', obj) || extract('id', obj) || x.objectIndex;
          var link = "#";
          var bc = {'content': content, 'link': link};
          breadcrumbs.push(bc);
        }
        else
        {
          var keyChain = x.schemapath_array || x.basepath_array;
          if(angular.isDefined(keyChain))
          {
            var f = extract(keyChain, x.schema);
            if(angular.isDefined(f))
            {
              var t = extract("type", f);
              var content = undefined;
              var link = "#";
              if(t == "object")
              {
                content = extract("schema.verbose_singular", f) || extract("label", f);
              }
              else if(t == "objectarray" || t == "stringarray" || t == "textarray" || t == "templatearray")
              {
                content = extract("schema.verbose_plural", f) || extract("label", f);
              }
              else
              {
                content = extract("label", f);
              }
              var bc = {'content': content, 'link': link};
              breadcrumbs.push(bc);
            }
          }
        }
      }
      $scope.breadcrumbs = breadcrumbs;
    }
    return breadcrumbs;
  };

  $scope.update_ui = function(removed, backtrace)
  {
    if(angular.isDefined($scope.stack.head))
    {
      if(angular.isDefined($scope.stack.head.modal))
      {
        if($scope.stack.head.modal == removed.modal)
        {
          $scope.update_breadcrumbs();
          $timeout(function(){ geodash.ui.update($scope.stack.head.modal); },0);
        }
        else
        {
          var oldModal = removed.modal;
          var newModal = $scope.stack.head.modal;
          $("#"+oldModal).modal('hide');
          $("#"+newModal).modal({'backdrop': 'static', 'keyboard':false});
          //var newScope = geodash.api.getScope(newModal);
          // newScope.clear(); Should have already happened in clear_all
          $timeout(function(){
            var newScope = geodash.api.getScope(newModal);
            newScope.update_stack(backtrace);
            $.each(newScope.stack.head, function(key, value){ newScope[key] = value;});
            newScope.update_breadcrumbs();
            $("#"+newModal).modal('show');
            $timeout(function(){ geodash.ui.update(newModal); },0);
          },0);
        }
      }
      else
      {
        var oldModal = removed.modal;
        $("#"+oldModal).modal('hide');
      }
    }
    else
    {
      $("#"+removed.modal).modal('hide');
    }
  };


  $scope.clear = function()
  {
    $scope.clear_all(1);
  };

  $scope.clear_all = function(count)
  {
    var backtrace = $scope.stack.backtrace;
    if(backtrace.length > 0)
    {
      var clear_array = [
        "workspace", "workspace_flat",
        "schema", "schema_flat",
        "basepath", "basepath_flat", "basepath_array",
        "schemapath", "schemapath_flat", "schemapath_array",
        "objectIndex",
        "path", "path_flat", "path_array",
        "breadcrumbs"];
      var scopes = {};
      var s = undefined;
      for(var i = 0; i < count && i < backtrace.length; i++)
      {
        var x = backtrace[i];
        if(angular.isUndefined(s))
        {
          var m = extract('modal', x);
          s = angular.isDefined(m) ? geodash.api.getScope(m) : $scope;
        }
        $.each(x, function(key, value){ s[key] = undefined; });
        $.each(clear_array, function(index, value){ s[value] = undefined; });
      }
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
      else if(angular.isDefined(extract("search.datasets", field)))
      {
        var datasets = extract("search.datasets", field);
        if((angular.isString(datasets) || Array.isArray(datasets)) && datasets.length > 0)
        {
          include = true;
        }
      }
      else if(angular.isString(extract("search.dataset", field)))
      {
        if(extract("search.dataset", field).length > 0)
        {
          include = true;
        }
      }
      else if(angular.isDefined(extract("search.local", field)))
      {
        if(angular.isString(extract("search.local", field)))
        {
          if(extract("search.local", field).length > 0)
          {
            include = true;
          }
        }
        else if(angular.isString(extract("search.local.name", field)))
        {
          include = true;
        }
      }
      else if(angular.isDefined(extract("search.remote", field, undefined)))
      {
        include = true;
      }
    }
    return include;
  };


$scope.typeaheadDatasetsForSearch = function(x)
{
  var datasets = "";

  if(! angular.isDefined(x))
  {
    x = extract($scope.schemapath, $scope.schema, undefined);
  }

  if(angular.isDefined(x))
  {
    if(Array.isArray(extract("search.datasets", x)))
    {
      datasets = extract("search.datasets", x).join(",");
    }
    else if(angular.isString(extract("search.datasets", x)))
    {
      datasets = extract("search.datasets", x);
    }
    else if(angular.isString(extract("search.dataset", x)))
    {
      datasets = extract("search.dataset", x);
    }
  }
  return datasets;
};

  $scope.localDataForSearch = function(x)
  {
    var localData = "";

    if(! angular.isDefined(x))
    {
      x = extract($scope.schemapath, $scope.schema, undefined);
    }

    if(angular.isDefined(x))
    {
      localData = extract("options", x, "");

      if(localData.length == 0)
      {
        localData = extract("search.local", x, "");
      }

    }
    return localData;
  };

  $scope.remoteDataForSearch = function(x)
  {
    var data = "";

    if(! angular.isDefined(x))
    {
      x = extract($scope.schemapath, $scope.schema, undefined);
    }

    if(angular.isDefined(x))
    {
      data = extract("search.remote", x, {});
    }

    return data;
  };
  $scope.initialValueForSearch = function(x)
  {
    var data = "";

    if(! angular.isDefined(x))
    {
      x = extract($scope.schemapath, $scope.schema, undefined);
    }

    if(angular.isDefined(x))
    {
      data = extract("search.initial", x, {});
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

  $scope.asset = function(id)
  {
    return geodash.api.getByID(id, $scope.workspace.config.assets);
  };
};
