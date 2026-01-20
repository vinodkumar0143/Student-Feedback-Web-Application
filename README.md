# How to Run the Student Feedback App

Since this is a static web application (HTML, CSS, JavaScript), you don't need to compile it. You just need to open it in a web browser.

## Option 1: The Easiest Way (Recommended)
1. Navigate to the folder where you saved the files.
2. Double-click on **`index.html`**.
3. The app will open in your default web browser (Chrome, Edge, etc.).

## Option 2: Using the Terminal (Windows PowerShell)
If you want to launch it from the terminal, run this command:

```powershell
start index.html
```

## Option 3: Using VS Code (Best for Development)
1. Install the **"Live Server"** extension in VS Code.
2. Right-click on `index.html` and select **"Open with Live Server"**.
   - *Note: If you got an error before, try uninstalling and reinstalling the Live Server extension, or simply use Option 1.*

## Running the Backend (Node.js)
The app now includes a Node.js Express backend in the `backend/` folder.

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will run at `http://localhost:3000`.

## Troubleshooting
- If the animations or styles don't look right, make sure `style.css` and `script.js` are in the same folder as `index.html`.
- If you see a "cors" error (unlikely for this simple app), use a local server (requires installing Node.js or Python).
