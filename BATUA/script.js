// Enhanced BATUA Expense Tracker JavaScript

// Global Variables
let expenses = [];
let quickAddItems = [
    { id: 1, icon: '☕', name: 'Coffee', price: 4.50, category: 'food' },
    { id: 2, icon: '🍔', name: 'Lunch', price: 12.99, category: 'food' },
    { id: 3, icon: '⛽', name: 'Gas', price: 45.00, category: 'travel' },
    { id: 4, icon: '🎬', name: 'Movie', price: 15.00, category: 'entertainment' },
    { id: 5, icon: '🛒', name: 'Groceries', price: 85.00, category: 'shopping' },
    { id: 6, icon: '🚌', name: 'Transport', price: 3.50, category: 'travel' }
];

let settings = {
    monthlyBudget: 3000,
    currency: 'USD',
    budgetAlerts: true,
    dailyReminders: false,
    weeklyReports: true
};

let currentUser = null;
let currentEditId = null;
let charts = {};

// Category icons mapping
const categoryIcons = {
    food: '🍔',
    travel: '✈',
    bills: '⚡',
    shopping: '🛍',
    entertainment: '🎬',
    health: '❤',
    education: '🎓'
};

// Currency symbols
const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    INR: '₹'
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is authenticated
    checkAuthentication();
    
    if (currentUser) {
        loadUserData();
        showMainApp();
        initializeApp();
    } else {
        showAuthModal();
    }
});

// Authentication Functions
function checkAuthentication() {
    const userData = localStorage.getItem('quicktap_user');
    if (userData) {
        currentUser = JSON.parse(userData);
        return true;
    }
    return false;
}

function showAuthModal() {
    const authModal = document.getElementById('authModal');
    const mainNav = document.getElementById('mainNav');
    const mainContent = document.getElementById('mainContent');
    
    authModal.classList.add('active');
    mainNav.style.display = 'none';
    mainContent.style.display = 'none';
}

function showMainApp() {
    const authModal = document.getElementById('authModal');
    const mainNav = document.getElementById('mainNav');
    const mainContent = document.getElementById('mainContent');
    
    authModal.classList.remove('active');
    mainNav.style.display = 'block';
    mainContent.style.display = 'block';
    
    // Update user name in nav
    const userName = document.getElementById('userName');
    if (userName && currentUser) {
        userName.textContent = currentUser.name || currentUser.email || 'User';
    }
}

