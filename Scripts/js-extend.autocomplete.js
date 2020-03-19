(function ($) {

    $.fn.extend({
        extAutoComplete: function (options) {
            return new $.ext.autocomplete(options, this);
        }
    });

    $.ext.autocomplete = function (options, target) {
        var $options = $.extend(true, $.ext.autocomplete.defaults, options);
        var $locals = {
            name: 'ext-autocomplete-' + $.ext.guid.newGuid(),
            intervalFilter: null
        };
        var $targets = {
            autocomplete: '[data-name="' + $locals.name + '"]',
            autocomplete_data: '[data-name="' + $locals.name + '-data"]'
        };
        var $methods = {
            startUp: function () {
                if ($(target).length > 0) {
                    $(target).addClass('ext-autocomplete');
                    $(target).attr('data-name', $locals.name);
                }
                else
                    $(document.body).append('<div class="ext-autocomplete" data-name="' + $locals.name + '"></div>');

                $($targets.autocomplete).html('');
                $($targets.autocomplete).append('<input type="text" autocomplete="off" spellcheck="false" data-filter="" />');
                $($targets.autocomplete).append('<span class="icon"></span>');
                $($targets.autocomplete).click(function () {
                    $(this).toggleClass('active');

                    if ($(this).hasClass('active')) {
                        var clientRect = $(this)[0].getBoundingClientRect();
                        if (clientRect.bottom + $($targets.autocomplete_data).outerHeight() > $(window).innerHeight())
                            $($targets.autocomplete_data).css({ top: (clientRect.top - $($targets.autocomplete_data).outerHeight() + 1) + 'px' });
                        else
                            $($targets.autocomplete_data).css({ top: (clientRect.bottom - 1) + 'px' });
                        $($targets.autocomplete_data).css({ left: clientRect.left + 'px' });
                        if ($($targets.autocomplete_data)[0].style.minWidth == '')
                            $($targets.autocomplete_data).css({ 'min-width': (clientRect.width - 2) + 'px' });
                        $($targets.autocomplete_data).css({ 'visibility': 'visible' });

                        $($targets.autocomplete + ' input').focus();
                    }
                    else
                        $($targets.autocomplete_data).css({ 'visibility': 'hidden' });

                    return false;
                });
                $($targets.autocomplete + ' input').click(function () {
                    if ($($targets.autocomplete).hasClass('active'))
                        return false;
                });
                $($targets.autocomplete + ' input').focus(function () {
                    $(this).select();
                });
                $($targets.autocomplete + ' input').keydown(function (evt) {
                    if (evt.keyCode == 13)
                        return false;
                });
                $($targets.autocomplete + ' input').keyup(function () {
                    clearInterval($locals.intervalFilter);

                    if ($(this).val() == $(this).attr('data-filter'))
                        return;

                    $locals.intervalFilter = setInterval(function () {
                        clearInterval($locals.intervalFilter);

                        var filterValue = $($targets.autocomplete + ' input').val();
                        $($targets.autocomplete + ' input').attr('data-filter', filterValue);

                        $($targets.autocomplete_data + ' div').trigger('table:reload', true);
                    }, 500);
                });

                $(document.body).append('<div data-name="' + $locals.name + '-data"><div></div></div>');
                $(document.body).append(function () {
                    return '\
                        <style>\
                            ' + $targets.autocomplete_data + '\
                            {\
                                position: absolute;\
                                top: 0;\
                                visibility: hidden;\
                                width: calc(100% - 20px);\
                            }\
                            ' + $targets.autocomplete_data + ' .ext-table\
                            {\
                                margin: 0;\
                                width: 100%;\
                            }\
                            ' + $targets.autocomplete_data + ' .ext-table .content-body .body-row.hover {\
                                cursor: pointer;\
                            }\
                        </style>\
                    ';
                }());
                $(document.body).click(function (evt) {
                    if ($($targets.autocomplete).hasClass('active')) {
                        if ($(evt.target).closest($targets.autocomplete_data).length <= 0)
                            $($targets.autocomplete).click();
                    }
                });

                var tableOptions = $.extend(true, $.ext.table.defaults, $options);
                tableOptions.ajaxRead.createParam = function () {
                    var params = $options.ajaxRead.createParam();
                    var filterValue = $($targets.autocomplete + ' input').val();
                    return { Filters: [{ Names: ['A', 'B', 'C'], Value: filterValue, Type: 'contains' }] };
                };
                $options['rows'] = {
                    click: function (data) {

                    },
                    hover: { use: true }
                };
                $($targets.autocomplete_data + ' div').extTable($options);
            }
        };

        $methods.startUp();

        this.get = {
            text: function () {
                return $($targets.autocomplete + ' input').val();
            }
        };
    };

    $.ext.autocomplete.defaults = {
        ajaxRead: {
            url: '',
            createParam: function () { return {}; }
        },
        createData: function () { return []; },
        columns: [],
        fixeds: { columns: { lefts: [], leftInMin: 0, rights: [], rightInMin: 0 }, head: false, height: 0 },
        info: { show: true, format: 'Showing {0} to {1} of {2} entries' },
        paging: { index: 0, sizes: { label: 'Show', start: 0, times: 4 } },
        sorting: { columns: [], fields: {}, defaults: {} }
    };

})(jQuery);