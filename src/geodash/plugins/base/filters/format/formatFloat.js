geodash.filters["formatFloat"] = function()
{
  return function(value, decimals)
  {
    if(value != undefined && value !== "")
    {
      if(decimals != undefined)
      {
        return value.toFixed(decimals);
      }
      else
      {
        return value.toString();
      }
    }
    else
    {
      return "";
    }
  };
};
