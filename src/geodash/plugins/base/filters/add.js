geodash.filters["add"] = function()
{
  return function(value, arg)
  {
    if(Array.isArray(arg))
    {
      var arr = arg;
      return value + arr[value % arr.length];
    }
    else if(arguments.length > 2)
    {
      var arr = Array.prototype.slice.call(arguments, [1]);
      return value + arr[value % arr.length];
    }
    else
    {
      return value + arg;
    }
  };
};
