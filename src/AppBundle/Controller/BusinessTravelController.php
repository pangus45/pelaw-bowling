<?php

namespace AppBundle\Controller;

use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;

use Symfony\Component\Form\Forms;
use Symfony\Component\Form\Extension\Core\Type\FormType;
use Symfony\Component\Form\Extension\Core\Type\HiddenType;
use Symfony\Component\Form\Extension\Core\Type\TelType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\DateType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\FileType;

use Symfony\Component\Form\Extension\Validator\ValidatorExtension;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Validation;

use CommonBundle\Service\FormsHelper;


class BusinessTravelController extends Controller
{
    public function businessTravelAction(Request $pRequest, FormsHelper $pFormsHelper)
    {
//        $result = $this->mailSend('paulangus2004@hotmail.com',
//            'Tell me more',
//            'This is just a test email - you don\'t have to worry about it too much');

//        return new Response($result);

        $desktopForm = $this->formCreate($pFormsHelper, 'desktopBusinessApplicationForm');
        $mobileForm = $this->formCreate($pFormsHelper, 'mobileBusinessApplicationForm');

        $desktopSuccess = $this->formProcess('desktop', $desktopForm);
        $mobileSuccess = $this->formProcess('mobile', $mobileForm);

        $success = $desktopSuccess || $mobileSuccess;
//        $success = false;

        // if it's a post, the layout service looks for the page id in the form instead
        $pRequest->request->set('pageId', 'business-travel');

        $blocks = array('desktop-businessApplicationForm' => $desktopForm->createView(),
            'mobile-businessApplicationForm' => $mobileForm->createView());

        $blockSelector = array('businessApplicationForm' => 'Business Application Form');

        return $this->render('@Common/defaultPage.html.twig',
            array('success' => $success,
                'blockSelector' => $blockSelector,
                'controllerBlocks' => $blocks)
        );
    }


