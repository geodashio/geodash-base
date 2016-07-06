geodash.filters["yaml"] = function()
{
  return function(value, depth)
  {
    if(value != undefined)
    {
      return YAML.stringify(value, (depth || 4));
    }
    else
    {
      return "";
    }
  };
};
