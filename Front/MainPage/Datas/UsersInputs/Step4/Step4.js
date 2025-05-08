

// Fonction pour sauvegarder les valeurs dans le sessionStorage
const saveToSessionStorage = () => {
    const annee = document.getElementById('annee').value;
    const etat = document.getElementById('etat').value;
    const statut = document.getElementById('statut').value;

    sessionStorage.setItem('anneeUserInput', annee);
    sessionStorage.setItem('etatUserChoice', etat);
    sessionStorage.setItem('statutUserChoice', statut);

};

// Ajouter des écouteurs d'événements pour les changements d'entrée
document.querySelectorAll('#annee, #etat, #statut').forEach(input => {
    input.addEventListener('change', saveToSessionStorage);
});


const step4PrevButton = document.querySelector(".Step4PrevButton");
const step4NextButton = document.querySelector(".Step4NextButton");
const step3 = document.querySelector(".Step3");
const step4 = document.querySelector(".Step4");
const step5 = document.querySelector(".Step5");

const step5Display = sessionStorage.getItem("step5Display");
if (step5Display !== null) step5.style.display = step5Display;

// ➤ Étape 4 → Étape 5
step4NextButton.addEventListener("click", () => {
    if (step4 && step5) {
      step4.style.display = "none";
      step5.style.display = "flex";
      sessionStorage.setItem("step4Display", "none");
      sessionStorage.setItem("step5Display", "flex");
    }
  });
  
  // ➤ Étape 4 ← Étape 3 (bouton précédent)
  step4PrevButton.addEventListener("click", () => {
    if (step3 && step4) {
      step3.style.display = "flex";
      step4.style.display = "none";
      sessionStorage.setItem("step3Display", "flex");
      sessionStorage.setItem("step4Display", "none");
      sessionStorage.setItem("step5Display", "none"); // sécurité
    }
  });
  

  // ➤ Restauration des champs de l'étape 4

const anneeInput = document.getElementById('annee');
const etatSelect = document.getElementById('etat');
const statutSelect = document.getElementById('statut');

const savedAnnee = sessionStorage.getItem('anneeUserInput');
if (savedAnnee !== null) anneeInput.value = savedAnnee;

const savedEtat = sessionStorage.getItem('etatUserChoice');
if (savedEtat !== null) etatSelect.value = savedEtat;

const savedStatut = sessionStorage.getItem('statutUserChoice');
if (savedStatut !== null) statutSelect.value = savedStatut;
