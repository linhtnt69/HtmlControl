$(document).ready(function () {
    $('.dropdown').click(function () {
        $('.dropdown.open').not(this).click();
        $(this).toggleClass('open');
        return false;
    });

    $('.dropdown > .items > .item').click(function () {
        if ($(this).hasClass('active'))
            return;
        $(this).closest('.items').find('.item').not(this).removeClass('active');
        $(this).addClass('active');
        $(this).closest('.items').prev('.item').remove();
        $(this).clone().insertBefore($(this).closest('.items'));
    });

    $('.dropdown > .items > .item').on('dropdown:selected', function () {
        if ($(this).hasClass('active'))
            return;
        $(this).closest('.items').find('.item').not(this).removeClass('active');
        $(this).addClass('active');
        $(this).closest('.items').prev('.item').remove();
        $(this).clone().insertBefore($(this).closest('.items'));
    });

    $(document.body).click(function () {
        if ($('.dropdown').hasClass('open'))
            $('.dropdown.open').click();
    });
});