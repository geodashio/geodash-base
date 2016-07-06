geodash.filters["formatArray"] = function()
{
  return function(arr)
  {
      if(Array.isArray(arr))
      {
        if(arr.length == 0)
        {
          return "";
        }
        else if(arr.length == 1)
        {
          return arr[0];
        }
        else if(arr.length == 2)
        {
          return arr.join(" and ");
        }
        else // greater than 2
        {
          return arr.slice(0,-1).join(", ")+", and "+arr[arr.length - 1];
        }
      }
      else
      {
          return arr;
      }
  };
};
