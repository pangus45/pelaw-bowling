$(document).ready(function () {

    $('#confirmButton').click(function () {

        var data = {
            id: $('#bookingConfirmWrapper').data('id'),
            summary: $('#summary').val()
        };

        $.post('/post/bookingConfirm', data, function(){

            location.reload();
        });
    });
});
