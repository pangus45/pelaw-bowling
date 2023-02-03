<?php

namespace AppBundle\Controller;

use AppBundle\Service\BookingManager;
use CommonBundle\Service\FormsHelper;
use CommonBundle\Service\Globals;
use Google\Client;
use Google\Service\Appengine\RepairApplicationRequest;
use Google\Service\Calendar;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class BookingConfirmController extends Controller
{
    public function bookingConfirmAction(Request $pRequest, BookingManager $pManager)
    {
        // example
        // https://stackoverflow.com/questions/70155451/php-google-service-account-auth-calendar-api

        $bookingId = $pRequest->get('id');

        if (!$bookingId) {
            return $this->render('bookingConfirmation.html.twig');
        }

        $booking = $pManager->bookingGet($bookingId);

        if (!$booking) {
            return $this->redirectToRoute('home');
        }

        if ('both' == $booking->location) {
            $booking->location = 'Clubhouse + Bowling Green'; // stored as both in booking but better like this for email
        } else {
            $booking->location = ucfirst($booking->location); // stored as both in booking but better like this for email
        }

//        $description = $calendar->getSummary();

        return $this->render('bookingConfirmation.html.twig', ['booking' => $booking]);
    }


    public function bookingPostAction(Request $pRequest, BookingManager $pManager, Globals $pGlobals, FormsHelper $pFormsHelper)
    {
        $summary = $pRequest->get('summary');
        $id = $pRequest->get('id');

        if (is_null($summary) || is_null($id)) {
            return new Response('');
        }

        $booking = $pManager->bookingGet($id);

        if (!$booking) {
            return new Response('');
        }

        $booking->summary = $summary;

        $success = $this->bookingAddToCalendars($booking, $pGlobals);

        if ($success) {
            $booking->confirmed = true;
            $pManager->bookingSave($booking);

            $this->userEmailSend($booking, $pFormsHelper);

            return new Response('OK');
        }

        return new Response('');
    }


    function userEmailSend($pBooking, FormsHelper $pFormsHelper)
    {
        $pFormsHelper->lineLog(json_encode($pBooking));

        if ('both' == $pBooking->location) {
            $pBooking->location = 'Clubhouse + Bowling Green'; // stored as both in booking but better like this for email
        }

        $SUBJECT = 'Booking Confirmed at Pelaw Community Bowling Club - ' . ucfirst($pBooking->location);

//        $SEND_TO = ['dev@positivemint.com', $pBooking->email];
        $SEND_TO = [$pBooking->email, 'dev@positivemint.com'];

        $REPLY_TO = 'pelawcbc55@gmail.com';

        if ($SEND_TO[0] == $SEND_TO[1]) {
            array_pop($SEND_TO);
        }

        $pFormsHelper->mailSend(json_decode(json_encode($pBooking), true),
            $SEND_TO,
            'userBookingEmail.html.twig',
            $REPLY_TO, $SUBJECT);
    }

    function bookingAddToCalendars(&$pBooking, Globals $pGlobals)
    {
        if ('clubhouse' == $pBooking->location) {

            return $this->bookingAddToCalendar('clubhouse', $pBooking, $pGlobals);

        } else if ('green' == $pBooking->location) { // green

            return $this->bookingAddToCalendar('green', $pBooking, $pGlobals);

        } else if ('both' == $pBooking->location) {

            if ($this->bookingAddToCalendar('clubhouse', $pBooking, $pGlobals) &&
                $this->bookingAddToCalendar('green', $pBooking, $pGlobals)) {

                return true;
            }
        }

        return false;
    }

    function bookingAddToCalendar($pLocation, $pBooking, Globals $pGlobals)
    {
        $GREEN_ID = 'f00bb87e7f8da04abe45d139ece7387fb67d8626521c78590c72e6830e9f93bc@group.calendar.google.com';
        $CLUBHOUSE_ID = 'db5812b2f4a67c74fa97a8deb43449d1148244e783d6e4edf4c261d66242a8fe@group.calendar.google.com';
//        $GREEN_TEST_ID = 'dfbc6322620568dfe2251643858ba206d44e81161a58ab8fafd928e48f2146e7@group.calendar.google.com';
//        $CLUBHOUSE_TEST_ID = '3e7fb05d69bc98340a114176a276b3ebd232555d9c6459b40a9c2ea61c2cb7c4@group.calendar.google.com';

        $calendarId = 'green' == $pLocation ? $GREEN_ID : $CLUBHOUSE_ID;
//        $calendarId = 'green' == $pLocation ? $GREEN_TEST_ID : $CLUBHOUSE_TEST_ID;

        $client = new Client();
        $client->useApplicationDefaultCredentials();

        $JSON_KEY_FILE = $pGlobals->projectRootGet() . '/src/AppBundle/pelaw-bowling-temp-a39e3feca0fe.json';
        putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $JSON_KEY_FILE);

//        $client->addScope(Calendar::CALENDAR);
        $client->addScope(Calendar::CALENDAR_EVENTS);

        $client->setSubject('pelaw-bowling-service-account@pelaw-bowling-temp.iam.gserviceaccount.com');

        $service = new Calendar($client);

        $event = new Calendar\Event();

        $TIMEZONE = 'Europe/London';

        $startParts = explode(':', $pBooking->startTime);
        $endParts = explode(':', $pBooking->endTime);

        $startDateTime = new \DateTime();
        $startDateTime->setTime($startParts[0], $startParts[1]);

        $endDateTime = new \DateTime();
        $endDateTime->setTime($endParts[0], $endParts[1]);

//        $event->setDescription('Test Description');
        $event->setSummary($pBooking->summary);
//
        $eventStart = new Calendar\EventDateTime();
        $eventStart->setTimeZone($TIMEZONE);
        $eventStart->setDateTime($startDateTime->format('c'));

        $eventEnd = new Calendar\EventDateTime();
        $eventEnd->setTimeZone($TIMEZONE);
        $eventEnd->setDateTime($endDateTime->format('c'));

        $event->setStart($eventStart);
        $event->setEnd($eventEnd);

        $event = $service->events->insert($calendarId, $event);

        if ($event) {
            $pBooking->eventIDs->{$pLocation} = $event->id;
            return true;
        }

        return false;
    }
}

