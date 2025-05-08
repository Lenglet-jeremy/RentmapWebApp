const radioButtons = document.querySelectorAll('input[name="Choice"]');

radioButtons.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      sessionStorage.setItem("selectedPropertyType", radio.value);
    }
  });
});

const savedPropertyType = sessionStorage.getItem("selectedPropertyType");

if (savedPropertyType) {
  const savedRadio = document.querySelector(`input[name="Choice"][value="${savedPropertyType}"]`);
  if (savedRadio) {
    savedRadio.checked = true;
  }
}




// =====================================================
// ==================== RELOAD PAGE ====================
// =====================================================

// Sélection des éléments
const input = document.querySelector("input"); // ou ajuste selon ton sélecteur exact

const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");
const step3 = document.querySelector(".Step3");

const step1NextButton = document.querySelector(".Step1NextButton");
const step2PrevButton = document.querySelector(".Step2PrevButton");
const step2NextButton = document.querySelector(".Step2NextButton");

// ➤ Récupération des états depuis sessionStorage
const step1Display = sessionStorage.getItem("step1Display");
const step2Display = sessionStorage.getItem("step2Display");
const step3Display = sessionStorage.getItem("step3Display");

// ➤ Application des états au chargement
if (step1Display !== null) step1.style.display = step1Display;
if (step2Display !== null) step2.style.display = step2Display;
if (step3Display !== null) step3.style.display = step3Display;


// ➤ Étape 1 → Étape 2
step1NextButton.addEventListener("click", () => {
  if (!step1NextButton.disabled && step1 && step2) {
    step1.style.display = "none";
    step2.style.display = "flex";
    sessionStorage.setItem("step1Display", "none");
    sessionStorage.setItem("step2Display", "flex");
    sessionStorage.setItem("step3Display", "none"); // sécurité
  }
});

// ➤ Étape 2 → Étape 3
step2NextButton.addEventListener("click", () => {
  if (step2 && step3) {
    step2.style.display = "none";
    step3.style.display = "flex";
    sessionStorage.setItem("step2Display", "none");
    sessionStorage.setItem("step3Display", "flex");
  }
});

// ➤ Étape 2 ← Étape 1 (bouton précédent)
step2PrevButton.addEventListener("click", () => {
  if (step1 && step2) {
    step1.style.display = "flex";
    step2.style.display = "none";
    sessionStorage.setItem("step1Display", "flex");
    sessionStorage.setItem("step2Display", "none");
    sessionStorage.setItem("step3Display", "none"); // au cas où on revient en arrière
  }
});
// =====================================================
// ================== END RELOAD PAGE ==================
// =====================================================
