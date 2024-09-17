//login start
const loginLink = document.getElementById("login-link");

async function checkUserStatusAndUpdateUI() {
  const userStatus = await getUserStatus();

  if (userStatus && userStatus.isLoggedIn) {
    showLogoutButton(userStatus.username);
    return userStatus;
  } else {
    showLoginButton();
    return null;
  }
}

async function getUserStatus() {
  try {
    const response = await fetch("https://localhost:7248/api/user/status", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Fehler beim Abrufen des Benutzerstatus.");
    }

    return await response.json();
  } catch (error) {
    console.error("Fehler beim Abrufen des Benutzerstatus:", error);
    return { isLoggedIn: false };
  }
}
function validateEmail(email) {
  console.log("Validiere E-Mail:", email);
  return /\S+@\S+\.\S+/.test(email);
}

// Funktion zur Handhabung der Registrierung
async function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById("reg-username").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const password = document.getElementById("reg-password").value.trim();
  const registerStatus = document.getElementById("register-status");

  if (!username || !email || !password) {
    displayMessage(registerStatus, "Bitte füllen Sie alle Felder aus.", false);
    return;
  }

  if (!validateEmail(email)) {
    displayMessage(
      registerStatus,
      "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      false
    );
    return;
  }

  try {
    const registerResponse = await fetch(
      "https://localhost:7248/api/user/register",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (!registerResponse.ok) {
      throw new Error("Die Registrierung ist fehlgeschlagen.");
    }

    const loginResponse = await fetch("https://localhost:7248/api/user/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!loginResponse.ok) {
      throw new Error("Automatische Anmeldung fehlgeschlagen.");
    }
    showLogoutButton(username);
    loadOrCreateSettings();
    displayMessage(
      registerStatus,
      "Sie haben sich erfolgreich registriert und sind nun eingeloggt.",
      true
    );

    setTimeout(() => {
      window.location.href = "/";
    }, 2500);
  } catch (error) {
    displayMessage(registerStatus, error.message, false);
  }
}

// Hilfsfunktion zum Escaping von HTML
function escapeHtml(text) {
  console.log("Escape HTML:", text);
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

async function handleLogin(event) {
  console.log("handleLogin gestartet");
  event.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginStatus = document.getElementById("login-status");

  if (!validateRequired(username, password)) {
    displayMessage(
      loginStatus,
      "Bitte Benutzername und Passwort eingeben.",
      false
    );
    console.log("handleLogin beendet aufgrund fehlender Eingaben");
    return;
  }

  try {
    const response = await fetch("https://localhost:7248/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });

    console.log("Serverantwort auf Login:", response);

    if (!response.ok) {
      throw new Error("Login fehlgeschlagen: " + response.statusText);
    }

    const responseData = await response.json();
    displayMessage(loginStatus, "Login erfolgreich!", true);
    showLogoutButton(username);
    loadOrCreateSettings();
    setTimeout(() => {
      window.location.href = "/";
    }, 2500);
  } catch (error) {
    console.error("Fehler beim Login:", error);
    displayMessage(loginStatus, error.message, false);
  }
  console.log("handleLogin beendet");
}

function validateRequired(...values) {
  return values.every((value) => value.length > 0);
}

function displayMessage(element, message, success) {
  element.innerText = message;
  element.style.display = "block";
  if (success) {
    element.style.color = "#28a745";
  } else {
    element.style.color = "#dc3545";
  }
}
//login ende

//überall start
function showLoginButton() {
  const loginLink = document.getElementById("login-link");
  loginLink.innerHTML =
    "<button onclick=\"location.href='/login.html'\">Login</button>";
}

function showLogoutButton(username) {
  const logoutButton = document.createElement("button");
  logoutButton.innerText = `Logout (${username})`;
  logoutButton.onclick = logout;
  loginLink.innerHTML = "";
  loginLink.appendChild(logoutButton);
}
function logout() {
  fetch("https://localhost:7248/api/user/logout", {
    method: "POST",
    credentials: "include",
  })
    .then((response) => {
      console.log("Server response:", response);
      if (response.ok) {
        localStorage.removeItem("userStatus");
        sessionStorage.removeItem("userStatus");
        showLoginButton();
      } else {
        console.error("Logout fehlgeschlagen mit Status:", response.status);
      }
    })
    .catch((error) => console.error("Logout failed:", error));
}
function showSuccessMessage(message) {
  const successMessage = document.getElementById("success-message");
  successMessage.textContent = message;
  successMessage.style.display = "block";
  setTimeout(() => {
    successMessage.style.opacity = "1";
  }, 10);
  setTimeout(() => {
    successMessage.style.opacity = "0";
    successMessage.style.display = "none";
  }, 3000);
}

function showErrorMessage(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.opacity = "1";
  }, 10);
  setTimeout(() => {
    errorMessage.style.opacity = "0";
    errorMessage.style.display = "none";
  }, 3000);
}
function showWarningMessage(message) {
  const warningMessage = document.getElementById("warning-message");
  warningMessage.textContent = message;
  warningMessage.style.display = "block";
  setTimeout(() => {
    warningMessage.style.opacity = "1";
  }, 10); 
  setTimeout(() => {
    warningMessage.style.opacity = "0";
    warningMessage.style.display = "none";
  }, 5000); 
}
//überall ende

//index Start
function setupCategoryDropdown(dropdownId, customCategoryGroupId) {
  const categorySelect = document.getElementById(dropdownId);
  const customCategoryGroup = document.getElementById(customCategoryGroupId);

  function toggleCustomCategoryGroup() {
    if (categorySelect.value === "andere") {
      customCategoryGroup.style.display = "block";
    } else {
      customCategoryGroup.style.display = "none";
    }
  }

  categorySelect.addEventListener("change", toggleCustomCategoryGroup);
  toggleCustomCategoryGroup(); 
}

