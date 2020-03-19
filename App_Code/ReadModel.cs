using System.Collections.Generic;

public class Filter
{
    public List<string> Names { get; set; }
    public object Value { get; set; }
    public string Type { get; set; }
}

public class Pager
{
    public int Index { get; set; }
    public int Size { get; set; }
}

public class Sorter
{
    public string Name { get; set; }
    public string Type { get; set; }
}

public class ReadModel
{
    public Pager Pager { get; set; }
    public List<Filter> Filters { get; set; }
    public List<Sorter> Sorters { get; set; }
}