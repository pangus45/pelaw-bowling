<?php

namespace AppBundle\Service;

use Psr\Log\LoggerInterface;
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

        $this->request->getBaseUrl();

        $url = $this->request->getRequestUri();
        // If there's issues with the page id, then getting requests this way will be the issue
    }

    public function contactFormProcessAndGetData($pLostProperty = false)
    {
        $desktopForm = $this->formCreate('desktopContact', $pLostProperty);
        $mobileForm = $this->formCreate('mobileContact', $pLostProperty);

//        $desktopSuccess = $this->formProcess('desktop', $desktopForm);
//        $mobileSuccess = $this->formProcess('mobile', $mobileForm);

//        $success = $desktopSuccess || $mobileSuccess;
        $success = false; // temp for dev

        // if it's a post, the layout service looks for the page id in the form instead
        // Don't know if this is still necessary???
        $this->request->request->set('pageId', $this->pageID);

        if ($pLostProperty) {
            $blocks = array('desktop-lostPropertyForm' => $desktopForm->createView(),
                'mobile-lostPropertyForm' => $mobileForm->createView());
        } else {
            $blocks = array('desktop-contactForm' => $desktopForm->createView(),
                'mobile-contactForm' => $mobileForm->createView());
        }

//      $blockSelector = array('contactForm' => 'Contact Form');

        return array('success' => $success, 'controllerBlocks' => $blocks);
    }

    private function formCreate($pName, $pLostProperty)
    {
        $inputs = [];

        //        Your Details
        $inputs['subject'] = [
            'label' => 'Subject',
            'maxLength' => 50,
            'placeholder' => 'Subject'
        ];

        $inputs['name'] = [
            'label' => 'Name',
            'maxLength' => 50,
            'placeholder' => 'First Name'
        ];

//        $inputs['lastName'] = [
//            'maxLength' => 50,
//            'placeholder' => 'Last Name'
//        ];

        $inputs['email'] = [
            'label' => 'Email',
            'maxLength' => 50,
            'placeholder' => 'Email',
            'type' => EmailType::class
        ];

//        $inputs['phone'] = [
//            'maxLength' => 20,
//            'placeholder' => 'Phone',
//            'type' => TelType::class
//        ];

//        $inputs['bookingRef'] = [
//            'maxLength' => 20,
//            'placeholder' => 'Booking Ref (optional)'
//        ];

        $inputs['message'] = [
            'label' => "Message",
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

//        $formFactory = Forms::createFormFactoryBuilder()->addExtension(new ValidatorExtension(Validation::createValidator()))->getFormFactory();
//
//
//        $MAIL_CONSTRAINTS = [new Length(['max' => $EMAIL_MAX_LENGTH]), new NotBlank(['message' => $NOT_BLANK_MESSAGE_EMAIL]), new Email(['message' => $INVALID_EMAIL_MESSAGE])];
//
//        $CONSENT_LABEL = 'I give consent for the data provided in this form to be stored for the sole purpose of responding to this communication. I can use this form to request my details be deleted at any time.';
//        $CONSENT_MESSAGE = 'You must give consent for us to be able to respond to your message';
//
//        $form = $formFactory->createNamedBuilder($pName)
//            ->add('name', TextType::class,
//                array('label' => 'contact.labels.name',
//                    'attr' => ['maxlength' => $NAME_MAX_LENGTH, 'placeholder'],
//                    'constraints' => [new Length(['max' => $NAME_MAX_LENGTH]), new NotBlank(['message' => $NOT_BLANK_MESSAGE_NAME])]))
////            ->add('email', EmailType::class,
////                array('label' => 'contact.labels.email',
////                    'attr' => ['maxlength' => $EMAIL_MAX_LENGTH],
////                    'constraints' => [new Length(['max' => $EMAIL_MAX_LENGTH]), new NotBlank(['message' => $NOT_BLANK_MESSAGE_EMAIL]), new Email(['message' => $INVALID_EMAIL_MESSAGE])]))
//            ->add('email', RepeatedType::class, array(
//                'type' => EmailType::class,
//                'invalid_message' => $EMAIL_MISMATCH_MESSAGE,
//                'first_options' => array('label' => 'Email', 'constraints' => $MAIL_CONSTRAINTS),
//                'second_options' => array('label' => 'Confirm Email', 'constraints' => $MAIL_CONSTRAINTS),
//            ))
//            ->add('phone', TextType::class,
//                array('label' => 'Phone Number',
//                    'attr' => ['maxlength' => $PHONE_MAX_LENGTH],
//                    'required' => false,
//                    'constraints' => [new Length(['max' => $PHONE_MAX_LENGTH])]))
//            ->add('subject', ChoiceType::class,
//                ['label' => 'Subject',
//                    'choices' => ['General Enquiries' => 'general',
//                        'Accounts' => 'accounts',
//                        'Insurance' => 'insurance',
//                        'Telematics' => 'telematics',
//                        'Garage' => 'garage',
//                        'Drivers' => 'drivers',
//                        'Complaints' => 'complaints'],
//                    'constraints' => [new Length(['max' => $CATEGORY_MAX_LENGTH]), new NotBlank()]
//                ])
//            ->add('message', TextareaType::class,
//                array('label' => 'contact.labels.message',
//                    'attr' => ['maxlength' => $MESSAGE_MAX_LENGTH, 'rows' => 10],
//                    'constraints' => [new Length(['max' => $MESSAGE_MAX_LENGTH]), new NotBlank(['message' => $NOT_BLANK_MESSAGE_MESSAGE])]))
//            ->add('consent', CheckboxType::class,
//                array('label' => $CONSENT_LABEL,
//                    'required' => false,
//                    'constraints' => [new NotBlank(['message' => $CONSENT_MESSAGE])]))
//            ->add('url', TextType::class,
//                array('label' => 'contact.labels.url',
//                    'attr' => ['maxlength' => $URL_MAX_LENGTH],
//                    'constraints' => [new Length(['max' => $URL_MAX_LENGTH]), new NotBlank()]))
//            ->add('pageId', HiddenType::class,
//                array('data' => 'contact',
//                    'attr' => ['maxlength' => $PAGE_ID_MAX_LENGTH],
//                    'constraints' => [new Length(['max' => $PAGE_ID_MAX_LENGTH]), new NotBlank()]))
//            ->add('submit', SubmitType::class,
//                array('label' => 'contact.labels.submit'))
//            ->getForm();
//
//        $form->handleRequest();

        return $form;
    }

    private function contactLog($pLines)
    {
        $logger = $this->get('logger');

        $pLines[] = '-----------------------------------';

        $entry = implode("\r\n", $pLines);

        $logger->info($entry);
    }

    private function formProcess($pMobileOrDesktop, &$pForm)
    {
        if (!$pForm->isSubmitted()) {

            return false;
        }

        $logMessage[] = ''; // space after log date
        $logMessage[] = '****** ' . $pMobileOrDesktop . ' contact submission' . ' ******';

        $data = $pForm->getData();

        foreach ($data as $fieldName => $fieldValue) {

            if ('url' != $fieldName && 'pageId' != $fieldName) {
                $logMessage[] = $fieldValue;
            }
        }

        if (!$pForm->isValid()) {
            $logMessage[] = 'Invalid!';
            $this->contactLog($logMessage);
            return false;
        }

        if ('contact' != $data['pageId']) {

            $logMessage[] = 'Rejected - wrong page id';
            $this->contactLog($logMessage);
            return false;
        }

        if ('39djdfj3sdfegdds' != $data['url']) {

            $logMessage[] = 'Rejected - incorrect url';
            $this->contactLog($logMessage);
            return false;
        }

//        $PROHIBITED_WORDS = ['http://', 'https://'];

        $ADDRESSES = ['general' => ['ben.bell@blueline-group.com', 'andrew.humphrey@blueline-group.com', 'dispatchers@blueline-group.com', 'accounts@blueline-group.com', 'info@blueline-group.com'],
            'accounts' => ['accounts@blueline-group.com', 'info@blueline-group.com'],
            'insurance' => ['blis@blueline-group.com'],
            'telematics' => ['telematics@blueline-group.com'],
            'garage' => ['garage@blueline-group.com'],
            'drivers' => ['drivers@blueline-group.com'],
            'complaints' => ['complaints@blueline-group.com'],
        ];

        if (!array_key_exists($data['subject'], $ADDRESSES)) {

            $logMessage[] = 'Rejected - incorrect subject';
            $this->contactLog($logMessage);
            return false;
        }

        $data['sendToAddresses'] = $ADDRESSES[$data['subject']];

        $logMessage[] = 'Sending Mail to ' . join(', ', $data['sendToAddresses']);

        $messagesSent = $this->mailSendSwift($data);

        $logMessage[] = 'Swift Mail: ' . $messagesSent . ' mail(s) sent';

        $logMessage[] = '';

        $this->contactLog($logMessage);

        // Assuming sent for now

//        if ($messagesSent > 0) {
//
//            return true;
//        }

        return true;
    }

    private function mailSendPHPMail($pData, $pFrom)
    {
        $SUBJECT = 'A PHP Contact Request for ' . ucfirst($pData['subject']) . ' from ' . $pData['name'];

        $BODY = $this->renderView(
            'contactEmail.html.twig',
            $pData
        );

        $headers = "MIME-Version: 1.0" . "\r\n";
        $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $headers .= 'From: <' . $pFrom . '>' . "\r\n";
        $headers .= 'Reply-To: ' . $pData['email'] . "\r\n";
//        $headers .= 'Reply-To: ' . $pFrom . "\r\n";

        $TO = join(', ', $pData['sendToAddresses']);

        $result = mail($TO, $SUBJECT, $BODY, $headers);

        return $result;
    }

    private function mailSendSwift($pData)
    {
        $SUBJECT = 'Website Contact Request for ' . ucfirst($pData['subject']) . ' from ' . $pData['name'];

        $BODY = $this->renderView(
            'contactEmail.html.twig',
            $pData
        );

        $SITE_FROM = $this->getParameter('site_from_address');

        $mail = new \Swift_Message($SUBJECT);

        $mail->setFrom($SITE_FROM)
            ->setTo($pData['sendToAddresses'])
            ->setReplyTo(array($pData['email']))
            ->setBody($BODY,
                'text/html'
            );

        return $this->get('mailer')->send($mail);
    }
}