function handleModalClick(event) {
  const addTransactionModal = document.getElementById("add-transaction-modal");
  const closeButton = document.querySelector(".close-button");

  if (event.target === addTransactionModal || event.target === closeButton) {
    closeModal();
  }
}

function openModal() {
  const addTransactionModal = document.getElementById("add-transaction-modal");
  console.log("Öffne das Modal"); 
  addTransactionModal.style.display = "block";
  setTimeout(() => {
    addTransactionModal.classList.add("modal-open");
  }, 10);
}

function closeModal() {
  const addTransactionModal = document.getElementById("add-transaction-modal");
  addTransactionModal.classList.remove("modal-open");
  setTimeout(() => {
    addTransactionModal.style.display = "none";
  }, 300);
}

function setupTransactionModal() {
  const addTransactionBtn = document.getElementById("add-transaction-btn");
  addTransactionBtn.addEventListener("click", openModal);

  const newTransactionForm = document.getElementById("submit-transaction-btn");
  newTransactionForm.addEventListener("click", (event) =>
    handleNewTransaction(event)
  );
}

let warningShown = false;

async function handleNewTransaction(event) {
  event.preventDefault();

  let settings = await loadUserSettings();
  let showWarnings = settings.showWarnings;
  const amountInput = document.getElementById("new-amount");
  const descriptionInput = document.getElementById("new-description");
  const categorySelect = document.getElementById("new-category");
  const customCategoryInput = document.getElementById("new-custom-category");
  const dateInput = document.getElementById("new-date");
  const isIncome = document.getElementById("income").checked;
  const notIncome = document.getElementById("expense").checked;

  const amount = parseFloat(amountInput.value);
  const description = descriptionInput.value;
  const category =
    categorySelect.value === "andere"
      ? customCategoryInput.value
      : categorySelect.value;
  const date = dateInput.value || null;
  
  if (isNaN(amount) || amount <= 0 || !description) {
    showErrorMessage(
      "Bitte geben Sie einen gültigen Betrag, eine Beschreibung und ein Datum ein."
    );

    showWarnings = false;
    return;
  }

  if (!date && showWarnings && !warningShown) {
    showWarningMessage(
      "Warnung: Ohne Eingabe eines Datums wird das heutige Datum verwendet!"
    );
    
    warningShown = true;
    showWarnings = false;
    return;
  }

  try {
    let categoryId = null;
    let categoryName = null;
    if (category) {
      categoryId = await getCategoryOrCreate(category, isIncome);
    } else {
      categoryName = await analyzeDescriptionWithAI(description);
      categoryId = await getCategoryOrCreate(categoryName, isIncome);
    }

    await submitNewTransaction(amount, description, categoryId, date, isIncome);

    updateFilteredTransactions();
    closeModal();
    showSuccessMessage("Transaktion erfolgreich erstellt.");
    fetchAndDisplayUserBalance();
    warningShown = false;
  } catch (error) {
    console.error("Fehler beim Erstellen der Transaktion:", error);
    showErrorMessage("Fehler beim Erstellen der Transaktion.");
  }
}
async function openEditModal(transactionId) {
  let modalO = document.getElementById("options-modal");
  modalO.style.display = "none";

  const modal = document.getElementById("update-transaction-modal");
  modal.querySelector(".close-button").addEventListener("click", () => {
    modal.style.display = "none";
  });

  const response = await fetch(
    `https://localhost:7248/api/transaction/${transactionId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );
  if (response.ok) {
    const transactionData = await response.json();

    document.getElementById("update-transaction-id").value = transactionData.id;
    document.getElementById("update-income").checked = transactionData.isIncome;
    document.getElementById("update-amount").value = transactionData.amount;
    document.getElementById("update-description").value =
      transactionData.description || "";

    const updateCategoryDropdown = document.getElementById("update-category");
    if (transactionData.categoryName) {
      updateCategoryDropdown.value = transactionData.categoryName;
    } else {
      updateCategoryDropdown.value = "";
    }

    document.getElementById("update-custom-category").value =
      transactionData.customCategory || "";
    document.getElementById("update-date").value = transactionData.date;

    modal.style.display = "block";
  } else {
    console.error("Fehler beim Abrufen der Transaktionsdetails.");
  }
}

async function editAndUpdateTransaction(transactionId) {
  try {
    const modal = document.getElementById("update-transaction-modal");

    const transactionIdInput = document.getElementById("update-transaction-id");
    const transactionId = transactionIdInput.value;
    const isIncomeInput = document.getElementById("update-income");
    const isIncome = isIncomeInput.checked;
    const amountInput = document.getElementById("update-amount");
    const amount = parseFloat(amountInput.value);
    const descriptionInput = document.getElementById("update-description");
    const description = descriptionInput.value;
    const categoryInput = document.getElementById("update-category");
    const category = categoryInput.value;
    const customCategoryInput = document.getElementById(
      "update-custom-category"
    );
    const customCategory = customCategoryInput.value;
    const dateInput = document.getElementById("update-date");
    const date = dateInput.value;

    let categoryId = null;
    let categoryName = null;

    if (category) {
      categoryId = await getCategoryOrCreate(category, isIncome);
    } else {
      categoryName = await analyzeDescriptionWithAI(description);
      categoryId = await getCategoryOrCreate(categoryName, isIncome);
    }

    const updatedTransaction = {
      Id: transactionId,
      IsIncome: isIncome,
      Amount: amount,
      Description: description,
      CategoryId: categoryId,
      CustomCategory: customCategory,
      Date: date,
    };

    console.log(updatedTransaction);
    const response = await fetch(
      `https://localhost:7248/api/transaction/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedTransaction),
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren der Transaktion.");
    }

    successMessage("Transaktion erfolgreich aktualisiert");
    console.log("Transaktion erfolgreich aktualisiert");
    modal.style.display = "none";
    updateFilteredTransactions();
    fetchAndDisplayUserBalance();
  } catch (error) {
    errorMessage("Fehler beim Aktualisieren der Transaktion: ", error);
    console.error("Fehler beim Aktualisieren der Transaktion: ", error);
  }
}

