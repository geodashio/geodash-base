geodash.filters["formatBreakpoint"] = function()
{
    return function(value)
    {
      if(Number.isInteger(value))
      {
        return geodash.filters["formatInteger"]()(value, 'delimited', ' ');
      }
      else if($.isNumeric(value))
      {
        return geodash.filters["formatFloat"]()(value, 2);
      }
      else
      {
        return "" + value;
      }
    };
};
