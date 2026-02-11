# Frontend for Canary Trading System

A simple, modern frontend built with HTML, CSS, and JavaScript to interact with the Zerodha trading backend.

## Features

- 🔐 **Zerodha OAuth Login** - Secure authentication flow
- 📊 **Dashboard** - View portfolio summary, holdings, and positions
- 💰 **Real-time P&L** - Track profit and loss across holdings and positions
- 🎨 **Modern UI** - Gradient backgrounds with glassmorphism effects
- 📱 **Responsive Design** - Works on desktop and mobile devices

## Setup Instructions

### 1. Start the Backend Server

First, make sure your FastAPI backend is running:

```bash
# From the project root directory
python main.py
```

The backend should be running at `http://127.0.0.1:8000`

### 2. Serve the Frontend

You have several options to serve the frontend:

#### Option A: Using Python's HTTP Server (Recommended for testing)

```bash
# Navigate to the frontend directory
cd frontend

# Start a simple HTTP server
python -m http.server 3000
```

Then open your browser and go to: `http://localhost:3000`

#### Option B: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option C: Direct File Access

Simply open `index.html` in your browser. However, this may have CORS issues with API calls.

## Usage

1. **Login**: Click the "Login with Zerodha" button
2. **Authenticate**: You'll be redirected to Zerodha's login page
3. **View Dashboard**: After successful authentication, you'll see your:
   - Portfolio summary
   - Holdings with P&L
   - Active positions
4. **Refresh Data**: Click the refresh button to update your data

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── styles.css      # Styling and animations
├── app.js          # JavaScript logic and API integration
└── README.md       # This file
```

## API Integration

The frontend connects to the following backend endpoints:

- `GET /` - Check backend status
- `GET /kite-login` - Initiate Zerodha OAuth login
- `GET /callback` - OAuth callback handler
- `GET /dashboard` - Get dashboard data (requires authentication)

## Configuration

The API base URL is configured in `app.js`:

```javascript
const API_BASE_URL = 'http://127.0.0.1:8000';
```

If your backend is running on a different port or domain, update this value.

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Troubleshooting

### CORS Errors

If you see CORS errors in the browser console:
1. Make sure the backend is running
2. Check that CORS is properly configured in `main.py`
3. Use a proper HTTP server (not direct file access)

### Login Not Working

1. Verify your Zerodha API credentials in the backend `.env` file
2. Check that the redirect URL matches your Zerodha app configuration
3. Ensure the backend is running and accessible

### Data Not Loading

1. Check browser console for errors
2. Verify you're logged in (check Network tab in DevTools)
3. Try refreshing the page

## Development

To modify the frontend:

1. **HTML** (`index.html`) - Update structure and layout
2. **CSS** (`styles.css`) - Modify styling and animations
3. **JavaScript** (`app.js`) - Change logic and API calls

The code is well-commented for easy understanding and modification.

## Security Notes

- Never commit API keys or secrets
- The frontend relies on backend authentication
- Access tokens are managed by the backend
- Use HTTPS in production

## License

MIT License - See LICENSE file for details