async function submitNewTransaction(
  amount,
  description,
  categoryId,
  date,
  isIncome
) {
  try {
    const response = await fetch(`https://localhost:7248/api/transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ amount, description, categoryId, date, isIncome }),
    });

    if (!response.ok) {
      throw new Error("Fehler beim Speichern der Transaktion.");
    }

    return response.json();
  } catch (error) {
    console.error("Fehler:", error);
    throw error;
  }
}
async function updateTransaction() {
  try {
    const transactionIdInput = document.getElementById("update-transaction-id");
    const transactionId = transactionIdInput.value;
    const isIncomeInput = document.getElementById("update-income");
    const isIncome = isIncomeInput.checked;
    const amountInput = document.getElementById("update-amount");
    const amount = parseFloat(amountInput.value);
    const descriptionInput = document.getElementById("update-description");
    const description = descriptionInput.value;
    const categoryInput = document.getElementById("update-category");
    const category = categoryInput.value;
    const customCategoryInput = document.getElementById(
      "update-custom-category"
    );
    const customCategory = customCategoryInput.value;
    const dateInput = document.getElementById("update-date");
    const date = dateInput.value;

    let categoryId = null;
    let categoryName = null;

    if (category) {
      categoryId = await getCategoryOrCreate(category, isIncome);
    } else {
      categoryName = await analyzeDescriptionWithAI(description);
      categoryId = await getCategoryOrCreate(categoryName, isIncome);
    }

    const updatedTransaction = {
      Id: transactionId,
      IsIncome: isIncome,
      Amount: amount,
      Description: description,
      CategoryId: categoryId,
      CustomCategory: customCategory,
      Date: date,
    };

    const response = await fetch(
      `https://localhost:7248/api/transaction/${transactionId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(updatedTransaction),
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Aktualisieren der Transaktion.");
    }

    console.log("Transaktion erfolgreich aktualisiert");
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Transaktion: ", error);
  }
}

async function getCategoryOrCreate(categoryName, isIncome) {
  let categoryId;

  const searchResponse = await fetch(
    `https://localhost:7248/api/category/search/${categoryName}/${isIncome}`,
    {
      credentials: "include",
    }
  );

  if (searchResponse.ok) {
    categoryId = await searchResponse.json();
    console.log("Gefundene Kategorie-ID:", categoryId);
  } else {
    console.log("Kategorie nicht gefunden. Erstelle eine neue Kategorie.");
    const createResponse = await fetch(
      "https://localhost:7248/api/category/create",
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName, isIncome: isIncome }),
      }
    );

    if (!createResponse.ok) {
      throw new Error("Fehler beim Erstellen der Kategorie");
    }

    const newSearchResponse = await fetch(
      `https://localhost:7248/api/category/search/${categoryName}/${isIncome}`,
      {
        credentials: "include",
      }
    );

    if (newSearchResponse.ok) {
      categoryId = await newSearchResponse.json();
      console.log("Neue Kategorie-ID:", categoryId);
    } else {
      throw new Error(
        "Fehler beim Abrufen der Kategorie-ID nach dem Erstellen"
      );
    }
  }

  return categoryId;
}

async function loadLatestTransactions() {
  try {
    const response = await fetch(`https://localhost:7248/api/transaction/`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(
        "Fehler beim Laden der Transaktionen. Statuscode: " + response.status
      );
    }

    const data = await response.json();
    const transactions = data.transactions;
    const totalBalance = data.totalBalance;

    if (Array.isArray(transactions)) {
      displayTransactions(transactions, totalBalance);
    } else {
      throw new Error(
        "Ungültige Antwortdaten: Die Transaktionen wurden nicht geladen."
      );
    }
  } catch (error) {
    console.error("Fehler beim Laden der Transaktionen:", error);
  }
}

let userCurrency = "USD";

async function loadUserSettings() {
  try {
    const response = await fetch("https://localhost:7248/api/settings/", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Fehler beim Laden der Benutzereinstellungen");
    }

    const settingsData = await response.json();

    const userSettings = {
      userId: settingsData.userId,
      currency: settingsData.currency,
      showWarnings: settingsData.showWarnings,
      notificationsEnabled: settingsData.notificationsEnabled,
      monthlyBudget: settingsData.monthlyBudget,
    };

    return userSettings;
  } catch (error) {
    console.error("Fehler beim Laden der Benutzereinstellungen:", error);
    return null;
  }
}

