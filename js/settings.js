document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    const userStatus = await checkUserStatusAndUpdateUI();
    const settingsForm = document.getElementById("settings-form");
    const currencySelect = document.getElementById("currency");
    const showWarningsCheckbox = document.getElementById("show-warnings");
    const notificationCheckbox = document.getElementById("notification");
    const saveBudgetButton = document.getElementById("save-budget-button");
    const monthlyBudgetInput = document.getElementById("monthly-budget");
        if (userStatus && userStatus.isLoggedIn) {
        loadOrCreateSettings();
        showLogoutButton(userStatus.username);
        document.getElementById('settings-form').addEventListener('submit', saveSettings);

    } else {
        showLoginButton();
    }
}