function switchAuthTab(tab) {
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    tabs.forEach(t => t.classList.remove('active'));
    forms.forEach(f => f.classList.remove('active'));
    
    document.querySelector([onclick="switchAuthTab('${tab}')"]).classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

function handleEmailSignIn(event) {
    event.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    // Simple demo authentication
    const userData = {
        id: generateId(),
        email: email,
        name: email.split('@')[0],
        authMethod: 'email'
    };
    
    authenticateUser(userData);
}

function handleEmailSignUp(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    // Simple demo authentication
    const userData = {
        id: generateId(),
        name: name,
        email: email,
        authMethod: 'email'
    };
    
    authenticateUser(userData);
}

function signInWithGoogle() {
    // Demo Google authentication
    const userData = {
        id: generateId(),
        name: 'Google User',
        email: 'user@gmail.com',
        authMethod: 'google'
    };
    
    showNotification('Signing in with Google...', 'info');
    setTimeout(() => authenticateUser(userData), 1500);
}

function signUpWithGoogle() {
    signInWithGoogle();
}

function signInWithPhone() {
    switchToPhoneVerification();
}

function signUpWithPhone() {
    switchToPhoneVerification();
}

function switchToPhoneVerification() {
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(f => f.classList.remove('active'));
    document.getElementById('phoneVerification').classList.add('active');
}

function sendOTP() {
    const countryCode = document.getElementById('countryCode').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    
    if (!phoneNumber) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Demo OTP sending
    showNotification('OTP sent successfully!', 'success');
    document.getElementById('otpSection').style.display = 'block';
}

function verifyOTP() {
    const otp = document.getElementById('otpInput').value;
    
    if (otp.length !== 6) {
        showNotification('Please enter a valid 6-digit OTP', 'error');
        return;
    }
    
    // Demo OTP verification
    const userData = {
        id: generateId(),
        name: 'Phone User',
        phone: document.getElementById('countryCode').value + document.getElementById('phoneNumber').value,
        authMethod: 'phone'
    };
    
    authenticateUser(userData);
}

function resendOTP() {
    sendOTP();
}

function forgotPassword() {
    showNotification('Password reset link sent to your email!', 'info');
}

function authenticateUser(userData) {
    currentUser = userData;
    localStorage.setItem('quicktap_user', JSON.stringify(userData));
    
    showNotification('Welcome to BATUA!', 'success');
    setTimeout(() => {
        showMainApp();
        initializeApp();
    }, 1000);
}

function signOut() {
    if (confirm('Are you sure you want to sign out?')) {
        localStorage.removeItem('quicktap_user');
        localStorage.removeItem('quicktap_expenses_' + currentUser.id);
        localStorage.removeItem('quicktap_quickadd_' + currentUser.id);
        localStorage.removeItem('quicktap_settings_' + currentUser.id);
        
        currentUser = null;
        showNotification('Signed out successfully', 'info');
        setTimeout(() => location.reload(), 1000);
    }
}

// Data Management Functions
function loadUserData() {
    if (!currentUser) return;
    
    const userExpenses = localStorage.getItem('quicktap_expenses_' + currentUser.id);
    const userQuickAdd = localStorage.getItem('quicktap_quickadd_' + currentUser.id);
    const userSettings = localStorage.getItem('quicktap_settings_' + currentUser.id);
    
    expenses = userExpenses ? JSON.parse(userExpenses) : [];
    quickAddItems = userQuickAdd ? JSON.parse(userQuickAdd) : quickAddItems;
    settings = userSettings ? JSON.parse(userSettings) : settings;
}

function saveUserData() {
    if (!currentUser) return;
    
    localStorage.setItem('quicktap_expenses_' + currentUser.id, JSON.stringify(expenses));
    localStorage.setItem('quicktap_quickadd_' + currentUser.id, JSON.stringify(quickAddItems));
    localStorage.setItem('quicktap_settings_' + currentUser.id, JSON.stringify(settings));
}

// Initialize app components
function initializeApp() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = today;
    }
    
    // Set current month for dashboard filter
    const dashboardMonth = document.getElementById('dashboardMonth');
    if (dashboardMonth) {
        const currentMonth = new Date().toISOString().slice(0, 7);
        dashboardMonth.value = currentMonth;
    }
    
    displayExpenses();
    displayQuickAddItems();
    updateStats();
    updateHeroStats();
    loadSettings();
    checkBudgetAlert();

    // Add event listeners
    addEventListeners();
    
    // Load theme preference
    loadTheme();
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 500);
}

function addEventListeners() {
    // Form submissions
    const expenseForm = document.getElementById('expenseForm');
    if (expenseForm) {
        expenseForm.addEventListener('submit', addExpense);
    }
    // Add custom field button
    const addCustomFieldBtn = document.getElementById('addCustomFieldBtn');
    if (addCustomFieldBtn) {
        addCustomFieldBtn.addEventListener('click', function() {
            const container = document.getElementById('customFieldsContainer');
            const row = document.createElement('div');
            row.className = 'form-group custom-field-row';
            row.innerHTML = `
                <div style="display:flex;gap:0.5rem;align-items:center;">
                    <input type="text" class="custom-field-label" placeholder="Field Name (e.g. Location)" style="flex:1;" required>
                    <input type="text" class="custom-field-value" placeholder="Value" style="flex:1;" required>
                    <button type="button" class="remove-custom-field-btn" title="Remove" style="background:var(--error);color:#fff;border:none;border-radius:6px;padding:0.5rem 0.75rem;cursor:pointer;">&times;</button>
                </div>
            `;
            container.appendChild(row);
            row.querySelector('.remove-custom-field-btn').onclick = function() {
                row.remove();
            };
        });
    }
    
    const editForm = document.getElementById('editQuickAddForm');
    if (editForm) {
        editForm.addEventListener('submit', saveQuickAddItem);
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('editModal');
        if (event.target === modal) {
            closeModal();
        }
        
        // Close user dropdown when clicking outside
        const userMenu = document.querySelector('.user-menu');
        const userDropdown = document.getElementById('userDropdown');
        if (!userMenu.contains(event.target)) {
            userDropdown.classList.remove('active');
        }
    });
}

