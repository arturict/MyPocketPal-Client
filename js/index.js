document.addEventListener("DOMContentLoaded", initializeApp);

async function initializeApp() {
  const userStatus = await checkUserStatusAndUpdateUI();

  if (userStatus && userStatus.isLoggedIn) {
    setupEventListeners();
    updateFilteredTransactions();
    setupCategoryDropdown();
    initModalAndLoadCategories();
    showLogoutButton(userStatus.username);
    fetchAndDisplayUserBalance();
    setupTransactionModal();
    loadUserSettings();
    toggleTransactionFilters();
    setupCategoryDropdown("new-category", "custom-category-group");
    setupCategoryDropdown("update-category", "update-custom-category-group");
  } else {
    showLoginButton();
  }
}

function setupEventListeners() {
  const addTransactionBtn = document.getElementById("add-transaction-btn");
  const newTransactionForm = document.getElementById("new-transaction-form");
  const filterCategory = document.getElementById("transactions-filter-category");
  const filterIncome = document.getElementById("transactions-filter-income");
  const filterDate = document.getElementById("transactions-filter-date");
  const filterSortField = document.getElementById("transactions-sort-field");
  const filterSortOrder = document.getElementById("transactions-sort-order");
  const applyFiltersBtn = document.getElementById("apply-transactions-filters");
  const importButton = document.getElementById("import-button");
  const importFileInput = document.getElementById("import-file");
  const exportButton = document.getElementById("export-button");
  const updateTransactionBtn = document.getElementById("submit-update-transaction-btn");

  addTransactionBtn.addEventListener("click", openModal);
  newTransactionForm.addEventListener("submit", (event) => handleNewTransaction(event));
  window.addEventListener("click", handleModalClick);
  filterCategory.addEventListener("change", updateFilteredTransactions);
  filterIncome.addEventListener("change", updateFilteredTransactions);
  filterDate.addEventListener("change", updateFilteredTransactions);
  filterSortField.addEventListener("change", updateFilteredTransactions);
  filterSortOrder.addEventListener("change", updateFilteredTransactions);
  applyFiltersBtn.addEventListener("click", updateFilteredTransactions);

  exportButton.addEventListener("click", exportTransactions);
  importButton.addEventListener("click", () => importFileInput.click());
  importFileInput.addEventListener("change", () => handleCsvUpload(importFileInput));
  updateTransactionBtn.addEventListener("click", updateTransaction);
}

