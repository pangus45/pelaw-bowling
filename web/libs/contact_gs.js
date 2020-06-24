$URL_1 = '/con';
$URL_2 = 'tact';
$URL_3 = 'sdfegdds';
$URL_4 = '39djdfj3';

$(document).ready(function(){

    // return;

    contactFormInit($URL_1 + $URL_2);
});

function contactFormInit(pUrl) {

    setTimeout(function(){

        $('#desktopContact_url, #mobileContact_url').val($URL_4 + $URL_3);

    }, 5000);

    // $('form input, form textarea').each(function(pIndex, pInput){
    //
    //     var input = $(pInput);
    //
    //     input.data('placeholder', input.attr('placeholder'));
    // });

    // $('form input, form textarea').change(function(){
    //
    //     var input = $(this);
    //
    //     if('' != input.val() && input.hasClass('missing')){
    //
    //         fieldMissingSet(input, false);
    //     }
    // });

    // $('form').attr('novalidate', true);

    return;

    $('form').on('submit', function (pEvent) {

        pEvent.preventDefault();
        // Think this is preventing iphone returning to page after send!
        // Sort out next time

        // some browsers (IPhone - Safari) don't support required fields
        // if(isRequiredFieldMissing($('form'))){
        //     return false;
        // }

        // $('#popup').modal('show');
        // $('#modalTitle').text('Sending');
        // $('#modalBody i').show();
        // $('#modalBody span').text('');

        $.post({

            url: pUrl,
            data: $(this).serialize(),
            timeout: 10000,
            success: submitSuccess,
            error: submitError
        });
    });
}

function fieldMissingSet(pInput, pMissing){

    var placeholder = pInput.data('placeholder');

    if(pMissing){

        pInput.attr('placeholder', 'Please enter: ' + placeholder);
        pInput.addClass('missing');
    }
    else{

        pInput.attr('placeholder', placeholder);
        pInput.removeClass('missing');
    }
}

function isRequiredFieldMissing(pForm){

    // var requiredFields = pForm.find('[required]'); // change to [required] if not using true option as part of the attribute as it is not really needed.
    var requiredFields = pForm.find('.required input, .required textarea'); // change to [required] if not using true option as part of the attribute as it is not really needed.
    var missingField = false;

    requiredFields.each(function(pIndex, pInput){

        var input = $(pInput);

        fieldMissingSet(input, false);

        if('' == input.val()){

            fieldMissingSet(input, true);

            if(!missingField){ // set focus for first missing field
                input.focus();
            }

            missingField = true;
        }
    });

    return missingField;
}

function submitSuccess(pResponse){

    // $(document).empty();

    // $(document).append(pResponse);

    // l('Success');
    console.log(pResponse);
    // $('#debug').empty();
    // $('#debug').append(pResponse);

    // $('#modalTitle').text('Thanks');
    // $('#modalBody span').text('Your request has been received and we\'ll be in touch shortly.');
    // $('#modalBody i').hide();

    // $('#contact').find('input,textarea').val('');

    location.reload();
}

function submitError(pRequest, pStatus, pError){

    l('Connection Problem');

    if("timeout" == pStatus) {
        l('timeout');
    }
    else{
        l('other error');
    }

    $('#modalTitle').text('Sorry');
    $('#modalBody i').hide();
    $('#modalBody span').html('Sorry there was a connection problem.<br>Please click ok and try sending the form again.');
}