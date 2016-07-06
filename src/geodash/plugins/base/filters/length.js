geodash.filters["len"] = geodash.filters["length"] = function()
{
  return function(value)
  {
    if(Array.isArray(value))
    {
      return value.length;
    }
    else if(angular.isString(value))
    {
      return value.length;
    }
    else
    {
      return 0;
    }
  };
};
