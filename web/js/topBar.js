var gMobileMenuOut = false;
var gSliding = false;
var gMENU_SLIDE_TIME = 0.5;

$(document).ready(function () {

    mobileToggleButtonInit();

    // mobileMenuOpen();

    $(window).resize(function(){

        if(!mobileLayout()){
            mobileMenuClose();
        }
    });
});


function mobileToggleButtonInit() {

    var sliderElement = $('#menuSlider');

    var toggleButton = $('#mobileMenuToggle');

    toggleButton.on('touchstart click', function () {

        if (gMobileMenuOut) {

            mobileMenuClose();

        } else {

            mobileMenuOpen();
        }
    });
}

// These function also getting called from bookOnline.js now
function mobileMenuClose() {

    if (gSliding) {
        // prevent click stopping touchstart on mobile
        return;
    }

    gSliding = true;

    var sliderElement = $('#menuSlider');

    TweenLite.to(sliderElement, gMENU_SLIDE_TIME, {
        marginTop: 0, onComplete: function () {

            gSliding = false;
            gMobileMenuOut = false;
            $('#mobileMenuLinks').hide();
        }
    });
}

function mobileMenuOpen() {

    if (gSliding) {
        // prevent click stopping touchstart on mobile
        return;
    }

    var sliderElement = $('#menuSlider');

    var menuLinksHeight = $('#mobileMenuLinks').outerHeight();

    $('#mobileMenuLinks').show();

    gSliding = true;

    TweenLite.to(sliderElement, gMENU_SLIDE_TIME, {
        marginTop: menuLinksHeight, onComplete: function () {

            gSliding = false;
            gMobileMenuOut = true;
        }
    });
}
