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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }
    );

    if (!registerResponse.ok) {
      throw new Error("Die Registrierung ist fehlgeschlagen.");
    }

    const loginResponse = await fetch("https://localhost:7248/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!loginResponse.ok) {
      throw new Error("Automatische Anmeldung fehlgeschlagen.");
    }
    showLogoutButton(username);
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

// Funktion zur Handhabung des Login-Vorgangs
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
  }, 10); // Geringfügige Verzögerung für den Übergangseffekt
  setTimeout(() => {
    successMessage.style.opacity = "0";
    successMessage.style.display = "none";
  }, 3000); // Zeige die Nachricht für 3 Sekunden und blende sie dann aus
}

function showErrorMessage(message) {
  const errorMessage = document.getElementById("error-message");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  setTimeout(() => {
    errorMessage.style.opacity = "1";
  }, 10); // Geringfügige Verzögerung für den Übergangseffekt
  setTimeout(() => {
    errorMessage.style.opacity = "0";
    errorMessage.style.display = "none";
  }, 3000); // Zeige die Nachricht für 3 Sekunden und blende sie dann aus
}
function showWarningMessage(message) {
  const warningMessage = document.getElementById("warning-message");
  warningMessage.textContent = message;
  warningMessage.style.display = "block";
  setTimeout(() => {
    warningMessage.style.opacity = "1";
  }, 10); // Geringfügige Verzögerung für den Übergangseffekt
  setTimeout(() => {
    warningMessage.style.opacity = "0";
    warningMessage.style.display = "none";
  }, 5000); // Zeige die Nachricht für 5 Sekunden und blende sie dann aus
}
//überall ende

//index Start
function setupCategoryDropdown() {
  const categorySelect = document.getElementById("new-category");
  const customCategoryGroup = document.getElementById("custom-category-group");

  categorySelect.addEventListener("change", () => {
    if (categorySelect.value === "andere") {
      customCategoryGroup.style.display = "block";
    } else {
      customCategoryGroup.style.display = "none";
    }
  });

  if (categorySelect.value === "andere") {
    customCategoryGroup.style.display = "block";
  } else {
    customCategoryGroup.style.display = "none";
  }
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
  console.log("Öffne das Modal"); // Hinzugefügte Zeile
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
    return;
  }
  if (!date && !warningShown) {
    showWarningMessage(
      "Warnung: Ohne eingabe eines Datums wird das heutige Datum verwendet!"
    );
    warningShown = true;
    return;
  }

  try {
    let categoryId = null;
    let categoryName = null;
    if (category) {
      categoryId = await getCategoryOrCreate(category, isIncome);
    } else {
      categoryName = await analyzeDescription(description);
      categoryId = await getCategoryOrCreate(categoryName, isIncome);
    }

    await submitNewTransaction(amount, description, categoryId, date, isIncome);

    loadLatestTransactions();
    closeModal();
    showSuccessMessage("Transaktion erfolgreich erstellt.");
    fetchAndDisplayUserBalance();
    warningShown = false;
  } catch (error) {
    console.error("Fehler beim Erstellen der Transaktion:", error);
    showErrorMessage("Fehler beim Erstellen der Transaktion.");
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

    const transactions = await response.json();

    if (Array.isArray(transactions)) {
      displayTransactions(transactions);
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

    const settings = await response.json();
    userCurrency = settings.currency;
  } catch (error) {
    console.error("Fehler beim Laden der Benutzereinstellungen:", error);
  }
}

