// Step1.js

// Sélection des éléments du DOM
const input = document.getElementById("Address");
const suggestionsList = document.getElementById("Suggestion");
const step1NextButton = document.querySelector(".Step1NextButton");
const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");

// Désactiver le bouton Next au début
step1NextButton.disabled = true;
// step1NextButton.disabled = false;

// Création d'un tooltip personnalisé
const customTooltip = document.createElement("div");
customTooltip.textContent = "Veuillez choisir une adresse complète";
customTooltip.style.position = "absolute";
customTooltip.style.background = "#333";
customTooltip.style.color = "#fff";
customTooltip.style.padding = "6px 10px";
customTooltip.style.borderRadius = "5px";
customTooltip.style.fontSize = "13px";
customTooltip.style.whiteSpace = "nowrap";
customTooltip.style.visibility = "hidden";
customTooltip.style.opacity = "0";
customTooltip.style.transition = "opacity 0.2s ease";
customTooltip.style.zIndex = "9999";
document.body.appendChild(customTooltip);

// Fonction de mise à jour du tooltip
function updateButtonTooltip() {
  if (step1NextButton.disabled) {
    step1NextButton.addEventListener("mouseenter", showTooltip);
    step1NextButton.addEventListener("mouseleave", hideTooltip);
  } else {
    hideTooltip();
    step1NextButton.removeEventListener("mouseenter", showTooltip);
    step1NextButton.removeEventListener("mouseleave", hideTooltip);
  }
}
updateButtonTooltip();

// Affichage / masquage du tooltip
function showTooltip() {
  const rect = step1NextButton.getBoundingClientRect();
  customTooltip.style.top = `${rect.top - 35}px`;
  customTooltip.style.left = `${rect.left + rect.width / 2}px`;
  customTooltip.style.transform = "translateX(-50%)";
  customTooltip.style.visibility = "visible";
  customTooltip.style.opacity = "1";
}

function hideTooltip() {
  customTooltip.style.visibility = "hidden";
  customTooltip.style.opacity = "0";
}

// Détection environnement
const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';

let timeoutId;
const DEBOUNCE_DELAY = 300;
let lastQuery = '';
let selectedIndex = -1;

// Saisie utilisateur
input.addEventListener("input", () => {
  const query = input.value.trim();
  selectedIndex = -1;
  clearTimeout(timeoutId);

  step1NextButton.disabled = true;
  updateButtonTooltip();

  if (query.length < 3) {
    suggestionsList.style.display = "none";
    return;
  }

  if (query === lastQuery) return;

  timeoutId = setTimeout(() => {
    lastQuery = query;
    fetchSuggestions(query);
  }, DEBOUNCE_DELAY);
});

