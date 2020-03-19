$(document).ready(function () {
    $('.checkbox .item').click(function () {
        var dataGroup = $(this).attr('data-group');
        if ($local.isEmptyString(dataGroup))
            $(this).toggleClass('active');
        else {
            $(this).closest('.checkbox').find('.item').not(this).removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.checkbox .item').on('checkbox:checked', function () {
        if ($(this).hasClass('active'))
            return;
        var dataGroup = $(this).attr('data-group');
        if ($local.isEmptyString(dataGroup))
            $(this).addClass('active');
        else {
            $(this).closest('.checkbox').find('.item').not(this).removeClass('active');
            $(this).addClass('active');
        }
    });

    $('.checkbox .item').on('checkbox:unchecked', function () {
        if (!$(this).hasClass('active'))
            return;
        var dataGroup = $(this).attr('data-group');
        if ($local.isEmptyString(dataGroup))
            $(this).removeClass('active');
    });
});