// Navigation functions
function showPage(pageName) {
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    const activeLink = document.querySelector([onclick="showPage('${pageName}')"]);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
        targetPage.classList.add('animate-in');
    }
    
    // Refresh page-specific data
    if (pageName === 'quickadd') {
        displayQuickAddItems();
    } else if (pageName === 'analytics') {
        updateAnalytics();
        setTimeout(() => initializeCharts(), 100);
    } else if (pageName === 'dashboard') {
        updateStats();
        displayExpenses();
    } else if (pageName === 'home') {
        updateHeroStats();
    }
}

// Theme functions
function toggleTheme() {
    const body = document.body;
    const themeToggle = document.querySelector('.theme-toggle i');
    
    body.classList.toggle('dark-theme');
    if (themeToggle) {
        themeToggle.className = body.classList.contains('dark-theme') ? 'fas fa-sun' : 'fas fa-moon';
    }
    
    // Save theme preference
    localStorage.setItem('darkTheme', body.classList.contains('dark-theme'));
    
    // Re-initialize charts with new colors
    setTimeout(() => initializeCharts(), 100);
}

function loadTheme() {
    const isDark = localStorage.getItem('darkTheme') === 'true';
    if (isDark) {
        document.body.classList.add('dark-theme');
        const themeToggle = document.querySelector('.theme-toggle i');
        if (themeToggle) {
            themeToggle.className = 'fas fa-sun';
        }
    }
}

// User menu functions
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    userDropdown.classList.toggle('active');
}

function showProfile() {
    showNotification('Profile feature coming soon!', 'info');
}

