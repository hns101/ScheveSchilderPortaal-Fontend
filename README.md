# Scheve Schilder Portaal – Front-end 🎨

This is the **React frontend** for the "Scheve Schilder Portaal" platform. It provides a seamless user experience for students to manage their lesson attendance and personal art galleries. For administrators, it offers a comprehensive dashboard to manage all aspects of the platform, from users and lessons to curating public-facing content.

---

## 🧱 Tech Stack

-   **React 19**
-   **React Router DOM** for routing
-   **Axios** for API requests
-   **React Context API** for global state management (Authentication)
-   **@dnd-kit/core** for accessible drag-and-drop functionality
-   **jwt-decode** for handling JWT expiration
-   **CSS Modules / CSS5** for styling

---

## 📁 Folder Structure

-   `api` || Centralized Axios instances for public and authenticated API calls.
-   `assets` || Images, logos, and other static assets.
-   `components` || Reusable React components, organized by role (`admin`, `user`, `public`, `common`).
-   `context` || React Context for authentication (`AuthContext`).
-   `helpers` || Helper functions and utilities (e.g., lesson management logic).
-   `hooks` || Custom React hooks for fetching data (e.g., `useGallery`, `useWeeks`).
-   `pages` || Top-level components that represent application pages.

---

## 🚀 Features

### 🌐 For Public Visitors (No Login Required)

-   **Public Gallery Hub:** A main `/galleries` page showcasing all student galleries and admin-curated collections that are marked as public.
-   **Detailed Views:** Visitors can click on any item in the hub to view a full-page detail view of a student's gallery or an admin's collection.
-   **Artist Discovery:** Artworks in collections link back to the original artist's public gallery.
-   **Secure Image Loading:** All public images are served through a secure endpoint that verifies the gallery's public status.

### 👩‍🎨 For Students (Logged-in Users)

-   **Lesson Planning:** View weekly lesson schedules, sign up for available slots, or withdraw from lessons.
-   **Smart Lesson Suggestions:** The lesson selector provides available slots from the previous week, the current week, and two upcoming weeks.
-   **Personal Gallery Management:**
   -   Upload, view, and delete artworks in a private, personal gallery space.
   -   **Go Public:** A simple toggle switch to make their personal gallery visible to the public on the gallery hub.
   -   **Set Cover Photo:** Choose any artwork to be the main "profile picture" for their gallery on the hub.

### 👩‍💼 For Admins (Full Control)

-   **Comprehensive User Management:**
   -   Create, view, and edit all user and student profiles.
   -   Toggle a user's `active` status, which restricts their ability to modify lessons.
-   **Full Lesson Control:** Add or remove any student from any lesson slot.
-   **Gallery Hub Curation:**
   -   View all student galleries, regardless of their public/private status.
   -   Toggle any student's gallery between public and private.
   -   **Drag-and-Drop Ordering:** Easily reorder both student galleries and collections to control their display order on the public hub.
-   **Collection Management:**
   -   Create and delete special curated **Collections**.
   -   Add any artwork from any student's gallery to one or more collections.
   -   Manage the contents of a collection on a dedicated editor page, including reordering and removing artworks.
-   **Full Content Control:** Admins can upload artworks to any student's gallery and delete any artwork from the system directly from the public gallery pages.

---

## 📬 API Integration

All backend requests point to a running instance of the backend API, typically:
`http://localhost:8080/`

This frontend is designed to work with the official backend project:
[https://github.com/hns101/ScheveSchilderPortaal-Backend](https://github.com/hns101/ScheveSchilderPortaal-Backend)

---

## 🔧 Getting Started

-   **Recommended IDE:** WebStorm or VS Code.
-   **Important:** Before starting, ensure the [backend project](https://github.com/hns101/ScheveSchilderPortaal-Backend) is running.

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Start the Development Server:**
    ```bash
    npm run dev
    ```

3.  Open your browser to the provided localhost port (e.g., `http://localhost:5173`) to view the application.

---

## 🖱️ Test Roles

**USER**
-   **Email:** `john@example.com`
-   **Password:** `password123`

**ADMIN**
-   **Email:** `admin@test.nl`
-   **Password:** `password123`
