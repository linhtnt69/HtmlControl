var $printPreview = new function () {
    var $arguments = {
        type: 'print',
        layout: 'portrait',
        pageSize: 'A4',
        options: { showHeader: true, showFooter: true }
    };
    var $methods = {
        changeBorder: function () {
            $('.print .preview').removeProp('style');
            $('.print .preview .border').removeProp('style');
            $('.print .preview .border-top').removeProp('style');
            $('.print .preview .border-left').removeProp('style');
            $('.print .preview .border-right').removeProp('style');
            $('.print .preview .border-bottom').removeProp('style');

            var previvewClientRect = $('.print .preview')[0].getBoundingClientRect();
            var previvewClientWidth = $('.print .preview')[0].clientWidth;
            var previvewClientHeight = $('.print .preview')[0].clientHeight;

            var scrollBottom = $('.print .preview').height() - previvewClientHeight;
            if (scrollBottom <= 0)
                $('.print .preview').css({ 'overflow-x': 'hidden' });

            var scrollRight = $('.print .preview').width() - previvewClientWidth;
            if (scrollRight <= 0)
                $('.print .preview').css({ 'overflow-y': 'hidden' });

            if (scrollRight > 0) {
                var paddingBottom = scrollBottom > 0 ? 4 : 3;
                $('.print .preview .border').css({ 'padding-bottom': paddingBottom });
                $('.print .preview .border-top').css({ top: previvewClientRect.top, left: previvewClientRect.left, width: previvewClientWidth });
                $('.print .preview .border-bottom').css({ top: previvewClientRect.top + previvewClientHeight - paddingBottom, left: previvewClientRect.left, width: previvewClientWidth, height: paddingBottom });
            }
            else {
                var paddingTopBottom = (previvewClientHeight - $('.print .preview .content').outerHeight()) / 2;
                $('.print .preview .border').css({ 'padding-top': paddingTopBottom, 'padding-bottom': paddingTopBottom });
            }

            if (scrollBottom > 0) {
                var paddingRight = scrollRight > 0 ? 4 : 3;
                $('.print .preview .border').css({ 'padding-right': paddingRight });
                $('.print .preview .border-left').css({ top: previvewClientRect.top, left: previvewClientRect.left, height: previvewClientHeight });
                $('.print .preview .border-right').css({ top: previvewClientRect.top, left: previvewClientRect.left + previvewClientWidth - paddingRight, width: paddingRight, height: previvewClientHeight });
            }
            else {
                var paddingLeftRight = (previvewClientWidth - $('.print .preview .content').outerWidth() + 1) / 2;
                $('.print .preview .border').css({ 'padding-left': paddingLeftRight, 'padding-right': paddingLeftRight });
            }
        },
        registerEvent: function () {
            $('.pp-btn.pp-btn-cancel').click(function () {
                $(window.parent.document).find('.previewer').remove();
            });
            $('.pp-btn.pp-btn-print').click(function () {
                //$(window.parent.document).find('.previewer').remove();
            });

            $('.dropdown.type > .items > .item').click(function () {
                $arguments.type = $(this).attr('data-value');
                localStorage.setItem('print-preview-arguments', JSON.stringify($arguments));
            });
            $('.dropdown.layout > .items > .item').click(function () {
                $('.preview .content').attr('data-layout', $(this).attr('data-value'));
                $methods.changeBorder();
                $arguments.layout = $(this).attr('data-value');
                localStorage.setItem('print-preview-arguments', JSON.stringify($arguments));
            });
            $('.dropdown.page-size > .items > .item').click(function () {
                $('.preview .content').attr('data-size', $(this).attr('data-value'));
                $methods.changeBorder();
                $arguments.pageSize = $(this).attr('data-value');
                localStorage.setItem('print-preview-arguments', JSON.stringify($arguments));
            });

            $('.checkbox.pages .item').last().click(function () {
                $('.checkbox.pages .item .indexs').focus();
            });
            $('.checkbox.pages .item .indexs').blur(function () {
                if ($local.isEmptyString($(this).val()))
                    $('.checkbox.pages .item').first().click();
            });
            $('.checkbox.options .item.show-header').click(function () {
                $arguments.options.showHeader = $(this).hasClass('active');
                localStorage.setItem('print-preview-arguments', JSON.stringify($arguments));
            });
            $('.checkbox.options .item.show-footer').click(function () {
                $arguments.options.showFooter = $(this).hasClass('active');
                localStorage.setItem('print-preview-arguments', JSON.stringify($arguments));
            });
        },
        startUp: function () {
            var argumentStr = localStorage.getItem('print-preview-arguments');
            if (!$local.isEmptyString(argumentStr))
                $arguments = $.extend(true, $arguments, JSON.parse(argumentStr));

            var $itemType = $('.dropdown.type > .items > .item[data-value="' + $arguments.type + '"]');
            if ($itemType.length > 0)
                $itemType.trigger('dropdown:selected');

            var $itemLayout = $('.dropdown.layout > .items > .item[data-value="' + $arguments.layout + '"]');
            if ($itemLayout.length > 0) {
                $itemLayout.trigger('dropdown:selected');
                $('.preview .content').attr('data-layout', $arguments.layout);
            }

            var $itemPageSize = $('.dropdown.page-size > .items > .item[data-value="' + $arguments.pageSize + '"]');
            if ($itemPageSize.length > 0) {
                $itemPageSize.trigger('dropdown:selected');
                $('.preview .content').attr('data-size', $arguments.pageSize);
            }

            if ($arguments.options.showHeader)
                $('.checkbox.options .item.show-header').trigger('checkbox:checked');
            else
                $('.checkbox.options .item.show-header').trigger('checkbox:unchecked');

            if ($arguments.options.showFooter)
                $('.checkbox.options .item.show-footer').trigger('checkbox:checked');
            else
                $('.checkbox.options .item.show-footer').trigger('checkbox:unchecked');

            $methods.changeBorder();
            $methods.registerEvent();

            setTimeout(function () {
                var $previewData = $('<div></div>').appendTo($('.preview .content .body'));
                $previewData.addClass('data');

                var $documentHead = $(window.parent.document.head).clone();
                $previewData.append($documentHead.find('link'));
                //$previewData.append($documentHead.find('script'));
                $previewData.append($documentHead.find('style'));

                var $documentBody = $(window.parent.document.body).clone();
                var $previewContent = $documentBody.find('.print-content');
                if ($previewContent.length > 0) {
                    $previewData.append($documentBody.find('link'));
                    //$previewData.append($documentBody.find('script'));
                    $previewData.append($documentBody.find('style'));
                    $previewData.append($previewContent);
                }
                else {
                    $documentBody.find('.no-print').remove();
                    $documentBody.find('.previewer').remove();
                    $previewData.append($documentBody.contents());
                }
            }, 0);
        }
    };

    $(document).ready($methods.startUp);
};