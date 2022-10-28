var KEY = 'AIzaSyDN6C96frpskjFXfW4GT6CxZ_2XhtA79XU';
var GREEN_ID = 'f00bb87e7f8da04abe45d139ece7387fb67d8626521c78590c72e6830e9f93bc@group.calendar.google.com';
var CLUBHOUSE_ID = 'db5812b2f4a67c74fa97a8deb43449d1148244e783d6e4edf4c261d66242a8fe@group.calendar.google.com';


$(document).ready(function () {

    calendarInit();

    formInit();
});


function formInit() {

    $('#bookingFormCancelButton').click(function () {

        var modal = $('#bookingFormModal');

        gsap.to(modal, .2, {
            opacity: 0,
            onComplete: function () {
                modal.css('display', 'none');
            }
        });

        return false;
    });
}

function dateClicked(pInfo) {

    alert('Clicked on: ' + pInfo.dateStr);

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

    var startDate = pInfo.start;
    var endDate = pInfo.end;

    $('#bookingStartTime').text(FullCalendar.formatDate(startDate, {
        hour: '2-digit',
        minute: '2-digit',
    }));

    $('#bookingEndTime').text(FullCalendar.formatDate(endDate, {
        hour: '2-digit',
        minute: '2-digit',
    }));

    $('#bookingDay').text(FullCalendar.formatDate(startDate, {
        day: 'numeric',
        month: 'long',
    }));

    var modal = $('#bookingFormModal');

    modal.css('display', 'flex');

    gsap.fromTo(modal, .2, {opacity: 0}, {opacity: 1});
}

function calendarInit() {

    var calendarEl = $('#calendar');

    var calendar = new FullCalendar.Calendar(calendarEl[0], {
        // initialView: 'dayGridWeek',
        initialView: 'timeGridWeek',
        // initialView: 'listWeek',
        contentHeight: 'auto',
        slotMinTime: '07:00:00',
        slotMaxTime: '22:00:00',
        nowIndicator: true,
        allDaySlot: false,
        googleCalendarApiKey: KEY,
        // dateClick: dateClicked,
        select: dateSelected,
        selectable: true,
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
    });

    calendar.render();
}
