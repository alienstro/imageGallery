<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: *');
header("Access-Control-Allow-Headers: *");

require_once "./autoloader.php";
require_once "./config/dbconnection.php";

$image = new backend_image\image();
$login = new backend_login\login();

if (isset($_REQUEST['request'])) {
    $request = explode('/', $_REQUEST['request']);
} else {
    http_response_code(404);
    echo json_encode(array('message' => 'failed request'));
}

$globalMethods = new GlobalMethods();

// $userId = 1;

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        switch ($request[0]) {
            case 'imageUpload':
                echo json_encode($image->imageUpload($_FILES['userFile']));
                break;

            case 'login':
                echo json_encode($login->login($data));
                break;

            case 'signup':
                echo json_encode($login->signup($data));
                break;

            case 'addComment':
                echo json_encode($image->addComment($data));
                break;

            case 'deleteComment':
                echo json_encode($image->deleteComment($data));
                break;

            case 'deleteImage':
                echo json_encode($image->deleteImage($data));
                break;

            case 'editImage':
                echo json_encode($image->editImage($_FILES['userFile'], $data));
                break;
        }
    case 'GET':
        switch ($request[0]) {
            case 'fetchImages':
                echo json_encode($image->fetchImages());
                break;

            case 'fetchImageById':
                echo json_encode($image->fetchImageById($_GET['imageId']));
                break;

            case 'fetchCommentById':
                echo json_encode($image->fetchCommentById($_GET['imageId']));
                break;

            case 'fetchComments':
                echo json_encode($image->fetchComments());
                break;
        }
}
