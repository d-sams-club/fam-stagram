DROP DATABASE IF EXISTS famstagram;

CREATE DATABASE famstagram;

USE famstagram;

CREATE TABLE users (
  id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  name varchar(255),
  email varchar(255) UNIQUE KEY,
  password varchar(255)
);

CREATE TABLE families (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name varchar(255),
  code varchar(255) UNIQUE KEY
 );

 CREATE TABLE messages (
  id int PRIMARY KEY AUTO_INCREMENT NOT NULL,
  userId int,
  familyId int,
  text varchar(255),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (familyId) REFERENCES families(id)
 );

 CREATE TABLE photos (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  userId int,
  url varchar(255),
  caption varchar(255),
  created_at int,
  FOREIGN KEY (userId) REFERENCES users(id)
 );

