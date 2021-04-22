<?php

namespace AppBundle\Service;

use Psr\Log\LoggerInterface;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Form\Forms;

use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\TelType;

//use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

use Symfony\Component\Form\Extension\Validator\ValidatorExtension;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;

use Symfony\Component\Translation\TranslatorInterface;
use Symfony\Component\HttpFoundation\RequestStack;

use CommonBundle\Service\Globals;

use CommonBundle\Service\FormsHelper;


class ContactForms
{
    private $translator;
    private $request;
    private $formsHelper;
    private $pageId;

    public function __construct(Globals $pGlobals, TranslatorInterface $pTranslator, RequestStack $pRequestStack, FormsHelper $pFormsHelper)
    {
        $this->translator = $pTranslator;
        $this->request = $pRequestStack->getCurrentRequest();
        $this->formsHelper = $pFormsHelper;
        $this->pageID = $pGlobals->getPageId();

//        $this->request->getBaseUrl();
//
//        $url = $this->request->getRequestUri();
//        // If there's issues with the page id, then getting requests this way will be the issue
    }

    public function contactFormProcessAndGetData()
    {
        $desktopForm = $this->formCreate('desktopContact');
        $mobileForm = $this->formCreate('mobileContact');

        $desktopSuccess = $this->submissionProcessAndSendEmail('desktop', $desktopForm);
        $mobileSuccess = $this->submissionProcessAndSendEmail('mobile', $mobileForm);

        $success = $desktopSuccess || $mobileSuccess;
//        $success = false; // temp for dev

        // if it's a post, the layout service looks for the page id in the form instead
        // Don't know if this is still necessary???
        $this->request->request->set('pageId', $this->pageID);

        $blocks = array(
            'desktop-contactForm' => $desktopForm->createView(),
            'mobile-contactForm' => $mobileForm->createView()
        );

        return array('success' => $success, 'controllerBlocks' => $blocks);
    }

    private function formCreate($pName)
    {
        $inputs = [];

        // Your Details
        $inputs['subject'] = [
            'placeholder' => 'Subject',
            'maxLength' => 30,
        ];

        $inputs['name'] = [
            'maxLength' => 40,
            'placeholder' => 'Name'
        ];

        $inputs['email'] = [
//            'label' => 'Email',
            'maxLength' => 40,
            'placeholder' => 'Email',
            'type' => EmailType::class
        ];

        $inputs['message'] = [
            'maxLength' => 5000,
            'placeholder' => "Message",
            'type' => TextareaType::class,
            'rows' => 6];

        $inputs['consent'] = [
            'label' => 'I give consent for the data provided in this form to be stored for the sole purpose of 
        responding to this communication. I can use this form to request my details be deleted at any time.',
            'type' => CheckboxType::class];

        $inputs['submit'] = [
            'label' => 'SEND',
            'type' => SubmitType::class
        ];

        return $this->formsHelper->formCreateAndProcess($pName, $inputs);
    }

    private function submissionProcessAndSendEmail($pMobileOrDesktop, &$pForm)
    {
        $data = $this->formsHelper->submissionProcess($pMobileOrDesktop, $pForm);

        if (is_null($data)) {
            return false;
        }

        $SEND_TO_ADDRESSES = ['pelawcbc55@gmail.com'];

        $SUBJECT = 'Website Contact Submission from ' . $data['name'] . ' - ' . ucfirst($data['subject']);

        $TEMPLATE_FILENAME = 'contactEmail.html.twig';

        $this->formsHelper->mailSend($data,
            $SEND_TO_ADDRESSES,
            $TEMPLATE_FILENAME,
            $data['email'],
            $SUBJECT
        );

        return true;
    }
}