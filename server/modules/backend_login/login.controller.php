<?php

class loginController {
    public function isCorrectPassword($password, $hashedPassword) {
        if($password != $hashedPassword) {
            return true;
        } else {
            return false;
        }
    }

    public function isEmailExists($email) {
        if (!$email) {
            return true; // Email exists
        } else {
            return false; // Email does not exist
        }
    }
}