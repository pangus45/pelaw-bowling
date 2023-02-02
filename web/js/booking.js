var KEY = 'AIzaSyDN6C96frpskjFXfW4GT6CxZ_2XhtA79XU';

var GREEN_ID = 'f00bb87e7f8da04abe45d139ece7387fb67d8626521c78590c72e6830e9f93bc@group.calendar.google.com';
var CLUBHOUSE_ID = 'db5812b2f4a67c74fa97a8deb43449d1148244e783d6e4edf4c261d66242a8fe@group.calendar.google.com';

// Tests
// var GREEN_ID = 'dfbc6322620568dfe2251643858ba206d44e81161a58ab8fafd928e48f2146e7@group.calendar.google.com';
// var CLUBHOUSE_ID = '3e7fb05d69bc98340a114176a276b3ebd232555d9c6459b40a9c2ea61c2cb7c4@group.calendar.google.com';

var FIRST_HOUR = 8;
var LAST_HOUR = 22;

$(document).ready(function () {

    calendarsInit();

    dateSelectorInit();

    formInit();

    // debugFormFill();
});


function dateSelectorInit() {

    var selector = $('#dateSelector');

    selector.change(function () {

        mobileCalendarGet().gotoDate(selector.val());
    });

    selector.css('display', 'block');

    $(window).scroll(function () {

        var toolbar = $('.mobileLayout').find('.fc-header-toolbar');

        selector.css('position', '');
        selector.css('top', '');

        toolbar.css('position', '');
        toolbar.css('top', '');
        toolbar.css('right', '');
        toolbar.css('padding', '');
        toolbar.css('border-bottom', '');

        mobileCalendarElementGet().css('margin-top', '');

        if (elementIsAboveViewport(selector, .03)) {

            mobileCalendarElementGet().css('margin-top', toolbar.outerHeight() * 2);

            selector.css('position', 'fixed');
            selector.css('top', '2px');

            toolbar.css('position', 'fixed');
            toolbar.css('top', '-2px');
            toolbar.css('right', '2px');
            toolbar.css('width', '100%');
            toolbar.css('padding', '1px');
            // toolbar.css('border-bottom', 'solid rgba(0,0,0,.1) 1px');

        }
    });
}


function mobileCalendarElementGet() {
    return $('.mobileLayout').find('.bookingCalendar');
}

function mobileCalendarGet() {

    return mobileCalendarElementGet().data('calendar');
}


function viewDatesChanged(pDateInfo) {

    dateSelectorUpdate(pDateInfo);
}


function dateSelectorUpdate(pDateInfo) {

    var year = FullCalendar.formatDate(pDateInfo.start, {year: 'numeric'});
    var month = FullCalendar.formatDate(pDateInfo.start, {month: '2-digit'});
    var day = FullCalendar.formatDate(pDateInfo.start, {day: '2-digit'});

    // alert(year + '-' + month + '-' + day);

    $('#dateSelector').val(year + '-' + month + '-' + day);
}


function debugFormFill() {

    $('#locationSelector').val('clubhouse');
    $('#organizationName').val('Joe Bloggs, Pelaw Society');
    $('#email').val('dev@positivemint.com');
    $('#phone').val('07930 123456');
    $('#reasonForBooking').val('We would like to practice bowling and some more space to test the big field');
}


function formInit() {

    var modal = $('#bookingFormModal');

    // modal.remove();
    //
    // $('body').append(modal);

    $('#bookingFormCancelButton').click(function () {

        gsap.to(modal, .2, {
            opacity: 0,
            onComplete: function () {
                modal.css('display', 'none');
            }
        });

        return false;
    });

    hoursOptionsFill('#bookingStartTimeHours');
    hoursOptionsFill('#bookingEndTimeHours');

    minsOptionsFill('#bookingStartTimeMins');
    minsOptionsFill('#bookingEndTimeMins');

    $('#bookingFormSubmitButton').click(function () {

        bookingFormSubmit();

        return false;
    });
}


function extraZerosAdd(pNumber) {

    if (0 == pNumber) {
        return '00';
    }

    return pNumber;
}

function bookingFormSubmit() {

    var data = {

        startTime: extraZerosAdd($('#bookingStartTimeHours').val()) + ':' + extraZerosAdd($('#bookingStartTimeMins').val()),
        endTime: extraZerosAdd($('#bookingEndTimeHours').val()) + ':' + extraZerosAdd($('#bookingEndTimeMins').val()),
        date: $('#bookingDay').text(),
        email: $('#email').val(),
        phone: $('#phone').val(),
        location: $('#locationSelector').val(),
        name: $('#organizationName').val(),
        reason: $('#reasonForBooking').val(),
        url: '32948rndjf9823rds',
    };

    $.post('/bookingRequest', data, function (pResponse) {

        if ('OK' == pResponse) {
            alert('Thanks. Your booking request has been received and we\'ll be in touch shortly');
        }
    });
}


