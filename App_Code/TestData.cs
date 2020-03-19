using System.Collections.Generic;
using System.Linq;

public class TestData
{
    public string Key { get; set; }
    public string A { get; set; }
    public string B { get; set; }
    public string C { get; set; }
    public string D { get; set; }
    public string E { get; set; }
    public string F { get; set; }
    public string G { get; set; }
    public string H { get; set; }
    public string I { get; set; }
}

public class TestProcess
{
    static List<TestData> datas = new List<TestData>();
    public TestProcess()
    {
        for (int i = 0; i < 1000; i++)
        {
            datas.Add(new TestData
            {
                Key = "Key" + i,
                A = "A" + i,
                B = "B" + i,
                C = "C" + i,
                D = "D" + i,
                E = "E" + i,
                F = "F" + i,
                G = "G" + i,
                H = "H" + i,
                I = "I" + i
            });
        }
    }

    public string Create(TestData newData)
    {
        if (newData == null)
            return "Entity is empty";

        newData.Key = "Key" + datas.Count;
        datas.Add(newData);

        return "";
    }

    public string Delete(string key)
    {
        if (string.IsNullOrEmpty(key))
            return "key is required";

        if (!datas.Any(d => d.Key == key))
            return "Not found key " + key;

        datas.RemoveAll(d => d.Key == key);

        return "";
    }

    public string Update(string key, TestData newData)
    {
        if (newData == null)
            return "Entity is empty";

        if (string.IsNullOrEmpty(key))
            return "key is required";

        if (!datas.Any(d => d.Key == key))
            return "Not found key " + key;

        datas.RemoveAll(d => d.Key == key);

        newData.Key = key;
        datas.Add(newData);

        return "";
    }

    public ReadResult<TestData> Read(ReadModel readModel)
    {
        var readResult = new ReadResult<TestData>(datas);

        if (readModel.Filters.IsReady())
        {
            foreach (var filter in readModel.Filters)
            {
                readResult.Datas = readResult.Datas.Find(filter.Names, filter.Value, filter.Type).ToList();
            }
        }

        readResult.TotalRow = readResult.Datas.Count;

        if (readModel.Sorters.IsReady())
        {
            var orderDatas = readResult.Datas.OrderBy(readModel.Sorters[0].Name, readModel.Sorters[0].Type);
            for (int s = 1; s < readModel.Sorters.Count; s++)
            {
                orderDatas = orderDatas.OrderNext(readModel.Sorters[s].Name, readModel.Sorters[s].Type);
            }
            readResult.Datas = orderDatas.ToList();
        }

        if (readModel.Pager.IsReady())
            readResult.Datas = readResult.Datas.Skip(readModel.Pager.Size * readModel.Pager.Index).Take(readModel.Pager.Size).ToList();

        return readResult;
    }
}