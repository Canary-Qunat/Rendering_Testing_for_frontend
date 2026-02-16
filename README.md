# Frontend - Simple UI

This is a plain, simple frontend for the Canary Tracking System backend.

## Files

- `index.html` - Main HTML page
- `styles.css` - Minimal CSS styling
- `app.js` - JavaScript for API communication

## How to Run

### Option 1: Using Python HTTP Server

```bash
cd frontend
python -m http.server 3000
```

Then open your browser to: `http://localhost:3000`

### Option 2: Using Node.js HTTP Server

```bash
cd frontend
npx http-server -p 3000
```

Then open your browser to: `http://localhost:3000`

### Option 3: Open Directly

Simply open `index.html` in your web browser. However, you may encounter CORS issues with this method.

## Features

- **Authentication**: Login with Zerodha OAuth
- **Profile**: View user profile information
- **Portfolio Summary**: See total value and P&L
- **Holdings**: View all long-term holdings in a table
- **Positions**: View all current positions in a table
- **Refresh**: Manually refresh data from backend

## Backend Requirements

Make sure your backend is running at `http://localhost:8000` before using this frontend.

To start the backend:

```bash
cd ..
uvicorn app.main:app --reload --port 8000
```

## Usage Flow

1. Open the frontend in your browser
2. If not authenticated, click "Login with Zerodha"
3. Complete the Zerodha login process
4. You'll be redirected back to the frontend with your data
5. Click "Refresh Data" to reload information from the backend
