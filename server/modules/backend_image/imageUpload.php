<?php

namespace backend_image;

require_once __DIR__ . "/imageUpload.model.php";
require_once __DIR__ . "/imageUpload.controller.php";
require_once __DIR__ . "/../global.php";

class imageUpload extends \GlobalMethods
{
    public function imageUpload($fileData)
    {
        if (!isset($fileData) || $fileData === null) {
            return $this->sendPayload(null, "fail", "No file data provided", 404);
        }

        if (isset($_POST['userId']) && !empty($_POST['userId'])) {
            $userId = $_POST['userId'];
        } else {
            return $this->sendPayload(null, "fail", "No userId provided", 404);
        }

        // EXTRACTING FILE INFORMATION FROM $FILEDATA
        $fileName = $fileData['name'];
        $fileSize = $fileData['size'];
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);

        // CHECK IF FILE IS AN IMAGE
        $allowedExtensions = array('jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'); // add more extensions if needed
        if (!in_array(strtolower($fileExt), $allowedExtensions)) {
            return $this->sendPayload(null, "fail", "Only image files are allowed", 404);
        }

        // CHECK IF FILE IS A VALID IMAGE
        $imageInfo = getimagesize($fileData['tmp_name']);
        if (!$imageInfo) {
            return $this->sendPayload(null, "fail", "Only image files are allowed", 404);
        }

        $imageUploadModel = new \imageUploadModel();
        $imageUploadController = new \imageUploadController();

        // echo $imageName;
        // echo "\n" . $imageSize;
        // echo "\n" . $imageExt;
        // die();

        // CREATE THE DIRECTORY THAT STORES FILES IF IT DOESN'T ALREADY EXIST
        $dir =  __DIR__ . '/../backend_uploadedImages';
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }

        // CREATES DIRECTORY FOR USER ONLY
        $userDir = $dir . "/" . $userId;

        if (!file_exists($userDir)) {
            mkdir($userDir, 0777, true);
        }

        $targetDir = $userDir . "/";
        $baseFileName = pathinfo($fileName, PATHINFO_FILENAME); // REMOVES THE EXTENSION
        $targetFile = $targetDir . $fileName;

        // CHECK IF FILE ALREADY EXISTS
        $counter = 1;
        $baseFileName = pathinfo($fileName, PATHINFO_FILENAME);
        $newFileName = $baseFileName;
        $targetFile = $targetDir . $newFileName . '.' . $fileExt;

        while (file_exists($targetFile)) {
            $newFileName = $baseFileName . "($counter)";
            $targetFile = $targetDir . '/' . $newFileName . '.' . $fileExt;
            $counter++;
        }

        move_uploaded_file($fileData["tmp_name"], $targetFile);

        // FILE PATH FOR DB
        $file_path = $userId . "/" . $newFileName . "." . $fileExt;

        if ($imageUploadModel->uploadImage($userId, $newFileName, $fileSize, $fileExt, $file_path)) {
            return $this->sendPayload(null, "fail", "Upload failed", 404);
        } else {
            $imageId = $imageUploadModel->getLatestImageId($userId);
            $fetchResultImage = $imageUploadModel->fetchImage($imageId);

            $data = json_encode(array(
                'imageId' => $fetchResultImage['image_id'],
                'userId' => $fetchResultImage['user_id'],
                'imageName' => $fetchResultImage['image_name'],
                'imageSize' => $fetchResultImage['image_size'],
                'imageExt' => $fetchResultImage['image_ext'],
                'imageDateCreated' => $fetchResultImage['image_date_created'],
                'imagePath' => $fetchResultImage['image_path']
            ));

            return $this->sendPayload($data, "success", "Successfully uploaded an image", 200);
        }
    }

    public function fetchImages()
    {
        $imageUploadModel = new \imageUploadModel();

        $result = $imageUploadModel->fetchImages();

        if ($result) {
            return $result;
        } else {
            return $this->sendPayload(null, "fail", "Failed to get images", 404);
        }
    }

    public function fetchImageById($imageId)
    {
        $imageUploadModel = new \imageUploadModel();

        $result = $imageUploadModel->fetchImage($imageId);

        if ($result) {
            return $result;
        } else {
            return $this->sendPayload(null, "fail", "Failed to get images", 404);
        }
    }

    public function fetchCommentById($imageId)
    {
        $imageUploadModel = new \imageUploadModel();

        $result = $imageUploadModel->fetchCommentByImageId($imageId);

        if ($result) {
            return $result;
        } else {
            return $this->sendPayload(null, "fail", "No comments", 200);
        }
    }

    public function fetchComments()
    {
        $imageUploadModel = new \imageUploadModel();

        $result = $imageUploadModel->fetchComments();

        if ($result) {
            return $result;
        } else {
            return $this->sendPayload(null, "fail", "Failed to get images", 404);
        }
    }

    public function addComment($data)
    {
        try {
            $imageUploadModel = new \imageUploadModel();

            $imageId = $data->imageId;
            $messages = $data->comment;
            $userId = $data->userId;

            // echo $messages;
            // echo "\n" . $imageId;
            // echo "\n" . $userId;
            // die();

            if ($imageUploadModel->addComment($imageId, $messages, $userId)) {
                return $this->sendPayload(null, "fail", "Failed to add comment", 404);
            } else {
                $commentId = $imageUploadModel->getLatestCommentId($userId);
                $fetchResultComment = $imageUploadModel->fetchComment($commentId);

                $fetchResultuser = $imageUploadModel->fetchUser($userId);

                $data = json_encode(array(
                    'commentId' => $fetchResultComment['comment_id'],
                    'imageId' => $fetchResultComment['image_id'],
                    'userId' => $fetchResultComment['user_id'],
                    'messages' => $fetchResultComment['messages'],
                    'commentDate' => $fetchResultComment['comment_date'],
                    'userLName' => $fetchResultuser['user_lname'],
                    'userFName' => $fetchResultuser['user_fname'],

                ));

                return $this->sendPayload($data, "success", "Successfully added a comment", 200);
            }
        } catch (\Exception $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "fail", $errmsg, 404);
        }
    }

    public function deleteImage($data) {
        try {
            $imageUploadModel = new \imageUploadModel();

            $imageId = $data->imageId;

            // echo $imageId;
            // die();

            if($imageUploadModel->deleteImage($imageId)) {
                return $this->sendPayload(null, "fail", "Failed to delete an image", 404);
            }

            return $this->sendPayload($data, "success", "Successfully deleted an image", 200);
        } catch (\Exception $e) {
            $errmsg = $e->getMessage();
            return $this->sendPayload(null, "fail", $errmsg, 404);
        }
    }
}