function displayTransactions(transactions, totalBalance) {
  const transactionListElement = document.getElementById("transaction-list");
  let rowsHtml = "";

  transactions.forEach(transaction => {
    // Stellen Sie sicher, dass Sie transaction.amount.value verwenden
    const formattedAmount = `${transaction.isIncome ? "+" : "-"} ${transaction.amount.value} ${userCurrency}`;
    rowsHtml += `
      <tr>
        <td>${new Date(transaction.date).toLocaleDateString()}</td>
        <td>${formattedAmount}</td>
        <td>${transaction.description || ""}</td>
        <td>${transaction.categoryName || "Unkategorisiert"}</td>
        <td>
          <div class="options">
            <span class="more-options" onclick="showOptions(${transaction.id})">&#8942;</span>
          </div>
        </td>
      </tr>`;
  });

  const totalFormatted = totalBalance >= 0 ? `+${totalBalance.toFixed(2)}` : `${totalBalance.toFixed(2)}`;
  const totalColor = totalBalance >= 0 ? "green" : "red";

  transactionListElement.innerHTML = `
    <table class='transactions-table'>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Betrag</th>
          <th>Beschreibung</th>
          <th>Kategorie</th>
          <th>Aktionen</th>
        </tr>
      </thead>
      <tbody>${rowsHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="4">Gesamtsaldo</td>
          <td style="color: ${totalColor};">${totalFormatted} ${userCurrency}</td>
        </tr>
      </tfoot>
    </table>`;
}


async function fetchAndDisplayUserBalance() {
  try {
    const balanceResponse = await fetch(
      "https://localhost:7248/api/transaction/balance",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!balanceResponse.ok) {
      throw new Error("Fehler beim Abrufen des Saldos");
    }

    const balanceData = await balanceResponse.json();

    const settingsResponse = await fetch(
      "https://localhost:7248/api/settings",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!settingsResponse.ok) {
      throw new Error("Fehler beim Abrufen der Einstellungen");
    }

    const settingsData = await settingsResponse.json();

    const expensesResponse = await fetch(
      "https://localhost:7248/api/transaction/transactions?IsIncome=false",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!expensesResponse.ok) {
      throw new Error("Fehler beim Abrufen der Ausgaben");
    }

    const expensesData = await expensesResponse.json();

    const totalExpenses = expensesData.totalBalance;

    const remainingBudget = settingsData.monthlyBudget + totalExpenses;

    displayUserBalance(balanceData, remainingBudget);
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function displayUserBalance(balance, remainingBudget) {
  const balanceElement = document.getElementById("user-balance");
  const warningElement = document.getElementById("balance-warning");

  warningElement.style.display = "block";

  if (isNaN(balance) || isNaN(remainingBudget)) {
    warningElement.textContent = "Fehler beim Abrufen des Saldos oder Budgets";
    warningElement.style.color = "red";
    return;
  }

  if (balance < 0) {
    balanceElement.textContent = `Minus ${Math.abs(balance).toFixed(
      2
    )} ${userCurrency}`;
    balanceElement.style.color = "red";

    warningElement.textContent = `Über Budget: ${Math.abs(
      remainingBudget
    ).toFixed(2)} ${userCurrency} zu viel ausgegeben`;
    warningElement.style.color = "red";
  } else {
    balanceElement.textContent = `${balance.toFixed(2)} ${userCurrency}`;
    balanceElement.style.color = "green";

    if (remainingBudget < 0) {
      warningElement.textContent = `Über Budget: ${Math.abs(
        remainingBudget
      ).toFixed(2)} ${userCurrency} übrig`;
      warningElement.style.color = "red";
    } else {
      warningElement.textContent = `Budget übrig: ${remainingBudget.toFixed(
        2
      )} ${userCurrency}`;
      warningElement.style.color = "green";
    }
  }
}

function showOptions(transactionId) {
  let modal = document.getElementById("options-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "options-modal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button" onclick="closeTransactionOptionsModal()">&times;</span>
        <h2>Transaktion Optionen</h2>
        <button onclick="openEditModal(${transactionId})" id="edit-transaction-button" type="button" >Ändern</button>
        <button onclick="deleteTransaction(${transactionId})">Löschen</button>
      </div>`;
    document.body.appendChild(modal);
  }

  modal.style.display = "block";
}

function closeTransactionOptionsModal() {
  const modal = document.getElementById("options-modal");
  if (modal) {
    modal.style.display = "none";
  }
}

async function deleteTransaction(transactionId) {
  try {
    const response = await fetch(
      `https://localhost:7248/api/transaction/${transactionId}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Löschen der Transaktion.");
    }

    console.log("Transaktion gelöscht");
    closeTransactionOptionsModal();
    updateFilteredTransactions();
    fetchAndDisplayUserBalance();
  } catch (error) {
    console.error("Fehler beim Löschen der Transaktion: ", error);
  }
}

async function initModalAndLoadCategories() {
  const selectedIncome = document.getElementById("filter-income").value;

  try {
    const url = selectedIncome
      ? `https://localhost:7248/api/category?isIncome=${selectedIncome}`
      : "https://localhost:7248/api/category";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    const categories = await response.json();
    populateCategoryDropdown(categories);
  } catch (error) {
    console.error("Fehler beim Laden der Kategorien:", error);
  }
}

function populateCategoryDropdown(categories) {
  const categorySelect = document.getElementById("filter-category");
  categorySelect.innerHTML = '<option value="">Alle Kategorien</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelect.appendChild(option);
  });
}
function toggleTransactionFilters() {
  var filterOptions = document.getElementById("transactions-filter-options");
  var toggleIcon = document.getElementById("transactions-toggle-icon");

  if (filterOptions.style.maxHeight) {
      filterOptions.style.maxHeight = null;
      toggleIcon.className = "transactions-arrow transactions-arrow-down";
  } else {
      filterOptions.style.maxHeight = filterOptions.scrollHeight + "px";
      toggleIcon.className = "transactions-arrow transactions-arrow-right";
  }
}

