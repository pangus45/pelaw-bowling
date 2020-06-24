var gMobileMenuOut = false;
var gMENU_SLIDE_TIME = 0.5;

// var gTOP_BAR_ANIM_TIME = .5;

var gSliding = false;
var gOriginalOverlay = null;

$(document).ready(function () {

    $(window).resize(topBarResizeResponse);

    // topBarResizeResponse();

    gOriginalOverlay = $('#dropdownOverlay').clone();

    mobileToggleButtonInit();

    topBarDropDownTogglesInit();

    topBarScrollInit();

    topBarLinkUnderlinesInit();

    // findMorphOrigin("#wiggleBar", "#straightBar", {showLines:true});
});


function topBarLinkUnderlinesInit() {

    var underlineSVGClone = $('#topBarLinkUnderlineTemplate').clone();

    var underlineLinks = $('.topBarLink:not(#loginLink)');

    underlineLinks.each(function () {

        var link = $(this);

        var underline = underlineSVGClone.clone();

        link.data('underline', underline);

        underline.addClass('topBarLinkUnderline');
        underline.show();
        underline.attr('id', '');

        var path = underline.find('path');

        // TweenMax.to(path, 0, {drawSVG: "0%"});

        $(document.body).append(underline);

        underline.css('display', 'none');
    });

    underlineLinks.hover(function () {

        var link = $(this);

        linkUnderlineHoverStart(link);

    }, function () {

        var link = $(this);

        linkUnderlineRemove(link);
    });

    driveRolloverCheck();
}


function underlineLinksGet() {

    return $('.topBarLink:not(#loginLink)');
}


function linkUnderlineHoverStart(pLink) {

    if (sideBarActive) {
        return;
    }

    if (pLink.hasClass('active')) {
        return;
    }

    // linkUnderlineTimelineKill(pLink);

    var underlineLinks = underlineLinksGet();

    var underline = pLink.data('underline');

    var leftPadding = parseInt(pLink.css('padding-left'));

    // position every time rather than init as fonts may still be loading and positions will be off
    underline.css('position', 'fixed');
    underline.css('top', pLink.position().top + pLink.height());
    underline.css('left', pLink.offset().left + leftPadding - 3);

    l('Offset: ' + pLink.offset().top + ', Pos: ' + pLink.position().top);

    if ('locationLink' == pLink.attr('id')) {
        underline.css('width', pLink.width() + 5);
    } else {
        underline.css('width', pLink.width() + 2);
    }

    underline.addClass('menuSlide');

    var line = underline.find('line');

    // line.css('opacity', 0);

    var oldTimeline = underline.data('timeline');

    if (oldTimeline) {
        oldTimeline.kill();
    }

    line.parent().css('display', 'block');

    gsap.set(line, {drawSVG: '50% 50%', opacity: 1});

    var timeline = new TimelineMax();

    timeline.to(line, 0.5, {drawSVG: '0% 100%', opacity: 1});

    var subTimeline = new TimelineMax({
        repeat: -1,
        // yoyo: true,

    });

    subTimeline.to(line, .5, {drawSVG: '15% 85%'});
    subTimeline.to(line, .5, {drawSVG: '0% 100%'});

    timeline.add(subTimeline);

    underline.data('timeline', timeline);

    // remove others

    underlineLinks.each(function () {

        if (pLink[0] != this) {

            linkUnderlineRemove($(this));
        }
    });
}


function linkUnderlineRemove(pLink) {

    if (pLink.hasClass('active')) {
        return;
    }

    var data = topBarLinkDataGet(pLink);

    if (data.path) {

        linkUnderlineTimelineKill(pLink);

        var timeline = gsap.timeline();

        timeline.to(data.path, .5, {
            drawSVG: "50% 50%", onComplete: function () {

                // data.underline.css('display', 'none');
            }
        });

        timeline.to(data.path, .2, {opacity: 0}, '-=.2');
    }
}


function topBarLinkDataGet(pLink) {

    var data = {
        underline: null, path: null, timeline: null
    };

    data.underline = pLink.data('underline');

    if (data.underline) {

        data.timeline = data.underline.data('timeline');

        data.path = data.underline.find('line');
    }

    return data;
}


function topBarResizeResponse() {

    // $('#dropdownOverlay').replaceWith(gOriginalOverlay);

    // topBarDropDownTogglesInit();
}


