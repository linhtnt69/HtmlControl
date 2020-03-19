(function ($) {

    $.fn.extend({
        extTable: function (options) {
            return new $.ext.table(options, this);
        }
    });

    $.ext.table = function (options, target) {
        var $options = $.extend(true, {
            autoLoadOnReady: true,
            autoRender: true,
            ajaxCreate: {
                url: '',
                createParam: function (data) { return {}; },
                onSuccess: function (data) { },
                onError: function () { }
            },
            ajaxDelete: {
                url: '',
                createParam: function (data) { return {}; },
                onSuccess: function (data) { },
                onError: function () { }
            },
            ajaxUpdate: {
                url: '',
                createParam: function (data) { return {}; },
                onSuccess: function (data) { },
                onError: function () { }
            },
            ajaxRead: {
                url: '',
                createParam: function () { return {}; }
            },
            createData: function () { return []; },
            columnAction: { headClassName: '', headText: '', design: null },
            columnCheck: { className: '', disabled: false },
            columns: [],
            groups: [],
            fixeds: { columns: { lefts: [], leftInMin: 0, rights: [], rightInMin: 0 }, head: false, height: 0 },
            info: { show: true, format: 'Showing {0} to {1} of {2} entries' },
            paging: { index: 0, sizes: { label: 'Show', start: 0, times: 4 } },
            sorting: { columns: [], fields: {}, defaults: {} },
            rows: {
                click: function (data) { return true; },
                edit: { inline: false, modal: false, templates: {} },
                hover: { use: false, over: function (data) { return true; }, out: function (data) { return true; } },
            }
        }, options);
        var $locals = {
            name: 'ext-table-' + $.ext.guid.newGuid(),
            fixedColumns: { lefts: [], rights: [] },
            fixedWidth: 0,
            groups: [],
            percents: [], resizeInterval: null,
            scrolls: { left: 0, top: 0 },
            templates: { columns: [], rowKey: '', colIndex: 0 }
        };
        var $targets = {
            table: '[data-name="' + $locals.name + '"]',
            table_hidden_data: '[data-name="' + $locals.name + '"] > div.hidden-data',

            table_head_data: '[data-name="' + $locals.name + '"] > div.content-head.head-data',
            table_head_left: '[data-name="' + $locals.name + '"] > div.content-head.head-left',
            table_head_right: '[data-name="' + $locals.name + '"] > div.content-head.head-right',

            table_body_data: '[data-name="' + $locals.name + '"] > div.content-body.body-data',
            table_body_left: '[data-name="' + $locals.name + '"] > div.content-body.body-left',
            table_body_right: '[data-name="' + $locals.name + '"] > div.content-body.body-right',

            table_foot: '[data-name="' + $locals.name + '"] > div.content-foot',
            table_foot_info: '[data-name="' + $locals.name + '"] > div.content-foot .info',
            table_foot_paging: '[data-name="' + $locals.name + '"] > div.content-foot .paging',

            table_modal: '[data-name="' + $locals.name + '"] > div.modal',
            table_modal_dialog: '[data-name="' + $locals.name + '"] > div.modal .dialog',
            table_modal_loading: '[data-name="' + $locals.name + '"] > div.modal .loading',

            table_scroll_bottom: '[data-name="' + $locals.name + '"] > div.scroll-bottom',
            table_scroll_right: '[data-name="' + $locals.name + '"] > div.scroll-right',

            paging_attr: '[data-name="' + $locals.name + '-paging-attr"]',
            paging_size: '[data-name="' + $locals.name + '-paging-size"]'
        };
        var $methods = {
            ajaxs: {
                run: function (url, params, onSuccess, onError) {
                    var ajaxOpts = {
                        type: 'POST',
                        url: url,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        success: function (response) {
                            if (response.d != undefined)
                                response = response.d;

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
                runWithLoading: function (url, params, onSuccess, onError) {
                    var ajaxOpts = {
                        type: 'POST',
                        url: url,
                        contentType: 'application/json; charset=utf-8',
                        dataType: 'json',
                        beforeSend: function () {
                            $methods.modals.loading.show();
                        },
                        success: function (response) {
                            if (response.d != undefined)
                                response = response.d;

                            if (typeof onSuccess == 'function')
                                onSuccess(response);

                            $methods.modals.loading.hide();
                        },
                        error: function (e) {
                            console.log(e.statusCode + ': ' + e.statusText);

                            if (typeof onError == 'function')
                                onError(e);

                            $methods.modals.loading.hide();
                        }
                    };
                    if (!$.isEmptyObject(params))
                        ajaxOpts.data = JSON.stringify(params);
                    $.ajax(ajaxOpts);
                }
            },
            changeToPercent: function (selector, maxWidth, subLastWidth) {
                var _totalPercent = 0;
                $(selector).each(function () {
                    if ($(selector).length - 1 == $(this).index())
                        return false;

                    var _width = $(this).innerWidth();
                    var _percent = $.ext.number.parseFixed(_width / maxWidth * 100, 1, 0);

                    $(this).attr('data-width', 'calc(' + _percent + '% - 1px)');
                    $(this).importantStyle('width', 'calc(' + _percent + '% - 1px)');

                    _totalPercent += _percent;
                });

                var _lastPercent = $.ext.number.parseFixed(100 - _totalPercent, 1, 0);
                if ($.ext.number.parseInt(subLastWidth, 0) > 0) {
                    $(selector).last().attr('data-width', 'calc(' + _lastPercent + '% - ' + subLastWidth + 'px)');
                    $(selector).last().importantStyle('width', 'calc(' + _lastPercent + '% - ' + subLastWidth + 'px)');
                }
                else {
                    $(selector).last().attr('data-width', _lastPercent + '%');
                    $(selector).last().importantStyle('width', _lastPercent + '%');
                }
            },
            datas: {
                fromRow: function (row) {
                    if ($(row).length > 0) {
                        var rowKey = $(row).attr('data-row-key');
                        return $methods.datas.fromRowKey(rowKey);
                    }
                    return {};
                },
                fromRowKey: function (rowKey) {
                    var $hiddenData = $($targets.table_hidden_data + ' [data-row-key="' + rowKey + '"]');
                    if ($hiddenData.length > 0) {
                        var dataStr = $hiddenData.val();
                        if (!$.ext.string.isNullOrEmpty(dataStr))
                            return JSON.parse(dataStr);
                    }
                    return {};
                },
                updateForRow: function (row, newData) {
                    if ($(row).length > 0) {
                        var rowKey = $(row).attr('data-row-key');
                        $methods.datas.updateForRowKey(rowKey);
                    }
                },
                updateForRowKey: function (rowKey, newData) {
                    var $hiddenData = $($targets.table_hidden_data + ' [data-row-key="' + rowKey + '"]');
                    if ($hiddenData.length > 0)
                        $hiddenData.val(JSON.stringify(newData));
                }
            },
            deleteRow: function (row) {
                if ($(row).length > 0) {
                    var rowKey = $(row).attr('data-row-key');
                    if ($.ext.string.isNullOrEmpty($options.ajaxDelete.url)) {
                        $('[data-row-key="' + rowKey + '"]').remove();
                        return;
                    }

                    var data = $methods.datas.fromRowKey(rowKey);
                    $methods.ajaxs.run($options.ajaxDelete.url, $options.ajaxDelete.createParam(data), function (response) {
                        if (!$.ext.string.isNullOrEmpty(response.Message)) {
                            $options.ajaxDelete.onError();
                            alert(response.Message);
                            return;
                        }
                        $options.ajaxDelete.onSuccess(response.Data);
                        $methods.loads.runWithLoading();
                    });
                }
            },
            generates: {
                head: function () {
                    var rowKey = 'row-ext-' + $.ext.guid.newGuid();

                    $($targets.table_head_data).append('<div class="head-row row-data" data-row-key="' + rowKey + '"></div>');

                    $.each($options.columns, function (ci, column) {
                        var $col = $('<div class="head-col"></div>');
                        $col.attr('data-index', ci);
                        $col.css({ width: $locals.percents[ci] + '%' });

                        if ($.inArray(ci, $locals.fixedColumns.lefts) != -1)
                            $col.addClass('col-left');
                        else if ($.inArray(ci, $locals.fixedColumns.rights) != -1)
                            $col.addClass('col-right');
                        else
                            $col.addClass('col-data');

                        if (!$.isEmptyObject(column)) {
                            var $col_options = $.extend(false, $.ext.table.columnDefaults, column);
                            $col.addClass($col_options.className);
                            $col.addClass($col_options.headClassName);
                            $col.html('<div class="head-col-content">' + ($.ext.string.isNullOrEmpty($col_options.headText) ? $col_options.dataField : $col_options.headText) + '</div>');

                            if ($.inArray(ci, $options.sorting.columns) != -1) {
                                if ($.ext.string.isNullOrEmpty($options.sorting.fields[ci]))
                                    $col.attr('data-sort-name', $col_options.dataField);
                                else
                                    $col.attr('data-sort-name', $options.sorting.fields[ci]);
                            }

                            if (!$.ext.string.isNullOrEmpty($options.sorting.defaults[ci]))
                                $col.attr('data-sort-type', $options.sorting.defaults[ci]);
                        }

                        $col.attr('data-class', $col.prop('class'));

                        $($targets.table_head_data + ' [data-row-key="' + rowKey + '"]').append($col);
                    });

                    $('.row-data[data-row-key="' + rowKey + '"]').css({ width: $('.row-data[data-row-key="' + rowKey + '"] .col-data').totalWidth() + 'px' });

                    if ($.ext.number.parseInt($($targets.table).innerWidth(), 0) > $($targets.table_head_data + ' [data-row-key="' + rowKey + '"]').outerWidth()) {
                        var fixedWidth = $($targets.table_head_data + ' [data-row-key="' + rowKey + '"]').outerWidth();
                        $($targets.table).attr('data-width', fixedWidth).css({ width: fixedWidth + 'px' });
                    }

                    if ($('[data-row-key="' + rowKey + '"] .head-col.col-left').length > 0) {
                        $($targets.table_head_left).append('<div class="head-row row-left" data-row-key="' + rowKey + '"></div>');

                        var leftWidth = $.ext.number.parseInt($('.row-data[data-row-key="' + rowKey + '"] .col-left').totalWidth(), 0);
                        $($targets.table_head_left).attr('data-width', leftWidth + 'px').css({ width: leftWidth + 'px' });
                        $($targets.table_body_left).attr('data-width', leftWidth + 'px').css({ width: leftWidth + 'px' });

                        $('.row-left[data-row-key="' + rowKey + '"]').append($('.row-data[data-row-key="' + rowKey + '"] .col-left'));
                        $methods.changeToPercent('.row-left[data-row-key="' + rowKey + '"] .col-left', $($targets.table_head_left).innerWidth(), 1);

                        $locals.fixedWidth += $($targets.table_head_left).outerWidth();
                    }

                    if ($('[data-row-key="' + rowKey + '"] .head-col.col-right').length > 0) {
                        $($targets.table_head_right).append('<div class="head-row row-right" data-row-key="' + rowKey + '"></div>');

                        var rightWidth = $.ext.number.parseInt($('.row-data[data-row-key="' + rowKey + '"] .col-right').totalWidth(), 0);
                        $($targets.table_head_right).attr('data-width', rightWidth + 'px').css({ width: rightWidth + 'px' });
                        $($targets.table_body_right).attr('data-width', rightWidth + 'px').css({ width: rightWidth + 'px' });

                        $('.row-right[data-row-key="' + rowKey + '"]').append($('.row-data[data-row-key="' + rowKey + '"] .col-right'));
                        $methods.changeToPercent('.row-right[data-row-key="' + rowKey + '"] .col-right', $($targets.table_head_right).innerWidth());

                        $locals.fixedWidth += $($targets.table_head_right).outerWidth();
                    }

                    var dataWidth = 'calc(100% - ' + $locals.fixedWidth + 'px)';
                    $($targets.table_head_data).attr('data-width', dataWidth).css({ width: dataWidth });
                    $($targets.table_body_data).attr('data-width', dataWidth).css({ width: dataWidth });

                    $('.row-data[data-row-key="' + rowKey + '"]').css({ width: $('.row-data[data-row-key="' + rowKey + '"] .col-data').totalWidth() + 'px' });
                    $methods.changeToPercent('.row-data[data-row-key="' + rowKey + '"] .col-data', $($targets.table_head_data + ' [data-row-key="' + rowKey + '"]').innerWidth());

                    $('.head-row[data-row-key="' + rowKey + '"] .head-col').css({ height: $.ext.number.parseInt($('[data-row-key="' + rowKey + '"]').height(), 0) + 'px' });

                    $($targets.table + ' .head-col[data-sort-name]').click(function () {
                        $($targets.table + ' .head-col[data-sort-name]').not(this).removeAttr('data-sort-type');

                        var sortType = $(this).attr('data-sort-type');
                        $(this).attr('data-sort-type', sortType == 'asc' ? 'desc' : 'asc');

                        $methods.loads.runWithLoading();
                    });
                },
                body: function (datas) {
                    $($targets.table + ' .content-body .body-row').remove();
                    $($targets.table_key).html('');

                    if (datas.length <= 0) {
                        $($targets.table).addClass('no-body');
                        return;
                    }

                    $($targets.table).removeClass('no-body');

                    $.each(datas, function (di, data) {
                        var rowKey = 'row-ext-' + $.ext.guid.newGuid();

                        var $hiddenData = $('<input type="hidden" data-row-key="' + rowKey + '" />').appendTo($($targets.table_hidden_data));
                        $hiddenData.val(JSON.stringify(data));

                        $($targets.table_body_data).append('<div class="body-row row-data" data-row-key="' + rowKey + '"></div>');

                        $.each($options.columns, function (ci, column) {
                            var $col = $('<div class="body-col"></div>');
                            $col.attr('data-index', ci);

                            if ($.inArray(ci, $locals.fixedColumns.lefts) != -1)
                                $col.addClass('col-left');
                            else if ($.inArray(ci, $locals.fixedColumns.rights) != -1)
                                $col.addClass('col-right');
                            else
                                $col.addClass('col-data');

                            if (!$.isEmptyObject(column)) {
                                var $col_options = $.extend(false, $.ext.table.columnDefaults, column);
                                $col.addClass($col_options.className);
                                $col.addClass($col_options.dataClassName);
                                if (typeof $col_options.dataHtml == 'function')
                                    $col.html('<div class="body-col-content">' + $col_options.dataHtml(data) + '</div>');
                                else
                                    $col.html('<div class="body-col-content">' + $.ext.string.parse(data[$col_options.dataField]) + '</div>');
                            }

                            $col.attr('data-class', $col.prop('class'));
                            $col.importantStyle('width', $($targets.table).find('.head-col[data-index="' + ci + '"]').attr('data-width'));

                            $($targets.table_body_data + ' [data-row-key="' + rowKey + '"]').append($col);
                        });

                        if ($('[data-row-key="' + rowKey + '"] .body-col.col-left').length > 0) {
                            $($targets.table_body_left).append('<div class="body-row row-left" data-row-key="' + rowKey + '"></div>');
                            $('.row-left[data-row-key="' + rowKey + '"]').append($('.row-data[data-row-key="' + rowKey + '"] .col-left'));
                        }

                        if ($('[data-row-key="' + rowKey + '"] .body-col.col-right').length > 0) {
                            $($targets.table_body_right).append('<div class="body-row row-right" data-row-key="' + rowKey + '"></div>');
                            $('.row-right[data-row-key="' + rowKey + '"]').append($('.row-data[data-row-key="' + rowKey + '"] .col-right'));
                        }

                        $('.row-data[data-row-key="' + rowKey + '"]').css({ width: $($targets.table).find('.head-row.row-data').first().outerWidth() + 'px' });

                        var rowHeight = $.ext.number.parseInt($('.row-data[data-row-key="' + rowKey + '"]').innerHeight(), 0);
                        $('.body-row[data-row-key="' + rowKey + '"] .body-col').css({ height: rowHeight + 'px' });
                        $('.body-row[data-row-key="' + rowKey + '"] .body-col .body-col-content').addClass('vertical');
                    });

                    if ($options.rows.edit.inline) {
                        if ($locals.templates.columns.length > 0) {
                            $locals.templates.rowKey = $($targets.table_body_data + ' .row-data').first().attr('data-row-key');
                            $locals.templates.colIndex = $locals.templates.columns[0];
                            $methods.generates.template();

                            $($targets.table + ' .content-body .body-row .body-col').click(function () {
                                var nextCol = $.ext.number.parseInt($(this).closest('.body-col').attr('data-index'), 0);
                                if ($.inArray(nextCol, $locals.templates.columns) == -1)
                                    return false;

                                var nextRowKey = $(this).closest('.body-row').attr('data-row-key');
                                if ($locals.templates.rowKey == nextRowKey && $locals.templates.colIndex == nextCol)
                                    return false;

                                $methods.updateRow(nextRowKey, nextCol);

                                return false;
                            });
                        }
                    }

                    $($targets.table + ' .content-body .body-row').click(function () {
                        var rowKey = $(this).attr('data-row-key');
                        var data = $methods.datas.fromRowKey(rowKey);
                        if ($options.rows.edit.modal)
                            return false;
                        var clickReturn = $options.rows.click(data);
                        return $.ext.boolean.parse(clickReturn, true);
                    });

                    if ($options.rows.hover.use) {
                        $($targets.table + ' .content-body .body-row').hover(function () {
                            var rowKey = $(this).attr('data-row-key');
                            var data = $methods.datas.fromRowKey(rowKey);
                            var overReturn = $options.rows.hover.over(data);
                            if (!$.ext.boolean.parse(overReturn, true))
                                return false;
                            $('.body-row[data-row-key="' + rowKey + '"]').addClass('hover');
                            return true;
                        }, function () {
                            var rowKey = $(this).attr('data-row-key');
                            var data = $methods.datas.fromRowKey(rowKey);
                            var outReturn = $options.rows.hover.out(data);
                            if (!$.ext.boolean.parse(outReturn, true))
                                return false;
                            $('.body-row[data-row-key="' + rowKey + '"]').removeClass('hover');
                            return true;
                        });
                    }
                },
                foot: function () {
                    if (!$options.info.show && $options.paging.sizes.start <= 0) {
                        $($targets.table).addClass('no-foot');
                        return;
                    }

                    $($targets.table_foot).show();

                    if ($options.info.show)
                        $($targets.table_foot).append('<div class="info">' + $.ext.string.format($options.info.format, 0, 0, 0) + '</div>');

                    if ($options.paging.sizes.start > 0) {
                        $($targets.table_foot).append(function () {
                            return '\
                            <div class="paging">\
                                <div class="size-label">' + $options.paging.sizes.label + '</div>\
                                <div class="size-click">\
                                    <span class="text">' + $options.paging.sizes.start + '</span>\
                                    <span class="icon"></span>\
                                </div>\
                                <div class="index-group">\
                                    <span class="icon first"></span>\
                                    <span class="icon prev"></span>\
                                    <input type="text" class="goto" value="' + ($options.paging.index + 1) + '" data-type="number" data-tooltip="false" />\
                                    <span class="icon next"></span>\
                                    <span class="icon last"></span>\
                                </div>\
                            </div>\
                        ';
                        }());

                        $($targets.table_foot_paging + ' .size-click').click(function () {
                            $(this).toggleClass('active');

                            if ($(this).hasClass('active')) {
                                var clientRect = $(this)[0].getBoundingClientRect();
                                $($targets.paging_size).css({
                                    width: clientRect.width + 'px',
                                    left: clientRect.left + 'px'
                                });
                                if (clientRect.bottom + $($targets.paging_size).outerHeight() > $(window).innerHeight())
                                    $($targets.paging_size).css({ top: ($(this).offset().top - $($targets.paging_size).outerHeight() + 1) + 'px' });
                                else
                                    $($targets.paging_size).css({ top: ($(this).offset().top + clientRect.height - 1) + 'px' });
                                $($targets.paging_size).show();
                            }
                            else
                                $($targets.paging_size).hide();

                            return false;
                        });
                        $($targets.table_foot_paging + ' .index-group .icon').click(function () {
                            var pageIndex = $.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0);
                            var totalIndex = $.ext.number.parseInt($($targets.paging_attr).attr('total-index'), 0);

                            if ($(this).hasClass('first')) {
                                if (pageIndex == 0)
                                    return;
                                pageIndex = 0;
                            }

                            if ($(this).hasClass('prev')) {
                                if (pageIndex == 0)
                                    return;
                                pageIndex--;
                            }

                            if ($(this).hasClass('next')) {
                                if (pageIndex == totalIndex - 1)
                                    return;
                                pageIndex++;
                            }

                            if ($(this).hasClass('last')) {
                                if (pageIndex == totalIndex - 1)
                                    return;
                                pageIndex = totalIndex - 1;
                            }

                            $($targets.paging_attr).attr('data-index', pageIndex);

                            $methods.loads.runWithLoading();
                        });
                        $($targets.table_foot_paging + ' .index-group .goto').keydown(function (evt) {
                            if (evt.keyCode == 13) {
                                var pageIndex = $.ext.number.parseInt($(this).val(), 0);
                                if (pageIndex < 1) {
                                    $(this).val($.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0) + 1);
                                    $(this).select();
                                    return false;
                                }

                                var totalIndex = $.ext.number.parseInt($($targets.paging_attr).attr('total-index'), 0);
                                if (pageIndex > totalIndex) {
                                    $(this).val($.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0) + 1);
                                    $(this).select();
                                    return false;
                                }

                                $($targets.paging_attr).attr('data-index', pageIndex - 1);

                                $methods.loads.runWithLoading();

                                return false;
                            }
                        });

                        if ($($targets.paging_attr).length <= 0) {
                            var $pagingAttr = $('<div data-name="' + $locals.name + '-paging-attr"></div>').appendTo(document.body);
                            $pagingAttr.attr('data-index', $options.paging.index);
                            $pagingAttr.attr('data-size', $options.paging.sizes.start);
                        }

                        if ($($targets.paging_size).length <= 0) {
                            var $pagingSize = $('<div data-name="' + $locals.name + '-paging-size"></div>').appendTo(document.body);
                            for (var i = 1; i <= $options.paging.sizes.times; i++) {
                                $pagingSize.append('<span>' + ($options.paging.sizes.start * i) + '</span>');
                            }
                            $pagingSize.find('span:eq(0)').addClass('active');
                            $pagingSize.find('span').click(function () {
                                $($targets.table_foot_paging + ' .size-click').click();

                                if ($(this).hasClass('active'))
                                    return false;

                                $($targets.paging_attr).attr('data-index', 0);
                                $($targets.paging_attr).attr('data-size', $(this).html());
                                $($targets.paging_size).find('span').removeClass('active');
                                $($targets.table_foot_paging + ' .size-click .text').html($(this).html());
                                $(this).addClass('active');

                                $methods.loads.runWithLoading();

                                return false;
                            });

                            $(document.body).append(function () {
                                return '\
                                <style>\
                                    ' + $targets.paging_attr + ',\
                                    ' + $targets.paging_size + '\
                                    {\
                                        display: none;\
                                    }\
                                    ' + $targets.paging_size + '\
                                    {\
                                        position: absolute;\
                                        background-color: #fff;\
                                        border: 1px solid #d2d6de;\
                                        z-index: 1030;\
                                    }\
                                    ' + $targets.paging_size + ' span\
                                    {\
                                        float: left;\
                                        cursor: pointer;\
                                        height: 27px;\
                                        line-height: 27px;\
                                        padding: 0 5px;\
                                        width: 100%;\
                                    }\
                                    ' + $targets.paging_size + ' span:hover,' + $targets.paging_size + ' span.active\
                                    {\
                                        background-color: #f1f1f1;\
                                    }\
                                </style>\
                            ';
                            }());
                        }
                    }
                },
                scroll: function () {
                    var scrollbarWidth = $.scrollbarWidth();
                    var height = $options.fixeds.height;
                    if ($options.fixeds.head) {
                        if (height <= 0) {
                            var maxHeight = 0;
                            if ($($targets.table).parent().scrollHeight() > $($targets.table).parent().innerHeight())
                                maxHeight = $.ext.number.parseInt($($targets.table).parent().height(), 0);
                            else
                                maxHeight = $.ext.number.parseInt($('.wrapper-content > .content-body').innerHeight() - $($targets.table).offset().top, 0);

                            maxHeight -= $($targets.table_head_data).outerHeight() + $($targets.table_foot).outerHeight() + 2;

                            if ($options.paging.sizes.start > 0) {
                                height = $($targets.table_body_data).outerHeight();
                                if (height > maxHeight)
                                    height = maxHeight;
                            }
                            else
                                height = maxHeight;
                        }
                    }

                    $($targets.table).css({ height: '' });
                    if (height > 0) {
                        if ($($targets.table).innerHeight() > height) {
                            $('<div class="scroll-right"></div>').insertBefore($($targets.table_modal))

                            $($targets.table_scroll_right).append('<div class="head-scroll"></div><div class="content-scroll use-scroll-right"><div class="scroll-row"></div></div>');
                            $($targets.table_scroll_right + ' .head-scroll').css({
                                width: scrollbarWidth + 'px',
                                height: ($($targets.table_head_data).outerHeight() - 2) + 'px'
                            });
                            $($targets.table_scroll_right + ' .content-scroll').css({
                                width: scrollbarWidth + 'px',
                                height: height + 'px'
                            });
                            $($targets.table_scroll_right + ' .content-scroll .scroll-row').css({ height: $($targets.table_body_data).outerHeight() + 'px' });

                            if (!$($targets.table).hasClass('no-foot'))
                                $($targets.table_scroll_right).css({ height: 'calc(100% - ' + $($targets.table_foot).outerHeight() + 'px)' });

                            $($targets.table_head_left).css({
                                width: ($($targets.table_head_left).outerWidth() + scrollbarWidth) + 'px',
                                'margin-right': (scrollbarWidth * -1) + 'px',
                                'overflow-y': 'scroll'
                            });
                            $($targets.table_body_left).addClass('use-scroll-right');
                            $($targets.table_body_left).css({
                                width: $($targets.table_head_left).outerWidth() + 'px',
                                height: height + 'px',
                                'margin-right': (scrollbarWidth * -1) + 'px',
                                'overflow-y': 'scroll'
                            });

                            $($targets.table_head_data).css({ 'overflow-y': 'scroll' });
                            $($targets.table_body_data).addClass('use-scroll-right');
                            $($targets.table_body_data).css({
                                height: height + 'px',
                                'overflow-y': 'scroll'
                            });

                            $($targets.table_head_right).css({
                                'margin-left': (scrollbarWidth * -1) + 'px',
                                'overflow-y': 'scroll',
                                width: ($($targets.table_head_right).outerWidth() + scrollbarWidth - 1) + 'px'
                            });
                            $($targets.table_body_right).addClass('use-scroll-right');
                            $($targets.table_body_right).css({
                                width: ($($targets.table_head_right).outerWidth() - 1) + 'px',
                                height: height + 'px',
                                'margin-left': (scrollbarWidth * -1) + 'px',
                                'overflow-y': 'scroll'
                            });
                        }
                    }

                    var contentWidth = $($targets.table_head_data + ' .head-row.row-data').first().outerWidth();
                    if ($('.wrapper-content > .content-body').scrollHeight() > $('.wrapper-content > .content-body').innerHeight()) {
                        contentWidth -= scrollbarWidth;
                        if ($($targets.table).parent().scrollHeight() > $($targets.table).parent().innerHeight())
                            contentWidth -= scrollbarWidth;

                        $($targets.table_head_data + ' .head-row.row-data').width(contentWidth);
                        $($targets.table_body_data + ' .body-row.row-data').width(contentWidth);
                    }
                    else {
                        if ($($targets.table).parent().scrollHeight() > $($targets.table).parent().innerHeight()) {
                            contentWidth -= scrollbarWidth;

                            $($targets.table_head_data + ' .head-row.row-data').width(contentWidth);
                            $($targets.table_body_data + ' .body-row.row-data').width(contentWidth);
                        }
                    }

                    //document.body.getBoundingClientRect();

                    if ($($targets.table_head_data).outerWidth() < contentWidth) {
                        $('<div class="scroll-bottom"></div>').insertBefore($($targets.table_modal))

                        $($targets.table_scroll_bottom).append('<div class="left-scroll"></div><div class="content-scroll use-scroll-bottom"><div class="scroll-row"></div></div><div class="right-scroll"></div>');
                        $($targets.table_scroll_bottom + ' .content-scroll').css({
                            width: 'calc(100% - ' + $locals.fixedWidth + 'px)',
                            height: scrollbarWidth + 'px'
                        });
                        $($targets.table_scroll_bottom + ' .content-scroll .scroll-row').css({ width: contentWidth + 'px' });
                        $($targets.table_scroll_bottom + ' .left-scroll').css({
                            width: ($($targets.table_head_left).outerWidth() - 1) + 'px',
                            height: scrollbarWidth + 'px'
                        });
                        $($targets.table_scroll_bottom + ' .right-scroll').css({
                            width: ($($targets.table_head_right).outerWidth() - 1),
                            height: scrollbarWidth + 'px'
                        });

                        if ($locals.fixedColumns.lefts.length <= 0)
                            $($targets.table_scroll_bottom + ' .left-scroll').remove();
                        if ($locals.fixedColumns.rights.length <= 0)
                            $($targets.table_scroll_bottom + ' .right-scroll').hide();

                        $($targets.table_head_data).addClass('use-scroll-bottom');
                        $($targets.table_body_data).addClass('use-scroll-bottom');

                        $($targets.table_body_left).css({ 'overflow-x': 'scroll' });
                        $($targets.table_body_data).css({ 'overflow-x': 'scroll' });
                        $($targets.table_body_right).css({ 'overflow-x': 'scroll' });
                    }

                    if ($($targets.table_scroll_right).length > 0) {
                        $($targets.table_scroll_bottom + ' .content-scroll').css({ width: 'calc(100% - ' + ($locals.fixedWidth + scrollbarWidth) + 'px)' });
                        $($targets.table_scroll_bottom + ' .left-scroll').css({ width: ($($targets.table_head_left).outerWidth() - scrollbarWidth - 1) + 'px' });
                    }

                    if ($($targets.table_scroll_bottom).length > 0)
                        $($targets.table_scroll_right + ' .content-scroll').css({ height: ($($targets.table_scroll_right + ' .content-scroll').outerHeight() - scrollbarWidth) + 'px' });

                    $($targets.table + ' .use-scroll-bottom').scroll(function () {
                        $locals.scrolls.left = $(this).scrollLeft();
                        $($targets.table + ' .use-scroll-bottom').scrollLeft($locals.scrolls.left);
                    });
                    $($targets.table + ' .use-scroll-right').scroll(function () {
                        $locals.scrolls.top = $(this).scrollTop();
                        $($targets.table + ' .use-scroll-right').scrollTop($locals.scrolls.top);
                    });
                    $($targets.table + ' .use-scroll-right').on('wheel', function (evt) {
                        var addScroll = 0;
                        if (evt.originalEvent.deltaY > 0)
                            addScroll = evt.originalEvent.deltaY + 10;
                        else
                            addScroll = evt.originalEvent.deltaY - 10;
                        $locals.scrolls.top = $(this).scrollTop() + addScroll;
                        $(this).scrollTop($locals.scrolls.top);
                    });
                },
                template: function () {
                    if ($locals.templates.columns.length <= 0)
                        return;

                    if ($.inArray($locals.templates.colIndex, $locals.templates.columns) == -1) {
                        var newCol = -1;
                        $.each($locals.templates.columns, function (ti, tv) {
                            if (tv > $locals.templates.colIndex) {
                                newCol = tv;
                                return false;
                            }
                        });
                        $locals.templates.colIndex = newCol == -1 ? $locals.templates.columns[0] : newCol;
                    }

                    if ($.isEmptyObject($options.columns[$locals.templates.colIndex]))
                        return;

                    var $col_options = $.extend(false, $.ext.table.columnDefaults, $options.columns[$locals.templates.colIndex]);
                    var $temp_options = $.extend(false, $.ext.table.templateDefaults, $options.rows.edit.templates[$locals.templates.colIndex]);
                    if (!$temp_options.useForUpdate || typeof $temp_options.design != 'function')
                        return;

                    var $col = $('[data-row-key="' + $locals.templates.rowKey + '"] .body-col[data-index="' + $locals.templates.colIndex + '"]');
                    $col.attr('data-height', $col.innerHeight());
                    $col.find('.body-col-content').hide();

                    var field = $.ext.string.isNullOrEmpty($temp_options.dataField) ? $col_options.dataField : $temp_options.dataField;
                    var data = $methods.datas.fromRowKey($locals.templates.rowKey);
                    var $colTemplate = $($temp_options.design()).appendTo($col);
                    $colTemplate.addClass('body-col-template');
                    $colTemplate.attr('data-field', field);
                    $colTemplate.prop('spellcheck', false);
                    $colTemplate.val(data[field]);
                    $colTemplate.select();
                    $colTemplate.keydown(function (evt) {
                        if (evt.keyCode == 27) {
                            $(this).val(data[field]);
                            $(this).select();
                            return true;
                        }

                        var $row = $(this).closest('.body-row');
                        var nextRowKey = '', nextCol = $locals.templates.colIndex;

                        if (evt.keyCode == 13) {
                            if ($(this).prop('type') == 'textarea' && $(this).prop('selectionEnd') - $(this).prop('selectionStart') != $(this).val().length)
                                return true;
                            if ($row.next().length > 0)
                                nextRowKey = $row.next().attr('data-row-key');
                            $methods.updateRow(nextRowKey, nextCol);
                            return false;
                        }

                        if (evt.keyCode == 9) {
                            if ($locals.templates.colIndex + 1 > $locals.templates.columns[$locals.templates.columns.length - 1]) {
                                if ($row.next().length > 0) {
                                    nextRowKey = $row.next().attr('data-row-key');
                                    nextCol = $locals.templates.columns[0];
                                }
                            }
                            else {
                                nextRowKey = $row.attr('data-row-key');
                                nextCol++;
                            }
                            $methods.updateRow(nextRowKey, nextCol);
                            return false;
                        }
                    });
                    $colTemplate.on('keyup input', function () {
                        if ($(this).prop('type') != 'textarea')
                            return;

                        $(this).css({ height: 'auto', padding: '0' });
                        if ($(this).scrollHeight() > $(this).height()) {
                            $(this).css({ height: $(this).scrollHeight() + 'px', padding: '' });
                            $(this).closest('.body-col').css({ height: $(this).outerHeight() });
                        }
                        else {
                            $(this).css({ padding: '' });
                            var beforeHeight = $.ext.number.parseInt($col.attr('data-height'), 0);
                            if ($(this).outerHeight() <= beforeHeight)
                                $(this).closest('.body-col').css({ height: beforeHeight + 'px' });
                            $(this).css({ height: '' });
                        }

                        var rowKey = $(this).closest('.body-row').attr('data-row-key');
                        $('.body-row[data-row-key="' + rowKey + '"] .body-col').css({ height: $.ext.number.parseInt($(this).closest('.body-col').innerHeight(), 0) + 'px' });

                        $($targets.table_scroll_right + ' .content-scroll .scroll-row').css({ height: $($targets.table_body_data).scrollHeight() + 'px' });
                    });
                }
            },
            loads: {
                run: function () {
                    if ($.ext.string.isNullOrEmpty($options.ajaxRead.url)) {
                        var datas = $options.createData();
                        if (!$.isArray(datas)) {
                            if (typeof datas == 'object')
                                datas = [datas];
                            else
                                datas = [];
                        }
                        $methods.reset();
                        $methods.generates.body(datas);
                        $methods.generates.scroll();
                        $methods.updateFoot(datas.length);
                        return;
                    }

                    var readModel = { Filters: [], Sorters: [], Pager: {} };
                    var params = $.extend(false, { readModel: readModel }, $options.ajaxRead.createParam());

                    params.readModel.Sorters = function () {
                        var sorters = [];
                        $($targets.table + ' .head-col[data-sort-type]').each(function () {
                            sortType = $(this).attr('data-sort-type');
                            if (!$.ext.string.isNullOrEmpty(sortType)) {
                                sortName = $(this).attr('data-sort-name');
                                sorters.push({ Name: sortName, Type: sortType });
                            }
                        });
                        return sorters;
                    }();

                    if ($options.paging.sizes.start > 0) {
                        params.readModel.Pager = function () {
                            return {
                                index: $.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0),
                                size: $.ext.number.parseInt($($targets.paging_attr).attr('data-size'), 0)
                            }
                        }();

                        $methods.ajaxs.run($options.ajaxRead.url, params, function (response) {
                            if ($.isEmptyObject(response.Data))
                                response.Data = { Datas: [], TotalRow: 0 };
                            $methods.reset();
                            $methods.generates.body(response.Data.Datas);
                            $methods.generates.scroll();
                            $methods.updateFoot(response.Data.TotalRow);
                        });
                    }
                    else {
                        $methods.ajaxs.run($options.ajaxRead.url, params, function (response) {
                            if (!$.isArray(response.Data))
                                response.Data = [];
                            $methods.reset();
                            $methods.generates.body(response.Data);
                            $methods.generates.scroll();
                            $methods.updateFoot(0);
                        });
                    }
                },
                runWithLoading: function () {
                    if ($.ext.string.isNullOrEmpty($options.ajaxRead.url)) {
                        $methods.modals.loading.show();
                        setTimeout(function () {
                            var datas = $options.createData();
                            if (!$.isArray(datas)) {
                                if (typeof datas == 'object')
                                    datas = [datas];
                                else
                                    datas = [];
                            }
                            $methods.reset();
                            $methods.generates.body(datas);
                            $methods.generates.scroll();
                            $methods.updateFoot(datas.length);
                            $methods.modals.loading.hide();
                        }, 0);
                        return;
                    }

                    var readModel = { Filters: [], Sorters: [], Pager: {} };
                    var params = $.extend(true, { readModel: readModel }, $options.ajaxRead.createParam());

                    params.readModel.Sorters = function () {
                        var sorters = [];
                        $($targets.table + ' .head-col[data-sort-type]').each(function () {
                            sortType = $(this).attr('data-sort-type');
                            if (!$.ext.string.isNullOrEmpty(sortType)) {
                                sortName = $(this).attr('data-sort-name');
                                sorters.push({ Name: sortName, Type: sortType });
                            }
                        });
                        return sorters;
                    }();

                    if ($options.paging.sizes.start > 0) {
                        params.readModel.Pager = function () {
                            return {
                                index: $.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0),
                                size: $.ext.number.parseInt($($targets.paging_attr).attr('data-size'), 0)
                            }
                        }();

                        $methods.ajaxs.runWithLoading($options.ajaxRead.url, params, function (response) {
                            if ($.isEmptyObject(response.Data))
                                response.Data = { Datas: [], TotalRow: 0 };
                            $methods.reset();
                            $methods.generates.body(response.Data.Datas);
                            $methods.generates.scroll();
                            $methods.updateFoot(response.Data.TotalRow);
                        });
                    }
                    else {
                        $methods.ajaxs.runWithLoading($options.ajaxRead.url, params, function (response) {
                            if (!$.isArray(response.Data))
                                response.Data = [];
                            $methods.reset();
                            $methods.generates.body(response.Data);
                            $methods.generates.scroll();
                            $methods.updateFoot(0);
                        });
                    }
                }
            },
            modals: {
                loading: {
                    hide: function () {
                        $($targets.table).css({ 'min-height': '' });
                        $($targets.table_modal).hide();
                        $($targets.table_modal).css({ height: $($targets.table).innerHeight() + 'px' });
                        $($targets.table_modal_loading).hide();
                    },
                    show: function () {
                        $($targets.table).css({ 'min-height': '100px' });
                        $($targets.table_modal_loading).show();
                        $($targets.table_modal).show();
                    }
                }
            },
            reset: function () {
                $($targets.table + ' .content-head').each(function () {
                    var dataWidth = $(this).attr('data-width');
                    $(this).removeProp('style');
                    $(this).css({ width: dataWidth });
                });
                $($targets.table + ' .content-body').each(function () {
                    var dataWidth = $(this).attr('data-width');
                    $(this).removeProp('style');
                    $(this).css({ width: dataWidth });
                });
                $($targets.table_scroll_bottom).remove();
                $($targets.table_scroll_right).remove();
            },
            resize: function () {
                if (!$($targets.table).is(':visible')) {
                    $($targets.table).addClass('resize-waiting');
                    return;
                }

                clearInterval($locals.resizeInterval);
                $locals.resizeInterval = setInterval(function () {
                    clearInterval($locals.resizeInterval);

                    $methods.startUp();
                    $methods.generates.head();
                    $methods.generates.foot();
                    $methods.loads.runWithLoading();
                }, 100);
            },
            startUp: function () {
                if ($options.columns.length <= 0) {
                    console.log('Not found columns on design');
                    return;
                }

                if ($(target).length > 0) {
                    $(target).addClass('ext-table');
                    $(target).attr('data-name', $locals.name);
                }
                else
                    $(document.body).append('<div class="ext-table" data-name="' + $locals.name + '"></div>');

                if ($options.fixeds.columns.leftInMin > 0 && window.innerWidth <= $options.fixeds.columns.leftInMin)
                    $locals.fixedColumns.lefts = [];
                else {
                    $locals.fixedColumns.lefts = [];
                    $.each($options.fixeds.columns.lefts, function (li, lv) {
                        if (lv >= 0 && lv <= $options.columns.length - 1)
                            $locals.fixedColumns.lefts.push(lv);
                    });
                }

                if ($options.fixeds.columns.rightInMin > 0 && window.innerWidth <= $options.fixeds.columns.rightInMin)
                    $locals.fixedColumns.rights = [];
                else {
                    $locals.fixedColumns.rights = [];
                    $.each($options.fixeds.columns.rights, function (ri, rv) {
                        if (rv >= 0 && rv <= $options.columns.length - 1)
                            $locals.fixedColumns.rights.push(rv);
                    });
                }

                $.each($options.groups, function (gi, group) {
                    if ($.isEmptyObject(group))
                        return false;

                    var $grp_options = $.extend(false, $.ext.table.groupDefaults, group);
                    if ($grp_options.from < 0 || $grp_options.from > $options.columns.length - 1 || $grp_options.to < 0 || $grp_options.to > $options.columns.length - 1)
                        return false;

                    if ($grp_options.to > $grp_options.from) {
                        if ($.ext.string.isNullOrEmpty($grp_options.text))
                            $grp_options.text = 'Group from ' + $grp_options.from + ' to ' + $grp_options.to;
                        $locals.groups.push($grp_options);
                    }
                });

                $($targets.table).html('');
                $($targets.table).append('<div class="content-head head-data"></div>');
                $($targets.table).append('<div class="content-body body-data"></div>');
                if ($locals.fixedColumns.lefts.length > 0) {
                    $('<div class="content-head head-left"></div>').insertBefore($($targets.table_head_data));
                    $('<div class="content-body body-left"></div>').insertBefore($($targets.table_body_data));
                }
                if ($locals.fixedColumns.rights.length > 0) {
                    $('<div class="content-head head-right"></div>').insertAfter($($targets.table_head_data));
                    $('<div class="content-body body-right"></div>').insertAfter($($targets.table_body_data));
                }
                $($targets.table).append('<div class="content-foot"></div>');
                $($targets.table).append('<div class="hidden-data" style="display:none;"></div>');
                $($targets.table).append('<div class="modal"><span class="loading"></span></div>');

                $locals.percents = [];
                var percent = $.ext.number.parseFixed(100 / $options.columns.length, 1, 0);
                for (var i = 0; i < $options.columns.length - 1; i++) {
                    $locals.percents.push(percent);
                }
                $locals.percents.push(100 - percent * ($options.columns.length - 1));

                var templateColumns = [];
                $.each($options.rows.edit.templates, function (tk, tv) {
                    templateColumns.push($.ext.number.parseInt(tk, 0));
                });
                $locals.templates.columns = templateColumns.sort();
            },
            updateFoot: function (totalRow) {
                if (!$options.info.show && $options.paging.sizes.start <= 0)
                    return;

                var dataLength = $($targets.table_body_data + ' .body-row.row-data').length;
                var from = 1, to = dataLength;
                if ($options.paging.sizes.start > 0) {
                    var pagingIndex = $.ext.number.parseInt($($targets.paging_attr).attr('data-index'), 0);
                    var pagingSize = $.ext.number.parseInt($($targets.paging_attr).attr('data-size'), 0);
                    from = pagingIndex * pagingSize + 1;
                    to = pagingIndex * pagingSize + dataLength;
                    totalRow = $.ext.number.parseInt(totalRow, dataLength);

                    var totalIndex = totalRow / pagingSize;
                    if (totalIndex > $.ext.number.parseInt(totalIndex, 0))
                        totalIndex = $.ext.number.parseInt(totalIndex, 0) + 1;
                    $($targets.paging_attr).attr('total-index', totalIndex)
                }
                else
                    totalRow = dataLength;

                if ($options.info.show)
                    $($targets.table_foot_info).html($.ext.string.format($options.info.format, from, to, totalRow));
            },
            updateRow: function (nextRowKey, nextCol) {
                var $col = $('[data-row-key="' + $locals.templates.rowKey + '"] .body-col[data-index="' + $locals.templates.colIndex + '"]');
                var $colContent = $col.find('.body-col-content');
                var $colTemplate = $col.find('.body-col-template');
                var field = $colTemplate.attr('data-field');
                var data = $methods.datas.fromRowKey($locals.templates.rowKey);
                if ($colTemplate.val() != data[field]) {
                    data[field] = $colTemplate.val();
                    $methods.ajaxs.runWithLoading($options.ajaxUpdate.url, $options.ajaxUpdate.createParam(data), function (response) {
                        if (!$.ext.string.isNullOrEmpty(response.Message)) {
                            $options.ajaxUpdate.onError();
                            alert(response.Message);
                            return;
                        }

                        $options.ajaxUpdate.onSuccess(response.Data);

                        var $col_options = $.extend(false, $.ext.table.columnDefaults, $options.columns[$locals.templates.colIndex]);
                        if (typeof $col_options.dataHtml == 'function')
                            $colContent.html($col_options.dataHtml(data));
                        else
                            $colContent.html(data[field]);


                        $methods.datas.updateForRowKey($locals.templates.rowKey, data);

                        if ($.ext.string.isNullOrEmpty(nextRowKey))
                            return;

                        $col.removeAttr('data-height');
                        $colContent.show();
                        $colTemplate.remove();

                        $locals.templates.rowKey = nextRowKey;
                        $locals.templates.colIndex = nextCol;
                        $methods.generates.template();
                    });
                }
                else {
                    if ($.ext.string.isNullOrEmpty(nextRowKey))
                        return;

                    $col.removeAttr('data-height');
                    $colContent.show();
                    $colTemplate.remove();

                    $locals.templates.rowKey = nextRowKey;
                    $locals.templates.colIndex = nextCol;
                    $methods.generates.template();
                }
            }
        };

        $(target).on('table:deleteRow', function (evt, row) {
            if ($(row).length > 0) {
                if ($(row).hasClass('body-row')) {
                    $methods.deleteRow(row);
                    return;
                }

                var $row = $(row).closest($targets.table + ' .content-body .body-row');
                if ($row.length > 0) {
                    $methods.deleteRow($row);
                    return;
                }
            }

            console.log('table:deleteRow error: Not found row');
        });
        $(target).on('table:reload', function (evt, withLoading) {
            if (withLoading)
                $methods.loads.runWithLoading();
            else
                $methods.loads.run();
        });
        $(target).on('table:render', function (evt) {
            $methods.startUp();
            $methods.generates.head();
            $methods.generates.foot();
            $methods.loads.runWithLoading();
        });
        $(target).on('table:resize', function (evt) {
            $methods.resize();
        });
        $(target).on('table:resize:waiting', function (evt) {
            if ($($targets.table).hasClass('resize-waiting')) {
                $($targets.table).removeClass('resize-waiting');
                $methods.resize();
            }
        });

        if ($options.autoRender) {
            $methods.startUp();
            $methods.generates.head();
            $methods.generates.foot();
        }

        $(document.body).ready(function () {
            if ($options.autoLoadOnReady)
                $methods.loads.runWithLoading();
        });
        $(document.body).click(function () {
            if ($(target).find('.size-click').hasClass('active'))
                $(target).find('.size-click').click();
        });

        $(window).resize(function () {
            $(target).trigger('table:resize');
        });
    };

    $.ext.table.columnDefaults = {
        className: '',
        dataClassName: '',
        dataField: '',
        dataHtml: null,
        headClassName: '',
        headText: ''
    };

    $.ext.table.groupDefaults = {
        from: 0,
        to: 0,
        text: ''
    };

    $.ext.table.templateDefaults = {
        dataField: '',
        dataType: 'string',
        design: null,
        useForAddNew: false,
        useForUpdate: false,
        useForSearch: false
    };

})(jQuery);