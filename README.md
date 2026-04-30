# 🛒 MarketPlace

##  Overview

MarketPlace is a simple web-based marketplace application where users can:

- Create an account and sign in  
- Post items for sale (with an optional image upload)  
- Browse all posted items on the homepage  
- View a single item’s details + seller info  
- Contact the seller via Telegram username  
- Add items to a cart  
- Leave comments on items (shared for all users via the database)  
- View and manage their profile (including changing password)  

---

##  Tech Stack

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** PHP (MySQLi + Sessions)  
- **Database:** MySQL (phpMyAdmin)  
- **Server:** Apache via XAMPP  

---

## acces the project using : http://localhost/MarketPlace/


---

##  Project Structure
MarketPlace/
│
├── pages/ # HTML pages
├── php/ # Backend endpoints
├── js/ # Frontend logic
├── css/ # Styling
├── uploads/ # Uploaded images


### Important Folders

- **pages/**  
  Contains: `index.html`, `signin.html`, `signup.html`, `post.html`, `item.html`, `profile.html`, `cart.html`, `navbar.html`

- **php/**  
  Backend endpoints (auth, items, comments, uploads)

- **js/**  
  Frontend logic (auth, navbar, items, profile, cart)

- **css/**  
  Styling files

- **uploads/**  
  Stores uploaded item images (auto-created if missing)

---

##  Setup Guide

### 1. Install & Start XAMPP

- Install XAMPP  
- Start:
  - Apache  
  - MySQL  

---

### 2. Move Project

Place project in: C:\xampp\htdocs\MarketPlace


Then open: [http://localhost/MarketPlace/pages/index.html]([url](http://localhost/MarketPlace/pages/index.html))


---

##  Database Setup (phpMyAdmin)

### 1. Create Database

Create a database named:marketplace


---

### 2. Create Tables

#### A) Users Table

```sql
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  location VARCHAR(100) NOT NULL,
  telegram_username VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


#### B) Items Table
CREATE TABLE IF NOT EXISTS items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  description TEXT NULL,
  category VARCHAR(60) NULL,
  image VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_items_user_id (user_id),
  INDEX idx_items_created_at (created_at),
  CONSTRAINT fk_items_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


#### B) Comments Table
CREATE TABLE IF NOT EXISTS comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  item_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_text VARCHAR(500) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_comments_item_id (item_id),
  INDEX idx_comments_user_id (user_id),
  CONSTRAINT fk_comments_item FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```
## How the App Works (User Flow)
### 1. Sign Up
- Go to: pages/signup.html
- Fill:
 Username,
Phone,
Location,
Telegram Username,
Email,
Password
Data is saved in the users table
### 2. Sign In
- Go to: pages/signin.html
- After login:
 - Session created ($_SESSION)
 - Data stored in localStorage
 - Navbar updates automatically
### 3. Post an Item
- Go to: pages/post.html
- Only logged-in users can post
- Image upload is optional
- Images stored in uploads/
### 4. Browse Items
- Homepage displays items
- Click item → opens:
- pages/item.html?id=ITEM_ID
### 5. Item Details + Seller Contact
- View item details and image
- See seller name
- Click Contact Seller
- Telegram link format: https://t.me/username
### 6. Comments (Visible to All Users)
- Users can post comments
- Stored in comments table
- Visible to all users
### 7. Cart
- Add items from item page
- Stored in localStorage
- Cart page: pages/cart.html
Supports:
Remove item,
Clear cart
### 8. Profile + Change Password
View:
Username,
Phone,
Location,
Telegram,
Email.
Change password:
Enter old + new password
Stored securely (hashed)
🔌 Backend Endpoints
### Auth
- php/signup.php
- php/signin.php
- php/check_auth.php
- php/logout.php
- php/change_password.php
### Items
- php/add_item.php
- php/get_items.php
- php/get_item.php
### Comments
- php/add_comment.php
- php/get_comments.php
 Notes / Troubleshooting


### Status
- Core marketplace features implemented
- Authentication working
- Item posting & browsing working
- Telegram contact working
- Shared comments working
- Cart implemented (localStorage)

---