    private function formCreate($pFormsHelper, $pName)
    {
        $inputs = [];

        // Company Details
        $inputs['companyName'] = [
            'maxLength' => 100,
            'placeholder' => 'Company Name'
        ];

        $inputs['tradingName'] = [
            'maxLength' => 100,
            'placeholder' => 'Trading Name'
        ];

        $inputs['industry'] = [
            'maxLength' => 100,
            'placeholder' => "Industry"
        ];

        $inputs['regNumber'] = [
            'maxLength' => 20,
            'placeholder' => "Company Registration Number"
        ];

        $inputs['address'] = [
            'maxLength' => 100,
            'placeholder' => "Address"
        ];

        $inputs['address2'] = [
            'maxLength' => 100,
            'placeholder' => "Address Line 2 (Optional)",
        ];

        $inputs['town'] = [
            'maxLength' => 50,
            'placeholder' => "Town",
        ];

        $inputs['county'] = [
            'maxLength' => 50,
            'placeholder' => "County",
        ];

        $inputs['postCode'] = [
            'maxLength' => 10,
            'placeholder' => "Post Code",
        ];

        $inputs['businessLandlineNumber'] = [
            'maxLength' => 20,
            'placeholder' => "Business Landline Number",
            'type' => TelType::class
        ];

        $inputs['companyEmail'] = [
            'maxLength' => 50,
            'placeholder' => "Email Address",
            'type' => EmailType::class
        ];

        $inputs['accountPurpose'] = [
            'type' => ChoiceType::class,
            'choices' => [
                '- Account Purpose -',
                'For staff and visitors',
                'For customers',
                'Other (please specify)'
            ]
        ];

        $inputs['otherPurpose'] = ['maxLength' => 200,
            'placeholder' => "If other, please specify"];

        $inputs['preferredVehicle'] = [
            'type' => ChoiceType::class,
            'choices' => [
                '- Preferred Vehicle -',
                'Standard Card',
                'Hybrid',
                'Wheelchair Accessible Vehicle',
                'Minibus',
                'Executive',
                'I don\'t mind'
            ]
        ];

        $inputs['message'] = ['maxLength' => 5000,
            'placeholder' => "Any Additional Info",
            'type' => TextareaType::class,
            'rows' => 4];

//        Your Details
        $inputs['title'] = [
            'type' => ChoiceType::class,
            'choices' => [
                '- Title -',
                'Mr',
                'Miss',
                'Ms',
                'Mrs',
                'Dr',
                'Prof'
            ]
        ];

        $inputs['firstName'] = [
            'maxLength' => 50,
            'placeholder' => "First Name",
        ];

        $inputs['lastName'] = [
            'maxLength' => 50,
            'placeholder' => "Last Name",
        ];

        $inputs['personalEmail'] = [
            'maxLength' => 50,
            'placeholder' => "Business email address",
            'type' => EmailType::class
        ];

        $inputs['personalLandlineNumber'] = [
            'maxLength' => 20,
            'placeholder' => "Landline Number",
            'type' => TelType::class
        ];

        $inputs['mobileNumber'] = [
            'maxLength' => 20,
            'placeholder' => "Mobile Number",
            'type' => TelType::class
        ];

        // Your Priority Account

        // Monthly Credit Allowance

        $inputs['monthlyCredit'] = [
            'type' => ChoiceType::class,
            'choices' => [
                '- Monthly Credit Allowance -',
                '<£500',
                '£500-£1000',
                '£1000-£2500',
                '£2500-£5000',
                '>£5000'
            ]
        ];

        $inputs['paymentMethod'] = [
            'type' => ChoiceType::class,
            'choices' => [
                '- Method of Payment -',
                'Direct Debit',
                'Credit Card',
                'Debit Card',
                'Cheque'
            ]
        ];

//        !!! Add Link !!!
        $inputs['termsAndConditions'] = ['label' => 'I agree to the Terms and Conditions',
            'type' => CheckboxType::class,
            'notBlankMessage' => 'You must agree to the terms and conditions in order to apply'];

        // File Upload
        $inputs['termsAndConditions'] = ['label' => 'I agree to the Terms and Conditions',
            'type' => CheckboxType::class,
            'notBlankMessage' => 'You must agree to the terms and conditions in order to apply'];


        $inputs['files'] = [
            'type' => FileType::class,
            'multiple' => true
        ];

        $inputs['submit'] = [
            'type' => SubmitType::class,
            'label' => 'APPLY NOW'
        ];

        //        $form = $formBuilder->add('submit', SubmitType::class,
//            array('label' => 'APPLY NOW'))
//            ->getForm();

//        $inputs['nominatorEmail'] = ['maxLength' => 50,
//            'placeholder' => "Email address of person making the nomination",
//            'type' => EmailType::class];
//
//        $inputs['nominatorName'] = ['notRequired' => true,
//            'maxLength' => 100,
//            'placeholder' => "Name of person making the nomination if not parent/guardian"];
//
//        $inputs['medicalCondition'] = ['maxLength' => 5000,
//            'placeholder' => "Please specify the medical condition or injury suffered by the nominee",
//            'type' => TextareaType::class,
//            'rows' => 5];

//        !!! Make sure gdpr is inclueded in t&c
//        $inputs['consent'] = ['label' => 'I give consent for the data provided in this form to be stored for the sole purpose of processing the nomination. I can use the form on the contact page to request my details be deleted at any time.',
//            'type' => CheckboxType::class,
//            'notBlankMessage' => 'You must give consent for us to be able to process your nomination'];

//        $URL_MAX_LENGTH = 16;
//        $PAGE_ID_MAX_LENGTH = 7;

//        !!! Security removed for now !!!
//        $form = $formBuilder->
//            add('url', TextType::class,
//            array('label' => 'Url',
//                'required' => false,
//                'attr' => ['maxlength' => $URL_MAX_LENGTH]))
//            ->add('pageId', HiddenType::class,
//                array('data' => 'award',
//                    'attr' => ['maxlength' => $PAGE_ID_MAX_LENGTH],
//                    'constraints' => [new Length(['max' => $PAGE_ID_MAX_LENGTH]), new NotBlank()]))
//            ->add('submit', SubmitType::class,
//                array('label' => 'contact.labels.submit'))
//            ->getForm();

        return $pFormsHelper->formCreateAndProcess($pName, $inputs);
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

