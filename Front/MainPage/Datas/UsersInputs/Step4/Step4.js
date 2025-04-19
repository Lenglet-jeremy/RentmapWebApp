

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
