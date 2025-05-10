import { displayAddressHistory, saveAddressToHistory, step1NextButton } from "../History/History.js";
import { updateButtonTooltip } from "../Tooltip/Tooltip.js";

export const suggestionsList = document.getElementById("AddressSuggestion");
const userAddress = document.getElementById("UserAddress");
const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';


let selectedIndex = -1;

// Récupération des suggestions
export async function fetchSuggestions(query) {
  try {
    suggestionsList.innerHTML = "<li class='loading'>Recherche en cours...</li>";
    suggestionsList.style.display = "flex";

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

  // parametrage du conteneur des suggestions
  suggestionsList.innerHTML = "";
  suggestionsList.style.display = "flex";
  suggestionsList.style.flexDirection = "column";
  suggestionsList.style.backgroundColor = "#f5f5f5";
  suggestionsList.style.border = "1px solid #ddd";
  suggestionsList.style.borderRadius = "4px";
  suggestionsList.style.maxHeight = "250px";
  suggestionsList.style.overflowY = "auto";

  // Si aucune suggestion trouvé
  if (!data.features || data.features.length === 0) {
    const noResult = document.createElement("li");
    noResult.textContent = "Aucun résultat trouvé";
    noResult.classList.add("no-result");
    suggestionsList.appendChild(noResult);
    return;
  }



  // Affichage des suggestions
  const query = userAddress.value.trim().toLowerCase();
  const relevantFeatures = data.features.filter(feature => (feature.relevance || 0) > 0.8);  // Pertinence des suggestions
  const featuresToDisplay = relevantFeatures.length > 0 ? relevantFeatures : data.features;

  // Création de chaque suggestions
  featuresToDisplay.forEach((feature, index) => {
    const li = document.createElement("li");
    li.style.cursor = "pointer";
    li.style.padding = "8px 12px";
    li.style.borderBottom = "1px solid #eee";
    li.style.transition = "background-color 0.2s";

    const placeName = feature.place_name;
    const lowerCaseName = placeName.toLowerCase();

    // Mise en valeur du matching
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

    // Selection de suggestion
    li.addEventListener("click", () => {
      userAddress.value = feature.place_name;
      saveAddressToHistory(feature.place_name);

      suggestionsList.style.display = "none";
      sessionStorage.setItem("UserInputAdress", userAddress.value);

      userAddress.dispatchEvent(new CustomEvent('addressSelected', { detail: feature }));

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

function setSuggestion(){

  userAddress.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsList.style.display = "none";
    }, 100);
  });

  suggestionsList.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

}

setSuggestion()