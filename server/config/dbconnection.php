<?php
// require_once __DIR__ . '/../vendor/autoload.php';

/*
//for debugging 
var_dump($server);
var_dump($database);
var_dump($user);
var_dump($pass);
var_dump($driver);
var_dump($secretKey);

try {
    $connection = new PDO("$driver:host=$server;dbname=$database;charset=utf8mb4", $user, $pass);
    // Other database operations...
    echo "Connection successful!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
*/

//set default time zone
date_default_timezone_set("Asia/Manila");

//set time limit of requests
set_time_limit(1000);

//define constants for server credentials/configuration
define("SERVER", "localhost");
define("DATABASE", "photogallery");
define("USER", "root");
define("PASSWORD", "");
define("DRIVER", "mysql");


// SEE https://www.php.net/manual/en/pdo.constants.php#pdo.constants.attr-emulate-prepares


class Connection{
    private $connectionString = DRIVER . ":host=" . SERVER . ";dbname=" . DATABASE . "; charset=utf8mb4";
    
    //options is a key=>value array of driver-specific connection options.
    private $options = [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        \PDO::ATTR_EMULATE_PREPARES
    ];

    public function connect() {
        return new \PDO($this->connectionString, USER, PASSWORD, $this->options);
    }
}
