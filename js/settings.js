document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    const userStatus = await checkUserStatusAndUpdateUI();

    if (userStatus && userStatus.isLoggedIn) {
        loadOrCreateSettings();
        showLogoutButton(userStatus.username);
    } else {
        showLoginButton();
    }
}



