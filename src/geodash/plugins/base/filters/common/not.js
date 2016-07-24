geodash.filters["not"] = function()
{
  return function(value)
  {
    return ! value;
  };
};
