// TURN OFF USE_OPTIMIZED_IMAGES WHILE SAMPLING IMAGE SIZES!!!

var gOptimizerImages = {};

var OPTIMIZER_MIN_SCREEN_WIDTH = 400;
var OPTIMIZER_MIN_SCREEN_HEIGHT = 400;

$(document).ready(function () {

    // for(var widthRangeTop = 500; widthRangeTop <= 2000; widthRangeTop+=500){
    //
    //     if(widthRangeTop > width){
    //         break;
    //     }
    // }
    //
    // for(var heightRangeTop = 500; heightRangeTop <= 2000; heightRangeTop+=500){
    //
    //     if(heightRangeTop > height){
    //         break;
    //     }
    // }

    setTimeout(function(){

        // let images load before starting
        setInterval(imagesSizeSample, 1000);

    }, 5000);

    $(document).keydown(imageOptimzerKeyPressResponse);
});

function imageOptimzerKeyPressResponse(pEvent){

    var key = pEvent.which;

    var S_KEY = 83;

    if(S_KEY == key){
        samplesLog();
    }
}

// function sizeCategoryGet(){
//
//     // want to split up the screen sizes but also respecting that different images are loaded for mobile,tablet,desktop etc.
//     var screenSize = screenSizeGet();
//
//     var width = $(window).width();
//     var height = $(window).height();
//
//     for(var widthRangeTop = 500; widthRangeTop <= 2000; widthRangeTop+=500){
//
//         if(widthRangeTop > width){
//             break;
//         }
//     }
//
//     for(var heightRangeTop = 500; heightRangeTop <= 2000; heightRangeTop+=500){
//
//         if(heightRangeTop > height){
//             break;
//         }
//     }
//
//     return [screenSize, widthRangeTop, heightRangeTop].join('-');
// }

function imagesSizeSample() {

    $('body img').each(function () {

        var element = $(this);

        if (!element.is('[src]')) {

            // l('No source');
            // l(element.parent().html());
            return true;
        }

        var url = $(this).attr('src');

        elementDimensionsLog(url, element);
    });

    var backgroundImages = $('*').filter(function () {

        return 'none' != $(this).css('background-image');
    });

    backgroundImages.each(function () {

        // may want to check background-size too but would be minimal gains at the mo
        var element = $(this);

        var url = backgroundImageUrlGet(element);

        elementDimensionsLog(url, element);
    });
}

function elementDimensionsLog(pUrl, pElement) {

    // loaded flag check here excludes any images that don't use loader - not sure this is what we want
    if (-1 != pUrl.indexOf('.svg') || !pElement.data('loaded')) {

        // svgs don't need shrunk
        return;
    }

    // only images loaded with image loaded have specified their screen size
    // other images assumed to be shown on all devices
    var screenData = pElement.data('screen');

    // var screenSize = screenSizeGet();

    if('all' != screenData && undefined != screenData && pElement.data('screen') != screenSizeGet()){

        // l(pElement.data('screen') + ': rejected : ' + pUrl);
        return;
    }

    if(screenWidthGet() < OPTIMIZER_MIN_SCREEN_WIDTH){
        return;
    }

    if(screenHeightGet() < OPTIMIZER_MIN_SCREEN_HEIGHT){
        return;
    }

    if(undefined == screenData){

        if(-1 != pUrl.indexOf('home6')){
            l('home6 should have screen data!!!');
        }

        l('setting screen data to all!!!');
        screenData = 'all';
    }

    if(-1 != pUrl.indexOf('images_production/')){
        alert('Turn off production images to use optimizer');
    }

    var imagesPos = pUrl.indexOf('images/');

    var relativePathStart = imagesPos + 'images/'.length;

    var relativeUrl = pUrl.substr(relativePathStart);

    var width = pElement.width();
    var height = pElement.height();

    if (width <= 0 || height <= 0) {

        // l('bad width or height: ' + url);
        return true;
    }

    if(!(screenSizeGet() in gOptimizerImages)){
        gOptimizerImages[screenSizeGet()] = {};
    }

    if (!(relativeUrl in gOptimizerImages[screenSizeGet()])) {

        l('Optimizer - new image found : ' + screenSizeGet() + ' : ' + relativeUrl);
        gOptimizerImages[screenSizeGet()][relativeUrl] = {
            minWidth: width,
            maxWidth: width,
            minHeight: height,
            maxHeight: height
        };
    }
    else {

        var data = gOptimizerImages[screenSizeGet()][relativeUrl];

        data.minWidth = Math.min(data.minWidth, width);
        data.minHeight = Math.min(data.minHeight, height);
        data.maxWidth = Math.max(data.maxWidth, width);
        data.maxHeight = Math.max(data.maxHeight, height);

        gOptimizerImages[screenSizeGet()][relativeUrl] = data;
    }
}

function samplesLog() {

    l('------------------------------------------------');
    $.each(gOptimizerImages, function (pSizeCategory, pSizeCategoryData) {
        $.each(pSizeCategoryData, function(pUrl, pImageData){

            var dimensions = [pImageData.minWidth, pImageData.minHeight, pImageData.maxWidth, pImageData.maxHeight];

            l(pUrl + ': ' + dimensions.join(','));
        });
    });
    l('------------------------------------------------');

    var data = {};

    $.each(gOptimizerImages, function(pSizeCategory, pSizeCategoryData) {

        data[pSizeCategory] = [];

        $.each(pSizeCategoryData, function (pUrl, pImageData) {

            var imageData = {
                url: pUrl,
                minWidth: pImageData.minWidth,
                minHeight: pImageData.minHeight,
                maxWidth: pImageData.maxWidth,
                maxHeight: pImageData.maxHeight
            };

            data[pSizeCategory].push(imageData);
        });
    });

    // $.each(gOptimizerImages, function (pUrl, pData) {
    //
    //     var imageData = {
    //         url: pUrl,
    //         minWidth: pData.minWidth,
    //         minHeight: pData.minHeight,
    //         maxWidth: pData.maxWidth,
    //         maxHeight: pData.maxHeight
    //     }
    //
    //     data.push(imageData);
    // });

    var url = gBaseUrl + 'image-samples-store/';

    $.post(url, {images: data, page: gPageId}, function(){ alert('image sizes saved')});
}