var SIDE_BAR_SLIDE_TIME = 0.5;

var sideBarActive = false;

$(document).ready(function () {

    $('#burger').data('shown', false);

    $('#burger').click(sideBarSlideToggle);
});


function sideBarSlideToggle() {

    var shown = $('#burger').data('shown');

    if (!shown) {

        menuOpen();
    } else {
        menuClose();
    }
}

var BURGER_DURATION = .5;
var BURGER_EASE = Power1.easeOut;

function burgerMorphToOpen(){

    TweenMax.to('#burgerPathTopStart', BURGER_DURATION, {morphSVG: '#burgerPathTopFinish', ease: BURGER_EASE});
    TweenMax.to('#burgerPathMiddleStart', BURGER_DURATION, {morphSVG: '#burgerPathMiddleFinish', ease: BURGER_EASE});
    TweenMax.to('#burgerPathBottomStart', BURGER_DURATION, {morphSVG: '#burgerPathBottomFinish', ease: BURGER_EASE});

    // TweenMax.to('#burgerPathTopStart', BURGER_DURATION, {opacity: 0, ease: BURGER_EASE});
    // TweenMax.to('#burgerPathMiddleStart', BURGER_DURATION, {morphSVG: '#burgerPathMiddleFinish', ease: BURGER_EASE});
    // TweenMax.to('#burgerPathBottomStart', BURGER_DURATION, {opacity: 0, ease: BURGER_EASE});
}


function burgerMorphReset(){

    TweenMax.to('#burgerPathTopStart', BURGER_DURATION, {morphSVG: '#burgerPathTopStart', ease: BURGER_EASE});
    TweenMax.to('#burgerPathMiddleStart', BURGER_DURATION, {morphSVG: '#burgerPathMiddleStart', ease: BURGER_EASE});
    TweenMax.to('#burgerPathBottomStart', BURGER_DURATION, {morphSVG: '#burgerPathBottomStart', ease: BURGER_EASE});

    // TweenMax.to('#burgerPathTopStart', BURGER_DURATION, {opacity: 1, ease: BURGER_EASE});
    // TweenMax.to('#burgerPathMiddleStart', BURGER_DURATION, {morphSVG: '#burgerPathMiddleStart', ease: BURGER_EASE});
    // TweenMax.to('#burgerPathBottomStart', BURGER_DURATION, {opacity: 1, ease: BURGER_EASE});
}



function menuOpen() {

    // $('html').css('overflow-y', 'hidden');

    // console.log($('#sideBarEdge').outerWidth());

    var timeline = new TimelineMax();

    timeline.staggerFrom('#menuDesktopRow0 .textPart', .5, {x: '-50%', opacity: 0, ease: Back.easeOut.config(1.7)}, .1);

    // var subTimeline = new TimelineMax();

    // subTimeline.from('.socialRow', .8, {rotateZ: '-90deg', transformOrigin:'top left', ease: Back.easeOut.config(1.7)}, 0);
    // subTimeline.from('.socialRow svg', .8, {rotateZ: '90deg', ease: Back.easeOut.config(1.7)}, 0);

    // timeline.add(subTimeline, "-=1.1");

    // TweenLite.to('#burger', SIDE_BAR_SLIDE_TIME, {rotationZ: 90});

    burgerMorphToOpen();

    sideBarActive = true;

    TweenLite.to('#menuLayout', SIDE_BAR_SLIDE_TIME, {
        x: $('#menuLayout').width(), onComplete: function () {

            $('#burger').data('shown', true);
        }
    });

    var translate = $('#menuLayout').width();

    TweenLite.to('#menuSlider, .menuSlide', SIDE_BAR_SLIDE_TIME, {
        x: translate
    });
}

function menuClose() {

    // TweenMax.staggerTo('#menuDesktopRow0 .textPart', .5, {
    //     x: '-50%',
    //     opacity: 0, ease: Back.easeOut.config(1.7)
    // }, .1);

    // TweenLite.to('#burger', SIDE_BAR_SLIDE_TIME, {rotationZ: 0});

    burgerMorphReset();

    TweenLite.to('#menuLayout', SIDE_BAR_SLIDE_TIME, {

        x: 0, onComplete: function () {

            $('#burger').data('shown', false);
            sideBarActive = false;
        }
    });

    TweenLite.to('#menuSlider, .menuSlide', SIDE_BAR_SLIDE_TIME, {
        x: 0,
        onComplete: function () {

            $('#menuSlider, .menuSlide').css('transform', '');
            // $('html').css('overflow-y', 'auto');
        }
    });
}