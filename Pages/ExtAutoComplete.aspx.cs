using System;
using System.Web.Services;

public partial class Pages_ExtAutoComplete : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    static TestProcess testProcess = new TestProcess();

    [WebMethod]
    public static WebResult Read(ReadModel readModel)
    {
        var readResult = testProcess.Read(readModel);
        return new WebResult(readResult);
    }
}