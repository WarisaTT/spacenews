CREATE DATABASE SpaceNews;

USE SpaceNews;

-- ตาราง Users
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    profile_image_url VARCHAR(255)
);

-- ตาราง Areas (พื้นที่ข่าว)
CREATE TABLE Areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(255) NOT NULL,
    description TEXT,
    area_image_url VARCHAR(255),
    category ENUM('university', 'community') NOT NULL DEFAULT 'community' -- เพิ่ม attribute category
);

-- ตาราง Posts (โพสต์ข่าว)
CREATE TABLE Posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    area_id INT,
    title VARCHAR(255),
    content TEXT,
    post_type ENUM('news', 'announcement', 'event') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (area_id) REFERENCES Areas(area_id)
);

-- ตาราง Comments (ความคิดเห็น)
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    comment TEXT,
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ตาราง Likes (การกดถูกใจและอารมณ์)
CREATE TABLE Likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT,
    user_id INT,
    emotion ENUM('like', 'love', 'surprised', 'sad', 'angry') DEFAULT 'like',
    FOREIGN KEY (post_id) REFERENCES Posts(post_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- ตาราง User_Areas (พื้นที่ที่ผู้ใช้ติดตาม)
CREATE TABLE User_Areas (
    user_area_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    area_id INT,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (area_id) REFERENCES Areas(area_id)
);

-- เพิ่มข้อมูลในตาราง Users
INSERT INTO Users (username, password, email, full_name, profile_image_url)
VALUES 
('john_doe', 'password123', 'john@example.com', 'John Doe', 'https://example.com/profiles/john.png'),
('jane_doe', 'password123', 'jane@example.com', 'Jane Doe', 'https://example.com/profiles/jane.png'),
('admin', 'admin123', 'admin@example.com', 'Administrator', 'https://example.com/profiles/admin.png');

-- เพิ่มข้อมูลในตาราง Areas
INSERT INTO Areas (area_name, description, area_image_url, category)
VALUES 
('KMUTT SPACE', 'News and events in KMUTT area.', 'https://example.com/areas/university.png', 'university'),
('KLONG 4 SPACE', 'News and events in Klong 4, Rangsit-Nakhon Nayok Road.', 'https://example.com/areas/community.png', 'community'),
('RMUTT SPACE', 'News and events in RMUTT area.', 'https://example.com/areas/downtown.png', 'university');

-- เพิ่มข้อมูลในตาราง Posts
INSERT INTO Posts (user_id, area_id, title, content, post_type)
VALUES 
(1, 1, 'Open House at KMUTT', 'Open House will be held on January 10th.', 'event'),
(2, 2, 'Klong 4 Cleanup Project', 'Join us for a community cleanup this Saturday.', 'announcement'),
(3, 3, 'Roadwork in RMUTT', 'There is ongoing roadwork in front of the main building.', 'news');

-- เพิ่มข้อมูลในตาราง Comments
INSERT INTO Comments (post_id, user_id, comment)
VALUES 
(1, 2, 'I’m really excited to join this event!'),
(2, 1, 'This is a great initiative, very helpful for the community.'),
(3, 2, 'Thanks for the update!');

-- เพิ่มข้อมูลในตาราง Likes
INSERT INTO Likes (post_id, user_id, emotion)
VALUES 
(1, 2, 'love'),
(2, 1, 'like'),
(3, 3, 'surprised');

-- เพิ่มข้อมูลในตาราง User_Areas
INSERT INTO User_Areas (user_id, area_id)
VALUES 
(1, 1),
(2, 2),
(3, 3),
(1, 2),
(2, 1);