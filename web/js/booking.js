var KEY = 'AIzaSyDN6C96frpskjFXfW4GT6CxZ_2XhtA79XU';
var GREEN_ID = 'pelawcbc55@gmail.com';
var CLUBHOUSE_ID = 'a806e059165f4cbebd629961b4e0e7c25c08817c2c42f5b44ef44e5e4e269866@group.calendar.google.com';


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