function exportData() {
    const data = {
        user: currentUser,
        expenses: expenses,
        quickAddItems: quickAddItems,
        settings: settings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `quicktap-data-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

// Expense functions
function addExpense(event) {
    event.preventDefault();
    const amount = parseFloat(document.getElementById('amount').value);
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    if (!amount || !description || !category || !date) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    // Collect custom fields
    const customFields = [];
    const customFieldRows = document.querySelectorAll('.custom-field-row');
    customFieldRows.forEach(row => {
        const label = row.querySelector('.custom-field-label').value.trim();
        const value = row.querySelector('.custom-field-value').value.trim();
        if (label && value) {
            customFields.push({ label, value });
        }
    });
    const expense = {
        id: generateId(),
        amount: amount,
        description: description,
        category: category,
        date: date,
        timestamp: new Date().toISOString(),
        customFields: customFields
    };
    expenses.unshift(expense);
    saveUserData();
    // Show success message
    showSuccessMessage('successMessage');
    showNotification('Expense added successfully!', 'success');
    // Reset form
    document.getElementById('expenseForm').reset();
    document.getElementById('date').value = new Date().toISOString().split('T')[0];
    document.getElementById('customFieldsContainer').innerHTML = '';
    displayExpenses();
    updateStats();
    updateHeroStats();
    checkBudgetAlert();
}

function quickAddExpense(item) {
    const expense = {
        id: generateId(),
        amount: item.price,
        description: item.name,
        category: item.category,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString()
    };
    
    expenses.unshift(expense);
    saveUserData();
    
    // Add click animation
    const quickItem = event.currentTarget;
    quickItem.classList.add('clicked');
    setTimeout(() => {
        quickItem.classList.remove('clicked');
    }, 600);
    
    // Show success message
    showSuccessMessage('quickAddSuccess');
    showNotification(`Added ${item.name} - ${formatCurrency(item.price)}`, 'success');
    
    updateStats();
    updateHeroStats();
    checkBudgetAlert();
    
    // If on dashboard, refresh expense list
    if (document.getElementById('dashboard').classList.contains('active')) {
        displayExpenses();
    }
}

function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveUserData();
        displayExpenses();
        updateStats();
        updateHeroStats();
        showNotification('Expense deleted', 'info');
    }
}

function displayExpenses() {
    const expenseList = document.getElementById('expenseList');
    if (!expenseList) return;
    let filteredExpenses = expenses;
    // Filter by selected month if on dashboard
    const dashboardMonth = document.getElementById('dashboardMonth');
    if (dashboardMonth && dashboardMonth.value) {
        const selectedMonth = dashboardMonth.value;
        filteredExpenses = expenses.filter(expense => {
            return expense.date.startsWith(selectedMonth);
        });
    }
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = `
            <div class="empty-state">
                <h3>No expenses yet</h3>
                <p>Start tracking your expenses by adding your first one above or using the Quick Add feature.</p>
            </div>
        `;
        return;
    }
    const expenseHTML = filteredExpenses.map(expense => {
        let customFieldsHtml = '';
        if (expense.customFields && expense.customFields.length > 0) {
            customFieldsHtml = '<div class="expense-custom-fields" style="margin-top:0.5rem;">' +
                expense.customFields.map(f => `<span style=\"display:inline-block;background:var(--bg-tertiary);color:var(--text-secondary);border-radius:6px;padding:2px 8px;margin-right:4px;font-size:0.85em;\">${f.label}: ${f.value}</span>`).join('') +
                '</div>';
        }
        return `
        <div class="expense-item">
            <div class="expense-details">
                <div class="expense-category">${categoryIcons[expense.category] || '💰'}</div>
                <div class="expense-info">
                    <h4>${expense.description}</h4>
                    <p>${formatDate(expense.date)} • ${capitalizeFirst(expense.category)}</p>
                    ${customFieldsHtml}
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div class="expense-amount">${formatCurrency(expense.amount)}</div>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
        `;
    }).join('');
    expenseList.innerHTML = expenseHTML;
}

// Quick Add functions
function displayQuickAddItems() {
    const quickAddGrid = document.getElementById('quickAddGrid');
    if (!quickAddGrid) return;
    
    const itemsHTML = quickAddItems.map(item => `
        <div class="quick-expense-item" onclick="quickAddExpense(${JSON.stringify(item).replace(/"/g, '&quot;')})">
            <button class="edit-btn" onclick="editQuickAddItem(${item.id}); event.stopPropagation();">
                <i class="fas fa-edit"></i>
            </button>
            <div class="quick-expense-icon">${item.icon}</div>
            <div class="quick-expense-name">${item.name}</div>
            <div class="quick-expense-price">${formatCurrency(item.price)}</div>
        </div>
    `).join('');
    
    const addNewHTML = `
        <div class="quick-expense-item add-new-quick" onclick="addNewQuickItem()">
            <div class="plus-icon">+</div>
            <div>Add New</div>
        </div>
    `;
    
    quickAddGrid.innerHTML = itemsHTML + addNewHTML;
}

function editQuickAddItem(id) {
    const item = quickAddItems.find(item => item.id === id);
    if (!item) return;
    
    currentEditId = id;
    
    document.getElementById('editIcon').value = item.icon;
    document.getElementById('editName').value = item.name;
    document.getElementById('editPrice').value = item.price;
    document.getElementById('editCategory').value = item.category;
    
    const modal = document.getElementById('editModal');
    modal.classList.add('active');
}