function driveRolloverCheck() {

    return; // for now

    if ('careers' == $('html').attr('id')) {

        var link = $('#careersLink');

        link.addClass('active');

        linkUnderlineHoverStart(link);
    }
}


var TOPBAR_SCROLL_THRESHOLD = 100;

var gTopBarWiggly = true;
var gTopBarAnimating = false;

function topBarScrollResponse() {

    if (gTopBarAnimating) {

        // allow animation to complete - but onComplete action makes sure we check again when done
        return;
    }

    var scrollTop = $(window).scrollTop();

    // l(scrollTop);

    if (scrollTop > TOPBAR_SCROLL_THRESHOLD) {

        if (gTopBarWiggly) {

            var timeline = new TimelineMax({
                onComplete: function () {

                    gTopBarAnimating = false;
                    topBarScrollResponse();
                }
            });

            timeline.to('#wiggleBar', .5, {
                morphSVG: {
                    shape: '#straightBar'
                }, ease: Back.easeInOut.config(2)
            }, 0);

            timeline.to('#mainLogo', .5, {y: -150, opacity: 0, ease: Back.easeIn.config(1)}, 0);

            timeline.to('#secondLogo', .5, {opacity: 1, y: '0%'}, .6);

            gTopBarWiggly = false;
            gTopBarAnimating = true;
        }
    } else {

        if (!gTopBarWiggly) {

            var timeline = new TimelineMax({
                onComplete: function () {

                    gTopBarAnimating = false;
                    topBarScrollResponse();
                }
            });

            timeline.to('#secondLogo', .5, {opacity: 0, y: '-100%'}, 0);

            timeline.to('#wiggleBar', .5, {
                morphSVG: {
                    shape: '#wiggleBar'
                }, ease: Back.easeInOut.config(2)
            }, 0);

            timeline.to('#mainLogo', .5, {y: 0, opacity: 1}, .3);

            gTopBarWiggly = true;
            gTopBarAnimating = true;
        }
    }
}


function topBarScrollInit() {

    $(document).scroll(topBarScrollResponse);

    topBarScrollResponse();
}


function linkUnderlineTimelineKill(pLink) {

    var data = topBarLinkDataGet(pLink);

    if (data.timeline) {
        data.timeline.kill();
    }
}


function dropdownOverlayActivate(pLink) {

    $('.topBarLink').removeClass('active');

    underlineLinksGet().each(function () {

        if (pLink[0] != this) {
            linkUnderlineRemove($(this));
        }
    });

    var data = topBarLinkDataGet(pLink);

    if (data.path) {

        linkUnderlineTimelineKill(pLink);

        TweenMax.to(data.path, .2, {drawSVG: '100%', opacity: 1});
    }

    pLink.addClass('active');

    var overlay = $('#dropdownOverlay');

    overlay.show();

    TweenMax.to(overlay, .5, {opacity: 0.95});

    $('.overlaySection').hide();

    var dropdown = overlaySectionGetForLink(pLink);

    dropdown.show();

    var links = dropdown.data('proxies');

    var id = pLink.attr('id');

    if ('bookLink' == id) {

        TweenMax.from(links.eq(0), .5, {opacity: 0, y: -300});
        TweenMax.from(links.eq(1), .5, {opacity: 0, scale: 0});
        TweenMax.from(links.eq(2), .5, {opacity: 0, x: -300});
        TweenMax.from(links.eq(3), .5, {opacity: 0, y: 300});
        TweenMax.from(links.eq(4), .5, {opacity: 0, x: 300});

    } else if ('locationLink' == id) {

        TweenMax.from(links.eq(0), .5, {opacity: 0, y: -300});
        TweenMax.from(links.eq(1), .5, {opacity: 0, scale: 0});
        TweenMax.from(links.eq(2), .5, {opacity: 0, scale: 0});
        TweenMax.from(links.eq(3), .5, {opacity: 0, y: 300});

    } else if ('loginLink' == id) {

        TweenMax.from(links.eq(0), .5, {opacity: 0, y: -300});
        TweenMax.from(links.eq(1), .5, {opacity: 0, y: 300});
    }

    TweenMax.from(dropdown.find('.closeLink'), .5, {opacity: 0, opacity: 0, delay: 0.5});
}


function overlaySectionGetForLink(pLink) {

    var linkId = pLink.attr('id');

    return $('#' + linkId + 'OverlaySection');
}


