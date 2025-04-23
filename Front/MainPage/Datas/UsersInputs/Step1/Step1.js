const input = document.getElementById("Address");
const suggestionsList = document.getElementById("Suggestion");
const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';

input.addEventListener("input", async () => {
    const query = input.value;

    if (query.length < 3) {
        suggestionsList.style.display = "none";
        return;
    }

    try {
        const url = `${backendUrl}/api/autocomplete?query=${encodeURIComponent(query)}`;
        console.log(`URL de la requête : ${url}`); // Ajoutez ce log
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        suggestionsList.style.display = "flex";
        suggestionsList.style.backgroundColor = "#999999";
        suggestionsList.innerHTML = "";

        data.features.forEach((feature) => {
            const li = document.createElement("li");
            li.style.cursor = "pointer";
            li.textContent = feature.place_name;
            li.onclick = () => {
                input.value = feature.place_name;
                suggestionsList.style.display = "none";
            };
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des suggestions :", error);
        suggestionsList.style.display = "none";
    }
});

input.addEventListener("blur", () => {
    setTimeout(() => {
        suggestionsList.style.display = "none";
    }, 200);
    sessionStorage.setItem("UserInputAdress", input.value);
});

input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        suggestionsList.style.display = "none";
        sessionStorage.setItem("UserInputAdress", input.value);
    }
});


const step1NextButton = document.querySelector(".Step1NextButton");
const step1 = document.querySelector(".Step1");
const step2 = document.querySelector(".Step2");

step1NextButton.addEventListener("click", () => {
    if (step1 && step2) {
        step1.style.display = "none";
        step2.style.display = "flex";
    }
});