function addNewQuickItem() {
    currentEditId = null;
    
    document.getElementById('editIcon').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editPrice').value = '';
    document.getElementById('editCategory').value = 'food';
    
    const modal = document.getElementById('editModal');
    modal.classList.add('active');
}

function saveQuickAddItem(event) {
    event.preventDefault();
    
    const icon = document.getElementById('editIcon').value;
    const name = document.getElementById('editName').value;
    const price = parseFloat(document.getElementById('editPrice').value);
    const category = document.getElementById('editCategory').value;
    
    if (!icon || !name || !price || !category) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    if (currentEditId) {
        // Edit existing item
        const index = quickAddItems.findIndex(item => item.id === currentEditId);
        if (index !== -1) {
            quickAddItems[index] = { id: currentEditId, icon, name, price, category };
        }
    } else {
        // Add new item
        const newItem = {
            id: generateId(),
            icon,
            name,
            price,
            category
        };
        quickAddItems.push(newItem);
    }
    
    saveUserData();
    displayQuickAddItems();
    closeModal();
    showNotification('Quick add item saved!', 'success');
}

function deleteQuickAddItem() {
    if (!currentEditId) return;
    
    if (confirm('Are you sure you want to delete this quick add item?')) {
        quickAddItems = quickAddItems.filter(item => item.id !== currentEditId);
        saveUserData();
        displayQuickAddItems();
        closeModal();
        showNotification('Quick add item deleted', 'info');
    }
}

function closeModal() {
    const modal = document.getElementById('editModal');
    modal.classList.remove('active');
    currentEditId = null;
}

// Statistics functions
function updateStats() {
    const dashboardMonth = document.getElementById('dashboardMonth');
    let targetMonth, targetYear;
    
    if (dashboardMonth && dashboardMonth.value) {
        const [year, month] = dashboardMonth.value.split('-');
        targetMonth = parseInt(month) - 1;
        targetYear = parseInt(year);
    } else {
        targetMonth = new Date().getMonth();
        targetYear = new Date().getFullYear();
    }
    
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === targetMonth && expenseDate.getFullYear() === targetYear;
    });
    
    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const transactionCount = monthlyExpenses.length;
    const budgetRemaining = settings.monthlyBudget - totalSpent;
    
    // Update DOM elements
    const totalSpentEl = document.getElementById('totalSpent');
    if (totalSpentEl) totalSpentEl.textContent = formatCurrency(totalSpent);
    
    const transactionCountEl = document.getElementById('transactionCount');
    if (transactionCountEl) transactionCountEl.textContent = transactionCount;
    
    const budgetRemainingEl = document.getElementById('budgetRemaining');
    if (budgetRemainingEl) {
        budgetRemainingEl.textContent = formatCurrency(budgetRemaining);
        budgetRemainingEl.style.color = budgetRemaining < 0 ? 'var(--error)' : 'var(--primary)';
    }
    
    // Update budget progress
    updateBudgetProgress(totalSpent);
}

function updateHeroStats() {
    const totalExpenses = expenses.length;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const budgetLeft = settings.monthlyBudget - thisMonthTotal;
    
    const heroTotalExpenses = document.getElementById('heroTotalExpenses');
    const heroThisMonth = document.getElementById('heroThisMonth');
    const heroBudgetLeft = document.getElementById('heroBudgetLeft');
    
    if (heroTotalExpenses) heroTotalExpenses.textContent = totalExpenses;
    if (heroThisMonth) heroThisMonth.textContent = formatCurrency(thisMonthTotal);
    if (heroBudgetLeft) {
        heroBudgetLeft.textContent = formatCurrency(budgetLeft);
        heroBudgetLeft.style.color = budgetLeft < 0 ? 'var(--error)' : 'inherit';
    }
}

