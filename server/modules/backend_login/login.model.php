<?php

require_once __DIR__ . "/../../config/dbconnection.php";

class loginModel extends Connection
{
    public function fetchEmail($user_email)
    {
        $query = "SELECT * FROM users WHERE user_email = :user_email";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_email", $user_email);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function newUser($user_email, $user_password, $user_lname, $user_fname) {
        $query = "INSERT INTO users(user_email, user_password, user_lname, user_fname) VALUES (:user_email, :user_password, :user_lname, :user_fname)";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_email", $user_email);
        $stmt->bindParam(":user_password", $user_password);
        $stmt->bindParam(":user_lname", $user_lname);
        $stmt->bindParam(":user_fname", $user_fname);
        $stmt->execute();
    }
}
