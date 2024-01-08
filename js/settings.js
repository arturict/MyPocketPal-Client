document.addEventListener('DOMContentLoaded', () => {
    loadOrCreateSettings();
    document.getElementById('settings-form').addEventListener('submit', saveSettings);
});

async function loadOrCreateSettings() {
    const response = await fetch('https://localhost:7248/api/settings/', { /* Ihr Fetch-Setup */ });
    if (!response.ok) {
        // Wenn keine Einstellungen gefunden, erstelle Standardwerte
        await createDefaultSettings();
    }
    const settings = await response.json();
    setFormValues(settings);
}

async function createDefaultSettings() {
    // Senden Sie einen Request, um Standardwerte in der Datenbank zu erstellen
}

function setFormValues(settings) {
    // Setzen Sie die Formularwerte basierend auf den geladenen Einstellungen
}

async function saveSettings(event) {
    event.preventDefault();
    // Sammeln und senden Sie die aktualisierten Einstellungen an den Server
}