function dropdownOverlayDeactivate() {

    $('.topBarLink').removeClass('active');

    underlineLinksGet().each(function () {

        linkUnderlineRemove($(this));
    });

    var overlay = $('#dropdownOverlay');

    TweenMax.to('#dropdownOverlay', .5, {
        opacity: 0, onComplete: function () {

            $('.overlaySection').hide();

            driveRolloverCheck();
        }
    });
}


function closeLinksInit() {

    $('.closeLink').click(function () {

        dropdownOverlayDeactivate();
        gCurrentOverlayLink = null;

    });
}


var gCurrentOverlayLink = null;


function topBarDropDownTogglesInit() {

    $('.topBarDropDownLink').click(function () {

        var link = $(this);

        if (this == gCurrentOverlayLink) {

            dropdownOverlayDeactivate();
            gCurrentOverlayLink = null;

        } else {

            dropdownOverlayActivate(link);
            gCurrentOverlayLink = this;
        }
    });

    var proxyLinks = $();
    var clonedChildren = $();

    // create fixed position proxies for all the links as this makes scaling smoother
    $('.overlaySection').each(function () {

            var section = $(this);

            section.show();

            var children = section.children();

            var proxyLinks = $();
            var clonedChildren = $();

            children.each(function () {

                var child = $(this);

                var clone = child.clone();

                // if (!child.hasClass('closeLink')) {
                clone.css('position', 'fixed');
                clone.css('top', child.position().top);
                // }

                clonedChildren = clonedChildren.add(clone);

                var cloneAndDescendants = clone.add(clone.find('*'));

                cloneAndDescendants.each(function () {

                    var element = $(this);

                    if (element.is('.overlayLink')) {
                        proxyLinks = proxyLinks.add(element);
                    }
                });
            });

            section.append(clonedChildren);

            children.hide(); // can't do this as we go because it will affect position

            section.hide();

            section.data('proxies', proxyLinks);

            proxyLinks.hover(function () {

                var proxy = $(this);

                proxyLinks.removeClass('over');

                proxy.addClass('over');

                linksHoverUpdate(proxyLinks);

            }, function () {

                proxyLinks.removeClass('over');

                linksHoverUpdate(proxyLinks);
            });
        }
    );

    $('#dropdownOverlay').hide(); // afterwards as not to upset positions

    closeLinksInit();
}


function linksHoverUpdate(pLinks) {

    pLinks.each(function () {

        var link = $(this);

        if (link.hasClass('over')) {

            if ('big' != link.data('state')) {

                existingTweenKill(link);

                var tween = TweenMax.to(link, 0.1, {scale: 1.2});

                link.data('state', 'big');
                link.data('tween', tween);
            }
        } else {

            if ('small' != link.data('state')) {

                existingTweenKill(link);

                var tween = TweenMax.to(link, 0.5, {scale: 1});

                link.data('state', 'small');
                link.data('tween', tween);
            }
        }
    });
}


function existingTweenKill(pLink) {

    var existingTween = pLink.data('tween');

    if (existingTween) {
        existingTween.kill();
    }
}


function topBarDropDownShow(pLink) {

    var dropDown = topBarDropDownGetFromLink(pLink);

    var down = dropDown.data('down');

    if (!down) {

        var originalHeight = dropDown.data('originalHeight');

        // dropDown.css('visibility', 'visible');
        // dropDown.css('opacity', 1);
        dropDown.css('height', originalHeight);
        dropDown.data('down', true);
        pLink.addClass('active');
    }
}


function topBarDropDownHide(pLink) {

    var dropDown = topBarDropDownGetFromLink(pLink);

    var down = dropDown.data('down');

    if (down) {

        // dropDown.css('visibility', 'hidden');
        // dropDown.css('opacity', 0);
        dropDown.css('height', 0);
        dropDown.data('down', false);
        pLink.removeClass('active');
    }
}


function topBarDropDownGetFromLink(link) {

    var dropDownId = link.attr('id') + 'DropDown';

    return $('#' + dropDownId);
}


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

// function mobileMenuIsActive() {
//
//     return 'left' == $('#mobileTopBarMediaCheck').css('float');
// }

// function topBarResizeResponse() {
//
//     if(!mobileMenuIsActive()){
//
//         var slideElement = $('#menuSlider');
//
//         slideElement.css('margin-top', 0);
//
//         gMobileMenuOut = false;
//     }
// }




