geodash.filters["ternary_defined"] = function()
{
  return function(value, t, f)
  {
    if(value != undefined && value != null && value != "")
    {
      return t;
    }
    else
    {
      return f;
    }
  };
};
