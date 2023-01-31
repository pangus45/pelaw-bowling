<?php

namespace AppBundle\Controller;

use AppBundle\Service\BookingManager;
use CommonBundle\Service\FormsHelper;
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
            return $this->render('bookingConfirmation.html.twig');
        }

        if (!$booking->confirmed && $pRequest->get('confirm') == $bookingId) {

            $calendar = $this->bookingAddToCalendar($booking);

            if ($calendar) {
                $booking->confirmed = true;
                $pManager->bookingSave($booking);
            }
        }

//        $link = $calendar->htmlLink;

//        if ($link) {
//            return new Response('Created at <a href="' . $link . '" >' . $link . ' </a>');
//        }

//        $description = $calendar->getSummary();

//        return new Response('FAIL', ['bookingLink' => $link]);

        return $this->render('bookingConfirmation.html.twig', ['booking' => $booking]);
    }

    function bookingAddToCalendar($pBooking)
    {
        $KEY = 'AIzaSyDN6C96frpskjFXfW4GT6CxZ_2XhtA79XU';
        $GREEN_ID = 'f00bb87e7f8da04abe45d139ece7387fb67d8626521c78590c72e6830e9f93bc@group.calendar.google.com';
        $CLUBHOUSE_ID = 'db5812b2f4a67c74fa97a8deb43449d1148244e783d6e4edf4c261d66242a8fe@group.calendar.google.com';
        $TEST_ID = '3e7fb05d69bc98340a114176a276b3ebd232555d9c6459b40a9c2ea61c2cb7c4@group.calendar.google.com';

        $client = new Client();
        $client->useApplicationDefaultCredentials();

        putenv('GOOGLE_APPLICATION_CREDENTIALS=/home/paul/sites/pb/src/AppBundle/pelaw-bowling-temp-a39e3feca0fe.json');

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

        $event->setDescription('Test Description');
        $event->setSummary('Test Summary');
//
        $eventStart = new Calendar\EventDateTime();
        $eventStart->setTimeZone($TIMEZONE);
        $eventStart->setDateTime($startDateTime->format('c'));

        $eventEnd = new Calendar\EventDateTime();
        $eventEnd->setTimeZone($TIMEZONE);
        $eventEnd->setDateTime($endDateTime->format('c'));

        $event->setStart($eventStart);
        $event->setEnd($eventEnd);

        $calendar = $service->events->insert($TEST_ID, $event);

        return $calendar;
    }
}

