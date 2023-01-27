<?php

namespace AppBundle\Controller;

use CommonBundle\Service\FormsHelper;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;


class BookingConfirmController extends Controller
{
    public function bookingConfirmAction(Request $pRequest)
    {
        return $this->render('bookingConfirmation.html.twig');
    }
}

