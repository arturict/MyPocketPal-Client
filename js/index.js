document.addEventListener("DOMContentLoaded", initializeApp);


async function initializeApp() {
    const userStatus = await checkUserStatusAndUpdateUI();

    if (userStatus && userStatus.isLoggedIn) {
        setupEventListeners();
        loadLatestTransactions();
        setupCategoryDropdown();
        initModalAndLoadCategories();
        showLogoutButton(userStatus.username);
        fetchAndDisplayUserBalance();
        setupTransactionModal();
        loadUserSettings();
    } else {
        showLoginButton();
    }
}

function setupEventListeners() {
    const addTransactionBtn = document.getElementById("add-transaction-btn");
    addTransactionBtn.addEventListener("click", openModal);
    document.getElementById("new-transaction-form").addEventListener("submit", (event) => handleNewTransaction(event));
    window.addEventListener("click", handleModalClick);
    document.getElementById('filter-category').addEventListener('change', updateFilteredTransactions);
    document.getElementById('filter-income').addEventListener('change', updateFilteredTransactions);
    document.getElementById('filter-income').addEventListener('change', initModalAndLoadCategories);
    document.getElementById("export-button").addEventListener("click", exportTransactions);


    
}
