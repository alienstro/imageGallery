CREATE DATABASE IF NOT EXISTS photoGallery;

USE photoGallery;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_email VARCHAR(255) UNIQUE KEY NOT NULL,
    user_lname VARCHAR(50) NOT NULL,
    user_fname VARCHAR(50) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_name VARCHAR(255) NOT NULL,
    image_size VARCHAR(255) NOT NULL,
    image_ext VARCHAR(255) NOT NULL,
    image_date_created DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_path VARCHAR(255) NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    image_id INT,
    messages TEXT,
    comment_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (image_id) REFERENCES images(image_id) ON DELETE CASCADE
);

INSERT INTO users (user_email, user_lname, user_fname, user_password)
VALUES
    ('johnny123@gordoncollege.edu.ph', 'McMama', 'Jonathan', 'ilovecats123'),
    ('spongebob@gordoncollege.edu.ph', 'Squarepants', 'Spongebob', 'ilovecats123'),
    ('marceline@gordoncollege.edu.ph', 'Vampire', 'Marceline', 'ilovecats123');
