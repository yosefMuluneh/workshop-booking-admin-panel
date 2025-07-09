# Workshop Booking System - Admin Panel

![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?style=for-the-badge&logo=vite)
![Material--UI](https://img.shields.io/badge/Material--UI-7.x-blue?style=for-the-badge&logo=mui)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)
![Recharts](https://img.shields.io/badge/Recharts-2.x-orange?style=for-the-badge)

This repository contains the administrator-facing dashboard for the Workshop Booking System. Built as a single-page application with React and Vite, it provides a comprehensive suite of tools for managing the entire platform.

---

### ➤ Live URL

`[PASTE YOUR LIVE RENDER/VERCEL ADMIN PANEL URL HERE]`

---

### ✨ Core Features

-   **Secure Admin Login**: A dedicated login page using JWT-based authentication to protect all admin routes.
-   **Statistical Dashboard**: A dynamic dashboard (`/dashboard`) displaying key performance indicators like total bookings, slots filled, and most popular workshops, visualized with interactive charts from Recharts.
-   **Full Workshop Management**:
    -   A powerful data grid on the `/workshops` page to view all workshops, including their status (Active/Archived).
    -   Functionality to create new workshops with multiple time slots via an intuitive modal form.
    -   A detailed view (`/workshops/:id`) for each workshop, allowing admins to manage time slots and view associated bookings.
-   **Comprehensive Bookings Overview**: A dedicated `/bookings` page to view and manage all customer bookings, with capabilities for filtering, pagination, and updating booking statuses (e.g., from `PENDING` to `CONFIRMED`).
-   **Robust Form Handling**: Modern form management using `react-hook-form` with Zod for schema-based validation.
-   **Centralized State Management**: Redux Toolkit is used to manage global state, such as user authentication status.

---

### 🛠️ Tech Stack

| Category                 | Technology / Library                                        |
| ------------------------ | ----------------------------------------------------------- |
| **Framework/Bundler**    | React, Vite                                                 |
| **UI Library**           | Material-UI (MUI), MUI X (DataGrid), Emotion                |
| **State Management**     | Redux Toolkit, React-Redux                                  |
| **Routing**              | React Router DOM                                            |
| **Form Management**      | React Hook Form with Zod for validation                     |
| **Data Visualization**   | Recharts                                                    |
| **API Communication**    | Axios                                                       |
| **Icons**                | Heroicons, MUI Icons                                        |
| **Testing**              | Vitest, React Testing Library, JSDOM                        |

---

### 🚀 Getting Started

#### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A running instance of the [Workshop Booking Backend API](<link-to-your-backend-repo>).

#### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [your-admin-panel-repo-url]
    cd admin-panel
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the project root. This file must contain the URL of the backend API.
    ```env
    # .env
    VITE_API_URL=http://localhost:5000/api
    ```
    *Note: Replace `http://localhost:5000` with the actual address of your local backend server if it's different.*

### ⚙️ Available Scripts

-   **Run the development server:**
    ```bash
    npm run dev
    ```
    Open the local URL provided by Vite (usually [http://localhost:5173](http://localhost:5173)) to view the application.

-   **Build for production:**
    This command bundles the app into static files for production in the `dist/` directory.
    ```bash
    npm run build
    ```

-   **Preview the production build:**
    This command serves the `dist/` folder locally to preview the production app.
    ```bash
    npm run preview
    ```

-   **Lint the codebase:**
    ```bash
    npm run lint
    ```

---

### 🌐 Deployment

This application is configured for easy deployment on platforms like **Render** or **Vercel** as a Static Site.

#### Build Configuration

-   **Build Command**: `npm run build`
-   **Publish Directory**: `dist`

#### Environment Variables

You must set the following environment variable in your deployment platform's settings:

-   `VITE_API_URL`: The live, public URL of your deployed backend API (e.g., `https://your-backend-api.onrender.com/api`).