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
