// Configuration
const API_BASE_URL = 'http://127.0.0.1:8001';

// DOM Elements
const welcomeSection = document.getElementById('welcomeSection');
const dashboardSection = document.getElementById('dashboardSection');
const errorSection = document.getElementById('errorSection');
const loginBtn = document.getElementById('loginBtn');
const loginBtnLarge = document.getElementById('loginBtnLarge');
const logoutBtn = document.getElementById('logoutBtn');
const refreshBtn = document.getElementById('refreshBtn');
const retryBtn = document.getElementById('retryBtn');
const errorMessage = document.getElementById('errorMessage');

// State
let isLoggedIn = false;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    loginBtn.addEventListener('click', handleLogin);
    loginBtnLarge.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    refreshBtn.addEventListener('click', loadDashboardData);
    retryBtn.addEventListener('click', () => {
        hideError();
        checkLoginStatus();
    });
}

// Check if user is logged in
async function checkLoginStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/`, {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'running') {
                // Try to load dashboard to verify authentication
                await loadDashboardData();
            }
        }
    } catch (error) {
        console.error('Error checking login status:', error);
        showWelcome();
    }
}

// Handle Login
function handleLogin() {
    // Redirect to backend login endpoint
    window.location.href = `${API_BASE_URL}/kite-login`;
}

// Handle Logout
function handleLogout() {
    isLoggedIn = false;
    showWelcome();
    // Clear any stored data
    localStorage.clear();
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        showLoading();

        const response = await fetch(`${API_BASE_URL}/api/dashboard-data`, {
            credentials: 'include'
        });

        if (response.status === 401) {
            // User needs to login
            showWelcome();
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const result = await response.json();

        if (result.status === 'success' && result.data) {
            const { profile, holdings, positions, summary } = result.data;

            // Update UI with data
            renderProfile(profile);
            renderHoldings(holdings);
            renderPositions(positions);
            updateSummary(summary);

            isLoggedIn = true;
            showDashboard();
        } else {
            throw new Error('Invalid response format');
        }

    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data. Please try logging in again.');
    }
}

// Render Profile Data
function renderProfile(profile) {
    const profileContent = document.getElementById('profileContent');

    if (!profile) {
        profileContent.innerHTML = '<p>No profile data available</p>';
        return;
    }

    profileContent.innerHTML = `
        <div class="profile-item">
            <strong>User ID</strong>
            <span>${profile.user_id || 'N/A'}</span>
        </div>
        <div class="profile-item">
            <strong>Name</strong>
            <span>${profile.user_name || 'N/A'}</span>
        </div>
        <div class="profile-item">
            <strong>Email</strong>
            <span>${profile.email || 'N/A'}</span>
        </div>
        <div class="profile-item">
            <strong>Broker</strong>
            <span>${profile.broker || 'Zerodha'}</span>
        </div>
    `;
}

// Render Holdings Table
function renderHoldings(holdings) {
    const holdingsBody = document.getElementById('holdingsBody');
    const holdingsCount = document.getElementById('holdingsCount');

    if (!holdings || holdings.length === 0) {
        holdingsBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No holdings found</td>
            </tr>
        `;
        holdingsCount.textContent = '0';
        return;
    }

    holdingsCount.textContent = holdings.length;

    holdingsBody.innerHTML = holdings.map(holding => {
        const quantity = holding.quantity || 0;
        const avgPrice = holding.average_price || 0;
        const lastPrice = holding.last_price || 0;
        const currentValue = lastPrice * quantity;
        const investedValue = avgPrice * quantity;
        const pnl = currentValue - investedValue;
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';

        return `
            <tr>
                <td><strong>${holding.tradingsymbol || 'N/A'}</strong></td>
                <td>${quantity}</td>
                <td>₹${avgPrice.toFixed(2)}</td>
                <td>₹${lastPrice.toFixed(2)}</td>
                <td>₹${currentValue.toFixed(2)}</td>
                <td class="${pnlClass}">₹${pnl.toFixed(2)}</td>
            </tr>
        `;
    }).join('');
}

// Render Positions Table
function renderPositions(positions) {
    const positionsBody = document.getElementById('positionsBody');
    const positionsCount = document.getElementById('positionsCount');

    if (!positions || positions.length === 0) {
        positionsBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No positions found</td>
            </tr>
        `;
        positionsCount.textContent = '0';
        return;
    }

    positionsCount.textContent = positions.length;

    positionsBody.innerHTML = positions.map(position => {
        const pnl = position.pnl || 0;
        const pnlClass = pnl >= 0 ? 'positive' : 'negative';

        return `
            <tr>
                <td><strong>${position.tradingsymbol || 'N/A'}</strong></td>
                <td>${position.quantity || 0}</td>
                <td>₹${(position.average_price || 0).toFixed(2)}</td>
                <td>₹${(position.last_price || 0).toFixed(2)}</td>
                <td class="${pnlClass}">₹${pnl.toFixed(2)}</td>
                <td>${position.product || 'N/A'}</td>
            </tr>
        `;
    }).join('');
}

// Update Summary Cards
function updateSummary(summary) {
    document.getElementById('totalValue').textContent = `₹${(summary.total_value || 0).toFixed(2)}`;

    const totalPnl = summary.total_pnl || 0;
    const totalPnlElement = document.getElementById('totalPnl');
    totalPnlElement.textContent = `₹${totalPnl.toFixed(2)}`;
    totalPnlElement.className = `value ${totalPnl >= 0 ? 'positive' : 'negative'}`;

    const holdingsPnl = summary.holdings_pnl || 0;
    const holdingsPnlElement = document.getElementById('holdingsPnl');
    holdingsPnlElement.textContent = `₹${holdingsPnl.toFixed(2)}`;
    holdingsPnlElement.className = `value ${holdingsPnl >= 0 ? 'positive' : 'negative'}`;

    const positionsPnl = summary.positions_pnl || 0;
    const positionsPnlElement = document.getElementById('positionsPnl');
    positionsPnlElement.textContent = `₹${positionsPnl.toFixed(2)}`;
    positionsPnlElement.className = `value ${positionsPnl >= 0 ? 'positive' : 'negative'}`;
}

// UI State Management
function showWelcome() {
    welcomeSection.style.display = 'flex';
    dashboardSection.style.display = 'none';
    errorSection.style.display = 'none';
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
}

function showDashboard() {
    welcomeSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    errorSection.style.display = 'none';
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
}

function showError(message) {
    welcomeSection.style.display = 'none';
    dashboardSection.style.display = 'none';
    errorSection.style.display = 'flex';
    errorMessage.textContent = message;
}

function hideError() {
    errorSection.style.display = 'none';
}

function showLoading() {
    // You can add a loading spinner here if needed
    console.log('Loading...');
}

// Utility Functions
function formatCurrency(value) {
    return `₹${value.toFixed(2)}`;
}

function formatNumber(value) {
    return value.toLocaleString('en-IN');
}
