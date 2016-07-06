geodash.filters["split"] = function()
{
    return function(value, delimiter)
    {
        if(angular.isString(value))
        {
            return value.split(delimiter || ",");
        }
        else
        {
            return value;
        }
    };
};
