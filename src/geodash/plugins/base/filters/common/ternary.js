geodash.filters["ternary"] = function()
{
  return function(value, t, f)
  {
    return value ? t : f;
  };
};
