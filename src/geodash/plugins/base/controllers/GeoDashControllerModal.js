geodash.controllers.GeoDashControllerModal = function(
  $scope, $element, $controller, $timeout, state, map_config, live)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));

  $scope.stack = {
    'head': undefined, //list[0]
    'prev': undefined, //list[1]
    'list': [],
    'backtrace': [] // Full list including other moadls stacks when necessary
  };

  $scope.showModal = function(x)
  {
    if(angular.isString(x))
    {
      return x != "";
    }
    else if(angular.isNumber(x))
    {
      return x >= 0;
    }
    else
    {
      return true;
    }
  };

  $scope.pop = function(){
    var ret = $scope.stack.list.shift();
    $scope.stack.backtrace.shift();
    if($scope.stack.list.length >= 2)
    {
      $scope.stack.head = $scope.stack.list[0];
      $scope.stack.prev = $scope.stack.list[1];
    }
    else if($scope.stack.list.length == 1)
    {
      $scope.stack.head = $scope.stack.list[0];
      $scope.stack.prev = angular.isDefined($scope.stack.head.prev) ? geodash.api.getScope($scope.stack.head.prev).stack.head : undefined;
    }
    else
    {
      $scope.stack.head = undefined;
      $scope.stack.prev = undefined;
    }
    $.each(ret, function(key, value){ $scope[key] = undefined; }); // Clean
    if(angular.isString(ret.prev))
    {
      if(ret.prev == ret.modal)
      {
        // Already cleared in $scope.go_back
        $.each($scope.stack.head, function(key, value){ $scope[key] = value;});
      }
      else
      {
        $("#"+ret.modal).modal('hide');
        $("#"+ret.prev).modal({'backdrop': 'static','keyboard':false});
        var retScope = geodash.api.getScope(ret.prev);
        retScope.clear();
        $timeout(function(){
          $.each(retScope.stack.head, function(key, value){ retScope[key] = value;});
          $("#"+ret.prev).modal('show');
        },0);
      }
    }
    else
    {
      $("#"+ret.modal).modal('hide');
    }
  };

  $scope.clear = function()
  {
    if(angular.isDefined($scope.stack.head))
    {
      $.each($scope.stack.head, function(key, value){ $scope[key] = undefined; });
      var clear_array = [
        "workspace", "workspace_flat",
        "schema", "schema_flat",
        "basepath", "basepath_flat", "basepath_array",
        "schemapath", "schemapath_flat", "schemapath_array",
        "objectIndex",
        "path", "path_flat", "path_array"];
      $.each(clear_array, function(index, value){ $scope[value] = undefined; });
    }
  };

  $scope.push = function(x, backtrace)
  {
    $scope.clear(); // Clean Old Values

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
        x.path_array = x.path.split(".");
      }
    }
    else if(angular.isDefined(x.path))
    {
      x.path_flat = x.path.replace(new RegExp("\\.", "gi"), "__");
      x.path_array = x.path.split(".");
    }
    if(angular.isDefined(x.workspace))
    {
      x.workspace_flat = geodash.api.flatten(x.workspace);
    }
    if(angular.isDefined(x.schema))
    {
      x.schema_flat = geodash.api.flatten(x.schema);
    }

    $scope.stack.list = [x].concat($scope.stack.list);
    $scope.stack.backtrace = [x].concat(backtrace || $scope.stack.backtrace);
    $scope.stack.head = $scope.stack.list[0];
    if($scope.stack.list.length >= 2)
    {
      $scope.stack.prev = $scope.stack.list[1];
    }
    else if($scope.stack.list.length == 1)
    {
      $scope.stack.prev = angular.isDefined($scope.stack.head.prev) ? geodash.api.getScope($scope.stack.head.prev).stack.head : undefined;
    }
    $.each($scope.stack.head, function(key, value){ $scope[key] = value; });
  };

  $scope.go_back = function()
  {
    $scope.clear();
    $timeout(function(){$scope.pop();},0);
  };

  $scope.edit_field = function(field_id, field_index)
  {
    var schemapath = $scope.stack.head.path;
    if(angular.isDefined($scope.stack.head.schemapath_array) && angular.isDefined(field_index))
    {
      schemapath = $scope.stack.head.schemapath + ".schema.fields."+field_index;
    }
    var x = {
      'modal': 'geodash-modal-edit-field',
      'prev': $scope.stack.head.modal,
      'workspace': $scope.stack.head.workspace,
      'schema': $scope.stack.head.schema,
      'basepath': $scope.stack.head.path,
      'schemapath': schemapath,
      'objectIndex': field_id
    };
    console.log('New X:');
    console.log(x);

    if($scope.stack.head.modal == x.modal)
    {
      // https://groups.google.com/forum/#!search/string$20input$20ng-repeat%7Csort:relevance/angular/VD77QR1J6uQ/sh-9HNkZu4IJ
      $scope.clear();
      $timeout(function(){$scope.push(x);},0);
    }
    else
    {
      $("#"+$scope.stack.head.modal).modal('hide');
      geodash.api.getScope(x.modal).push(x, $scope.stack.backtrace);
      $("#"+x.modal).modal({'backdrop': 'static','keyboard':false});
      $("#"+x.modal).modal('show');
    }
  };

  $scope.add_object = function(field_id)
  {
    var value = extract($scope.stack.head.path, $scope.stack.head.workspace);
    var length = angular.isDefined(value) ? value.length : 0;
    $scope.edit_object(length);
  };

  $scope.edit_object = function(field_id, field_index)
  {
    var schemapath = $scope.stack.head.schemapath || $scope.stack.head.path;
    if(angular.isDefined($scope.stack.head.schemapath) && angular.isDefined(field_index))
    {
      schemapath = $scope.stack.head.schemapath + ".schema.fields."+field_index;
    }
    var x = {
      'modal': 'geodash-modal-edit-object',
      'prev': $scope.stack.head.modal,
      'workspace': $scope.stack.head.workspace,
      'schema': $scope.stack.head.schema,
      'basepath': $scope.stack.head.path,
      'schemapath': schemapath,
      'objectIndex': field_id
    };
    console.log('New X:');
    console.log(x);

    if($scope.stack.head.modal == x.modal)
    {
      // https://groups.google.com/forum/#!search/string$20input$20ng-repeat%7Csort:relevance/angular/VD77QR1J6uQ/sh-9HNkZu4IJ
      $scope.clear();
      $timeout(function(){
        $scope.push(x);
        $timeout(function(){ $('[data-toggle="tooltip"]', $("#"+x.modal)).tooltip(); },0);
      },0);
    }
    else
    {
      $("#"+$scope.stack.head.modal).modal('hide');
      var targetScope = geodash.api.getScope(x.modal);
      var backtrace = $scope.stack.backtrace;
      targetScope.clear();
      $timeout(function(){
        targetScope.push(x, backtrace);
        var m = $("#"+x.modal);
        m.modal({'backdrop': 'static','keyboard':false});
        m.modal('show');
        $timeout(function(){ $('[data-toggle="tooltip"]', m).tooltip(); },0);
      },0);
    }
  };

  $scope.save_object = function()
  {
    var workspace = $scope.workspace;
    var workspace_flat = $scope.workspace_flat;
    $scope.clear();
    $timeout(function(){
      // By using $timeout, we're sure the template was reset (after we called $scope.clear)
      var ret = $scope.stack.list.shift();
      $scope.stack.backtrace.shift();
      if($scope.stack.list.length >= 2)
      {
        $scope.stack.head = $scope.stack.list[0];
        $scope.stack.prev = $scope.stack.list[1];
      }
      else if($scope.stack.list.length == 1)
      {
        $scope.stack.head = $scope.stack.list[0];
        $scope.stack.prev = angular.isDefined($scope.stack.head.prev) ? geodash.api.getScope($scope.stack.head.prev).stack.head : undefined;
      }
      else
      {
        $scope.stack.head = undefined;
        $scope.stack.prev = undefined;
      }
      $.each(ret, function(key, value){ $scope[key] = undefined; }); // Clean

      if(ret.prev == "geodash-modal-edit-object")
      {
        $.each($scope.stack.head, function(key, value){ $scope[key] = value;});
        $scope.workspace = $scope.stack.head.workspace = workspace;
        $scope.workspace_flat = $scope.stack.head.workspace_flat = workspace_flat;
      }
      else if(ret.prev == "geodash-modal-edit-field")
      {
        // Close Edit Object Modal
        $("#"+ret.modal).modal('hide');
        // Save Back to Edit Field Scope
        var targetScope = geodash.api.getScope(ret.prev);
        targetScope.workspace = targetScope.stack.head.workspace = workspace;
        targetScope.workspace_flat = targetScope.stack.head.workspace_flat = workspace_flat;
        // Open Edit Field Modal
        $("#"+ret.prev).modal('show');
        $timeout(function(){ $('[data-toggle="tooltip"]', $("#"+ret.prev)).tooltip(); },0);
      }
      else
      {
        // Save to GeoDash Server Editor
        var targetScope = geodash.api.getScope("geodash-sidebar-right");
        targetScope.workspace = workspace;
        targetScope.workspace_flat = workspace_flat;
        $("#"+ret.modal).modal('hide');
      }
    },0);
  };

  $scope.modal_title = function()
  {
    var breadcrumbs = [];
    for(var i = $scope.stack.backtrace.length - 1; i >= 0; i--)
    {
      var x = $scope.stack.backtrace[i];
      if(angular.isDefined(x.objectIndex))
      {
        var obj = extract(x.path_array, x.workspace);
        breadcrumbs.push(extract('title', obj) || extract('id', obj) || x.objectIndex);
      }
      else
      {
        var f = extract(x.schemapath_array || x.basepath_array, x.schema);
        if(angular.isDefined(f))
        {
          var t = extract("type", f);
          if(t == "object")
          {
            breadcrumbs.push(extract("schema.verbose_singular", f) || extract("label", f));
          }
          else if(t == "objectarray" || t == "stringarray" || t == "textarray" || t == "templatearray")
          {
            breadcrumbs.push(extract("schema.verbose_plural", f) || extract("label", f));
          }
          else
          {
            breadcrumbs.push(extract("label", f));
          }
        }
      }
    }
    return "Edit / " + breadcrumbs.join(" / ");
  };

  $scope.back_label = function()
  {
    var label = "Cancel";
    if(angular.isDefined($scope.stack.head) && $scope.stack.backtrace.length > 1)
    {
      var x = $scope.stack.backtrace[1];
      var t = extract((x.schemapath_array || x.basepath_array), x.schema);
      if(t.type == "objectarray" && angular.isNumber($scope.stack.head.objectIndex))
      {
        label = "Back to "+(extract("schema.verbose_plural", t) || extract("label", t));
      }
      else
      {
        label = "Back to "+(extract("schema.verbose_singular", t) || extract("label", t));
      }
    }
    return label;
  };

  $scope.save_label = function()
  {
    var label = "";
    if(angular.isDefined($scope.stack.head))
    {
      var x = $scope.stack.head;
      var t = extract((x.schemapath_array || x.basepath_array), x.schema);
      if(t.type == "objectarray" && (! angular.isDefined($scope.stack.head.objectIndex)))
      {
        label = "Save "+(extract("schema.verbose_plural", t) || extract("label", t) || "Object");
      }
      else
      {
        label = "Save "+(extract("schema.verbose_singular", t) || "Object");
      }
    }
    else
    {
      label = "Save";
    }
    return label;
  };
};
