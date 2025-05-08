function addRemoveFormGroup() {
    const section = document.querySelector(".section.Loyerprevisionnels");
    const addButton = document.getElementById("addFormGroup");
    const removeButton = document.getElementById("removeFormGroup");

    addButton.addEventListener("click", () => {
        let count = parseInt(sessionStorage.getItem("loyerCount") || "1");
        const nextIndex = count + 1;

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
        section.insertBefore(newGroup, controlButtons);

        // Ajouter écouteurs + restauration
        document.getElementById(`loyersLoyer${nextIndex}`).addEventListener("input", saveFieldToSession);
        document.getElementById(`loyersTypeLoyer${nextIndex}`).addEventListener("input", saveFieldToSession);

        sessionStorage.setItem("loyerCount", nextIndex.toString());
    });

    removeButton.addEventListener("click", () => {
        let count = parseInt(sessionStorage.getItem("loyerCount") || "1");

        if (count > 1) {
            const section = document.querySelector(".section.Loyerprevisionnels");
            const formGroups = section.querySelectorAll(".formGroup");
            const lastGroup = formGroups[formGroups.length - 1];
            const input = lastGroup.querySelector("input");
            const select = lastGroup.querySelector("select");

            if (input) sessionStorage.removeItem(input.id);
            if (select) sessionStorage.removeItem(select.id);

            section.removeChild(lastGroup);
            sessionStorage.setItem("loyerCount", (count - 1).toString());
        }
    });
}

// Sauvegarde individuelle
function saveFieldToSession(event) {
    sessionStorage.setItem(event.target.id, event.target.value);
}

function restoreInputById(id) {
    const savedValue = sessionStorage.getItem(id);
    if (savedValue !== null) {
        const field = document.getElementById(id);
        if (field) field.value = savedValue;
    }
}

function initStep5Fields() {
    document.querySelectorAll('.Step5 input, .Step5 select').forEach(field => {
        restoreInputById(field.id);
        field.addEventListener("input", saveFieldToSession);
    });
}

function restoreDynamicLoyers() {
    const section = document.querySelector(".section.Loyerprevisionnels");
    const loyerCount = parseInt(sessionStorage.getItem("loyerCount") || "1");

    for (let index = 2; index <= loyerCount; index++) {
        const newGroup = document.createElement("div");
        newGroup.className = "formGroup";
        newGroup.innerHTML = `
            <label for="loyersLoyer${index}">Loyer ${index}</label>
            <input type="number" id="loyersLoyer${index}" name="loyer${index}" class="inputField">
            <span>€</span>
            <select id="loyersTypeLoyer${index}" name="typeLoyer${index}">
                <option value="chambre">Chambre</option>
                <option value="logementEntier">Logement entier</option>
            </select>
        `;
        const controlButtons = section.querySelector(".FormGroupControlButtons");
        section.insertBefore(newGroup, controlButtons);

        restoreInputById(`loyersLoyer${index}`);
        restoreInputById(`loyersTypeLoyer${index}`);

        document.getElementById(`loyersLoyer${index}`).addEventListener("input", saveFieldToSession);
        document.getElementById(`loyersTypeLoyer${index}`).addEventListener("input", saveFieldToSession);
    }
}

// Navigation Step5 ← Step4
const step5PrevButton = document.querySelector(".Step5PrevButton");
const step4 = document.querySelector(".Step4");
const step5 = document.querySelector(".Step5");

step5PrevButton.addEventListener("click", () => {
    if (step4 && step5) {
        step4.style.display = "flex";
        step5.style.display = "none";
        sessionStorage.setItem("step4Display", "flex");
        sessionStorage.setItem("step5Display", "none");
    }
});

const loyerCount = sessionStorage.getItem("loyerCount");
if (!loyerCount) sessionStorage.setItem("loyerCount", "1"); // Valeur de base

initStep5Fields();
restoreDynamicLoyers();
addRemoveFormGroup();
