const radioButtons = document.querySelectorAll('input[name="Choice"]');

// Sauvegarde du choix lorsque l'utilisateur sélectionne une option
radioButtons.forEach(radio => {
    radio.addEventListener("change", function () {
        sessionStorage.setItem("propertyType", this.value);
        
    });
});

const step2PrevButton = document.querySelector(".Step2PrevButton");
const step2NextButton = document.querySelector(".Step2NextButton");
const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");
const step3 = document.querySelector(".Step3");

step2NextButton.addEventListener("click", () => {
    if (step2 && step3) {
        step2.style.display = "none";
        step3.style.display = "flex";
    }
});

step2PrevButton.addEventListener("click", () => {
    if (step1 && step3) {
        step1.style.display = "flex";
        step2.style.display = "none";
    }
});
