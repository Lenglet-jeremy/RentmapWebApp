

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

step4NextButton.addEventListener("click", () => {
    if (step4 && step5) {
        step4.style.display = "none";
        step5.style.display = "flex";
    }
});

step4PrevButton.addEventListener("click", () => {
    if (step3 && step5) {
        step3.style.display = "flex";
        step4.style.display = "none";
    }
});
