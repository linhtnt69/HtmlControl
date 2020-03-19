using System.Collections.Generic;

public class ReadResult
{
    public ReadResult()
    {
        Datas = new List<object>();
        TotalRow = 0;
    }
    public ReadResult(List<object> datas)
    {
        Datas = datas;
        TotalRow = 0;
    }

    public List<object> Datas { get; set; }
    public int TotalRow { get; set; }
}

public class ReadResult<T>
{
    public ReadResult()
    {
        Datas = new List<T>();
        TotalRow = 0;
    }
    public ReadResult(List<T> datas)
    {
        Datas = datas;
        TotalRow = 0;
    }

    public List<T> Datas { get; set; }
    public int TotalRow { get; set; }
}