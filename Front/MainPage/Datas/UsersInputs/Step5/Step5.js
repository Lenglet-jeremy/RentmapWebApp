function addRemoveFormGroup() {
    const section = document.querySelector(".section.Loyerprevisionnels");
    const addButton = document.getElementById("addFormGroup");
    const removeButton = document.getElementById("removeFormGroup");

    addButton.addEventListener("click", () => {
        const formGroups = section.querySelectorAll(".formGroup");
        const nextIndex = formGroups.length + 1;

        const newGroup = document.createElement("div");
        newGroup.className = "formGroup";
        newGroup.innerHTML = `
            <label for="loyersLoyer${nextIndex}">Loyer ${nextIndex}</label>
            <input type="number" id="loyersLoyer${nextIndex}" name="loyer${nextIndex}" class="inputField">
            <span>€</span>
            <select id="loyersTypeLoyer${nextIndex}" name="typeLoyer${nextIndex}">
                <option value="chambre">Chambre</option>
                <option value="logementEntier">Logement entier</option>
            </select>
        `;

        const controlButtons = section.querySelector(".FormGroupControlButtons");
        section.insertBefore(newGroup, controlButtons); // ✅ Corrigé ici
    });

    removeButton.addEventListener("click", () => {
        const formGroups = section.querySelectorAll(".formGroup");
        if (formGroups.length > 0) {
            section.removeChild(formGroups[formGroups.length - 1]);
        }
    });
}



addRemoveFormGroup()

const step5PrevButton = document.querySelector(".Step5PrevButton");
const step4 = document.querySelector(".Step4");
const step5 = document.querySelector(".Step5");


step5PrevButton.addEventListener("click", () => {
    if (step4 && step5) {
        step4.style.display = "flex";
        step5.style.display = "none";
    }
});
