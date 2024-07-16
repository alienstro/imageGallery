<?php

namespace backend_login;

use GlobalMethods;

require_once __DIR__ . "/login.model.php";
require_once __DIR__ . "/login.controller.php";
require_once __DIR__ . "/../global.php";


class login extends GlobalMethods
{
    public function login($data)
    {
        try {
            $email = $data->email;
            $password = $data->password;

            $loginModel = new \loginModel();
            $loginController = new \loginController();

            if (!$loginModel->fetchEmail($email)) {
                return $this->sendPayload(null, "fail", "Failed to find email", 404);
            } else {
                $fetchResult = $loginModel->fetchEmail($email);
            }

            $userId = $fetchResult['user_id'];
            $username = $fetchResult['user_fname'] . ' ' . $fetchResult['user_lname'];

            if ($loginController->isEmailExists($email)) {
                return $this->sendPayload(null, "fail", "Failed to find email", 404);
            }

            // echo $password;
            // echo "\n" . $fetchResult['user_password'];

            if ($loginController->isCorrectPassword($password, $fetchResult['user_password'])) {
                return $this->sendPayload(null, "fail", "Incorrect password", 404);
            }

            return $this->sendPayload($userId, "success", "Successfully logged in", 200);
        } catch (\Exception $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "fail", $errmsg, 404);
        }
    }

    public function signup($data) {
        try {
            $email = $data->email;
            $password = $data->password;
            $repassword = $data->repassword;
            $firstname = $data->firstname;
            $lastname = $data->lastname;

            $loginModel = new \loginModel();
            $loginController = new \loginController();

            $fetchEmail = $loginModel->fetchEmail($email);

            if($loginController->isNameValid($firstname, $lastname)) {
                return $this->sendPayload(null, "fail", "Name should be less than 30 characters", 404);
            }

            if($loginController->isCorrectPassword($password, $repassword)) {
                return $this->sendPayload(null, "fail", "Passwords do not match", 404);
            }

            if ($fetchEmail) {
                return $this->sendPayload(null, "fail", "Email Already Taken", 404);
            }

            // echo $password;
            // echo "\n" . $fetchResult['user_password'];

            if ($loginModel->newUser($email, $password, $lastname, $firstname)) {
                return $this->sendPayload(null, "fail", "Failed to upload new user", 404);
            }

            return $this->sendPayload(null, "success", "Successfully signed up", 200);
        }  catch (\Exception $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "fail", $errmsg, 404);
        }
    }
}
