<?php

require_once __DIR__ . "/../../config/dbconnection.php";

class imageModel extends Connection
{
    public function uploadImage($user_id, $image_name, $image_size, $image_ext, $image_path)
    {
        $query = "INSERT INTO images(user_id, image_name, image_size, image_ext, image_path) VALUES (:user_id, :image_name, :image_size, :image_ext, :image_path);";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":image_name", $image_name);
        $stmt->bindParam(":image_size", $image_size);
        $stmt->bindParam(":image_ext", $image_ext);
        $stmt->bindParam(":image_path", $image_path);
        $stmt->execute();
    }

    public function updateImage($image_id, $user_id, $image_name, $image_size, $image_ext, $image_path)
    {
        $query = "UPDATE images SET user_id = :user_id, image_name = :image_name, image_size = :image_size, image_ext = :image_ext, image_path = :image_path WHERE image_id = :image_id;";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":image_id", $image_id);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->bindParam(":image_name", $image_name);
        $stmt->bindParam(":image_size", $image_size);
        $stmt->bindParam(":image_ext", $image_ext);
        $stmt->bindParam(":image_path", $image_path);
        $stmt->execute();
    }

    public function getLatestImageId($user_id)
    {
        $query = "SELECT MAX(image_id) AS max_image_id FROM images WHERE user_id = :user_id;";


        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $fetchResult = $stmt->fetch(PDO::FETCH_ASSOC);

        return $fetchResult['max_image_id'];
    }

    public function fetchImage($image_id)
    {
        $query = "SELECT * FROM images WHERE image_id = :image_id";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":image_id", $image_id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function fetchImages()
    {
        $query = "SELECT * FROM images";

        $stmt = $this->connect()->prepare($query);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function addComment($image_id, $messages, $user_id)
    {
        $query = "INSERT INTO comments(image_id, messages, user_id) VALUES (:image_id, :messages, :user_id)";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":image_id", $image_id);
        $stmt->bindParam(":messages", $messages);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();
    }

    public function deleteImage($image_id)
    {
        $query = "DELETE FROM images WHERE image_id = :image_id;";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":image_id", $image_id);

        $stmt->execute();
    }

    public function getLatestCommentId($user_id)
    {
        $query = "SELECT MAX(comment_id) AS max_comment_id FROM comments WHERE user_id = :user_id;";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $fetchResult = $stmt->fetch(PDO::FETCH_ASSOC);

        return $fetchResult['max_comment_id'];
    }

    public function fetchUser($user_id)
    {
        $query = "SELECT * FROM users WHERE user_id = :user_id";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":user_id", $user_id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function fetchComment($comment_id)
    {
        $query = "SELECT * FROM comments WHERE comment_id = :comment_id";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":comment_id", $comment_id);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    public function fetchCommentByImageId($image_id)
    {
        $query = "SELECT c.*, u.user_lname, u.user_fname  FROM comments c  INNER JOIN users u ON c.user_id = u.user_id  WHERE c.image_id = :image_id";

        $stmt = $this->connect()->prepare($query);
        $stmt->bindParam(":image_id", $image_id);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    public function fetchComments()
    {
        $query = "SELECT * FROM comments";

        $stmt = $this->connect()->prepare($query);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }
}
