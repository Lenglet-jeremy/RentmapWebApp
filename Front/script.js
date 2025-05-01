// Script.js

const steps = document.querySelectorAll(".DataContent > div");
let currentStep = 1;

async function loadHTML(path, elementId) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`❌ Erreur de chargement : ${path}`);
        }
        const html = await response.text();

        const element = document.getElementById(elementId);
        if (!element) {
            throw new Error(`❌ L'élément ${elementId} n'existe pas dans le DOM`);
        }
        element.innerHTML = html;
    } catch (error) {
        console.error(error);
    }
}

async function loadAllHTML() {
    await loadHTML('./MainPage/MainPage.html', 'Body');
    await loadHTML('./MainPage/Datas/UsersInputs/Step1/Step1.html', 'Step1');
    await loadHTML('./MainPage/Datas/UsersInputs/Step2/Step2.html', 'Step2');
    await loadHTML('./MainPage/Datas/UsersInputs/Step3/Step3.html', 'Step3');
    await loadHTML('./MainPage/Datas/UsersInputs/Step4/Step4.html', 'Step4');
    await loadHTML('./MainPage/Datas/UsersInputs/Step5/Step5.html', 'Step5');
    await loadHTML('./MainPage/Datas/Result/Result.html', 'Result');
    await loadHTML('./MainPage/Datas/Result/Amenieties/Amenities.html', 'amenities-container');

    // Import the JavaScript files
    await import('./MainPage/Datas/UsersInputs/Step1/Step1.js');
    await import('./MainPage/Datas/UsersInputs/Step2/Step2.js');
    await import('./MainPage/Datas/UsersInputs/Step3/Step3.js');
    await import('./MainPage/Datas/UsersInputs/Step4/Step4.js');
    await import('./MainPage/Datas/UsersInputs/Step5/Step5.js');
    await import('./MainPage/Map/Map.js');
    await import('./MainPage/Datas/Result/Result.js');
    await import('./MainPage/Datas/Result/Amenieties/Amenities.js');
    await import('./MainPage/MainPage.js');
}

window.addEventListener('beforeunload', function (e) {
    fetch('/shutdown', { method: 'POST' })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});

loadAllHTML();
