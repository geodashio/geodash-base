geodash.filters["formatInteger"] = function()
{
  return function(value, type, delimiter)
  {
    if(value != undefined && value !== "")
    {
      if(type == "delimited")
      {
        delimiter = delimiter || ',';
        var str = Math.round(value).toString(); // Round in case value is a float
        var pattern = new RegExp('(\\d+)(\\d{3})','gi');
        while(pattern.test(str)){str=str.replace(pattern,'$1'+ delimiter +'$2');}
        return str;
      }
      else
      {
        return Math.round(value).toString();
      }
    }
    else
    {
        return "";
    }
  };
};
