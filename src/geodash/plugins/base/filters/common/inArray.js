geodash.filters["inArray"] = function()
{
  return function(value, arr)
  {
      if(Array.isArray(arr))
      {
        return arr.indexOf(value) != -1;
      }
      else
      {
        return false;
      }
  };
};
