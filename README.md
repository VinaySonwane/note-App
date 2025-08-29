# Note Taking Full-Stack Application

This is a complete full-stack note-taking application built with a modern tech stack including React, Node.js, Express, and MongoDB, all written in TypeScript. It features a robust user authentication system with both Email/OTP and Google OAuth, allowing users to securely manage their notes online.

**Live Demo:** [**https://your-frontend-url.vercel.app**](https://your-frontend-url.vercel.app) *(<- Replace with your Vercel URL)*

## Features

-   **Secure User Authentication:**
    -   Sign up with Email and a One-Time Password (OTP) sent to your inbox.
    -   Seamless sign-up and login with a Google account (OAuth 2.0).
-   **Session Management:** Uses JSON Web Tokens (JWT) to securely manage user sessions.
-   **Note Management:**
    -   Create new notes.
    -   View all existing notes.
    -   Delete notes with a confirmation dialog.
-   **Modern UI/UX:**
    -   Responsive, mobile-first design built with Tailwind CSS.
    -   User-friendly notifications for all actions.
    -   Expandable notes for better readability of long content.

## Technology Stack

-   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Axios, React Hot Toast
-   **Backend:** Node.js, Express, TypeScript, Mongoose
-   **Database:** MongoDB Atlas
-   **Authentication:** JWT, Google Auth Library, Nodemailer
-   **Deployment:**
    -   Backend deployed on **Render**.
    -   Frontend deployed on **Vercel**.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

-   Node.js (v18 or later)
-   npm or yarn
-   Git
-   A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account
-   A [Google Cloud Platform](https://console.cloud.google.com/) account for OAuth credentials
-   A [Mailtrap.io](https://mailtrap.io/) account for development email testing

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/VinaySonwane/note-App.git](https://github.com/VinaySonwane/note-App.git)
    cd note-App
    ```

2.  **Setup Backend (`/server`):**
    ```bash
    cd server
    npm install
    ```
    -   Create a `.env` file in the `/server` directory and add the following variables:
        ```env
        MONGO_URI=your_mongodb_connection_string
        PORT=5000
        JWT_SECRET=your_super_secret_string
        GOOGLE_CLIENT_ID=your_google_cloud_client_id

        # Mailtrap Credentials for development
        EMAIL_HOST=sandbox.smtp.mailtrap.io
        EMAIL_PORT=2525
        EMAIL_USER=your_mailtrap_username
        EMAIL_PASS=your_mailtrap_password
        ```

3.  **Setup Frontend (`/client`):**
    ```bash
    cd ../client
    npm install
    ```
    -   Create a `.env` file in the `/client` directory and add the following variables:
        ```env
        VITE_GOOGLE_CLIENT_ID=your_google_cloud_client_id
        VITE_API_URL=http://localhost:5000
        ```

### Running the Application

You will need two separate terminals to run both the frontend and backend servers.

1.  **Start the backend server (from the `/server` directory):**
    ```bash
    npm run dev
    ```

2.  **Start the frontend client (from the `/client` directory):**
    ```bash
    npm run dev
    ```

The application will be available at `http://localhost:5173`.
