geodash.filters["default_if_undefined"] = function()
{
  return function(value, fallback)
  {
    if(value != undefined && value != null)
    {
      return value;
    }
    else
    {
      return fallback;
    }
  };
};
