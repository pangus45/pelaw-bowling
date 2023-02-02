<?php

namespace AppBundle\Controller;

use AppBundle\Service\BookingManager;
use CommonBundle\Service\FormsHelper;
use CommonBundle\Service\Globals;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class BookingController extends Controller
{
    public function bookingAction(Request $pRequest, FormsHelper $pFormsHelper, BookingManager $pManager, Globals $pGlobals)
    {
        $startTime = $pRequest->get('startTime');
        $endTime = $pRequest->get('endTime');
        $date = $pRequest->get('date');
        $location = $pRequest->get('location');
        $name = $pRequest->get('name');
        $email = $pRequest->get('email');
        $phone = $pRequest->get('phone');
        $reason = $pRequest->get('reason');
        $dummy = $pRequest->get('url');

        if (
            is_null($startTime) ||
            is_null($endTime) ||
            is_null($date) ||
            is_null($location) ||
            is_null($name) ||
            is_null($email) ||
            is_null($phone) ||
            is_null($reason) ||
            $dummy != '32948rndjf9823rds'
        ) {

            return new Response('FAIL');
        }

        $data = [
            'startTime' => $startTime,
            'endTime' => $endTime,
            'date' => $date,
            'location' => $location,
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'reason' => $reason,
        ];

        $SUBJECT = 'Booking Request from ' . $name;

//        $SEND_TO = ['dev@positivemint.com'];
        $SEND_TO = ['pelawcbc55@gmail.com', 'dev@positivemint.com'];

        $pFormsHelper->lineLog(json_encode($data));

        $id = $pManager->bookingCreate($startTime, $endTime, $date, $location, $name, $email, $reason);

        if (!$id) {
            return new Response('');
        }

        $data['id'] = $id;
        $data['baseUrl'] = $pGlobals->baseUrlGet();

        if ('both' == $data['location']) {
            $data['location'] = 'Clubhouse + Bowling Green'; // stored as both in booking but better like this for email
        }

        $pFormsHelper->mailSend($data,
            $SEND_TO,
            'adminBookingEmail.html.twig',
            $email, $SUBJECT);

        return new Response('OK');
    }
}