function updateFilteredTransactions() {
  const selectedCategory = document.getElementById("transactions-filter-category").value;
  const selectedIncome = document.getElementById("transactions-filter-income").value;
  const selectedDateFilter = document.getElementById("transactions-filter-date").value;
  const selectedSortField = document.getElementById("transactions-sort-field").value;
  const selectedSortOrder = document.getElementById("transactions-sort-order").value;

  filterTransactions(selectedCategory, selectedIncome, selectedDateFilter, selectedSortField, selectedSortOrder);
}

function filterTransactions(categoryId, isIncome, dateFilterType = 'custom', sortField, sortOrder) {
  let url = "https://localhost:7248/api/Transaction/transactions";
  const queryParams = [];
  if (categoryId) {
    queryParams.push(`categoryId=${categoryId}`);
  }
  if (isIncome === "true" || isIncome === "false") {
    queryParams.push(`isIncome=${isIncome}`);
  }

  queryParams.push(`dateFilterType=${dateFilterType}`);

  queryParams.push(`sortField=${sortField || 'date'}`);
  queryParams.push(`sortOrder=${sortOrder || 'desc'}`);

  if (queryParams.length) {
    url += "?" + queryParams.join("&");
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
  .then((response) => response.json())
  .then((response) => {
    const transactions = response.Transactions;
    const totalBalance = response.TotalBalance;

    displayTransactions(transactions, totalBalance);
  })
  .catch((error) => {
    console.error("Fehler beim Filtern der Transaktionen:", error);
  });
}


function analyzeDescription(description) {
  const keywords = {
    Lebensmittel: [
      "supermarkt",
      "lebensmittel",
      "essen",
      "trinken",
      "einkauf",
      "nahrungsmittel",
      "restaurant",
      "markt",
      "einkaufen",
      "vorräte",
      "koch",
      "genuss",
      "lecker",
      "mahlzeit",
      "speisekarte",
      "zutaten",
      "frisch",
      "obst",
      "gemüse",
      "kochen",
      "geschmack",
      "nährstoffe",
      "ernährung",
      "getränke",
      "küche",
      "frühstück",
      "fleisch",
      "milchprodukte",
      "wein",
      "bioprodukte",
      "snacks",
      "nahrungsergänzungsmittel",
      "restaurantbesuch",
      "leckereien",
      "vitalstoffe",
      "kulinarisch",
      "gastronomie",
      "backen",
      "grillen",
    ],
    Transport: [
      "bus",
      "bahn",
      "taxi",
      "fahrkarte",
      "tanken",
      "auto",
      "fahrt",
      "verkehr",
      "zug",
      "verkehrsverbund",
      "straße",
      "fahrzeug",
      "fahrer",
      "reise",
      "mobilität",
      "pendeln",
      "parken",
      "führerschein",
      "navigation",
      "kilometer",
      "weg",
      "fahrplan",
      "flughafen",
      "reisen",
      "verkehrsregeln",
      "reisebus",
      "zugreisen",
      "tankstelle",
      "autobahn",
      "öffentlicher verkehr",
      "autoreparatur",
      "autoversicherung",
      "motorrad",
    ],
    Unterhaltung: [
      "kino",
      "film",
      "musik",
      "spiel",
      "veranstaltung",
      "konzert",
      "show",
      "freizeit",
      "kultur",
      "event",
      "unterhaltsam",
      "party",
      "künstler",
      "publikum",
      "auftritt",
      "tickets",
      "spaß",
      "spannung",
      "abenteuer",
      "darsteller",
      "entertainment",
      "vorführung",
      "vorhang",
      "musikstück",
      "filmpremiere",
      "theaterstück",
      "livemusik",
      "partyplanung",
      "kulturveranstaltung",
      "unterhaltungsbranche",
      "freizeitaktivitäten",
      "künstlerische darbietung",
      "filmindustrie",
    ],
    Elektronik: [
      "laptop",
      "smartphone",
      "tablet",
      "kamera",
      "elektronik",
      "gadget",
      "technologie",
      "computer",
      "gerät",
      "hardware",
      "software",
      "internet",
      "display",
      "speicher",
      "akku",
      "kabel",
      "netzwerk",
      "app",
      "touchscreen",
      "prozessor",
      "digital",
      "innovation",
      "elektrisch",
      "entwickeln",
      "elektronische geräte",
      "technikprodukte",
      "elektronikmarkt",
      "techniktrends",
      "elektronikgeschäft",
      "konsolen",
      "elektronikhersteller",
      "digitalkamera",
      "smart-home",
      "virtual reality",
      "digitalisierung",
      "technologiebranche",
    ],
    Kleidung: [
      "kleidung",
      "schuhe",
      "jacke",
      "hose",
      "mode",
      "bekleidung",
      "garderobe",
      "anzug",
      "kleiderschrank",
      "textilien",
      "design",
      "stil",
      "accessoires",
      "outfit",
      "stoff",
      "tragen",
      "modedesigner",
      "hemd",
      "jeans",
      "schmuck",
      "bekleiden",
      "marken",
      "trend",
      "schönheit",
      "anziehen",
      "schuhgeschäft",
      "designer-labels",
      "accessoires",
      "schneidern",
      "modenschau",
      "vintage-kleidung",
      "designer-mode",
      "stilbewusstsein",
      "taschen",
    ],
    OnlineEinkauf: [
      "amazon",
      "ebay",
      "online",
      "bestellung",
      "shop",
      "e-commerce",
      "versand",
      "online-kauf",
      "webshop",
      "einkaufswagen",
      "zahlung",
      "angebot",
      "internetshopping",
      "versandkosten",
      "kundenbewertung",
      "einkaufsliste",
      "kundenkonto",
      "retoure",
      "verfügbar",
      "lieferung",
      "onlineshopping",
      "webseite",
      "kaufen",
      "sortiment",
      "online-shoppen",
      "shopping-cart",
      "online-bezahlung",
      "kundenrezensionen",
      "bestellverlauf",
      "online-angebote",
      "digitales einkaufen",
      "e-commerce-plattform",
      "online-shopping-gewohnheiten",
    ],
    Gesundheit: [
      "arzt",
      "medikament",
      "krankenhaus",
      "apotheke",
      "gesundheit",
      "behandlung",
      "therapie",
      "arztbesuch",
      "medizin",
      "krank",
      "krankenkasse",
      "gesundheitswesen",
      "diagnose",
      "rezept",
      "patient",
      "gesundheitsvorsorge",
      "krankenversicherung",
      "heilung",
      "praxis",
      "sprechstunde",
      "ärztlich",
      "gesundheitscheck",
      "therapeut",
      "gesundheitszustand",
      "medikamenteneinnahme",
      "notfall",
      "gesundheitsdienstleistungen",
      "gesundheitsvorsorge",
      "medikamentenverschreibung",
      "gesundheitsexperten",
      "krankenhausaufenthalt",
      "medikamentenbeschaffung",
    ],
    Haushalt: [
      "möbel",
      "haushalt",
      "reinigung",
      "küche",
      "gerät",
      "wohnung",
      "einrichtung",
      "heim",
      "wohnaccessoires",
      "wohnraum",
      "aufräumen",
      "putzen",
      "ordnung",
      "hausarbeit",
      "geschirr",
      "möbeldesign",
      "wohnstil",
      "dekoration",
      "wohnzimmer",
      "bad",
      "einrichtungsgegenstände",
      "haushaltswaren",
      "sauberkeit",
      "wohnkomfort",
      "haushaltsgeräte",
      "reinigungsmittel",
      "hausdekoration",
      "innenarchitektur",
      "heimwerken",
      "küchengeräte",
      "raumgestaltung",
    ],
    Bildung: [
      "schule",
      "universität",
      "lernen",
      "bücher",
      "bildung",
      "kurs",
      "studium",
      "schulmaterial",
      "akademisch",
      "unterricht",
      "wissen",
      "lehrer",
      "bildungseinrichtung",
      "studiengebühren",
      "kommilitonen",
      "vorlesung",
      "praktikum",
      "forschung",
      "wissenschaft",
      "abschluss",
      "student",
      "lernen",
      "bildungssystem",
      "akademische",
      "bibliothek",
      "wissenschaftliche forschung",
      "studienleistung",
      "hochschulausbildung",
      "studienunterlagen",
      "akademische veranstaltungen",
    ],
    Reisen: [
      "flug",
      "hotel",
      "reise",
      "urlaub",
      "ferien",
      "ausflug",
      "tourismus",
      "reiseziel",
      "flugticket",
      "pension",
      "reiseplanung",
      "reiseveranstalter",
      "ferienhaus",
      "hotelzimmer",
      "gepäck",
      "rundreise",
      "abenteuerurlaub",
      "strandausflug",
      "kulturtrip",
      "entspannung",
      "reisende",
      "urlaubszeit",
      "reisegewohnheiten",
      "touristische",
      "erholungsreisen",
      "reiseerlebnis",
      "reisekosten",
      "wanderreisen",
      "urlaubsaktivitäten",
      "reisevergnügen",
      "touristenattraktionen",
    ],
    Sport: [
      "fitness",
      "sport",
      "training",
      "wettkampf",
      "aktivität",
      "körperliche betätigung",
      "bewegung",
      "spiel",
      "sportart",
      "sportschuhe",
      "trainer",
      "gesundheitsstudio",
      "turnhalle",
      "athlet",
      "sportler",
      "sportverein",
      "sportwettkampf",
      "ausdauer",
      "krafttraining",
      "dehnen",
      "erholung",
      "sportlichkeit",
      "sportbekleidung",
      "sportveranstaltung",
      "körperliche fitness",
      "sportausrüstung",
      "sportwissenschaft",
      "teamsportarten",
      "sportkultur",
      "sportpsychologie",
      "gesundheitsförderung",
    ],
    Hobbys: [
      "hobby",
      "freizeit",
      "sammlung",
      "kreativität",
      "basteln",
      "interessen",
      "leidenschaft",
      "hobbyprojekt",
      "künstlerisch",
      "handwerk",
      "freizeitbeschäftigung",
      "selbermachen",
      "kreatives gestalten",
      "handarbeiten",
      "bastelmaterial",
      "sammlerstück",
      "kunstwerk",
      "malen",
      "zeichnen",
      "kunsthandwerk",
      "kreativ",
      "selbstgemacht",
      "hobbyaktivitäten",
      "hobbysammlung",
      "kunstprojekt",
      "handwerkskunst",
      "freizeitspaß",
      "selbstgestaltung",
      "kreativwerkstatt",
      "hobbygemeinschaft",
    ],
    Finanzen: [
      "geld",
      "finanzen",
      "rechnung",
      "zahlung",
      "kosten",
      "ausgaben",
      "budget",
      "finanziell",
      "einnahmen",
      "kredit",
      "währung",
      "bank",
      "sparen",
      "investieren",
      "kontostand",
      "kreditkarte",
      "zinsen",
      "kreditwürdigkeit",
      "zahlungsverkehr",
      "online-banking",
      "finanzielle",
      "geldanlage",
      "kontoführung",
      "geldausgaben",
      "finanzplanung",
      "kostenmanagement",
      "finanzberater",
      "sparen und investieren",
      "zahlungsmethoden",
      "finanzmärkte",
      "bankwesen",
    ],
    Wohnen: [
      "wohnung",
      "haus",
      "miete",
      "wohnen",
      "immobilie",
      "einrichtung",
      "wohnaccessoires",
      "heimat",
      "möblierung",
      "zimmer",
      "nachbarn",
      "wohngegend",
      "mieter",
      "hausbesitzer",
      "makler",
      "umzug",
      "wohnungskauf",
      "wohnraumgestaltung",
      "eigenheim",
      "wohnungssuche",
      "wohnsituation",
      "nachbarschaft",
      "wohnbedarf",
      "wohnkultur",
      "wohnimmobilien",
      "einrichtungsstile",
      "nachbarschaftsbeziehungen",
      "umzugsvorbereitungen",
      "hausbesitz",
    ],
    Technik: [
      "technik",
      "gerät",
      "elektronik",
      "gadget",
      "computer",
      "innovation",
      "fortschritt",
      "entwicklung",
      "elektrisch",
      "technologie",
      "technikfreak",
      "innovationsgeist",
      "technisches know-how",
      "technikwelt",
      "gerätehersteller",
      "technikprodukte",
      "technikexperte",
      "techniktrends",
      "elektronikmarkt",
      "technikneuheiten",
      "innovationskraft",
      "elektronische",
      "technikartikel",
      "elektronikbranche",
      "elektronikentwicklung",
      "technologiebranche",
      "technische innovationen",
      "elektronikdesign",
      "high-tech-geräte",
      "elektronikindustrie",
      "technikrevolution",
    ],
  };

  for (const [category, words] of Object.entries(keywords)) {
    if (
      words.some((word) =>
        description.toLowerCase().includes(word.toLowerCase())
      )
    ) {
      return category;
    }
  }

  return "Unkategorisiert";
}

async function analyzeDescriptionWithAI(description) {
  const categories = [
    "Lebensmittel",
    "Transport",
    "Unterhaltung",
    "Elektronik",
    "Kleidung",
    "OnlineEinkauf",
    "Gesundheit",
    "Haushalt",
    "Bildung",
    "Reisen",
    "Sport",
    "Hobbys",
    "Finanzen",
    "Wohnen",
    "Technik",
  ];

  const prompt = `Bitte kategorisiere die folgende Beschreibung in eine der folgenden Kategorien: ${categories.join(
    ", "
  )}.
  
Beschreibung: "${description}"
Kategorie:`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model: "phi-3",
        prompt: prompt,
      }),
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      if (value) {
        result += decoder.decode(value);
      }
    }

    // Da die Antwort im NDJSON-Format ist, teilen wir sie in Zeilen auf
    const lines = result.trim().split("\n");

    // Extrahieren des Textes aus jeder Zeile
    let output = "";
    for (const line of lines) {
      if (line.trim() === "") continue;
      try {
        const json = JSON.parse(line);
        if (json.text) {
          output += json.text;
        }
      } catch (e) {
        console.error("Fehler beim Parsen von JSON:", e);
      }
    }

    output = output.trim();

    // Überprüfen, ob die Ausgabe eine der Kategorien ist
    const matchedCategory = categories.find((category) =>
      output.toLowerCase().includes(category.toLowerCase())
    );

    if (matchedCategory) {
      return matchedCategory;
    } else {
      return "Unkategorisiert";
    }
  } catch (error) {
    console.error("Fehler bei der Kommunikation mit der Ollama-API:", error);
    // Fallback auf die alte Funktion bei einem Fehler
    return analyzeDescription(description);
  }
}


