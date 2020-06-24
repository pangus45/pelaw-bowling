<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;


class ContactController extends Controller
{
    public function contactAction(ContactForms $pContactForms)
    {
        $data = $pContactForms->contactFormProcessAndGetData();

        // Doing this here allows us to make it only available on this page for now
        $data['blockSelector'] = array('contactForm' => 'Contact Form');

        return $this->render('@Common/defaultPage.html.twig', $data);
    }
}

