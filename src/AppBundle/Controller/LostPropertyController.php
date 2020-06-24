<?php

namespace AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

use AppBundle\Service\ContactForms;


class LostPropertyController extends Controller
{
    public function lostPropertyAction(ContactForms $pContactForms)
    {
        $data = $pContactForms->contactFormProcessAndGetData(true);

        // Doing this here allows us to make it only available on this page for now
        $data['blockSelector'] = array('lostPropertyForm' => 'Lost Property Form');

        return $this->render('@Common/defaultPage.html.twig', $data);
    }
}

