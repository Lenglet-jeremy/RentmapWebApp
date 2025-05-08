let SurfaceUserInputValue = document.getElementById('SurfaceUserInputValue');
SurfaceUserInputValue.addEventListener('input', function(event) {
    sessionStorage.setItem('SurfaceUserInputValue', event.target.value)
    
});


let PiecesNumberUsersInputValue = document.getElementById('PiecesNumberUsersInputValue');
PiecesNumberUsersInputValue.addEventListener('change', function(event) {
    sessionStorage.setItem('PiecesNumberUsersInputValue', event.target.value)
    
});



document.querySelectorAll('.InputWithButtons').forEach(group => {
    const input = group.querySelector('input');
    const plusBtn = group.querySelector('.Plus');
    const minusBtn = group.querySelector('.Minus');
    
    const inputIdName = input.getAttribute('id');

    plusBtn.addEventListener('click', () => {
        input.value = parseInt(input.value) + 1 || 1;
        sessionStorage.setItem(inputIdName, input.value)
        
    });

    minusBtn.addEventListener('click', () => {
        input.value = Math.max(1, parseInt(input.value) - 1 || 1);
        sessionStorage.setItem(inputIdName, input.value)
    });
});


let ElevatorOptionUserChoice = document.getElementById("ElevatorOptionUserChoice")
ElevatorOptionUserChoice.addEventListener( "change", function(event){
    sessionStorage.setItem('ElevatorOptionUserChoice', ElevatorOptionUserChoice.checked)
})

// Sélectionnez les éléments de sélection pour le GES et le DPE
let dpeSelect = document.getElementById('dpe');
let gesSelect = document.getElementById('ges');

// Ajoutez un écouteur d'événements pour sauvegarder la valeur du DPE dans le sessionStorage
dpeSelect.addEventListener('change', function(event) {
    sessionStorage.setItem('dpeValue', event.target.value);
});

// Ajoutez un écouteur d'événements pour sauvegarder la valeur du GES dans le sessionStorage
gesSelect.addEventListener('change', function(event) {
    sessionStorage.setItem('gesValue', event.target.value);
});

const step3PrevButton = document.querySelector(".Step3PrevButton");
const step3NextButton = document.querySelector(".Step3NextButton");
const step2 = document.querySelector(".Step2");
const step3 = document.querySelector(".Step3");
const step4 = document.querySelector(".Step4");

const step4Display = sessionStorage.getItem("step4Display");
if (step4Display !== null) step4.style.display = step4Display;

// ➤ Restauration des champs de l'étape 3

// Surface
const savedSurface = sessionStorage.getItem('SurfaceUserInputValue');
if (savedSurface !== null) {
    SurfaceUserInputValue.value = savedSurface;
}

// Nombre de pièces, chambres, SDB, etc.
const idsToRestore = [
    'PiecesNumberUsersInputValue',
    'ChamberNumberUsersInputValue',
    'BathroomsNumberUsersInputValue',
    'AppartementFloorsUsersInputValue',
    'AppartementFloorsNumberUsersInputValue'
];

idsToRestore.forEach(id => {
    const savedValue = sessionStorage.getItem(id);
    if (savedValue !== null) {
        const input = document.getElementById(id);
        if (input) input.value = savedValue;
    }
});

// Checkbox ascenseur
const savedElevator = sessionStorage.getItem('ElevatorOptionUserChoice');
if (savedElevator !== null) {
    ElevatorOptionUserChoice.checked = (savedElevator === 'true');
}

// DPE & GES
const savedDPE = sessionStorage.getItem('dpeValue');
if (savedDPE !== null) dpeSelect.value = savedDPE;

const savedGES = sessionStorage.getItem('gesValue');
if (savedGES !== null) gesSelect.value = savedGES;


// ➤ Étape 3 → Étape 4
step3NextButton.addEventListener("click", () => {
    if (step3 && step4) {
      step3.style.display = "none";
      step4.style.display = "flex";
      sessionStorage.setItem("step3Display", "none");
      sessionStorage.setItem("step4Display", "flex");
    }
  });
  
  // ➤ Étape 3 ← Étape 2 (bouton précédent)
  step3PrevButton.addEventListener("click", () => {
    if (step2 && step3) {
      step2.style.display = "flex";
      step3.style.display = "none";
      sessionStorage.setItem("step2Display", "flex");
      sessionStorage.setItem("step3Display", "none");
      sessionStorage.setItem("step4Display", "none"); // sécurité
    }
  });
  