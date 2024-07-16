<?php

// require_once __DIR__ . '/../vendor/autoload.php';

class GlobalMethods{

    public function sendPayload($data, $remarks, $message, $code){
        $status = array("remarks"=>$remarks, "message"=>$message);
        http_response_code($code);
        return array(
            "status"=>$status,
            "payload"=>$data,
            "prepared_by"=>"Robinx Prhynz Aquino",
            "timestamp"=>date_create()
        );
    }

}