<?php

class loginController
{
    public function isCorrectPassword($password, $hashedPassword)
    {
        if ($password != $hashedPassword) {
            return true;
        } else {
            return false;
        }
    }

    public function isEmailExists($email)
    {
        if (!$email) {
            return true; 
        } else {
            return false; 
        }
    }

    public function isNameValid($firstname, $lastname)
    {
        if (!empty($firstname) && !empty($lastname) && strlen($firstname) <= 30 && strlen($lastname) <= 30) {
            return false; 
        } else {
            return true;
        }
    }
}
