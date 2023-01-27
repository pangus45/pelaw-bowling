<?php

namespace AppBundle\Controller;

use CommonBundle\Service\FormsHelper;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class BookingController extends Controller
{
    public function bookingAction(Request $pRequest, FormsHelper $pFormsHelper)
    {
        $startTime = $pRequest->get('startTime');
        $endTime = $pRequest->get('endTime');
        $date = $pRequest->get('date');
        $location = $pRequest->get('location');
        $name = $pRequest->get('name');
        $email = $pRequest->get('email');
        $reason = $pRequest->get('reason');
        $dummy = $pRequest->get('url');

        if (
            is_null($startTime) ||
            is_null($endTime) ||
            is_null($date) ||
            is_null($location) ||
            is_null($name) ||
            is_null($email) ||
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
            'reason' => $reason,
        ];

        $SUBJECT = 'Booking Request from ' . $name;

        $pFormsHelper->lineLog(json_encode($data));

        $pFormsHelper->mailSend($data,
            ['dev@positivemint.com'],
            'bookingEmail.html.twig',
            $email, $SUBJECT);

        return new Response('OK');
    }
}

