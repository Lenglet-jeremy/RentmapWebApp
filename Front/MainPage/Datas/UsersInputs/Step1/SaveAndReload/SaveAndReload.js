// SaveAndReload.js

import { suggestionsList } from "../UserAddress/Suggestion/Suggestion.js";
import { updateButtonTooltip } from "../UserAddress/Tooltip/Tooltip.js";

// ➤ Récupération des états depuis sessionStorage
const step1Display = sessionStorage.getItem("step1Display");
const step2Display = sessionStorage.getItem("step2Display");
const suggestionsDisplay = sessionStorage.getItem("suggestionsDisplay");
const userAddress = document.getElementById("UserAddress");

const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");

const step1NextButton = document.querySelector(".Step1NextButton");
const savedUserAddress = sessionStorage.getItem("UserInputAdress");

// ➤ Application des états au chargement
if (step1Display !== null) step1.style.display = step1Display;
if (step2Display !== null) step2.style.display = step2Display;
if (suggestionsDisplay !== null) suggestionsList.style.display = suggestionsDisplay;


if (savedUserAddress !== null) {
  userAddress.value = savedUserAddress;
  updateButtonTooltip();
}


userAddress.addEventListener("input", () => {
  sessionStorage.setItem("UserInputAdress", userAddress.value.trim());
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
