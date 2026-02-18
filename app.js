// Backend API URL
const API_BASE_URL = 'https://rendering-testing-for-backend.onrender.com';

// DOM Elements
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const notAuthenticatedEl = document.getElementById('not-authenticated');
const authenticatedEl = document.getElementById('authenticated');
const loginBtn = document.getElementById('login-btn');
const refreshBtn = document.getElementById('refresh-btn');
const userNameEl = document.getElementById('user-name');

// Sections
const profileSection = document.getElementById('profile-section');
const summarySection = document.getElementById('summary-section');
const holdingsSection = document.getElementById('holdings-section');
const positionsSection = document.getElementById('positions-section');

// Utility Functions
function showLoading() {
    loadingEl.style.display = 'block';
}

function hideLoading() {
    loadingEl.style.display = 'none';
}

function showError(message) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function hideError() {
    errorEl.style.display = 'none';
}

function formatNumber(num) {
    return Number(num).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatPnL(value) {
    const formatted = '₹' + formatNumber(Math.abs(value));
    return value >= 0 ? `+${formatted}` : `-${formatted}`;
}

// API Functions
async function checkAuthStatus() {
    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_BASE_URL}/auth/status`);

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();

        if (data.authenticated) {
            showAuthenticatedUI(data.user);
            await loadDashboardData();
        } else {
            showNotAuthenticatedUI();
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        // Show login UI even on error - user might need to authenticate
        showNotAuthenticatedUI();
        showError('Cannot connect to backend. Make sure backend is running on port 8001. Error: ' + error.message);
    } finally {
        hideLoading();
    }
}

async function loadDashboardData() {
    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_BASE_URL}/api/dashboard-data`);

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard data');
        }

        const result = await response.json();
        const data = result.data;

        // Display Profile
        displayProfile(data.profile);

        // Display Summary
        displaySummary(data.summary);

        // Display Holdings
        displayHoldings(data.holdings);

        // Display Positions
        displayPositions(data.positions);

    } catch (error) {
        showError('Error loading dashboard data: ' + error.message);
    } finally {
        hideLoading();
    }
}

// UI Display Functions
function showNotAuthenticatedUI() {
    notAuthenticatedEl.style.display = 'block';
    authenticatedEl.style.display = 'none';
    profileSection.style.display = 'none';
    summarySection.style.display = 'none';
    holdingsSection.style.display = 'none';
    positionsSection.style.display = 'none';
}

function showAuthenticatedUI(user) {
    notAuthenticatedEl.style.display = 'none';
    authenticatedEl.style.display = 'block';
    userNameEl.textContent = user.user_name || user.user_id || 'User';
}

function displayProfile(profile) {
    document.getElementById('profile-user-id').textContent = profile.user_id || 'N/A';
    document.getElementById('profile-user-name').textContent = profile.user_name || 'N/A';
    document.getElementById('profile-email').textContent = profile.email || 'N/A';
    document.getElementById('profile-broker').textContent = profile.broker || 'N/A';

    profileSection.style.display = 'block';
}

function displaySummary(summary) {
    document.getElementById('summary-total-value').textContent = formatNumber(summary.total_value);

    const totalPnlEl = document.getElementById('summary-total-pnl');
    totalPnlEl.textContent = formatPnL(summary.total_pnl);
    totalPnlEl.className = 'pnl ' + (summary.total_pnl >= 0 ? 'positive' : 'negative');

    const holdingsPnlEl = document.getElementById('summary-holdings-pnl');
    holdingsPnlEl.textContent = formatPnL(summary.holdings_pnl);
    holdingsPnlEl.className = 'pnl ' + (summary.holdings_pnl >= 0 ? 'positive' : 'negative');

    const positionsPnlEl = document.getElementById('summary-positions-pnl');
    positionsPnlEl.textContent = formatPnL(summary.positions_pnl);
    positionsPnlEl.className = 'pnl ' + (summary.positions_pnl >= 0 ? 'positive' : 'negative');

    document.getElementById('summary-holdings-count').textContent = summary.holdings_count;
    document.getElementById('summary-positions-count').textContent = summary.positions_count;

    summarySection.style.display = 'block';
}

function displayHoldings(holdings) {
    const tbody = document.getElementById('holdings-tbody');
    tbody.innerHTML = '';

    if (!holdings || holdings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No holdings found</td></tr>';
    } else {
        holdings.forEach(holding => {
            const row = document.createElement('tr');

            const currentValue = holding.last_price * holding.quantity;
            const investedValue = holding.average_price * holding.quantity;
            const pnl = currentValue - investedValue;

            row.innerHTML = `
                <td>${holding.tradingsymbol || 'N/A'}</td>
                <td>${holding.quantity || 0}</td>
                <td>₹${formatNumber(holding.average_price || 0)}</td>
                <td>₹${formatNumber(holding.last_price || 0)}</td>
                <td class="pnl ${pnl >= 0 ? 'positive' : 'negative'}">${formatPnL(pnl)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    holdingsSection.style.display = 'block';
}

function displayPositions(positions) {
    const tbody = document.getElementById('positions-tbody');
    tbody.innerHTML = '';

    if (!positions || positions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">No positions found</td></tr>';
    } else {
        positions.forEach(position => {
            const row = document.createElement('tr');

            const pnl = position.pnl || 0;

            row.innerHTML = `
                <td>${position.tradingsymbol || 'N/A'}</td>
                <td>${position.quantity || 0}</td>
                <td>₹${formatNumber(position.average_price || 0)}</td>
                <td>₹${formatNumber(position.last_price || 0)}</td>
                <td class="pnl ${pnl >= 0 ? 'positive' : 'negative'}">${formatPnL(pnl)}</td>
            `;

            tbody.appendChild(row);
        });
    }

    positionsSection.style.display = 'block';
}

// Event Handlers
loginBtn.addEventListener('click', () => {
    window.location.href = `${API_BASE_URL}/kite-login`;
});

refreshBtn.addEventListener('click', () => {
    loadDashboardData();
});

// Handle OAuth Callback
function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const errorMessage = urlParams.get('message');

    console.log('OAuth Callback - auth status:', authStatus);
    console.log('OAuth Callback - error message:', errorMessage);
    console.log('OAuth Callback - full URL:', window.location.href);

    if (authStatus === 'success') {
        showError('Login successful! Loading data...');
        errorEl.style.backgroundColor = '#e8f5e9';
        errorEl.style.borderColor = '#4caf50';
        errorEl.style.color = '#2e7d32';

        // Clear URL parameters
        window.history.replaceState({}, document.title, window.location.pathname);

        // Check auth status
        setTimeout(() => {
            hideError();
            checkAuthStatus();
        }, 1000);
    } else if (authStatus === 'failed') {
        showError('Login failed. The authentication was not successful. Please try again.');
        showNotAuthenticatedUI();
    } else if (authStatus === 'error') {
        const msg = errorMessage ? `Login error: ${decodeURIComponent(errorMessage)}` : 'Login error occurred. Please try again.';
        showError(msg);
        showNotAuthenticatedUI();
    } else {
        // Normal page load
        checkAuthStatus();
    }
}

// Initialize
handleOAuthCallback();
