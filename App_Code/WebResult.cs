public class WebResult
{
    public WebResult() { }
    public WebResult(object data)
    {
        Data = data;
    }
    public WebResult(string message)
    {
        Message = message;
    }
    public object Data { get; set; }
    public string Message { get; set; }
}