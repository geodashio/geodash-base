geodash.filters["parseTrue"] = function()
{
  return function(value)
  {
      return ['on', 'true', 't', '1', 1, true].indexOf(value) != -1;
  };
};
