(function ($) {

    $.fn.extend({
        extFile: function (options) {
            this.each(function () {
                new $.ext.file(options, this);
            });
            return this;
        }
    });

    $.ext.file = function (options, target) {
        var $options = $.extend(true, $.ext.file.defaults, options);
        var $locals = {
            datas: {},
            displayIcon: $options.displayIcons.remove || $options.displayIcons.setHeader || $options.displayIcons.upload,
            name: 'ext-file-' + $.ext.guid.newGuid()
        };
        var $targets = {
            file: '[data-name="' + $locals.name + '"]',
            file_box: '[data-name="' + $locals.name + '"] .file-box',
            file_box_icon: '[data-name="' + $locals.name + '"] .file-box.icon',
            file_box_icon_remove: '[data-name="' + $locals.name + '"] .file-box .group-icon .icon-remove',
            file_box_icon_set_header: '[data-name="' + $locals.name + '"] .file-box .group-icon .icon-set-header',
            file_box_icon_upload: '[data-name="' + $locals.name + '"] .file-box .group-icon .icon-upload',
            file_box_viewing: '[data-name="' + $locals.name + '"] .file-box.viewing',

            modal_view: '[data-name="' + $locals.name + '-modal-view"]',
            modal_view_content: '[data-name="' + $locals.name + '-modal-view"] .view-content',
            modal_view_close: '[data-name="' + $locals.name + '-modal-view"] .view-content .view-close',
            modal_view_image: '[data-name="' + $locals.name + '-modal-view"] .view-content .view-image',
            modal_view_left: '[data-name="' + $locals.name + '-modal-view"] .view-content .view-left',
            modal_view_right: '[data-name="' + $locals.name + '-modal-view"] .view-content .view-right'
        };
        var $methods = {
            files: {
                accept: function (file) {
                    if ($options.matchTypes.length > 0) {
                        if ($options.matchTypes.indexOf(file.type) == -1) {
                            $options.matchTypeError();
                            return false;
                        }
                    }
                    return $options.matchFile(file);
                },
                clear: function () {
                    $locals.datas = {};
                    $($targets.file_box + ':not(.frame)').remove();
                },
                create: function (file) {
                    var fileId = $.ext.guid.newGuid();

                    $locals.datas[fileId] = { file: file };

                    var $fileBox = $('<div class="file-box" id="' + fileId + '"></div>').appendTo($($targets.file));
                    if ($locals.displayIcon) {
                        var $groupIcon = $('<div class="group-icon"></div>').appendTo($fileBox);
                        if ($options.displayIcons.remove)
                            $groupIcon.append('<span class="icon-remove"><i class="fa fa-trash"></i></span>');
                        if ($options.displayIcons.setHeader)
                            $groupIcon.append('<span class="icon-set-header"><i class="fa fa-square"></i></span>');
                        if ($options.displayIcons.upload)
                            $groupIcon.append('<span class="icon-upload"><i class="fa fa-upload"></i></span>');
                    }
                    $fileBox.append('<div class="group-view"><span class="file-loading"><i class="fa fa-spinner"></i></span></div>');
                    if ($options.displayInfo)
                        $fileBox.append('<div class="group-info"><span class="file-loading"><i class="fa fa-spinner"></i></span></div>');
                },
                load: function () {
                    $.each($locals.datas, function (dk, dv) {
                        var fileSrc = URL.createObjectURL(dv.file);

                        $locals.datas[dk]['fileSrc'] = fileSrc;

                        $options.bindData(dv);

                        setTimeout(function () {
                            if (dv.file.type.indexOf('image/') != -1)
                                $('#' + dk + ' .group-view').html('<img class="view" src="' + fileSrc + '" />');
                            else if (dv.file.type.indexOf('video/') != -1)
                                $('#' + dk + ' .group-view').html('<video class="view"><source src="' + fileSrc + '" type="' + dv.file.type + '" /></video>');
                            else
                                $('#' + dk + ' .group-view').html('<img class="view" src="' + fileSrc + '" />');

                            if ($options.displayInfo) {
                                $('#' + dk + ' .group-info').html('');
                                $('#' + dk + ' .group-info').append('<span class="line title">File Name</span><span class="line" title="' + dv.file.name + '">' + dv.file.name + '</span>');
                                $('#' + dk + ' .group-info').append('<span class="line title">File Size</span><span class="line">' + $methods.formatSize(dv.file.size) + '</span>');
                            }
                        }, 100);
                    });
                },
                read: function (file) {
                    if (!$methods.files.accept(file))
                        return;
                    $methods.files.clear();
                    $methods.files.create(file);
                    $methods.files.load();
                },
                reads: function (files) {
                    $.each(files, function (fi, file) {
                        if (!$methods.files.accept(file))
                            return;
                        $methods.files.create(file);
                    });
                    $methods.files.load();
                },
            },
            formatSize: function (length) {
                if (length < 1024) return length + " Bytes";
                else if (length < 1048576) return (length / 1024).toFixed(3) + " KB";
                else if (length < 1073741824) return (length / 1048576).toFixed(3) + " MB";
                else return (length / 1073741824).toFixed(3) + " GB";
            },
            generate: function () {
                var $file = $('<input type="file" />').appendTo($($targets.file));
                $file.prop('multiple', $options.multiple);
                if (!$.ext.string.isNullOrEmpty($options.accept))
                    $file.prop('accept', $options.accept);

                var $fileBoxFrame = $('<div class="file-box frame"></div>').appendTo($($targets.file));
                $fileBoxFrame.html('<span>' + $options.startContent + '</span>');
            },
            register: function () {
                $($targets.file + ' input[type="file"]').change(function () {
                    if (!this.files || this.files.length <= 0)
                        return;
                    if ($options.multiple)
                        $methods.files.reads(this.files);
                    else
                        $methods.files.read(this.files[0]);
                });
                $($targets.file_box + '.frame').click(function () {
                    $($targets.file + ' input[type="file"]').click();
                });

                window.addEventListener('dragover', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.dataTransfer.dropEffect = 'copy';
                });
                window.addEventListener('drop', function (evt) {
                    if ($(evt.target).hasClass('file-box') && $(evt.target).hasClass('frame')) {
                        evt.stopPropagation();
                        evt.preventDefault();
                        $methods.files.reads(evt.dataTransfer.files);
                    }
                });

                if ($locals.displayIcon) {
                    if ($options.displayIcons.remove)
                        $(document.body).on('click', $targets.file_box_icon_remove, function () {
                            var $fileBox = $(this).closest('.file-box');
                            $options.onRemove($locals.datas[$fileBox.prop('id')]);

                            if ($fileBox.find('.group-icon .icon-set-header.checked').length > 0)
                                $fileBox.next().find('.group-icon .icon-set-header').click();

                            $fileBox.remove();
                        });
                    if ($options.displayIcons.setHeader)
                        $(document.body).on('click', $targets.file_box_icon_set_header, function () {
                            if ($(this).hasClass('checked')) {
                                $(this).removeClass('checked');
                                $(this).find('.fa').removeClass('fa-check-square').addClass('fa-square');
                            }
                            else {
                                $($targets.file_box_icon_set_header).removeClass('checked');
                                $($targets.file_box_icon_set_header + ' .fa').removeClass('fa-check-square').addClass('fa-square');

                                $(this).find('.fa').removeClass('fa-square').addClass('fa-check-square');
                                $(this).addClass('checked');

                                var $fileBox = $(this).closest('.file-box');
                                $fileBox.insertAfter($($targets.file_box + '.frame'));
                                $options.onSetHeader($locals.datas[$fileBox.prop('id')]);
                            }
                        });
                    if ($options.displayIcons.upload)
                        $(document.body).on('click', $targets.file_box_icon_upload, function () { });
                }

                if ($options.viewInModal) {
                    $($targets.modal_view).click(function () {
                        $($targets.modal_view_close).click();
                    });
                    $($targets.modal_view_content).click(function () {
                        return false;
                    });
                    $($targets.modal_view_close).click(function () {
                        $(document.body).css({ overflow: '' });

                        $($targets.file_box_viewing).removeClass('viewing');
                        $($targets.modal_view).hide();
                    });
                    $($targets.modal_view_left).click(function () {
                        var $imgPrev = $($targets.file_box_viewing).prev().find('.group-view');
                        if ($imgPrev.length > 0)
                            $imgPrev.click();
                    });
                    $($targets.modal_view_right).click(function () {
                        var $imgNext = $($targets.file_box_viewing).next().find('.group-view');
                        if ($imgNext.length > 0)
                            $imgNext.click();
                    });

                    $(document.body).on('click', $targets.file_box + ' .group-view', function () {
                        $(document.body).css({ overflow: 'hidden' });

                        $($targets.file_box_viewing).removeClass('viewing');
                        $($targets.modal_view_image).html($(this).html());
                        $($targets.modal_view_image + ' video').prop('autoplay', true).prop('controls', true);
                        $($targets.modal_view).show();

                        if ($options.displayInfo)
                            $($targets.modal_view_content + ' .view-info').html($(this).next().html());

                        var $fileBox = $(this).closest('.file-box');
                        $fileBox.addClass('viewing');

                        var isOneImage = true;
                        if ($fileBox.prev().find('.group-view').length > 0) {
                            isOneImage = false;
                            $($targets.modal_view_left).removeClass('no-prev');
                        }
                        else
                            $($targets.modal_view_left).addClass('no-prev');

                        if ($fileBox.next().find('.group-view').length > 0) {
                            isOneImage = false;
                            $($targets.modal_view_right).removeClass('no-next');
                        }
                        else
                            $($targets.modal_view_right).addClass('no-next');

                        if (isOneImage)
                            $($targets.modal_view_image).addClass('one-image');
                        else
                            $($targets.modal_view_image).removeClass('one-image');
                    });

                    window.addEventListener('keyup', function (evt) {
                        if ($($targets.modal_view).is(':visible')) {
                            if (evt.keyCode == 27)
                                $($targets.modal_view_close).click();
                            if (evt.keyCode == 37)
                                $($targets.modal_view_left).click();
                            if (evt.keyCode == 39)
                                $($targets.modal_view_right).click();
                        }
                    });
                }
            },
            startUp: function () {
                if ($(target).length <= 0 || $(target).prop('tagName') == 'BODY')
                    $(document.body).append('<div data-name="' + $locals.name + '"></div>');
                else
                    $(target).attr('data-name', $locals.name);

                $($targets.file).addClass('ext-file');
                if ($options.display == $.ext.file.displays.horizontal)
                    $($targets.file).addClass('horizontal');
                if (!$options.displayInfo)
                    $($targets.file).addClass('no-info');
                if (!$options.multiple)
                    $($targets.file).addClass('one-image');
                if ($locals.displayIcon)
                    $($targets.file).addClass('show-icon');

                if ($options.viewInModal) {
                    $($targets.file).addClass('view-in-modal');

                    var $modalView = $('<div></div>').insertAfter($($targets.file));
                    $modalView.attr('data-name', $locals.name + '-modal-view');
                    $modalView.addClass('ext-file modal-view');

                    var $modalViewContent = $('<div class="view-content"></div>').appendTo($modalView);
                    $modalViewContent.append('<div class="view-image"></div>');
                    $modalViewContent.append('<span class="view-close"><i class="fa fa-close"></i></span>');
                    $modalViewContent.append('<span class="view-left"><i class="fa fa-arrow-left"></i></span>');
                    $modalViewContent.append('<span class="view-right"><i class="fa fa-arrow-right"></i></span>');
                    if ($options.displayInfo)
                        $modalViewContent.append('<div class="view-info"></div>');
                    else
                        $modalView.addClass('no-info');
                }
            }
        };

        $methods.startUp();
        $methods.generate();
        $methods.register();
    };

    $.ext.file.accepts = {
        audio: 'audio/*',
        excel: '.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        html: 'text/html',
        image: 'image/*',
        pdf: '.pdf',
        text: 'text/plain',
        video: 'video/*'
    };

    $.ext.file.displays = {
        horizontal: 'horizontal',
        vertical: 'vertical'
    };

    $.ext.file.defaults = {
        accept: '',
        bindData: function (data) { },
        display: $.ext.file.displays.vertical,
        displayIcons: { remove: false, setHeader: false, upload: false },
        displayInfo: false,
        matchFile: function (file) { return true; },
        matchTypes: [],
        matchTypeError: function () { },
        multiple: false,
        viewInModal: false,
        startContent: '<i class="fa fa-cloud-upload"></i>&nbsp;Drag file here',
        onRemove: function (data) { },
        onSetHeader: function (data) { },
        onUpload: function (data) { }
    };

})(jQuery);