function dateClicked(pInfo) {

    // alert('Clicked on: ' + pInfo.dateStr);

    // var endTime = JSON.parse(JSON.stringify(pInfo.start));

    var endTime = new Date(pInfo.date);

    endTime.setHours(pInfo.date.getHours() + 1)

    bookingFormPopupActivate(pInfo.date, endTime);

    // alert('Coordinates: ' + pInfo.jsEvent.pageX + ',' + info.jsEvent.pageY);
    // alert('Current view: ' + pInfo.view.type);
    // change the day's background color just for fun
    // info.dayEl.style.backgroundColor = 'red';
}

function dateSelected(pInfo) {

    // alert('From: ' + pInfo.startStr + ' to ' + pInfo.endStr);

    // alert('Coordinates: ' + pInfo.jsEvent.pageX + ',' + info.jsEvent.pageY);
    // alert('Current view: ' + pInfo.view.type);
    // change the day's background color just for fun
    // info.dayEl.style.backgroundColor = 'red';

    bookingFormPopupActivate(pInfo.start, pInfo.end);
}


function dateAMPMGet(pDate) {

    var hours = FullCalendar.formatDate(pDate, {
        hour: '2-digit'
    });

    return hours.split(" ")[1];
}


function dateHoursGet(pDate) {

    var hours = FullCalendar.formatDate(pDate, {
        hour: 'numeric',
        hour12: false
    });

    return hours;

    // return hours.split(" ")[0];
}

function dateMinsGet(pDate) {

    return FullCalendar.formatDate(pDate, {
        minute: '2-digit',
        hour12: false
    });
}


function hoursOptionsFill(pSelect) {

    for (var hour = FIRST_HOUR; hour <= LAST_HOUR; hour++) {

        if (hour < 10) {
            var hour = '0' + hour;
        }

        $('<option>').appendTo(pSelect).val(hour).text(hour);
    }
}


function minsOptionsFill(pSelect) {

    for (var min = 0; min <= 45; min += 30) {

        var option = $('<option>').appendTo(pSelect);

        option.val(min);

        if (0 == min) {
            option.text('00');
        } else {
            option.text(min);
        }
    }
}


function bookingFormPopupActivate(pStartTime, pEndTime) {

    var startHours = dateHoursGet(pStartTime);
    var startMins = dateMinsGet(pStartTime);

    var endHours = dateHoursGet(pEndTime);
    var endMins = dateMinsGet(pEndTime);

    $('#bookingStartTimeHours').val(startHours);
    $('#bookingStartTimeMins').val(startMins);
    $('#bookingEndTimeHours').val(endHours);
    $('#bookingEndTimeMins').val(endMins);

    $('#bookingDay').text(FullCalendar.formatDate(pStartTime, {
        day: 'numeric',
        month: 'long',
    }));

    var modal = $('#bookingFormModal');

    modal.css('display', 'flex');

    gsap.fromTo(modal, .2, {opacity: 0}, {opacity: 1});
}


function eventClicked(pEventInfo) {

    // pEventInfo.event.url

    pEventInfo.jsEvent.preventDefault();
}


function calendarsInit() {

    var bookingCalendars = $('.bookingCalendar');

    bookingCalendars.each(function () {

        var calendarElement = $(this);

        var options = {
            locale: 'en-gb',
            eventClick: eventClicked,
            datesSet: viewDatesChanged,
            // initialView: 'dayGridWeek',
            initialView: 'timeGridDay',
            // initialView: 'listWeek',
            contentHeight: 1000,
            expandRows: true,
            // height: 2000,
            slotMinTime: '0' + FIRST_HOUR + ':00:00',
            slotMaxTime: LAST_HOUR + ':00:00',
            nowIndicator: true,
            allDaySlot: false,
            googleCalendarApiKey: KEY,
            selectOverlap: true,
            eventSources: [
                {
                    googleCalendarId: GREEN_ID,
                    className: 'green'
                },
                {
                    googleCalendarId: CLUBHOUSE_ID,
                    className: 'clubHouse'
                }
            ]
        };

        if (elementIsInMobileLayout(calendarElement)) {

            options.selectable = false;
            options.dateClick = dateClicked;
            options.initialView = 'timeGridDay';

        } else {

            options.selectable = true;
            options.selectMirror = true;
            options.select = dateSelected;
            options.initialView = 'timeGridWeek';
        }

        var calendar = new FullCalendar.Calendar($(this)[0], options);

        calendarElement.data('calendar', calendar);

        calendar.render();
    });
}
