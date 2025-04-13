import { updateMap } from './Map/Map.js';

window.UsersInputsLat = 48.8584;
window.UsersInputsLon = 2.2945;

const steps = document.querySelectorAll(".DataContent > div");
let currentStep = 0;

function InitializeSteps() {
    const resultDiv = document.getElementById("Result");

    const addressInput = document.getElementById("Address");
    addressInput.addEventListener("blur", getCoordinates);
    addressInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            getCoordinates();
        }
    });

    document.querySelectorAll(".NavButtons button").forEach(button => {
        button.addEventListener("click", function () {
            if (button.id === "next") {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                }
            } else if (button.id === "prev") {
                if (currentStep > 0) {
                    currentStep--;
                }
            } else if (button.id === "getResult") {
                resultDiv.style.display = "flex";
                steps[currentStep].style.display = "none";
                return;
            }

            showStep(currentStep);
        });
    });
}

function saveToSessionStorage(data, dataType = "") {
    if (typeof (data) === "object" && data.length > 0) {
        sessionStorage.setItem("OSMLatitude", data[0].lat);
        sessionStorage.setItem("OSMLongitude", data[0].lon);
        sessionStorage.setItem("OSMDisplayName", data[0].display_name);
        sessionStorage.setItem("OSMType", data[0].type);
    } else if (typeof (data) === "string" && dataType !== "") {
        sessionStorage.setItem(dataType, data);
    }
}

function loadFromSessionStorage() {
    // Implémentez cette fonction si nécessaire
}

function showStep(index) {
    steps.forEach((step, i) => {
        step.style.display = i === index ? "flex" : "none";
    });
}

export async function getCoordinates() {
    let url = "https://nominatim.openstreetmap.org/search?format=json";
    let address = document.getElementById("Address").value.trim();
    const radius = document.getElementById("radius") ?
        parseInt(document.getElementById("radius").value) * 1000 : 50000;
    const amenityLimit = document.getElementById("amenityLimit") ?
        parseInt(document.getElementById("amenityLimit").value) : 100;

    saveToSessionStorage(address, "UserInputAdresse");

    if (address) {
        url += `&q=${encodeURIComponent(address)}`;
    } else {
        console.error("Veuillez fournir une adresse.");
        return;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error("La réponse n'est pas au format JSON.");
        }

        const data = await response.json();
        console.log("Données de Nominatim :", data);
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            saveToSessionStorage(data);

            updateMap(lat, lon, radius, amenityLimit);
        } else {
            console.error("Aucune donnée trouvée pour l'adresse fournie.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}

InitializeSteps();
showStep(currentStep);

document.getElementById('PrintButton').addEventListener('click', function () {
    const resultDiv = document.getElementById('ResultArea');
    const chartCanvases = resultDiv.querySelectorAll('canvas');

    chartCanvases.forEach((canvas) => {
        if (canvas.getContext && canvas.width > 0 && canvas.height > 0) {
            const dataUrl = canvas.toDataURL('image/png');
            const imgId = canvas.id.replace('Canvas', 'Image');
            let img = document.getElementById(imgId);

            if (img) {
                img.src = dataUrl;
                img.style.display = 'block';
                canvas.style.display = 'none';
            } else {
                img = document.createElement('img');
                img.id = imgId;
                img.src = dataUrl;
                img.alt = canvas.id + " Chart";
                img.className = "print-only-image";
                img.style.maxWidth = "100%";
                canvas.parentNode.insertBefore(img, canvas.nextSibling);
                canvas.style.display = 'none';
            }
        }
    });

    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'print-style';
    style.innerHTML = `
        @media print {
            body * {
                visibility: hidden;
            }
            #ResultArea, #ResultArea * {
                visibility: visible;
            }
            #ResultArea {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
            }
            canvas {
                display: none !important;
            }
            .Chart img, .print-only-image {
                display: block !important;
                max-width: 100%;
                height: auto;
            }
        }
    `;
    document.head.appendChild(style);

    window.print();

    setTimeout(() => {
        document.getElementById('print-style').remove();
        chartCanvases.forEach(canvas => {
            canvas.style.display = 'block';
            const imgId = canvas.id.replace('Canvas', 'Image');
            const img = document.getElementById(imgId);
            if (img) {
                img.style.display = 'none';
            }
            const tempImages = document.querySelectorAll('.print-only-image');
            tempImages.forEach(tempImg => {
                tempImg.parentNode.removeChild(tempImg);
            });
        });
    }, 1000);
});
