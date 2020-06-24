// will count anything on page with class number
function pinballNumberCounterInit() {

    numberCountStartCheck();

    $(document).scroll(function () {

        numberCountStartCheck();
    });

    $(window).resize(function () {
        numberCountStartCheck();
    });
}

function numberCountStartCheck() {

    $('.counter').each(function () {

        var numberElement = $(this);

        if (!numberElement.data('animDone')) {

            if (numberCounterIsInView(numberElement)) {

                numberElement.data('animDone', true);
                numberCountStart(numberElement);
            }
        }
    });
}

function numberCounterIsInView(pElement) {

    var windowHeight = $(window).height();

    // var lastNumberLabel = $('.counterLabel').last();

    var OFFSET = 20;

    var elementBottom = pElement.offset().top + pElement.outerHeight() - OFFSET;

    if ($(document).scrollTop() + windowHeight > elementBottom) {

        return true;
    }
}

function numberCountStart(pElement) {

    var targetNumber = parseInt(pElement.data('number'));

    pElement.text('0');
    pElement.css('visibility', 'visible');

    var incrementPerMs = targetNumber / NUMBER_COUNT_TIME_MS;

    // l('increment per ms: ' + incrementPerMs);

    showNumber(pElement, targetNumber, incrementPerMs);
}

function showNumber(pElement, pMax, pIncrementPerMs, pLastNumber, pLastTime) {

    // l(pLastNumber);

    setTimeout(function () {

        pLastNumber = pLastNumber || 0;

        numberTextSet(pElement, pLastNumber);

        var currentTime = timeGet();

        pLastTime = pLastTime || currentTime;

        var timeElapsed = currentTime - pLastTime;

        var newNumber = pLastNumber + (timeElapsed * pIncrementPerMs * (.5 + Math.random()));

        if (newNumber >= pMax) {

            numberTextSet(pElement, pMax);

            return;
        }

        showNumber(pElement, pMax, pIncrementPerMs, newNumber, currentTime);

    }, 0);
}

function numberTextSet(pElement, pNumber) {

    // l(pNumber);

    var roundedNumber = parseInt(pNumber);

    var numberText = roundedNumber.toString();

    var counter = 3;

    var textWithCommas = '';

    for (var i in numberText) {

        var characterIndex = numberText.length - i - 1;

        var character = numberText[characterIndex];

        textWithCommas = character + textWithCommas;

        counter--;

        if (0 == counter && 0 != characterIndex) {
            textWithCommas = ',' + textWithCommas;
            counter = 3;
        }
    }

    pElement.text(textWithCommas);
}