$(document).ready(function () {

    $('#confirmButton').click(function () {

        var url = location.href.split('?');

        location.href = url[0] + '?confirm=' + $('#bookingConfirmWrapper').data('id');
    });
});
