# 🎨 Scheve Schilder Portaal – Frontend

This is the **React frontend** for the painting lesson platform "Scheve Schilder Portaal." Users can manage their lesson attendance, while admins can manage students, lessons, and weekly schedules through a custom-built dashboard.

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

### 👩‍💼 For Admins

- Full CRUD for weekly lessons
- Register new users/students
- Assign students to lessons
- Remove students from overbooked lessons
- Password reset modal
- Visual capacity overview for each slot

### 🎯 UX / UI

- Clean layout with custom header + tab navigation
- Mobile responsive
- Editable user fields (inline edit)
- Toast-like feedback

---

## 📬 API Integration

All backend requests point to:

http://localhost:8080/


JWT token is automatically attached to all secure endpoints using `axios.defaults.headers.common.Authorization`.

---

## 🔧 Getting Started


1. Install dependencies:
   ```bash
   npm install

2. Start development server:
   ```bash
   npm run dev

