#  Scheve Schilder Portaal – Front-end 🎨

This is the **React frontend** for the painting lesson platform "Scheve Schilder Portaal." Users can manage their lesson attendance and upload artworks in their own gallery, while admins can manage students, lessons, and weekly schedules through a custom-built dashboard.

---

## 🛠 Tech Stack

- React 19
- React Router DOM
- Axios (for API requests)
- CSS5
- JWT Authentication (with localStorage)
- Context API (Auth)

---

## 📦 Folder Structure
- assets || Images, logos, and other static assets
- components || Reusable React components
- context || React Context API files
- helpers || Helper functions and utilities
- hooks || Custom React hooks
- pages || Application pages

---

## 🚀 Features

### 🔒 Authentication

- Login with email + password
- JWT token saved in localStorage
- Auth-protected routes for users and admins

### 👩‍🎨 For Students

- View your weekly lesson slot
- Change slot, catch up or cancel
- See classmates in each lesson
- Default preferences remembered
- Viewing own gallery 
- Uploading & deleting Artwork

### 👩‍💼 For Admins

- Full CRUD for weekly lessons
- Register new users/students
- Assign students to lessons
- Remove students from overbooked lessons
- Password reset for students
- Visual capacity overview for each slot

---

## 📬 API Integration

All backend requests point to:
http://localhost:8080/

All API calls are build on this backend:
https://github.com/hns101/ScheveSchilderPortaal-Backend



---
## 🔧 Getting Started
- Recommend IDE Use Webstorm || https://www.jetbrains.com/webstorm/download
- ! Before starting make sure your backend is up and running ! ||
https://github.com/hns101/ScheveSchilderPortaal-Backend
 
1. Install dependencies:
   ```bash
   npm install

2. Start development server:
   ```bash
   npm run dev 
3. Go to the provided Localhost port to login with one of the test roles.
---
## 🖱️Test Roles
USER
##### email : `john@example.com` || Password : `password123`

ADMIN
#### Email : `admin@test.nl` || Password : `password123`
