// Tooltip.js

const step1NextButton = document.querySelector(".Step1NextButton");

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


// Désactiver le bouton Next au début
step1NextButton.disabled = true;
// step1NextButton.disabled = false;

// Fonction de mise à jour du tooltip
export function updateButtonTooltip() {
  if (step1NextButton.disabled) {
    step1NextButton.addEventListener("mouseenter", showTooltip);
    step1NextButton.addEventListener("mouseleave", hideTooltip);
  } else {
    step1NextButton.removeEventListener("mouseenter", showTooltip);
    step1NextButton.removeEventListener("mouseleave", hideTooltip);
  }
}



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

updateButtonTooltip()