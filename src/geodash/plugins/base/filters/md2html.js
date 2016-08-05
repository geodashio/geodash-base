geodash.filters["md2html"] = function()
{
  return function(text)
  {
    if(text != undefined)
    {
      var converter = new showdown.Converter();
      html = converter.makeHtml(text);

      // Open Links in New Windows
      html = html.replace(new RegExp("(<a .*?)>(.*?)</a>", "gi"), '$1 target="_blank">$2</a>');

      // Replace New Line characters with Line Breaks
      html = html.replace(new RegExp('\n', 'gi'),'<br>');

      // Replace extra new lines before heading tags, which add their own margin by default
      html = html.replace(new RegExp("<br><br><(h\\d.*?)>", "gi"),'<br><$1>');

      // Replace extra new lines before paragraph tags, which add their own margin by default
      html = html.replace(new RegExp("<br><br><p>", "gi"),'<p>');

      // If one enclosing paragraph element, then flatten it.
      var matches = html.match(new RegExp("^<p(.*?)>(.*?)</p>", "gi"));
      if(angular.isDefined(matches) && matches.length == 1)  // If only 1 match
      {
        if(matches[0] == html) // Fully enclosing
        {
          html = html.substring("<p>".length, html.length - "</p>".length);
        }
      }

      return html;
    }
    else
    {
      return "";
    }
  };
};
