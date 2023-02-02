<?php

namespace AppBundle\Service;

use CommonBundle\Service\Globals;


class BookingManager
{
    private $dataPath;

    public function __construct(Globals $pGlobals)
    {
        $this->dataPath = $pGlobals->systemPublicPathGet('/data/bookings/');

//        $this->request->getBaseUrl();
//
//        $url = $this->request->getRequestUri();
//        // If there's issues with the page id, then getting requests this way will be the issue
    }

    private function bookingPathGet($pID)
    {
        return $this->dataPath . $pID;
    }

    public function bookingGet($pID)
    {
        $fileName = $this->bookingPathGet($pID);

        if (file_exists($fileName)) {

            $file = file_get_contents($this->bookingPathGet($pID));

            $data = json_decode($file);

            if ($data) {
                return $data;
            }
        }

        return false;
    }


    public
    function bookingCreate($pStartTime, $pEndTime, $pDate, $pLocation, $pName, $pEmail, $pPhone, $pReason)
    {
        $id = uniqid();

        $data = [
            'id' => $id,
            'startTime' => $pStartTime,
            'endTime' => $pEndTime,
            'date' => $pDate,
            'location' => $pLocation,
            'name' => $pName,
            'email' => $pEmail,
            'phone' => $pPhone,
            'reason' => $pReason,
            'confirmed' => false,
            'eventIDs' => new \stdClass()
        ];

        $this->bookingSave(json_decode(json_encode($data)));

        return $id;
    }

    function bookingSave($pBooking)
    {
        file_put_contents($this->bookingPathGet($pBooking->id), json_encode($pBooking, JSON_PRETTY_PRINT));
    }
}

//class Booking{
//
//    private $data;
//
//    public function startTimeGet(){
//
//        $parts =
//    }
//}
