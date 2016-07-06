geodash.filters["default_if_undefined_or_blank"] = function()
{
  return function(value, fallback)
  {
    if(value != undefined && value != null && value != "")
    {
      return value;
    }
    else
    {
      return fallback;
    }
  };
};
