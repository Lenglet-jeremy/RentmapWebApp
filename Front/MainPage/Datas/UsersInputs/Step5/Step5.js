
const step5PrevButton = document.querySelector(".Step5PrevButton");
const step4 = document.querySelector(".Step4");
const step5 = document.querySelector(".Step5");


step5PrevButton.addEventListener("click", () => {
    if (step4 && step5) {
        step4.style.display = "flex";
        step5.style.display = "none";
    }
});
