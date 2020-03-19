using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Services;

public partial class Pages_ExtReportView : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    static TestProcess testProcess = new TestProcess();

    [WebMethod]
    public static WebResult Create(TestData newData)
    {
        var message = testProcess.Create(newData);
        if (!string.IsNullOrEmpty(message))
            return new WebResult(message);
        return new WebResult(newData);
    }

    [WebMethod]
    public static WebResult Delete(string key)
    {
        var message = testProcess.Delete(key);
        if (!string.IsNullOrEmpty(message))
            return new WebResult(message);
        return new WebResult();
    }

    [WebMethod]
    public static WebResult Deletes(List<string> keys)
    {
        if (keys == null || !keys.Any())
            return new WebResult("keys is required");

        var messages = new List<string>();
        foreach (var key in keys)
        {
            var message = testProcess.Delete(key);
            if (!string.IsNullOrEmpty(message))
                messages.Add(message);
        }

        if (messages.Count > 0)
            return new WebResult(string.Join("<br/>", messages));

        return new WebResult();
    }

    [WebMethod]
    public static WebResult Update(string key, TestData newData)
    {
        var message = testProcess.Update(key, newData);
        if (!string.IsNullOrEmpty(message))
            return new WebResult(message);
        return new WebResult(newData);
    }

    [WebMethod]
    public static WebResult Read(ReadModel readModel)
    {
        var readResult = testProcess.Read(readModel);
        return new WebResult(readResult);
    }
}