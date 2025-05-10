// Step1.js

import { fetchSuggestions } from "./UserAddress/Suggestion/Suggestion.js";
import { updateButtonTooltip } from "./UserAddress/Tooltip/Tooltip.js";


// Sélection des éléments du DOM
const userAddress = document.getElementById("UserAddress");
const suggestionsList = document.getElementById("AddressSuggestion");



let timeoutId;
const DEBOUNCE_DELAY = 300;
let lastQuery = '';
let selectedIndex = -1;

import("./SaveAndReload/SaveAndReload.js")
import("./UserAddress/Suggestion/Suggestion.js")
import("./UserAddress/History/History.js")
import("./UserAddress/Tooltip/Tooltip.js")


// Saisie utilisateur
userAddress.addEventListener("input", () => {
  const query = userAddress.value.trim();
  selectedIndex = -1;
  clearTimeout(timeoutId);


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
