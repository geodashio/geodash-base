geodash.controllers.GeoDashControllerModal = function(
  $scope, $element, $controller, $timeout, state, map_config, live)
{
  angular.extend(this, $controller('GeoDashControllerBase', {$element: $element, $scope: $scope}));

  $scope.showOptions = geodash.ui.showOptions;

  $scope.stack = {
    'head': undefined, //backtrace[0]
    'prev': undefined, //backtrace[1]
    'backtrace': [] // Full list to include states from other modals
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

  $scope.pop = function()
  {
    var removed = $scope.stack.backtrace.shift();
    $scope.update_stack();
    $scope.update_main(removed);
    $scope.update_ui(removed, $scope.stack.backtrace);
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

  $scope.push = function(x, backtrace)
  {
    $scope.clear(); // Clean Old Values
    x = $scope.expand(x)
    $scope.update_stack([x].concat(backtrace || $scope.stack.backtrace));
    $.each($scope.stack.head, function(key, value){ $scope[key] = value; });
    $scope.update_breadcrumbs();
  };

  $scope.rollback = function(index)
  {
    var count = angular.isDefined(index) ? ($scope.stack.backtrace.length - index - 1) : 1;
    $scope.clear_all(count);
    $timeout(function(){
      var removed = $scope.stack.backtrace[0];
      $scope.update_stack($scope.stack.backtrace.slice(count));
      $scope.update_main(removed);
      $scope.update_ui(removed, $scope.stack.backtrace);
    },0);
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
      $timeout(function(){ geodash.ui.update(x.modal); },0);
    }
  };

  $scope.add_object = function(field_id)
  {
    //var value = extract($scope.stack.head.path, $scope.stack.head.workspace);
    //var length = angular.isDefined(value) ? value.length : 0;
    $scope.edit_object(extractArrayLength($scope.stack.head.path, $scope.stack.head.workspace, 0));
  };

  $scope.search_object = function()
  {
    var field_id = extractArrayLength($scope.stack.head.path, $scope.stack.head.workspace, 0)
    var field_index = undefined;
    /////////////
    var schemapath = $scope.stack.head.schemapath || $scope.stack.head.path;
    if(angular.isDefined($scope.stack.head.schemapath) && angular.isDefined(field_index))
    {
      schemapath = $scope.stack.head.schemapath + ".schema.fields."+field_index;
    }
    var x = {
      'modal': 'geodash-modal-search-object',
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
        $timeout(function(){ geodash.ui.update(x.modal); },0);
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
        $timeout(function(){ geodash.ui.update(x.modal); },0);
      },0);
    }
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
        $timeout(function(){ geodash.ui.update(x.modal); },0);
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
        $timeout(function(){ geodash.ui.update(x.modal); },0);
      },0);
    }
  };

  $scope.save_object = function()
  {
    var workspace = $scope.workspace;
    var workspace_flat = $scope.workspace_flat;
    $scope.clear_all(2);
    $timeout(function(){
      // By using $timeout, we're sure the template was reset (after we called $scope.clear)
      //var ret = $scope.stack.list.shift();
      var saved = $scope.stack.backtrace.shift();
      if($scope.stack.backtrace.length > 0)
      {
        var backtrace = $scope.stack.backtrace;
        backtrace[0]['workspace'] = workspace;
        backtrace[0]['workspace_flat'] = workspace_flat;
        $scope.update_stack(backtrace);
        if($scope.stack.head.modal == saved.modal)
        {
          $.each($scope.stack.head, function(key, value){ $scope[key] = value;});
          $scope.workspace = $scope.stack.head.workspace = workspace;
          $scope.workspace_flat = $scope.stack.head.workspace_flat = workspace_flat;
          $scope.update_breadcrumbs();
        }
        else
        {
          var oldModal = saved.modal;
          var newModal = $scope.stack.head.modal;
          $("#"+oldModal).modal('hide');
          $("#"+newModal).modal({'backdrop': 'static', 'keyboard':false});
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
        var targetScope = geodash.api.getScope("geodash-sidebar-right");
        targetScope.workspace = workspace;
        targetScope.workspace_flat = workspace_flat;
        $("#"+saved.modal).modal('hide');
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
