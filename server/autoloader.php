<?php

spl_autoload_register(function ($className) {

    $className = str_replace('\\', DIRECTORY_SEPARATOR, $className);

    $filePath = __DIR__ . '/../server/modules/' . $className . '.php';

    if (file_exists($filePath)) {
        require_once $filePath;
    }
});
