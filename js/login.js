document.addEventListener("DOMContentLoaded", function () {
  checkUserStatusAndUpdateUI();

  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", handleLogin);
  const registerForm = document.getElementById("register-form");
registerForm.addEventListener("submit", handleRegister);
});
const loginLink = document.getElementById("login-link");

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
        return { isLoggedIn: false, username: error };
    }
}

// Hilfsfunktion zur Validierung von E-Mail
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
    displayMessage(registerStatus, "Bitte geben Sie eine gültige E-Mail-Adresse an.", false);
    return;
  }

  try {
    const registerResponse = await fetch("https://localhost:7248/api/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

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
    displayMessage(registerStatus, "Sie haben sich erfolgreich registriert und sind nun eingeloggt.", true);
    

    setTimeout(() => {
      window.location.href = "/"; // Weiterleitung zur Startseite
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
    displayMessage(loginStatus, "Bitte Benutzername und Passwort eingeben.", false);
    console.log("handleLogin beendet aufgrund fehlender Eingaben");
    return;
  }

  try {
    const response = await fetch("https://localhost:7248/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: 'include'
    });

    console.log("Serverantwort auf Login:", response);

    if (!response.ok) {
      throw new Error("Login fehlgeschlagen: " + response.statusText);
    }

    const responseData = await response.json();
    displayMessage(loginStatus, "Login erfolgreich!", true);
    showLogoutButton(username);
  } catch (error) {
    console.error("Fehler beim Login:", error);
    displayMessage(loginStatus, error.message, false);
  }
  console.log("handleLogin beendet");
}




function showLoginButton() {
  const loginLink = document.getElementById("login-link");
  loginLink.innerHTML = '<button onclick="location.href=\'/login.html\'">Login</button>';
}
//function getSessionId() {//
 // const cookies = document.cookie.split(";");
//  for (const cookie of cookies) {
 //   const parts = cookie.trim().split("=");
 //   if (parts[0] === "SessionId") {
 //     return parts[1];
 //   }
 // }
 // return null;
//}

function showLogoutButton(username) {
  const logoutButton = document.createElement("button");
  logoutButton.innerText = `Logout (${username})`;
  logoutButton.onclick = logout; 
  loginLink.innerHTML = ""; 
  loginLink.appendChild(logoutButton);
}
function logout() {
  fetch('https://localhost:7248/api/user/logout', {
      method: 'POST',
      credentials: 'include'
  }).then(response => {
      console.log('Server response:', response);
      if(response.ok) {
          localStorage.removeItem('userStatus');
          sessionStorage.removeItem('userStatus');
          showLoginButton();
      } else {
          console.error('Logout fehlgeschlagen mit Status:', response.status);
      }
  }).catch(error => console.error('Logout failed:', error));
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