function updateBudgetProgress(totalSpent) {
    const budgetProgress = document.getElementById('budgetProgressBar');
    const budgetProgressText = document.getElementById('budgetProgressText');
    
    if (budgetProgress && budgetProgressText) {
        const percentage = Math.min((totalSpent / settings.monthlyBudget) * 100, 100);
        budgetProgress.style.width = percentage + '%';
        budgetProgressText.textContent = `${percentage.toFixed(0)}% used`;
        
        // Change color based on percentage
        if (percentage > 90) {
            budgetProgress.style.background = 'var(--error)';
        } else if (percentage > 70) {
            budgetProgress.style.background = 'var(--warning)';
        } else {
            budgetProgress.style.background = 'var(--gradient)';
        }
    }
}

function filterByMonth() {
    updateStats();
    displayExpenses();
}

// Budget Alert functions
function checkBudgetAlert() {
    if (!settings.budgetAlerts) return;
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    });
    
    const totalSpent = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const percentage = (totalSpent / settings.monthlyBudget) * 100;
    
    if (percentage >= 100) {
        showBudgetAlert('You have exceeded your monthly budget limit!', 'over');
    } else if (percentage >= 90) {
        showBudgetAlert('You are approaching your monthly budget limit. You have used ' + percentage.toFixed(0) + '% of your budget.', 'warning');
    }
}

function showBudgetAlert(message, type) {
    const modal = document.getElementById('budgetAlertModal');
    const messageEl = document.getElementById('budgetAlertMessage');
    
    if (messageEl) {
        messageEl.textContent = message;
    }
    
    modal.classList.add('active');
}

function closeBudgetAlert() {
    const modal = document.getElementById('budgetAlertModal');
    modal.classList.remove('active');
}

// Analytics functions
function updateAnalytics() {
    const timeframe = document.getElementById('analyticsTimeframe')?.value || 'month';
    
    // Update daily average
    updateDailyAverage(timeframe);
    
    // Update charts will be called separately
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function updateDailyAverage(timeframe) {
    let filteredExpenses = [];
    const now = new Date();
    
    if (timeframe === 'month') {
        filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
        });
    } else if (timeframe === 'quarter') {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= threeMonthsAgo;
        });
    } else if (timeframe === 'year') {
        filteredExpenses = expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate.getFullYear() === now.getFullYear();
        });
    }
    
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const days = timeframe === 'month' ? now.getDate() : 
                 timeframe === 'quarter' ? 90 : 
                 timeframe === 'year' ? getDayOfYear(now) : 30;
    
    const dailyAverage = total / days;
    
    const dailyAverageEl = document.getElementById('dailyAverage');
    if (dailyAverageEl) {
        dailyAverageEl.textContent = formatCurrency(dailyAverage);
    }
}

// Chart functions
function initializeCharts() {
    // Destroy existing charts
    Object.values(charts).forEach(chart => {
        if (chart) chart.destroy();
    });
    
    initializeSpendingChart();
    initializeCategoryChart();
    initializeReportChart();
}

function initializeSpendingChart() {
    const canvas = document.getElementById('spendingChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    
    // Get last 7 days data
    const last7Days = getLast7DaysData();
    
    charts.spendingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(d => d.date),
            datasets: [{
                label: 'Daily Spending',
                data: last7Days.map(d => d.amount),
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? '#475569' : '#e2e8f0'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        color: isDark ? '#475569' : '#e2e8f0'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: isDark ? '#f8fafc' : '#1e293b'
                    }
                }
            }
        }
    });
}

function initializeCategoryChart() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    
    const categoryData = getCategoryData();
    
    charts.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categoryData.map(d => capitalizeFirst(d.category)),
            datasets: [{
                data: categoryData.map(d => d.amount),
                backgroundColor: [
                    '#6366f1',
                    '#8b5cf6',
                    '#06b6d4',
                    '#10b981',
                    '#f59e0b',
                    '#ef4444',
                    '#ec4899'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: isDark ? '#f8fafc' : '#1e293b',
                        padding: 20
                    }
                }
            }
        }
    });
}

