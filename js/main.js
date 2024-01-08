document.addEventListener("DOMContentLoaded", initializeApp);


async function initializeApp() {
    const userStatus = await checkUserStatusAndUpdateUI();

    if (userStatus && userStatus.isLoggedIn) {
        setupEventListeners();
        loadLatestTransactions();
        setupCategoryDropdown();
        initModalAndLoadCategories();
        showLogoutButton(userStatus.username);
        setupTransactionModal();
    } else {
        showLoginButton();
    }
}

function setupEventListeners() {
    const addTransactionBtn = document.getElementById("add-transaction-btn");
    addTransactionBtn.addEventListener("click", openModal);
    document.getElementById("new-transaction-form").addEventListener("submit", (event) => handleNewTransaction(event));
    window.addEventListener("click", handleModalClick);
}

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
    }, 300); // Verzögerung für den Übergangseffekt
}

function setupTransactionModal() {
  const addTransactionBtn = document.getElementById("add-transaction-btn");
  addTransactionBtn.addEventListener("click", openModal);

  const newTransactionForm = document.getElementById("submit-transaction-btn");
  newTransactionForm.addEventListener("click", (event) => handleNewTransaction(event));
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
    const category = categorySelect.value === "andere" ? customCategoryInput.value : categorySelect.value;
    const date = dateInput.value || null;  
    if (isNaN(amount) || amount <= 0 || !description ) {
        showErrorMessage("Bitte geben Sie einen gültigen Betrag, eine Beschreibung und ein Datum ein.");
        return;
    }
    if (!date && !warningShown) {
        showWarningMessage("Warnung: Ohne eingabe eines Datums wird das heutige Datum verwendet!");
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
        warningShown = false;
    } catch (error) {
        console.error("Fehler beim Erstellen der Transaktion:", error);
        showErrorMessage("Fehler beim Erstellen der Transaktion.");
    }
  }
  

  async function submitNewTransaction(amount, description, categoryId, date, isIncome) {
    try {
        const response = await fetch(`https://localhost:7248/api/transaction`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',  
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

    const searchResponse = await fetch(`https://localhost:7248/api/category/search/${categoryName}/${isIncome}`, {
        credentials: 'include'
    });

    if (searchResponse.ok) {
        categoryId = await searchResponse.json();
        console.log("Gefundene Kategorie-ID:", categoryId);
    } else {
        console.log("Kategorie nicht gefunden. Erstelle eine neue Kategorie.");
        const createResponse = await fetch('https://localhost:7248/api/category/create', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: categoryName, isIncome: isIncome })
        });

        if (!createResponse.ok) {
            throw new Error("Fehler beim Erstellen der Kategorie");
        }

        const newSearchResponse = await fetch(`https://localhost:7248/api/category/search/${categoryName}/${isIncome}`, {
            credentials: 'include'
        });

        if (newSearchResponse.ok) {
            categoryId = await newSearchResponse.json();
            console.log("Neue Kategorie-ID:", categoryId);
        } else {
            throw new Error("Fehler beim Abrufen der Kategorie-ID nach dem Erstellen");
        }
    }

    return categoryId;
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
  

async function loadLatestTransactions() {
  try {
    const response = await fetch(
        `https://localhost:7248/api/transaction/`,
        {
          credentials: 'include' 
        }
      );
      

      if (!response.ok) {
          throw new Error("Fehler beim Laden der Transaktionen. Statuscode: " + response.status);
      }

      const transactions = await response.json();

      if (Array.isArray(transactions)) {
          displayTransactions(transactions);
      } else {
          throw new Error("Ungültige Antwortdaten: Die Transaktionen wurden nicht geladen.");
      }
  } catch (error) {
      console.error("Fehler beim Laden der Transaktionen:", error);
  }
}


function displayTransactions(transactions) {
    const transactionListElement = document.getElementById("transaction-list");
    let rowsHtml = '';

    transactions.forEach(transaction => {
        const formattedAmount = transaction.isIncome ? `+${transaction.amount}` : `-${transaction.amount}`;

        rowsHtml += `
            <tr>
                <td>${new Date(transaction.date).toLocaleDateString()}</td>
                <td>${formattedAmount}</td>
                <td>${transaction.description}</td>
                <td>${transaction.categoryName || "Unkategorisiert"}</td>
                <td>
                    <div class="options">
                        <span class="more-options" onclick="showOptions(${transaction.id})">&#8942;</span>
                    </div>
                </td>
            </tr>`;
    });

    transactionListElement.innerHTML = "<table class='transactions-table'><thead><tr><th>Datum</th><th>Betrag</th><th>Beschreibung</th><th>Kategorie</th><th>Aktionen</th></tr></thead><tbody>" + rowsHtml + "</tbody></table>";
}


