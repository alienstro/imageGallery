<?php

class imageController {
    public function deleteFile($filePath) {
        if (file_exists($filePath)) {
            unlink($filePath);
            return true;
        } else {
            return false;
        }
    }
}
