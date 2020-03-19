<%@ WebHandler Language="C#" Class="OpenFile" %>

using System;
using System.IO;
using System.Web;

public class OpenFile : IHttpHandler
{

    public void ProcessRequest(HttpContext context)
    {
        var fileData = new System.Collections.Generic.Dictionary<string, object>();
        try
        {
            var fileUrl = context.Request.Form["fileUrl"];
            var fileInfo = new FileInfo(fileUrl);
            fileData.Add("lastModifiedDate", fileInfo.LastAccessTime);
                fileData.Add("name", fileInfo.Name);
                fileData.Add("size", fileInfo.Length);
                fileData.Add("type", fileInfo.Extension);
                fileData.Add("name", fileInfo.Name);
        }
        catch (Exception)
        {

            throw;
        }

        context.Response.ContentType = "text/plain";
        context.Response.Write("Hello World");
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

}