function showOptions(transactionId) {
    let modal = document.getElementById('options-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'options-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">&times;</span>
                <h2>Transaktion Optionen</h2>
                <button onclick="editTransaction(${transactionId})">Ändern</button>
                <button onclick="deleteTransaction(${transactionId})">Löschen</button>
            </div>`;
        document.body.appendChild(modal);
    }

    modal.querySelector('.close-button').onclick = closeTransactionOptionsModal;


    modal.style.display = 'block';
}
function closeTransactionOptionsModal() {
    const modal = document.getElementById('options-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function deleteTransaction(transactionId) {
    try {
        const response = await fetch(`https://localhost:7248/api/transaction/${transactionId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Fehler beim Löschen der Transaktion.');
        }

        console.log("Transaktion gelöscht");
        closeTransactionOptionsModal(); // Schließt das spezifische Modal für Transaktionsoptionen
        loadLatestTransactions(); // Lädt die Transaktionsliste neu
    } catch (error) {
        console.error("Fehler beim Löschen der Transaktion: ", error);
    }
}


async function initModalAndLoadCategories() {
    try {
        const response = await fetch('https://localhost:7248/api/category', {
            method: 'GET',
            credentials: 'include'
        });
        const categories = await response.json();
        populateCategoryDropdown(categories);
    } catch (error) {
        console.error('Fehler beim Laden der Kategorien:', error);
    }
}