function initializeReportChart() {
    const canvas = document.getElementById('reportChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isDark = document.body.classList.contains('dark-theme');
    
    // This will be updated when generateReport is called
    charts.reportChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Daily Spending',
                data: [],
                backgroundColor: 'rgba(99, 102, 241, 0.8)'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: isDark ? '#475569' : '#e2e8f0'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b',
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        color: isDark ? '#475569' : '#e2e8f0'
                    },
                    ticks: {
                        color: isDark ? '#cbd5e1' : '#64748b'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: isDark ? '#f8fafc' : '#1e293b'
                    }
                }
            }
        }
    });
}

// Report functions
function generateReport() {
    const startDate = document.getElementById('reportStartDate').value;
    const endDate = document.getElementById('reportEndDate').value;
    
    if (!startDate || !endDate) {
        showNotification('Please select both start and end dates', 'error');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('Start date must be before end date', 'error');
        return;
    }
    
    const reportExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= new Date(startDate) && expenseDate <= new Date(endDate);
    });
    
    // Update report summary
    updateReportSummary(startDate, endDate, reportExpenses);
    
    // Update report chart
    updateReportChart(startDate, endDate, reportExpenses);
    
    // Update report table
    updateReportTable(reportExpenses);
    
    showNotification('Report generated successfully!', 'success');
}

