// Step1.js

// Sélection des éléments du DOM
const input = document.getElementById("Address");
const suggestionsList = document.getElementById("Suggestion");

// Configuration de l'URL du backend selon l'environnement
const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';

// Variables pour l'autocomplétion optimisée
let timeoutId;
const DEBOUNCE_DELAY = 300; // Délai en ms pour éviter trop de requêtes
let lastQuery = '';
let selectedIndex = -1;

// Gestionnaire d'événement pour la saisie dans le champ d'adresse
input.addEventListener("input", () => {
  const query = input.value.trim();
  
  // Réinitialiser l'index sélectionné à chaque nouvelle saisie
  selectedIndex = -1;
  
  // Effacer le timeout précédent
  clearTimeout(timeoutId);
  
  // Vérifier si la requête est suffisamment longue
  if (query.length < 3) {
    suggestionsList.style.display = "none";
    return;
  }
  
  // Éviter les requêtes redondantes
  if (query === lastQuery) return;
  
  // Attendre un peu que l'utilisateur finisse de taper
  timeoutId = setTimeout(() => {
    lastQuery = query;
    fetchSuggestions(query);
  }, DEBOUNCE_DELAY);
});

// Fonction pour récupérer les suggestions d'adresses
async function fetchSuggestions(query) {
  try {
    // Afficher un indicateur de chargement
    suggestionsList.innerHTML = "<li class='loading'>Recherche en cours...</li>";
    suggestionsList.style.display = "flex";
    suggestionsList.style.marginTop = "45px";
    
    const url = `${backendUrl}/api/autocomplete?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
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

// Fonction pour afficher les suggestions
function displaySuggestions(data) {
  // Vider la liste
  suggestionsList.innerHTML = "";
  
  // Si aucun résultat
  if (!data.features || data.features.length === 0) {
    const noResult = document.createElement("li");
    noResult.textContent = "Aucun résultat trouvé";
    noResult.classList.add("no-result");
    suggestionsList.appendChild(noResult);
    return;
  }
  
  // Configurer l'apparence de la liste
  suggestionsList.style.display = "flex";
  suggestionsList.style.flexDirection = "column";
  suggestionsList.style.backgroundColor = "#f5f5f5";
  suggestionsList.style.border = "1px solid #ddd";
  suggestionsList.style.borderRadius = "4px";
  suggestionsList.style.maxHeight = "250px";
  suggestionsList.style.overflowY = "auto";
  
  // Filtrer pour n'afficher que les résultats pertinents
  // On peut filtrer selon la pertinence ou la correspondance avec la recherche
  const query = input.value.trim().toLowerCase();
  const relevantFeatures = data.features.filter(feature => {
    const relevanceScore = feature.relevance || 0;
    // On peut ajuster ce seuil selon les besoins
    return relevanceScore > 0.7;
  });
  
  // Utiliser les résultats filtrés au lieu de tous les résultats
  const featuresToDisplay = relevantFeatures.length > 0 ? relevantFeatures : data.features;
  
  // Ajouter chaque suggestion à la liste
  featuresToDisplay.forEach((feature, index) => {
    const li = document.createElement("li");
    
    // Styles pour l'élément de liste
    li.style.cursor = "pointer";
    li.style.padding = "8px 12px";
    li.style.borderBottom = "1px solid #eee";
    li.style.transition = "background-color 0.2s";
    
    // Mettre en évidence la partie correspondant à la recherche
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
    
    // Événements pour l'élément de liste
    li.addEventListener("click", () => {
      input.value = feature.place_name;
      suggestionsList.style.display = "none";
    
      // Stocker l'adresse sélectionnée
      sessionStorage.setItem("UserInputAdress", input.value);
    
      // Déclencher un événement personnalisé
      input.dispatchEvent(new CustomEvent('addressSelected', { detail: feature }));
    });
    
    
    li.addEventListener("mouseover", () => {
      selectedIndex = index;
      highlightSelection();
    });
    
    suggestionsList.appendChild(li);
  });
  
  // Si la liste est vide après filtrage, masquer
  if (suggestionsList.children.length === 0) {
    suggestionsList.style.display = "none";
  }
}

// Fonction pour mettre en surbrillance la suggestion sélectionnée
function highlightSelection() {
  // Supprimer la surbrillance de tous les éléments
  Array.from(suggestionsList.children).forEach((item, idx) => {
    if (idx === selectedIndex) {
      item.style.backgroundColor = "#e0e0e0";
    } else {
      item.style.backgroundColor = "";
    }
  });
}

// Gestion de la perte de focus du champ d'adresse
input.addEventListener("blur", () => {
  // Attendre que le clic sur une suggestion soit traité avant de masquer
  setTimeout(() => {
    suggestionsList.style.display = "none";
  }, 100);
});

suggestionsList.addEventListener("mousedown", (e) => {
  e.preventDefault(); // Empêche le champ d'être "blurred" avant le clic
});


// Gestion de la navigation clavier pour les suggestions
input.addEventListener("keydown", (event) => {
  // Si la liste des suggestions est visible
  if (suggestionsList.style.display === "flex") {
    const suggestions = suggestionsList.children;
    
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
        } else {
          suggestionsList.style.display = "none";
          sessionStorage.setItem("UserInputAdress", input.value);
        }
        break;
        
      case "Escape":
        event.preventDefault();
        suggestionsList.style.display = "none";
        break;
    }
  } else if (event.key === "Enter") {
    // Si les suggestions ne sont pas affichées mais que la touche Entrée est pressée
    sessionStorage.setItem("UserInputAdress", input.value);
  }
});

// Gérer le clic en dehors pour fermer la liste
document.addEventListener("click", (event) => {
  if (
    event.target !== input &&
    !suggestionsList.contains(event.target)
  ) {
    suggestionsList.style.display = "none";
  }
});


// Configuration des boutons de navigation entre les étapes
const step1NextButton = document.querySelector(".Step1NextButton");
const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");

step1NextButton.addEventListener("click", () => {
  if (step1 && step2) {
    step1.style.display = "none";
    step2.style.display = "flex";
  }
});

// Style CSS pour la liste des suggestions
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
`;
document.head.appendChild(style);

document.getElementById('Address').addEventListener('blur', () => {
  const address = document.getElementById('Address').value.trim();
  if (address) {
      sessionStorage.setItem('UserInputAdress', address);
  }
});

document.getElementById('Address').addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
      const address = document.getElementById('Address').value.trim();
      if (address) {
          sessionStorage.setItem('UserInputAdress', address);
      }
  }
});
