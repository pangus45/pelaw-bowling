$(document).ready(function () {

    var confirmButton = $('#confirmButton');

    confirmButton.click(function () {

        var summary = $('#summary');

        var data = {
            id: $('#bookingConfirmWrapper').data('id'),
            summary: summary.val()
        };

        if(!summary.val()){
            summary.addClass('error');
            return;
        }

        confirmButton.addClass('pending');

        $.post('/post/bookingConfirm', data, function (pResponse) {

            console.log(pResponse);
            location.reload();
        });
    });
});
