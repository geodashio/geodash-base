geodash.filters["prepend"] = function()
{
  return function(value, arg)
  {
    if(Array.isArray(value))
    {
      if(Array.isArray(arg))
      {
        return arg.concat(value);
      }
      else
      {
        return [arg].concat(value);
      }
    }
    else if(angular.isString(value))
    {
      var arr = Array.prototype.slice.call(arguments, [1]);
      return arr.join("") + value;
    }
    else
    {
      return arg + value;
    }
  };
};
