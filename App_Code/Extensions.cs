using System.Collections.Generic;
using System.Linq;

public static class Extensions
{
    static bool equals<T>(this T obj, List<string> names, object value)
    {
        var isTrue = false;
        foreach (var name in names)
        {
            var objVal = obj.GetType().GetProperty(name).GetValue(obj, null);
            if (objVal == value)
            {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }
    static bool startWith<T>(this T obj, List<string> names, object value)
    {
        var isTrue = false;
        foreach (var name in names)
        {
            var objVal = obj.GetType().GetProperty(name).GetValue(obj, null);
            if (objVal != null && objVal.ToString().StartsWith(value.ToString()))
            {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }
    static bool endWith<T>(this T obj, List<string> names, object value)
    {
        var isTrue = false;
        foreach (var name in names)
        {
            var objVal = obj.GetType().GetProperty(name).GetValue(obj, null);
            if (objVal != null && objVal.ToString().EndsWith(value.ToString()))
            {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }
    static bool contains<T>(this T obj, List<string> names, object value)
    {
        var isTrue = false;
        foreach (var name in names)
        {
            var objVal = obj.GetType().GetProperty(name).GetValue(obj, null);
            if (objVal != null && objVal.ToString().Contains(value.ToString()))
            {
                isTrue = true;
                break;
            }
        }
        return isTrue;
    }
    public static IEnumerable<T> Find<T>(this IEnumerable<T> datas, List<string> names, object value, string type)
    {
        if (names == null || names.Count <= 0 || string.IsNullOrEmpty(type) || value == null)
            return datas;

        if (type.ToLower() == "equals")
            return datas.Where(d => d.equals(names, value));

        if (type.ToLower() == "startwith")
            return datas.Where(d => d.startWith(names, value));

        if (type.ToLower() == "endwith")
            return datas.Where(d => d.endWith(names, value));

        if (type.ToLower() == "contains")
            return datas.Where(d => d.contains(names, value));

        return datas;
    }
    public static IOrderedEnumerable<T> OrderBy<T>(this IEnumerable<T> datas, string name, string type)
    {
        if (!string.IsNullOrEmpty(type) && type.ToLower() == "desc")
            return datas.OrderByDescending(d => d.GetType().GetProperty(name).GetValue(d, null));
        return datas.OrderBy(d => d.GetType().GetProperty(name).GetValue(d, null));
    }
    public static IOrderedEnumerable<T> OrderNext<T>(this IOrderedEnumerable<T> orderDatas, string name, string type)
    {
        if (!string.IsNullOrEmpty(type) && type.ToLower() == "desc")
            return orderDatas.ThenByDescending(d => d.GetType().GetProperty(name).GetValue(d, null));
        return orderDatas.ThenBy(d => d.GetType().GetProperty(name).GetValue(d, null));
    }

    public static bool IsReady<T>(this T obj)
    {
        return obj != null;
    }
    public static bool IsReady<T>(this List<T> objs)
    {
        return objs != null && objs.Any();
    }
}