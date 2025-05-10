import { updateButtonTooltip } from "../Tooltip/Tooltip.js";

const userAddress = document.getElementById("UserAddress");
const LIMIT_HISTORY = 5

export const step1NextButton = document.querySelector(".Step1NextButton");

function getAddressHistory() {
  return JSON.parse(localStorage.getItem("addressHistory")) || [];
}

export function saveAddressToHistory(address) {
  let history = JSON.parse(localStorage.getItem("addressHistory")) || [];
  
  // Supprime les doublons
  history = history.filter(item => item !== address);

  // Ajoute au début
  history.unshift(address);

  history = history.slice(0, LIMIT_HISTORY);

  localStorage.setItem("addressHistory", JSON.stringify(history));
}

export function displayAddressHistory() {
  const container = document.getElementById("AddressHistory");
  const history = getAddressHistory();

  if (history.length === 0) {
    container.style.display = "none";
    return;
  }
  
  container.style.top = `${userAddress.offsetTop + userAddress.offsetHeight}px`;
  container.style.left = `${userAddress.offsetLeft}px`;
  container.style.width = `${userAddress.offsetWidth}px`;

  container.innerHTML = "<p>Historique des adresses :</p><ul>" +
    history.map(addr => `<li>${addr}</li>`).join('') + "</ul>";

  container.querySelectorAll("li").forEach(li => {
  li.addEventListener("click", () => {

    userAddress.value = li.textContent;
    saveAddressToHistory(userAddress.value)

    step1NextButton.disabled = false;
    updateButtonTooltip();

    container.style.display = "none";

    // Forcer le focus dans l'input
    userAddress.focus();

    // Simuler une touche "Enter" pour déclencher le traitement
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      keyCode: 13,
      which: 13,
      bubbles: true
    });
    userAddress.dispatchEvent(enterEvent);
    userAddress.dispatchEvent(new Event('change'));

  });
});

}

function setUserAddressBehavior() {

  userAddress.addEventListener("focus", () => {
    if (userAddress.value.trim() === "") {
      displayAddressHistory();
      document.getElementById("AddressHistory").style.display = "block";
    }
  });

  userAddress.addEventListener("input", () => {
    const addressHistory = document.getElementById("AddressHistory");
    
    if (userAddress.value.trim() === "") {
      displayAddressHistory();
      addressHistory.style.display = "block";
    } else {
      addressHistory.style.display = "none";
    }
  });

  userAddress.addEventListener("blur", () => {
  setTimeout(() => {
    const addressHistory = document.getElementById("AddressHistory");
    addressHistory.style.display = "none";
  }, 100);
});


}


setUserAddressBehavior()