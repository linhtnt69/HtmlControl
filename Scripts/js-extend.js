(function ($) {

    $.fn.extend({
        importantStyle: function (name, value) {
            return $.importantStyle(this, name, value);
        },
        border: function () {
            return $.border(this);
        },
        margin: function () {
            return $.margin(this);
        },
        padding: function () {
            return $.padding(this);
        },
        scrollHeight: function () {
            return $.scrollHeight(this);
        },
        totalHeight: function (length) {
            return $.totalHeight(this, length);
        },
        totalWidth: function (length) {
            return $.totalWidth(this, length);
        }
    });

    $.ext = {
        ajax: {
            get: function (url, params) {
                var result = { Code: 0, Data: null, Message: '', Language: '', LanguageArgs: [] };

                var ajaxOpts = {
                    type: 'GET',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function (response) {
                        result.Code = response.Code;
                        result.Data = response.Data;
                        result.Message = $.ext.string.format('Language {0} - Args {1}', response.Language, response.LanguageArgs);
                    },
                    error: function (e) {
                        result.Code = e.statusCode;
                        result.Message = e.statusText;
                        console.log(e.statusCode + ': ' + e.statusText);
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);

                return result;
            },
            getAsync: function (url, params, onSuccess, onError) {
                var ajaxOpts = {
                    type: 'GET',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (response) {
                        if (typeof onSuccess == 'function')
                            onSuccess(response);
                    },
                    error: function (e) {
                        console.log(e.statusCode + ': ' + e.statusText);
                        if (typeof onError == 'function')
                            onError(e);
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);
            },
            getAsyncWithLoading: function (url, params, onSuccess, onError) {
                var ajaxOpts = {
                    type: 'GET',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function () {
                        $('.modal_loading').show();
                    },
                    success: function (response) {
                        if (typeof onSuccess == 'function')
                            onSuccess(response);

                        $('.modal_loading').hide();
                    },
                    error: function (e) {
                        console.log(e.statusCode + ': ' + e.statusText);

                        if (typeof onError == 'function')
                            onError(e);

                        $('.modal_loading').hide();
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);
            },

            post: function (url, params) {
                var result = { Code: 0, Data: null, Message: '', Language: '', LanguageArgs: [] };

                var ajaxOpts = {
                    type: 'POST',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    async: false,
                    success: function (response) {
                        result.Code = response.Code;
                        result.Data = response.Data;
                        result.Message = $.ext.string.format('Language {0} - Args {1}', response.Language, response.LanguageArgs);
                    },
                    error: function (e) {
                        result.Code = e.statusCode;
                        result.Message = e.statusText;
                        console.log(e.statusCode + ': ' + e.statusText);
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);

                return result;
            },
            postAsync: function (url, params, onSuccess, onError) {
                var ajaxOpts = {
                    type: 'POST',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (response) {
                        if (typeof onSuccess == 'function')
                            onSuccess(response);
                    },
                    error: function (e) {
                        console.log(e.statusCode + ': ' + e.statusText);
                        if (typeof onError == 'function')
                            onError(e);
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);
            },
            postAsyncWithLoading: function (url, params, onSuccess, onError) {
                var ajaxOpts = {
                    type: 'POST',
                    url: url,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    beforeSend: function () {
                        $('.modal_loading').show();
                    },
                    success: function (response) {
                        if (typeof onSuccess == 'function')
                            onSuccess(response);

                        $('.modal_loading').hide();
                    },
                    error: function (e) {
                        console.log(e.statusCode + ': ' + e.statusText);

                        if (typeof onError == 'function')
                            onError(e);

                        $('.modal_loading').hide();
                    }
                };
                if (!$.isEmptyObject(params))
                    ajaxOpts.data = JSON.stringify(params);
                $.ajax(ajaxOpts);
            }
        },
        array: {
            change: function (arrs, idxs) {
                var _newArrs = [];
                $.each(idxs, function (ii, iv) {
                    if (arrs.length > iv)
                        _newArrs.push(arrs[iv]);
                });
                return _newArrs;
            },
            sum: function (arrs, idxs) {
                var _total = 0;
                if ($.isArray(idxs) && idxs.length > 0) {
                    $.each(idxs, function (ii, iv) {
                        if (arrs.length > iv)
                            _total += arrs[iv];
                    });
                }
                else {
                    $.each(arrs, function (ai, av) {
                        _total += arrs[iv];
                    });
                }
                return _total;
            }
        },
        boolean: {
            parse: function (value, nullValue) {
                if ($.ext.string.isNullOrEmpty(value))
                    value = nullValue;
                if ($.ext.string.isNullOrEmpty(value) || value.toString() == '0' || value.toString().toLowerCase() == 'false')
                    return false;
                return true;
            }
        },
        date: {
            format: function (value, fromDB) {
                if ($.ext.string.isNullOrEmpty(value))
                    return '';

                if (fromDB)
                    value = eval('new ' + value.substring(1, value.length - 1) + '');

                var info = {
                    year: value.getFullYear(),
                    month: '0' + (value.getMonth() + 1),
                    day: '0' + value.getDate(),
                    hour: '0' + value.getHours(),
                    minute: '0' + value.getMinutes(),
                    second: '0' + value.getSeconds()
                };
                if (info.month.length == 3)
                    info.month = info.month.substring(1);
                if (info.day.length == 3)
                    info.day = info.day.substring(1);
                if (info.hour.length == 3)
                    info.hour = info.hour.substring(1);
                if (info.minute.length == 3)
                    info.minute = info.minute.substring(1);
                if (info.second.length == 3)
                    info.second = info.second.substring(1);

                return $.ext.string.format('{0}/{1}/{2} {3}:{4}:{5}', info.year, info.month, info.day, info.hour, info.minute, info.second);
            },
            lastOfMonth: function (year, month) {
                return new Date(year, month, 0);
            }
        },
        guid: {
            newGuid: function () {
                var _time = new Date().getTime();;
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = (_time + Math.random() * 16) % 16 | 0;
                    _time = Math.floor(_time / 16);
                    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                });
                return uuid;
            }
        },
        number: {
            format: function (value, digit, seperate, nullValue) {
                digit = $.ext.number.parseInt(digit, 0);
                value = $.ext.number.parseFixed(value, digit, nullValue);
                if (value == null)
                    return '';

                if ($.ext.string.isNullOrEmpty(seperate))
                    seperate = ',';

                var digitSeparate = seperate == '.' ? ',' : '.';
                value = $.ext.string.replaceChar(value.toString(), seperate, '');
                if (digitSeparate == ',')
                    value = $.ext.string.replaceChar(value.toString(), digitSeparate, '.');

                if (isNaN(value))
                    return 'Invalid number format!';

                var sub = '';
                if (value.indexOf('-') != -1) {
                    sub = value.substring(0, 1);
                    value = value.substring(1, value.lenght);
                }

                var valueSeperates = value.split('.');

                var values = [];
                while (valueSeperates[0] != '') {
                    values.splice(0, 0, valueSeperates[0].substring(valueSeperates[0].length - 3, valueSeperates[0].length));
                    valueSeperates[0] = valueSeperates[0].substring(0, valueSeperates[0].length - 3);
                }

                valueSeperates[0] = values.join(seperate);
                return sub + valueSeperates.join(digitSeparate);
            },
            parseInt: function (value, nullValue) {
                if ($.ext.string.isNullOrEmpty(value) || isNaN(value))
                    value = nullValue;
                if ($.ext.string.isNullOrEmpty(value))
                    return null;
                return parseInt(value);
            },
            parseFloat: function (value, nullValue) {
                if ($.ext.string.isNullOrEmpty(value) || isNaN(value))
                    value = nullValue;
                if ($.ext.string.isNullOrEmpty(value))
                    return null;
                return parseFloat(value);
            },
            parseFixed: function (value, digit, nullValue) {
                if (digit == 0)
                    return $.ext.number.parseInt(value, nullValue);
                if ($.ext.string.isNullOrEmpty(value) || isNaN(value))
                    value = nullValue;
                if ($.ext.string.isNullOrEmpty(value))
                    return null;
                return parseFloat(value.toFixed(digit));
            },
            parseFormat: function (value, digit, seperate, nullValue) {
                digit = $.ext.number.parseInt(digit, 0);

                if ($.ext.string.isNullOrEmpty(value))
                    return $.ext.number.parseFixed(nullValue, digit, 0);

                if ($.ext.string.isNullOrEmpty(seperate))
                    seperate = ',';

                var digitSeparate = seperate == '.' ? ',' : '.';

                value = $.ext.string.replaceChar(value.toString(), seperate, '');
                if (digitSeparate == ',')
                    value = $.ext.string.replaceChar(value.toString(), digitSeparate, '.');

                return $.ext.number.parseFixed(value, digit, nullValue);
            }
        },
        object: {
            map: function (fromObj, toObj) {
                if ($.isEmptyObject(toObj))
                    return {};

                if ($.isEmptyObject(fromObj))
                    return toObj;

                var newObj = {};
                $.each(toObj, function (key, val) {
                    if (fromObj[key] == undefined)
                        newObj[key] = val;
                    else {
                        if (typeof val == 'object')
                            newObj[key] = $.ext.object.map(fromObj[key], val);
                        else
                            newObj[key] = fromObj[key];
                    }
                });

                return newObj;
            },
            sort: function (obj) {
                if ($.isEmptyObject(obj))
                    return {};

                var objKeys = Object.keys(obj);
                objKeys.sort(function (a, b) { return a - b; });

                var newObj = {};
                $.each(objKeys, function (ki, kv) {
                    newObj[kv] = obj[kv];
                });

                return newObj;
            }
        },
        string: {
            format: function (format, objs) {
                objs = typeof objs === 'object' ? objs : Array.prototype.slice.call(arguments, 1);
                return format.replace(/\{\{|\}\}|\{(\w+)\}/g, function (m, n) {
                    if (m == "{{") return "{";
                    if (m == "}}") return "}";
                    if (objs[n] == undefined) return m;
                    return objs[n];
                });
            },
            isNullOrEmpty: function (val) {
                if (val === undefined || val === null || val === '' || val === 'undefined' || val === 'null')
                    return true;
                return false;
            },
            parse: function (val) {
                if (val === undefined || val === null || val === '' || val === 'undefined' || val === 'null')
                    return '';
                return val.toString();
            },
            replaceChar: function (value, from, to) {
                if ($.ext.string.isNullOrEmpty(value))
                    return value;

                while (value.indexOf(from) != -1) {
                    value = value.replace(from, to);
                }

                return value;
            },
            replaceChars: function (value, froms, tos) {
                if ($.ext.string.isNullOrEmpty(value))
                    return value;

                for (var i = 0; i < froms.length; i++) {
                    while (value.indexOf(froms[i]) != -1) {
                        value = value.replace(froms[i], tos[i]);
                    }
                }

                return value;
            },
            runFunction: function (func, params, returnValue) {
                var paramNames = (func + '')
                    .replace(/[/][/].*$/mg, '') // strip single-line comments
                    .replace(/\s+/g, '') // strip white space
                    .replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments  
                    .split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters  
                    .replace(/=[^,]+/g, '') // strip any ES6 defaults  
                    .split(',').filter(Boolean); // split & filter [""]

                var paramValues = [];
                $.each(paramNames, function (pni, pnv) {
                    if (params[pnv] != undefined)
                        paramValues.push(JSON.stringify(params[pnv]));
                });

                if (returnValue)
                    return eval('func(' + paramValues.join(',') + ')');
                else
                    eval('func(' + paramValues.join(',') + ')');
            }
        }
    };

    $.importantStyle = function (selector, name, value) {
        if ($(selector).length <= 0)
            return;
        $(selector)[0].style.setProperty(name, value, 'important');
    };
    $.border = function (selector) {
        var _borderWidth = $(selector).css('border-width').replace(/\s/g, '');
        if ($.ext.string.isNullOrEmpty(_borderWidth))
            return { top: 0, right: 0, bottom: 0, left: 0 };

        var _borderWidthStr = '';
        var _borderWidths = _borderWidth.split('px');
        switch (_borderWidths.length) {
            case 2:
                _borderWidthStr = $.ext.string.format('{"top":{0},"right":{0},"bottom":{0},"left":{0}}', _borderWidths[0]);
                break;
            case 3:
                _borderWidthStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{0},"left":{1}}', _borderWidths[0], _borderWidths[1]);
                break;
            case 4:
                _borderWidthStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{1}}', _borderWidths[0], _borderWidths[1], _borderWidths[2]);
                break;
            case 5:
                _borderWidthStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{3}}', _borderWidths[0], _borderWidths[1], _borderWidths[2], _borderWidths[3]);
                break;
        }

        if ($.ext.string.isNullOrEmpty(_borderWidthStr))
            return { top: 0, right: 0, bottom: 0, left: 0 };
        return $.parseJSON(_borderWidthStr);
    };
    $.margin = function (selector) {
        var _margin = $(selector).css('margin').replace(/\s/g, '');
        if ($.ext.string.isNullOrEmpty(_margin))
            return { top: 0, right: 0, bottom: 0, left: 0 };

        var _marginStr = '';
        var _margins = _margin.split('px');
        switch (_margins.length) {
            case 2:
                _marginStr = $.ext.string.format('{"top":{0},"right":{0},"bottom":{0},"left":{0}}', _margins[0]);
                break;
            case 3:
                _marginStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{0},"left":{1}}', _margins[0], _margins[1]);
                break;
            case 4:
                _marginStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{1}}', _margins[0], _margins[1], _margins[2]);
                break;
            case 5:
                _marginStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{3}}', _margins[0], _margins[1], _margins[2], _margins[3]);
                break;
        }

        if ($.ext.string.isNullOrEmpty(_marginStr))
            return { top: 0, right: 0, bottom: 0, left: 0 };
        return $.parseJSON(_marginStr);
    };
    $.padding = function (selector) {
        var _padding = $(selector).css('padding').replace(/\s/g, '');
        if ($.ext.string.isNullOrEmpty(_padding))
            return { top: 0, right: 0, bottom: 0, left: 0 };

        var _paddingStr = '';
        var _paddings = _padding.split('px');
        switch (_paddings.length) {
            case 2:
                _paddingStr = $.ext.string.format('{"top":{0},"right":{0},"bottom":{0},"left":{0}}', _paddings[0]);
                break;
            case 3:
                _paddingStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{0},"left":{1}}', _paddings[0], _paddings[1]);
                break;
            case 4:
                _paddingStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{1}}', _paddings[0], _paddings[1], _paddings[2]);
                break;
            case 5:
                _paddingStr = $.ext.string.format('{"top":{0},"right":{1},"bottom":{2},"left":{3}}', _paddings[0], _paddings[1], _paddings[2], _paddings[3]);
                break;
        }

        if ($.ext.string.isNullOrEmpty(_paddingStr))
            return { top: 0, right: 0, bottom: 0, left: 0 };
        return $.parseJSON(_paddingStr);
    };
    $.scrollHeight = function (selector) {
        if ($(selector).length > 0)
            return $(selector)[0].scrollHeight;
        return 0;
    };
    $.scrollbarWidth = function () {
        var scrollDiv = document.createElement('div');
        scrollDiv.className = 'scrollbar-measure';
        document.body.appendChild(scrollDiv);

        var _scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;

        document.body.removeChild(scrollDiv);

        return _scrollbarWidth;
    };
    $.totalHeight = function (selector, length) {
        var _totalHeight = 0;
        if ($.ext.number.parseInt(length, 0) > 0) {
            $(selector).each(function () {
                if (length <= 0)
                    return false;
                _totalHeight += $(this).outerHeight();
                length--;
            });
        }
        else {
            $(selector).each(function () {
                _totalHeight += $(this).outerHeight();
            });
        }
        return _totalHeight;
    };
    $.totalWidth = function (selector, length) {
        var _totalWidth = 0;
        if ($.ext.number.parseInt(length, 0) > 0) {
            $(selector).each(function () {
                if (length <= 0)
                    return false;

                var clientRect = $(this)[0].getBoundingClientRect();
                _totalWidth += clientRect.width;

                length--;
            });
        }
        else {
            $(selector).each(function () {
                var clientRect = $(this)[0].getBoundingClientRect();
                _totalWidth += clientRect.width;
            });
        }
        return _totalWidth;
    };

})(jQuery);