async function exportTransactions() {
  try {
    const userStatus = await getUserStatus(); 

    const categoryId = document.getElementById("filter-category").value;
    const isIncome = document.getElementById("filter-income").value;

    const queryParams = [];

    if (categoryId) {
      queryParams.push(`categoryId=${categoryId}`);
    }

    if (isIncome !== "") {
      queryParams.push(`isIncome=${isIncome}`);
    }

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    const response = await fetch(
      `https://localhost:7248/api/transaction/transactions${queryString}`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error(
        "Fehler beim Exportieren von Transaktionen. Statuscode:",
        response.status
      );
      throw new Error("Export fehlgeschlagen.");
    }

    const transactions = await response.json();
    console.log("Transaktionsdaten:", transactions); // Ausgabe der erhaltenen Daten

    const username = userStatus.username;

    const csvData = convertTransactionsToCSV(transactions);
    console.log("CSV-Daten:", csvData); // Ausgabe der erzeugten CSV-Daten

    const blob = new Blob([csvData], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${username}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Exportfehler:", error);
  }
}

function convertTransactionsToCSV(transactions) {
  if (
    !transactions ||
    !transactions.transactions ||
    !Array.isArray(transactions.transactions)
  ) {
    throw new Error("Ungültige Transaktionsdaten.");
  }

  const header = "Datum,Betrag,Beschreibung,Kategorie,Einkommen\n";
  const csvData = transactions.transactions
    .map((transaction) => {
      const date = new Date(transaction.date).toISOString().substring(0, 10);
      const amount = transaction.amount;
      const description = escapeCSVValue(transaction.description || "");
      const categoryName = escapeCSVValue(
        transaction.categoryName || "Unkategorisiert"
      );
      const isIncome = transaction.isIncome ? "Ja" : "Nein";
      return `${date},${amount},${description},${categoryName},${isIncome}`;
    })
    .join("\n");

  return header + csvData;
}

function escapeCSVValue(value) {
  if (typeof value === "string" && value.includes(",")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

async function handleCsvUpload(fileInput) {
  try {
    const file = fileInput.files[0];
    if (!file) {
      throw new Error("Es wurde keine Datei ausgewählt.");
    }

    const reader = new FileReader();

    reader.onload = function (event) {
      const csvData = event.target.result;
      const transactions = parseCsvToTransactions(csvData);

      if (transactions.length === 0) {
        throw new Error("Die CSV-Datei enthält keine gültigen Transaktionen.");
      }

      handleImportedTransactions(transactions);
    };

    reader.readAsText(file);
  } catch (error) {
    console.error(
      "Fehler beim Hochladen und Verarbeiten der CSV-Datei:",
      error
    );
    showErrorMessage("Fehler beim Hochladen und Verarbeiten der CSV-Datei.");
  }
}
function parseCsvToTransactions(csvData) {
  const rows = csvData.split("\n");
  const transactions = [];

  // Die erste Zeile überspringen, da es sich um die Header-Zeile handelt
  for (let i = 1; i < rows.length; i++) {
    const columns = rows[i].split(",");
    if (columns.length >= 5) {
      const date = columns[0];
      const amount = parseFloat(columns[1]);
      const description = columns[2];
      const categoryName = columns[3];
      const isIncome = columns[4].toLowerCase() === "ja";

      if (!isNaN(amount)) {
        transactions.push({
          date,
          amount,
          description,
          categoryName,
          isIncome,
        });
      }
    }
  }

  return transactions;
}

async function handleImportedTransactions(importedTransactions) {
  try {
    const promises = importedTransactions.map(async (importedTransaction) => {
      const { date, amount, description, isIncome } = importedTransaction;

      let categoryId = null;
      let categoryName = null;
      if (description) {
        categoryName = await analyzeDescriptionWithAI(description);
        categoryId = await getCategoryOrCreate(categoryName, isIncome);
      }

      await submitNewTransaction(
        amount,
        description,
        categoryId,
        date,
        isIncome
      );
    });

    await Promise.all(promises);

    updateFilteredTransactions();
    showSuccessMessage("Importierte Transaktionen erfolgreich erstellt.");
    fetchAndDisplayUserBalance();
  } catch (error) {
    console.error("Fehler beim Importieren der Transaktionen:", error);
    showErrorMessage("Fehler beim Importieren der Transaktionen.");
  }
}

//index ende
//Settings Start
async function loadOrCreateSettings() {
  try {
    const response = await fetch("https://localhost:7248/api/settings", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) {
      await createDefaultSettings();
      return;
    }
    const settings = await response.json();
    setFormValues(settings);

    const currencySelect = document.getElementById("currency");

    const currencyOptionsResponse = await fetch(
      "https://localhost:7248/api/settings/currencies",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (currencyOptionsResponse.ok) {
      const currencyOptions = await currencyOptionsResponse.json();

      currencySelect.innerHTML = "";

      currencyOptions.forEach((option) => {
        const [value, label] = option.split(" - ");
        const optionElement = document.createElement("option");
        optionElement.value = value;
        optionElement.textContent = label;
        currencySelect.appendChild(optionElement);
      });

      console.log("Währungsoptionen geladen:", currencyOptions);
    } else {
      console.error("Fehler beim Abrufen der Währungsoptionen.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Einstellungen:", error);
  }
}

function setFormValues(settings) {
  const form = document.getElementById("settings-form");
  const currencySelect = form.querySelector("#currency");
  const showWarningsCheckbox = form.querySelector("#show-warnings");
  const notificationCheckbox = form.querySelector("#notification");
  const monthlyBudgetInput = form.querySelector("#monthly-budget");

  currencySelect.value = settings.Currency;

  const currencyOptions = currencySelect.querySelectorAll("option");
  for (const option of currencyOptions) {
    if (option.value === settings.Currency) {
      currencySelect.selectedIndex = option.index;
      break;
    }
  }

  showWarningsCheckbox.checked = settings.showWarnings;
  notificationCheckbox.checked = settings.notificationsEnabled;

  if (settings.monthlyBudget !== null) {
    monthlyBudgetInput.value = settings.monthlyBudget.toFixed(2);
  } else {
    monthlyBudgetInput.value = "";
  }

  console.log("Einstellungen geladen:", settings);
}

async function saveSettings(event) {
  event.preventDefault();
  const monthlyBudget = parseFloat(
    document.getElementById("monthly-budget").value
  );

  if (isNaN(monthlyBudget)) {
    showErrorMessage("Ungültiges monatliches Budget.");
    return;
  }

  const settings = {
    Currency: document.getElementById("currency").value,
    ShowWarnings: document.getElementById("show-warnings").checked,
    NotificationsEnabled: document.getElementById("notification").checked,
    MonthlyBudget: monthlyBudget,
  };

  try {
    const response = await fetch("https://localhost:7248/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(settings),
    });

    if (response.ok) {
      showSuccessMessage("Einstellungen erfolgreich gespeichert.");
    } else {
      showErrorMessage("Fehler beim Speichern der Einstellungen.");
    }
  } catch (error) {
    console.error("Fehler beim Speichern der Einstellungen:", error);
    showErrorMessage("Fehler beim Speichern der Einstellungen.");
  }
}

async function createDefaultSettings() {
  const defaultSettings = {
    Currency: "CHF - Franken (CHF)",
    ShowWarnings: true,
    NotificationsEnabled: false,
  };

  try {
    const response = await fetch("https://localhost:7248/api/settings/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(defaultSettings),
    });

    if (response.ok) {
      showSuccessMessage("Standard-Einstellungen erfolgreich erstellt.");
      loadOrCreateSettings();
    } else {
      showErrorMessage("Fehler beim Erstellen der Standard-Einstellungen.");
    }
  } catch (error) {
    console.error("Fehler beim Erstellen der Standard-Einstellungen:", error);
    showErrorMessage("Fehler beim Erstellen der Standard-Einstellungen.");
  }
}
//settings ende
