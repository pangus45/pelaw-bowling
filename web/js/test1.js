$(document).ready(function () {

    $('.rootRowWrapper').each(function () {

        hcRowParallaxCheck($(this));
    });
});


function hcRowParallaxCheck(pRowWrapper) {

    var classes = pRowWrapper.attr('class').split(" ");

    $.each(classes, function (pIndex, pClass) {

        if ('attachTo-' == pClass.substr(0, 9)) {

            var rowName = pClass.substr(9);

            var attachToRow = $('[data-row-name=' + rowName + ']');

            if (attachToRow.length > 0) {

                if (pRowWrapper.hasClass('backLayer')) {
                    hcBackLayerInit(pRowWrapper, attachToRow);
                } else {
                    hcRowScrollLayerInit(pRowWrapper, attachToRow);
                }
            }
        }
    });
}


function hcFixedRowInit(pRowToAttach, pTop) {

    pRowToAttach.css('position', 'fixed');
    pRowToAttach.css('width', '100%');
    pRowToAttach.css('top', pTop);
    // pRowToAttach.css('opacity', 0);
}


function hcBackLayerInit(pRowToAttach, pAttachToRow) {

    hcFixedRowInit(pRowToAttach, '50vh');

    hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow, true);

    rowLoadedCallbackRegister(function () {

        // will execute many times but should be prevented animating many
        // times by flags
        hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow);
    });

    $(window).scroll(function () {

        hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow);
    });
}



function rowToAttachFadeOut(pRowToAttach, pInit){

    if(pInit || pRowToAttach.data('fadedIn')){

        pRowToAttach.data('fadedIn', false);

        TweenMax.to(pRowToAttach, .3, {opacity: 0});
    }
}

function hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow, pInit) {

    var scrollTop = $(window).scrollTop();

    var attachedToRowTopWithMargin = elementTopRelativeToScreenGet(pAttachToRow, scrollTop, true);
    var attachedToRowTopWithoutMargin = elementTopRelativeToScreenGet(pAttachToRow, scrollTop, false);

    var rowToAttachY = fixedElementScreenYGet(pRowToAttach);

    l('attachedToRowTop', attachedToRowTopWithMargin);
    l('screenY ' + pRowToAttach.data('row-name'), fixedElementScreenYGet(pRowToAttach));
    // l('rowToAttachOffsetTop ' + pRowToAttach.data('row-name'), rowToAttachOffsetTop);

    var disappearBoundary = attachedToRowTopWithoutMargin + (pAttachToRow.height() * 0.5);

    if(rowToAttachY > disappearBoundary){

        rowToAttachFadeOut(pRowToAttach, pInit);
    }
    else if(attachedToRowTopWithMargin < $(window).height() * 0.66){

        // attachToRow top margin is now one third in view - fade in if not already

        if(pInit || !pRowToAttach.data('fadedIn')){

            pRowToAttach.data('fadedIn', true);

            TweenMax.to(pRowToAttach, .3, {opacity: 1});
        }
    }
    else{

        rowToAttachFadeOut(pRowToAttach, pInit);
    }

    // var halfAttachToRowHeight = pAttachToRow.height() / 2;
    //
    // var pxFromMiddleScrolled = halfScreenHeight - attachedToRowTop - halfAttachToRowHeight;
    //
    // var fractionOfScreenScrolled = pxFromMiddleScrolled / $(window).height();
    //
    // var abs = Math.abs(fractionOfScreenScrolled);
    //
    // var negativeOfFraction = 1 - abs;
    //
    // var opacity = negativeOfFraction;
    //
    // l(fractionOfScreenScrolled, opacity);

    // l('Setting opacity to ' + opacity);
    // pRowToAttach.css('opacity', opacity);
}


// function hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow) {
//
//     var scrollTop = $(window).scrollTop();
//
//     var attachedToRowTop = elementTopRelativeToScreenGet(pAttachToRow, scrollTop);
//
//     // var topMinusMargin = attachedToRowTop - parseFloat(pAttachToRow.css('margin-top'));
//
//     var halfScreenHeight = $(window).height() / 2;
//
//     var halfAttachToRowHeight = pAttachToRow.height() / 2;
//
//     var pxFromMiddleScrolled = halfScreenHeight - attachedToRowTop - halfAttachToRowHeight;
//
//     var fractionOfScreenScrolled = pxFromMiddleScrolled / $(window).height();
//
//     var abs = Math.abs(fractionOfScreenScrolled);
//
//     var negativeOfFraction = 1 - abs;
//
//     var opacity = negativeOfFraction;
//
//     l(fractionOfScreenScrolled, opacity);
//
//     l('Setting opacity to ' + opacity);
//     pRowToAttach.css('opacity', opacity);
// }


function hcRowScrollLayerInit(pRowToAttach, pAttachToRow) {

    hcFixedRowInit(pRowToAttach, 0);

    hcRowScrollLayerSet(pRowToAttach, pAttachToRow);
    hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow, true);

    rowLoadedCallbackRegister(function(){

        hcRowScrollLayerSet(pRowToAttach, pAttachToRow);
        hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow);
    });

    $(window).scroll(function () {

        hcRowScrollLayerSet(pRowToAttach, pAttachToRow);
        hcBackLayerOpacityUpdate(pRowToAttach, pAttachToRow);
    });
}


function hcRowScrollLayerSet(pRowToAttach, pAttachToRow) {

    var scrollTop = $(window).scrollTop();

    var attachedToRowTop = elementTopRelativeToScreenGet(pAttachToRow, scrollTop);

    // l(attachedToRowTop);

    var velocity = 1;
    var extraOffset = 0;

    if (pRowToAttach.hasClass('middleLayer')) {

        velocity = 1;
        extraOffset = 0;
    }

    var halfScreenHeight = $(window).height() / 2;

    var halfAttachToRowHeight = pAttachToRow.height() / 2;

    var pxFromMiddleScrolled = halfScreenHeight - attachedToRowTop - halfAttachToRowHeight;

    var fractionOfScreenScrolled = pxFromMiddleScrolled / $(window).height();
    var offset = fractionOfScreenScrolled * pRowToAttach.outerHeight() * velocity;

    TweenMax.set(pRowToAttach, {y: attachedToRowTop + offset + extraOffset});

    // pRowToAttach.data('yTranslate', data.yTranslation);

    // pRowToAttach.css('top', attachedToRowTop);
}