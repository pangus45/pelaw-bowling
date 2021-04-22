$URL_3 = 'sdfegdds';
$URL_4 = '39djdfj3';

$(document).ready(function () {

    contactFormInit();

    var clickableElements = 'input, select, button, textarea';

    if (!editorLoaded()) {

        $(clickableElements).eq(0).focus();
    }

    // if (typeof(gEditorLoaded) !== 'undefined') {

    debugFill();

    // }
});

function debugFill() {

    if (editorIsActive() || -1 != location.href.indexOf('localhost:') || -1 != location.href.indexOf('192.168.')) {

        debugFillSpecific('desktop');
        debugFillSpecific('mobile');
    }
}


function debugFillSpecific(pLayout) {

    pLayout += 'Contact_';

    // $('#' + pLayout + 'date').val('25/12/2020');
    $('#' + pLayout + 'name').val('Joe Bloggs');
    $('#' + pLayout + 'email').val('dev@positivemint.com');
    $('#' + pLayout + 'subject').val('Schedules');
    $('#' + pLayout + 'message').val("Just a test - no need to do anything about this email");
    $('#' + pLayout + 'consent').prop("checked", true);
}


function contactFormInit() {

    setTimeout(function () {

        $('#desktopContact_url, #mobileContact_url').val($URL_4 + $URL_3);

    }, 2000);
}