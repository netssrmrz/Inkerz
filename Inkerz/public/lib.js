
export class Ctx
{
  constructor()
  {
    this.use_cache = true;
    this.cache = [];
  }

  Get_From_Cache(key)
  {
    return this.cache[key];
  }

  Insert_In_Cache(key, val)
  {
    this.cache[key] = val;
  }

  If_Not_In_Cache(key, get_val_fn, on_success_fn)
  {
    var val = null;

    if (this.Exists_In_Cache(key))
    {
      val = this.Get_From_Cache(key);
      on_success_fn(val);
    }
    else
    {
      get_val_fn();
    }
  }

  Delete_From_Cache(key, on_success_fn)
  {
    this.cache[key] = null;
  }

  Get_Comics(limit, offset, orderBy, titleStartsWith, issueNumber, on_success_fn)
  {
    var url_params, url = "/v1/public/comics";

    if (limit)
      url_params = Append_Str(url_params, "limit=" + limit, "&");
    if (offset)
      url_params = Append_Str(url_params, "offset=" + offset, "&");
    if (orderBy)
      url_params = Append_Str(url_params, "orderBy=" + encodeURIComponent(orderBy), "&");
    if (titleStartsWith)
      url_params = Append_Str(url_params, "titleStartsWith=" + encodeURIComponent(titleStartsWith), "&");
    if (issueNumber)
      url_params = Append_Str(url_params, "issueNumber=" + encodeURIComponent(issueNumber), "&");
    if (url_params)
      url = url + "?" + url_params;

    Get_Json(url, on_success_fn);
  }

  Get_Comic(id) { }

  Get_Comic_Characters(id) { }

  Get_Comic_Creators(id) { }

  Get_Comic_Events(id) { }

  Get_Comic_Stories(id) { }
}

export function Get_Json(url, success_fn)
{
  var req;

  req = new XMLHttpRequest();
  req.onreadystatechange = Req_State_Change;
  req.open("GET", url, true);
  req.send();

  function Req_State_Change()
  {
    if (this.readyState == XMLHttpRequest.DONE)
    {
      if (success_fn != null)
        success_fn(JSON.parse(this.responseText));
    }
  }
};

export function If_Empty_Null(a)
{
  var res;

  if (a != null && a != "")
    res = a;

  return res;
}

export function To_Int(str)
{
  var res = 0, int;

  if (str != null)
  {
    int = parseInt(str);
    if (!isNaN(int))
      res = int;
  }

  return res;
}
function Append_Str(a, b, div)
{
  var res;

  if (a && b)
    res = a + div + b;
  else if (a && !b)
    res = a;
  else if (!a && b)
    res = b;

  return res;
}