// Récupération des suggestions
async function fetchSuggestions(query) {
  try {
    suggestionsList.innerHTML = "<li class='loading'>Recherche en cours...</li>";
    suggestionsList.style.display = "flex";
    suggestionsList.style.marginTop = "45px";

    const url = `${backendUrl}/api/autocomplete?query=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');

    const data = await response.json();
    displaySuggestions(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des suggestions :", error);
    suggestionsList.innerHTML = "<li class='error'>Une erreur est survenue</li>";
    setTimeout(() => {
      suggestionsList.style.display = "none";
    }, 2000);
  }
}

// Affichage suggestions
function displaySuggestions(data) {
  suggestionsList.innerHTML = "";

  if (!data.features || data.features.length === 0) {
    const noResult = document.createElement("li");
    noResult.textContent = "Aucun résultat trouvé";
    noResult.classList.add("no-result");
    suggestionsList.appendChild(noResult);
    return;
  }

  suggestionsList.style.display = "flex";
  suggestionsList.style.flexDirection = "column";
  suggestionsList.style.backgroundColor = "#f5f5f5";
  suggestionsList.style.border = "1px solid #ddd";
  suggestionsList.style.borderRadius = "4px";
  suggestionsList.style.maxHeight = "250px";
  suggestionsList.style.overflowY = "auto";

  const query = input.value.trim().toLowerCase();
  const relevantFeatures = data.features.filter(feature => (feature.relevance || 0) > 0.7);
  const featuresToDisplay = relevantFeatures.length > 0 ? relevantFeatures : data.features;

  featuresToDisplay.forEach((feature, index) => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.style.padding = "8px 12px";
    li.style.borderBottom = "1px solid #eee";
    li.style.transition = "background-color 0.2s";

    const placeName = feature.place_name;
    const lowerCaseName = placeName.toLowerCase();

    if (lowerCaseName.includes(query)) {
      const startIndex = lowerCaseName.indexOf(query);
      const endIndex = startIndex + query.length;
      li.innerHTML =
        placeName.substring(0, startIndex) +
        `<strong>${placeName.substring(startIndex, endIndex)}</strong>` +
        placeName.substring(endIndex);
    } else {
      li.textContent = placeName;
    }

    li.addEventListener("click", () => {
      input.value = feature.place_name;
      suggestionsList.style.display = "none";
      sessionStorage.setItem("UserInputAdress", input.value);
      input.dispatchEvent(new CustomEvent('addressSelected', { detail: feature }));

      step1NextButton.disabled = false;
      updateButtonTooltip();
    });

    li.addEventListener("mouseover", () => {
      selectedIndex = index;
      highlightSelection();
    });

    suggestionsList.appendChild(li);
  });

  if (suggestionsList.children.length === 0) {
    suggestionsList.style.display = "none";
  }
}

// Navigation clavier
function highlightSelection() {
  Array.from(suggestionsList.children).forEach((item, idx) => {
    item.style.backgroundColor = idx === selectedIndex ? "#e0e0e0" : "";
  });
}

input.addEventListener("blur", () => {
  setTimeout(() => {
    suggestionsList.style.display = "none";
  }, 100);
});

suggestionsList.addEventListener("mousedown", (e) => {
  e.preventDefault();
});

input.addEventListener("keydown", (event) => {
  const suggestions = suggestionsList.children;

  if (suggestionsList.style.display === "flex") {
    switch(event.key) {
      case "ArrowDown":
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        highlightSelection();
        break;

      case "ArrowUp":
        event.preventDefault();
        selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        highlightSelection();
        break;

      case "Enter":
        event.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          suggestions[selectedIndex].click();
        }
        break;

      case "Escape":
        event.preventDefault();
        suggestionsList.style.display = "none";
        break;
    }
  }
});


// CSS dynamique
const style = document.createElement("style");
style.textContent = `
  #Suggestion {
    list-style-type: none;
    padding: 0;
    margin: 0;
    position: absolute;
    width: 100%;
    z-index: 1000;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  #Suggestion li {
    margin: 0;
    width: 100%;
  }

  #Suggestion li:last-child {
    border-bottom: none;
  }

  #Suggestion li:hover {
    background-color: #e0e0e0;
  }

  #Suggestion .loading {
    text-align: center;
    padding: 10px;
    color: #666;
  }

  #Suggestion .error {
    text-align: center;
    padding: 10px;
    color: #d32f2f;
  }

  #Suggestion .no-result {
    text-align: center;
    padding: 10px;
    color: #666;
    font-style: italic;
  }

  .Step1NextButton[disabled] {
    pointer-events: auto;
    cursor: not-allowed;
  }
`;
document.head.appendChild(style);

// =====================================================
// ==================== RELOAD PAGE ====================
// =====================================================

// ➤ Récupération des états depuis sessionStorage
const step1Display = sessionStorage.getItem("step1Display");
const step2Display = sessionStorage.getItem("step2Display");
const suggestionsDisplay = sessionStorage.getItem("suggestionsDisplay");
const addressInput = document.getElementById("Address");


const savedUserAddress = sessionStorage.getItem("UserInputAdress");
if (savedUserAddress !== null) {
  addressInput.value = savedUserAddress;
  step1NextButton.disabled = false;
  updateButtonTooltip();
}



// ➤ Application des états au chargement
if (step1Display !== null) step1.style.display = step1Display;
if (step2Display !== null) step2.style.display = step2Display;
if (suggestionsDisplay !== null) suggestionsList.style.display = suggestionsDisplay;

// ➤ Masquer la liste de suggestions si clic en dehors
document.addEventListener("click", (event) => {
  if (event.target !== input && !suggestionsList.contains(event.target)) {
    suggestionsList.style.display = "none";
    sessionStorage.setItem("suggestionsDisplay", "none");
  }
});

// ➤ Étape 1 → Étape 2
step1NextButton.addEventListener("click", () => {
  if (!step1NextButton.disabled && step1 && step2) {
    step1.style.display = "none";
    step2.style.display = "flex";
    suggestionsList.style.display = "none"; // Sécurité si suggestions ouvertes
    sessionStorage.setItem("step1Display", "none");
    sessionStorage.setItem("step2Display", "flex");
    sessionStorage.setItem("suggestionsDisplay", "none");
  }
});

// =====================================================
// ================== END RELOAD PAGE ==================
// =====================================================
