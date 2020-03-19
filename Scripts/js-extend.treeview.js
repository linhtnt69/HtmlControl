(function ($) {

    $.fn.extend({
        extTreeView: function (options) {
            this.each(function () {
                new $.ext.treeview(options, this);
            });
            return this;
        }
    });

    $.ext.treeview = function (options, target) {
        var $options = $.extend(true, $.ext.treeview.defaults, options);
        var $locals = { name: 'ext-treeview-' + $.ext.guid.newGuid() };
        var $targets = {
            treeview: '[data-name="' + $locals.name + '"]'
        };
        var $methods = {
            startUp: function () {
                if ($(target).length <= 0 || $(target).prop('tagName') == 'BODY')
                    $(document.body).append('<div data-name="' + $locals.name + '"></div>');
                else
                    $(target).attr('data-name', $locals.name);
                $($targets.treeview).addClass('ext-treeview');
            }
        }

        this.addRoot = function (args) {
            args = $.extend(false, { source: {}, displayField: '', attrs: [] }, args);

            if ($.isEmptyObject(args.source) || args.displayField === '')
                return '';

            var $root_label = $('<span class="label"></span>').appendTo($(target));
            var $root_label_text = $('<span></span>').appendTo($root_label);
            $root_label_text.html(args.source[args.displayField]);
            if ($options.allowAdd) {
                var $root_label_icon_add = $('<span class="fa fa-plus icon add root"></span>').appendTo($root_label);
                $.each(args.attrs, function (ai, attr) {
                    attr = $.extend(false, { name: '', field: '' }, attr);

                    if (attr.name === '' || attr.field === '')
                        return '';

                    $root_label_icon_add.attr('data-' + attr.name, args.source[attr.field]);
                });
            }
        }

        $methods.startUp();
    }

    $.ext.treeview.defaults = {
        allowAdd: false,
        allowDelete: false
    };

})(jQuery);