# Student Feedback Backend

This is the backend server for the Student Feedback Application, built with Node.js and Express.

## Setup Instructions

Since the automatic installation might have failed, please follow these steps to set up the backend:

1.  **Open a terminal** in this folder (`backend`).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the server**:
    ```bash
    npm start
    ```
    Or for development with auto-restart (requires Node.js v18.11+):
    ```bash
    npm run dev
    ```

## Project Structure

-   `server.js`: The main entry point of the application.
-   `.env`: Configuration variables (like PORT).
-   `package.json`: Project manifest and dependencies.

## API Endpoints

-   `GET /`: Health check to verify the server is running.

## Troubleshooting: "npm is not recognized"

If you see an error saying **"'npm' is not recognized as the name of a cmdlet..."**, it means **Node.js is not installed** on your computer.

### How to Fix:
1.  **Download Node.js**:
    *   Go to [https://nodejs.org/](https://nodejs.org/)
    *   Download the **LTS (Long Term Support)** version for Windows.
2.  **Install It**:
    *   Run the installer.
    *   **Important**: Make sure "Add to PATH" is selected during installation (it is usually selected by default).
3.  **Restart VS Code**:
    *   After installing, **close VS Code completely** and open it again.
    *   This is required for the terminal to recognize the new command.
4.  **Try Again**:
    *   Open the terminal (`Ctrl + ~`).
    *   Type `node -v` to confirm it's installed.
    *   Then try `npm install` and `npm start` again.
