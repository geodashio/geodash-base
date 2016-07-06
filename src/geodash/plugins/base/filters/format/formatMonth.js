geodash.filters["formatMonth"] = function()
{
  return function(value, type)
  {
    if(value != undefined && value !== "")
    {
      if(type == "long")
      {
        return months_long[value-1];
      }
      else if(type == "short3" || type == "short_3")
      {
        return months_short_3[value-1];
      }
      else if(type == "int2")
      {
        return value < 10 ? ('0'+ value.toString()) : value.toString();
      }
      else
      {
        return value.toString();
      }
    }
    else
    {
      return ""
    }
  };
};