function updateReportSummary(startDate, endDate, reportExpenses) {
    const reportPeriod = document.getElementById('reportPeriod');
    const reportTotal = document.getElementById('reportTotal');
    const reportTransactions = document.getElementById('reportTransactions');
    
    if (reportPeriod) {
    reportPeriod.textContent = `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }
    
    if (reportTotal) {
        const total = reportExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        reportTotal.textContent = formatCurrency(total);
    }
    
    if (reportTransactions) {
        reportTransactions.textContent = reportExpenses.length;
    }
}

function updateReportChart(startDate, endDate, reportExpenses) {
    if (!charts.reportChart) return;
    
    // Group expenses by date
    const dailyData = {};
    reportExpenses.forEach(expense => {
        const date = expense.date;
        dailyData[date] = (dailyData[date] || 0) + expense.amount;
    });
    
    const sortedDates = Object.keys(dailyData).sort();
    
    charts.reportChart.data.labels = sortedDates.map(date => formatDate(date, true));
    charts.reportChart.data.datasets[0].data = sortedDates.map(date => dailyData[date]);
    charts.reportChart.update();
}

function updateReportTable(reportExpenses) {
    const tableContent = document.getElementById('reportTableContent');
    if (!tableContent) return;
    
    if (reportExpenses.length === 0) {
        tableContent.innerHTML = '<p class="text-center">No expenses found for the selected period.</p>';
        return;
    }
    
    // Group by category
    const categoryTotals = {};
    reportExpenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    const sortedCategories = Object.entries(categoryTotals)
        .sort(([,a], [,b]) => b - a);
    
    const tableHTML = `
        <div class="table-responsive">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="border-bottom: 2px solid var(--border);">
                        <th style="text-align: left; padding: 1rem;">Category</th>
                        <th style="text-align: right; padding: 1rem;">Amount</th>
                        <th style="text-align: right; padding: 1rem;">Percentage</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedCategories.map(([category, amount]) => {
                        const total = reportExpenses.reduce((sum, expense) => sum + expense.amount, 0);
                        const percentage = ((amount / total) * 100).toFixed(1);
                        return `
                            <tr style="border-bottom: 1px solid var(--border);">
                                <td style="padding: 1rem;">
                                    ${categoryIcons[category] || '💰'} ${capitalizeFirst(category)}
                                </td>
                                <td style="text-align: right; padding: 1rem; font-weight: 600; color: var(--primary);">
                                    ${formatCurrency(amount)}
                                </td>
                                <td style="text-align: right; padding: 1rem; color: var(--text-secondary);">
                                    ${percentage}%
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
    `;
    
    tableContent.innerHTML = tableHTML;
}

// Settings functions
function loadSettings() {
    const monthlyBudgetEl = document.getElementById('monthlyBudget');
    if (monthlyBudgetEl) monthlyBudgetEl.value = settings.monthlyBudget;
    
    const currencyEl = document.getElementById('currency');
    if (currencyEl) currencyEl.value = settings.currency;
    
    const budgetAlertsEl = document.getElementById('budgetAlerts');
    if (budgetAlertsEl) budgetAlertsEl.checked = settings.budgetAlerts;
    
    const dailyRemindersEl = document.getElementById('dailyReminders');
    if (dailyRemindersEl) dailyRemindersEl.checked = settings.dailyReminders;
    
    const weeklyReportsEl = document.getElementById('weeklyReports');
    if (weeklyReportsEl) weeklyReportsEl.checked = settings.weeklyReports;
}

function saveBudgetSettings() {
    const monthlyBudget = parseFloat(document.getElementById('monthlyBudget').value);
    const currency = document.getElementById('currency').value;
    
    if (!monthlyBudget || monthlyBudget <= 0) {
        showNotification('Please enter a valid monthly budget', 'error');
        return;
    }
    
    settings.monthlyBudget = monthlyBudget;
    settings.currency = currency;
    
    saveUserData();
    updateStats();
    updateHeroStats();
    showNotification('Budget settings saved successfully!', 'success');
}

function saveNotificationSettings() {
    settings.budgetAlerts = document.getElementById('budgetAlerts').checked;
    settings.dailyReminders = document.getElementById('dailyReminders').checked;
    settings.weeklyReports = document.getElementById('weeklyReports').checked;
    
    saveUserData();
    showNotification('Notification preferences updated successfully!', 'success');
}

// Utility functions
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function formatDate(dateString, short = false) {
    const date = new Date(dateString);
    if (short) {
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
    }
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function formatCurrency(amount) {
    const symbol = currencySymbols[settings.currency] || '';
    return `${symbol}${amount.toFixed(2)}`;
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function showSuccessMessage(messageId) {
    const successMessage = document.getElementById(messageId);
    if (successMessage) {
        successMessage.classList.add('show');
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 3000);
    }
}

function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function getLast7DaysData() {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        const dayExpenses = expenses.filter(expense => expense.date === dateString);
        const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        last7Days.push({
            date: formatDate(dateString, true),
            amount: dayTotal
        });
    }
    
    return last7Days;
}

function getCategoryData() {
    const categoryTotals = {};
    expenses.forEach(expense => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
    });
    
    return Object.entries(categoryTotals)
        .map(([category, amount]) => ({ category, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 7); // Top 7 categories
}

function getDayOfYear(date) {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
}

// Initialize report dates
function initializeReportDates() {
    const today = new Date();
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);
    
    const reportStartDate = document.getElementById('reportStartDate');
    const reportEndDate = document.getElementById('reportEndDate');
    
    if (reportStartDate) reportStartDate.value = lastWeek.toISOString().split('T')[0];
    if (reportEndDate) reportEndDate.value = today.toISOString().split('T')[0];
}

// Set initial report dates when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        initializeReportDates();
    }, 1000);
});

// Handle window resize for charts
window.addEventListener('resize', function() {
    Object.values(charts).forEach(chart => {
        if (chart) chart.resize();
    });
});

// Export individual functions for debugging (can be removed in production)
if (typeof window !== 'undefined') {
    window.BATUADebug = {
        expenses,
        quickAddItems,
        settings,
        currentUser,
        charts
    };

    // Responsive mobile nav toggle
    window.toggleMobileNav = function() {
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) navLinks.classList.toggle('open');
    };

    // Close mobile nav on link click (for better UX)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            if (navLinks && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
            }
        });
    });
}