function populateCategoryDropdown(categories) {
    const categorySelect = document.getElementById('filter-category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

document.getElementById('filter-category').addEventListener('change', function() {
    filterTransactionsByCategory(this.value);
});


function filterTransactionsByCategory(categoryId) {
    let url = 'https://localhost:7248/api/transaction';
    if (categoryId) {
        url += `/category/${categoryId}`;
    }

    fetch(url, {
        method: 'GET',
        credentials: 'include'
    })
    .then(response => response.json())
    .then(transactions => {
        displayTransactions(transactions);
    })
    .catch(error => {
        console.error('Fehler beim Filtern der Transaktionen:', error);
    });
}




function showLoginButton() {
  const loginLink = document.getElementById("login-link");
  loginLink.innerHTML = '<button onclick="location.href=\'/login.html\'">Login</button>';
}

function showLogoutButton() {
    const loginLink = document.getElementById("login-link");
    loginLink.innerHTML = `<button onclick="logout()">Logout</button>`;
  }
  
  function logout() {
      fetch('https://localhost:7248/api/user/logout', {
          method: 'POST',
          credentials: 'include'
      }).then(response => {
          if (response.ok) {
              
            showLoginButton();
          }
      }).catch(error => console.error('Logout failed:', error));
  }
  

  function analyzeDescription(description) {
    const keywords = {
        Lebensmittel: ['supermarkt', 'lebensmittel', 'essen', 'trinken', 'einkauf', 'nahrungsmittel', 'restaurant', 'markt', 'einkaufen', 'vorräte', 'koch', 'genuss', 'lecker', 'mahlzeit', 'speisekarte', 'zutaten', 'frisch', 'obst', 'gemüse', 'kochen', 'geschmack', 'nährstoffe', 'ernährung', 'getränke', 'küche', 'frühstück', 'fleisch', 'milchprodukte', 'wein', 'bioprodukte', 'snacks', 'nahrungsergänzungsmittel', 'restaurantbesuch', 'leckereien', 'vitalstoffe', 'kulinarisch', 'gastronomie', 'backen', 'grillen'],
        Transport: ['bus', 'bahn', 'taxi', 'fahrkarte', 'tanken', 'auto', 'fahrt', 'verkehr', 'zug', 'verkehrsverbund', 'straße', 'fahrzeug', 'fahrer', 'reise', 'mobilität', 'pendeln', 'parken', 'führerschein', 'navigation', 'kilometer', 'weg', 'fahrplan', 'flughafen', 'reisen', 'verkehrsregeln', 'reisebus', 'zugreisen', 'tankstelle', 'autobahn', 'öffentlicher verkehr', 'autoreparatur', 'autoversicherung', 'motorrad'],
        Unterhaltung: ['kino', 'film', 'musik', 'spiel', 'veranstaltung', 'konzert', 'show', 'freizeit', 'kultur', 'event', 'unterhaltsam', 'party', 'künstler', 'publikum', 'auftritt', 'tickets', 'spaß', 'spannung', 'abenteuer', 'darsteller', 'entertainment', 'vorführung', 'vorhang', 'musikstück', 'filmpremiere', 'theaterstück', 'livemusik', 'partyplanung', 'kulturveranstaltung', 'unterhaltungsbranche', 'freizeitaktivitäten', 'künstlerische darbietung', 'filmindustrie'],
        Elektronik: ['laptop', 'smartphone', 'tablet', 'kamera', 'elektronik', 'gadget', 'technologie', 'computer', 'gerät', 'hardware', 'software', 'internet', 'display', 'speicher', 'akku', 'kabel', 'netzwerk', 'app', 'touchscreen', 'prozessor', 'digital', 'innovation', 'elektrisch', 'entwickeln', 'elektronische geräte', 'technikprodukte', 'elektronikmarkt', 'techniktrends', 'elektronikgeschäft', 'konsolen', 'elektronikhersteller', 'digitalkamera', 'smart-home', 'virtual reality', 'digitalisierung', 'technologiebranche'],
        Kleidung: ['kleidung', 'schuhe', 'jacke', 'hose', 'mode', 'bekleidung', 'garderobe', 'anzug', 'kleiderschrank', 'textilien', 'design', 'stil', 'accessoires', 'outfit', 'stoff', 'tragen', 'modedesigner', 'hemd', 'jeans', 'schmuck', 'bekleiden', 'marken', 'trend', 'schönheit', 'anziehen', 'schuhgeschäft', 'designer-labels', 'accessoires', 'schneidern', 'modenschau', 'vintage-kleidung', 'designer-mode', 'stilbewusstsein', 'taschen'],
        OnlineEinkauf: ['amazon', 'ebay', 'online', 'bestellung', 'shop', 'e-commerce', 'versand', 'online-kauf', 'webshop', 'einkaufswagen', 'zahlung', 'angebot', 'internetshopping', 'versandkosten', 'kundenbewertung', 'einkaufsliste', 'kundenkonto', 'retoure', 'verfügbar', 'lieferung', 'onlineshopping', 'webseite', 'kaufen', 'sortiment', 'online-shoppen', 'shopping-cart', 'online-bezahlung', 'kundenrezensionen', 'bestellverlauf', 'online-angebote', 'digitales einkaufen', 'e-commerce-plattform', 'online-shopping-gewohnheiten'],
        Gesundheit: ['arzt', 'medikament', 'krankenhaus', 'apotheke', 'gesundheit', 'behandlung', 'therapie', 'arztbesuch', 'medizin', 'krank', 'krankenkasse', 'gesundheitswesen', 'diagnose', 'rezept', 'patient', 'gesundheitsvorsorge', 'krankenversicherung', 'heilung', 'praxis', 'sprechstunde', 'ärztlich', 'gesundheitscheck', 'therapeut', 'gesundheitszustand', 'medikamenteneinnahme', 'notfall', 'gesundheitsdienstleistungen', 'gesundheitsvorsorge', 'medikamentenverschreibung', 'gesundheitsexperten', 'krankenhausaufenthalt', 'medikamentenbeschaffung'],
        Haushalt: ['möbel', 'haushalt', 'reinigung', 'küche', 'gerät', 'wohnung', 'einrichtung', 'heim', 'wohnaccessoires', 'wohnraum', 'aufräumen', 'putzen', 'ordnung', 'hausarbeit', 'geschirr', 'möbeldesign', 'wohnstil', 'dekoration', 'wohnzimmer', 'bad', 'einrichtungsgegenstände', 'haushaltswaren', 'sauberkeit', 'wohnkomfort', 'haushaltsgeräte', 'reinigungsmittel', 'hausdekoration', 'innenarchitektur', 'heimwerken', 'küchengeräte', 'raumgestaltung'],
        Bildung: ['schule', 'universität', 'lernen', 'bücher', 'bildung', 'kurs', 'studium', 'schulmaterial', 'akademisch', 'unterricht', 'wissen', 'lehrer', 'bildungseinrichtung', 'studiengebühren', 'kommilitonen', 'vorlesung', 'praktikum', 'forschung', 'wissenschaft', 'abschluss', 'student', 'lernen', 'bildungssystem', 'akademische', 'bibliothek', 'wissenschaftliche forschung', 'studienleistung', 'hochschulausbildung', 'studienunterlagen', 'akademische veranstaltungen'],
        Reisen: ['flug', 'hotel', 'reise', 'urlaub', 'ferien', 'ausflug', 'tourismus', 'reiseziel', 'flugticket', 'pension', 'reiseplanung', 'reiseveranstalter', 'ferienhaus', 'hotelzimmer', 'gepäck', 'rundreise', 'abenteuerurlaub', 'strandausflug', 'kulturtrip', 'entspannung', 'reisende', 'urlaubszeit', 'reisegewohnheiten', 'touristische', 'erholungsreisen', 'reiseerlebnis', 'reisekosten', 'wanderreisen', 'urlaubsaktivitäten', 'reisevergnügen', 'touristenattraktionen'],
        Sport: ['fitness', 'sport', 'training', 'wettkampf', 'aktivität', 'körperliche betätigung', 'bewegung', 'spiel', 'sportart', 'sportschuhe', 'trainer', 'gesundheitsstudio', 'turnhalle', 'athlet', 'sportler', 'sportverein', 'sportwettkampf', 'ausdauer', 'krafttraining', 'dehnen', 'erholung', 'sportlichkeit', 'sportbekleidung', 'sportveranstaltung', 'körperliche fitness', 'sportausrüstung', 'sportwissenschaft', 'teamsportarten', 'sportkultur', 'sportpsychologie', 'gesundheitsförderung'],
        Hobbys: ['hobby', 'freizeit', 'sammlung', 'kreativität', 'basteln', 'interessen', 'leidenschaft', 'hobbyprojekt', 'künstlerisch', 'handwerk', 'freizeitbeschäftigung', 'selbermachen', 'kreatives gestalten', 'handarbeiten', 'bastelmaterial', 'sammlerstück', 'kunstwerk', 'malen', 'zeichnen', 'kunsthandwerk', 'kreativ', 'selbstgemacht', 'hobbyaktivitäten', 'hobbysammlung', 'kunstprojekt', 'handwerkskunst', 'freizeitspaß', 'selbstgestaltung', 'kreativwerkstatt', 'hobbygemeinschaft'],
        Finanzen: ['geld', 'finanzen', 'rechnung', 'zahlung', 'kosten', 'ausgaben', 'budget', 'finanziell', 'einnahmen', 'kredit', 'währung', 'bank', 'sparen', 'investieren', 'kontostand', 'kreditkarte', 'zinsen', 'kreditwürdigkeit', 'zahlungsverkehr', 'online-banking', 'finanzielle', 'geldanlage', 'kontoführung', 'geldausgaben', 'finanzplanung', 'kostenmanagement', 'finanzberater', 'sparen und investieren', 'zahlungsmethoden', 'finanzmärkte', 'bankwesen'],
        Wohnen: ['wohnung', 'haus', 'miete', 'wohnen', 'immobilie', 'einrichtung', 'wohnaccessoires', 'heimat', 'möblierung', 'zimmer', 'nachbarn', 'wohngegend', 'mieter', 'hausbesitzer', 'makler', 'umzug', 'wohnungskauf', 'wohnraumgestaltung', 'eigenheim', 'wohnungssuche', 'wohnsituation', 'nachbarschaft', 'wohnbedarf', 'wohnkultur', 'wohnimmobilien', 'einrichtungsstile', 'nachbarschaftsbeziehungen', 'umzugsvorbereitungen', 'hausbesitz'],
        Technik: ['technik', 'gerät', 'elektronik', 'gadget', 'computer', 'innovation', 'fortschritt', 'entwicklung', 'elektrisch', 'technologie', 'technikfreak', 'innovationsgeist', 'technisches know-how', 'technikwelt', 'gerätehersteller', 'technikprodukte', 'technikexperte', 'techniktrends', 'elektronikmarkt', 'technikneuheiten', 'innovationskraft', 'elektronische', 'technikartikel', 'elektronikbranche', 'elektronikentwicklung', 'technologiebranche', 'technische innovationen', 'elektronikdesign', 'high-tech-geräte', 'elektronikindustrie', 'technikrevolution']
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

async function checkUserStatusAndUpdateUI() {
    let userStatus = retrieveFromStorage();
    if (!userStatus || !userStatus.isLoggedIn) {
        userStatus = await getUserStatus();
        storeInStorage(userStatus);
    }
  
    if (userStatus && userStatus.isLoggedIn) {
        showLogoutButton(userStatus.username);
        return userStatus; 
    } else {
        showLoginButton();
        return null; 
    }
  }
  function storeInStorage(userStatus) {
    try {
        const dataToStore = {
            ...userStatus,
            expiry: new Date().getTime() + (7 * 24 * 60 * 60 * 1000) 
        };
        localStorage.setItem('userStatus', JSON.stringify(dataToStore));
    } catch (e) {
        sessionStorage.setItem('userStatus', JSON.stringify(userStatus));
    }
  }
  
  function retrieveFromStorage() {
    const userData = localStorage.getItem('userStatus') || sessionStorage.getItem('userStatus');
    if (!userData) return null;
  
    const data = JSON.parse(userData);
    if (new Date().getTime() > data.expiry) {
        localStorage.removeItem('userStatus');
        sessionStorage.removeItem('userStatus');
        return null;
    }
    return data;
  }
  
  
  async function getUserStatus() {
      try {
         const response = await fetch('https://localhost:7248/api/user/status', {
      method: 'GET', 
      credentials: 'include'
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