function displayTransactions(transactions) {
  const transactionListElement = document.getElementById("transaction-list");
  let rowsHtml = "";

  transactions.forEach((transaction) => {
    const formattedAmount = `${transaction.isIncome ? "+" : "-"}${
      transaction.amount
    } ${userCurrency}`;

    rowsHtml += `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${formattedAmount}</td>
                <td>${transaction.description}</td>
                <td>${transaction.categoryName || "Unkategorisiert"}</td>
                <td>
                    <div class="options">
                        <span class="more-options" onclick="showOptions(${
                          transaction.id
                        })">&#8942;</span>
                    </div>
                </td>
            </tr>`;
  });

  transactionListElement.innerHTML =
    "<table class='transactions-table'><thead><tr><th>Datum</th><th>Betrag</th><th>Beschreibung</th><th>Kategorie</th><th>Aktionen</th></tr></thead><tbody>" +
    rowsHtml +
    "</tbody></table>";
}
async function fetchAndDisplayUserBalance() {
  try {
    const response = await fetch(
      "https://localhost:7248/api/transaction/balance",
      {
        method: "GET",
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Fehler beim Abrufen des Saldos");
    }

    const balance = await response.json();
    displayUserBalance(balance);
  } catch (error) {
    console.error("Fehler:", error);
  }
}

function displayUserBalance(balance) {
  const balanceElement = document.getElementById("user-balance");
  if (balance < 0) {
    balanceElement.textContent = `Minus ${Math.abs(balance).toFixed(
      2
    )} ${userCurrency}`;
    balanceElement.style.color = "red";
  } else {
    balanceElement.textContent = `${balance.toFixed(2)} ${userCurrency}`;
    balanceElement.style.color = "lime";
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
                <span class="close-button">&times;</span>
                <h2>Transaktion Optionen</h2>
                <button onclick="editTransaction(${transactionId})">Ändern</button>
                <button onclick="deleteTransaction(${transactionId})">Löschen</button>
            </div>`;
    document.body.appendChild(modal);
  }

  modal.querySelector(".close-button").onclick = closeTransactionOptionsModal;

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
    loadLatestTransactions();
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

function updateFilteredTransactions() {
  const selectedCategory = document.getElementById("filter-category").value;
  const selectedIncome = document.getElementById("filter-income").value;

  filterTransactions(selectedCategory, selectedIncome);
}
function filterTransactions(categoryId, isIncome) {
  let url = "https://localhost:7248/api/transaction/transactions"; // Geänderte URL
  const queryParams = [];
  if (categoryId) {
    queryParams.push(`categoryId=${categoryId}`);
  }
  if (isIncome === "true" || isIncome === "false") {
    queryParams.push(`isIncome=${isIncome}`);
  }
  if (queryParams.length) {
    url += "?" + queryParams.join("&");
  }

  fetch(url, {
    method: "GET",
    credentials: "include",
  })
    .then((response) => response.json())
    .then((transactions) => {
      displayTransactions(transactions);
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

function exportTransactions() {
  const categoryId = document.getElementById("filter-category").value;
  const isIncome = document.getElementById("filter-income").value;
  const queryParams = [];
  if (categoryId) {
      queryParams.push(`categoryId=${categoryId}`);
  }
  if (isIncome !== "") {
      queryParams.push(`isIncome=${isIncome}`);
  }

  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

  fetch(`https://localhost:7248/api/transaction/transactions${queryString}`, {
      method: "GET",
      credentials: "include",
  })
  .then(response => {
      if (!response.ok) {
          throw new Error("Export fehlgeschlagen.");
      }
      return response.json();
  })
  .then(transactions => {
      const csvData = convertTransactionsToCSV(transactions);

      const blob = new Blob([csvData], { type: "text/csv" });

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "exported_transactions.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
  })
  .catch(error => {
      console.error("Exportfehler:", error);
  });
}

function convertTransactionsToCSV(transactions) {
  const header = "Datum,Betrag,Beschreibung,Kategorie,Einkommen\n";
  const csvData = transactions.map(transaction => {
      const date = new Date(transaction.date).toLocaleDateString();
      const amount = transaction.amount;
      const description = transaction.description || "";
      const categoryName = transaction.categoryName || "Unkategorisiert";
      const isIncome = transaction.isIncome ? "Ja" : "Nein";
      return `${date},${amount},"${description}","${categoryName}","${isIncome}"`;
  }).join("\n");

  return header + csvData;
}



//index ende
//settings start
async function loadOrCreateSettings() {
  try {
    const response = await fetch('https://localhost:7248/api/settings', {
      method: 'GET',
      credentials: 'include'
    });
    if (!response.ok) {
      await createDefaultSettings();
      return;
    }
    const settings = await response.json();
    setFormValues(settings);
  } catch (error) {
    console.error('Fehler beim Laden der Einstellungen:', error);
  }
}

function setFormValues(settings) {
  document.getElementById('currency').value = settings.Currency;
  document.getElementById('show-warnings').checked = settings.ShowWarnings;
  document.getElementById('notification').checked = settings.NotificationsEnabled;
}

async function saveSettings(event) {
  event.preventDefault();
  const settings = {
    Currency: document.getElementById("currency").value,
    ShowWarnings: document.getElementById("show-warnings").checked,
    NotificationsEnabled: document.getElementById("notification").checked,
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
    Currency: "CHF",
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
    } else {
      showErrorMessage("Fehler beim Erstellen der Standard-Einstellungen.");
    }
  } catch (error) {
    console.error("Fehler beim Erstellen der Standard-Einstellungen:", error);
    showErrorMessage("Fehler beim Erstellen der Standard-Einstellungen.");
  }
}
//settings ende
