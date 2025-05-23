// MainPage.js

import { updateMap1, destroyMap1 } from './Map/Map.js';


window.UsersInputsLat = 48.8584;
window.UsersInputsLon = 2.2945;

// Définir la limite maximale comme une variable globale
const MAX_AMENITY_LIMIT = 100;

const steps = document.querySelectorAll(".DataContent > div");
let currentStep = 0;

// Fonction pour créer et afficher le popup
function showMaxLimitPopup() {
    // Vérifier si un popup existe déjà
    let popup = document.getElementById("max-limit-popup");
    
    // Si le popup n'existe pas, le créer
    if (!popup) {
        popup = document.createElement("div");
        popup.id = "max-limit-popup";
        popup.style.position = "fixed";
        popup.style.bottom = "20px";
        popup.style.right = "20px";
        popup.style.backgroundColor = "#f44336";
        popup.style.color = "white";
        popup.style.padding = "15px";
        popup.style.borderRadius = "5px";
        popup.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
        popup.style.zIndex = "1000";
        popup.style.opacity = "0";
        popup.style.transition = "opacity 0.3s ease-in-out";
        document.body.appendChild(popup);
    }
    
    // Mettre à jour le texte du popup
    popup.textContent = `La limite maximale est de ${MAX_AMENITY_LIMIT} commodités`;
    
    // Afficher le popup
    setTimeout(() => {
        popup.style.opacity = "1";
    }, 10);
    
    // Masquer le popup après 3 secondes
    setTimeout(() => {
        popup.style.opacity = "0";
    }, 3000);
}

function InitializeSteps() {

    const resultDisplay = sessionStorage.getItem("resultDisplay");
    const step5Display = sessionStorage.getItem("step5Display");

    const resultDiv = document.getElementById("Result");
    const step5 = document.querySelector(".Step5");
    const step1 = document.querySelector("#Step1");
    const mapArea = document.querySelector("#MapArea");
    const content = document.querySelector(".ContentArea .Content");

    // Cas 1 : L'utilisateur revient sur les résultats
    if (resultDisplay === "flex") {
        resultDiv.style.display = "flex";
        step5.style.display = "none";
        mapArea.style.display = "none";
        content.style.width = "100%";
    } else {
        // Cas 2 : Aucun état => première visite ou reset => on affiche Step1 et MapArea
        step1.style.display = "block"; // ou "flex" selon ton CSS
        mapArea.style.display = "flex";
    }

    // Toujours afficher le body une fois prêt
    document.body.style.display = "block";


    const addressInput = document.getElementById("Address");
    addressInput.addEventListener("blur", getCoordinates);
    addressInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            getCoordinates();
        }
    });

    // Ajouter la validation pour amenityLimit
    const amenityLimitInput = document.getElementById("amenityLimit");
    if (amenityLimitInput) {
        // Définir l'attribut max avec la valeur de la variable globale
        amenityLimitInput.setAttribute("max", MAX_AMENITY_LIMIT);
        amenityLimitInput.setAttribute("min", "0");
        
        amenityLimitInput.addEventListener("input", function() {
            // Convertir la valeur en nombre
            let value = parseInt(this.value);
            
            // Si la valeur est supérieure à la limite maximale, la fixer à cette limite
            // et afficher le popup
            if (value > MAX_AMENITY_LIMIT) {
                this.value = MAX_AMENITY_LIMIT;
                showMaxLimitPopup();
            }
            
            // Si la valeur n'est pas un nombre, la fixer à 0
            if (isNaN(value)) {
                this.value = 0;
            }
        });
        
        // Ajouter également un événement pour l'input pour détecter les changements en temps réel
        amenityLimitInput.addEventListener("input", function() {
            // Convertir la valeur en nombre
            let value = parseInt(this.value);
            
            // Si la valeur est supérieure à la limite maximale, afficher le popup
            if (value > MAX_AMENITY_LIMIT) {
                showMaxLimitPopup();
            }
        });
    }

    if (resultDisplay !== null) {
        resultDiv.style.display = resultDisplay;

        // ➤ Si on est sur la page de résultat, masquer la carte
        if (resultDisplay === "flex") {
            const mapArea = document.querySelector(".MapArea");
            mapArea.style.display = "none";
            document.querySelector(".ContentArea .Content").style.width = "100%";
        }
    }


    
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
                // ➤ Masquer l'étape 5 et stocker l'état
                step5.style.display = "none";
                sessionStorage.setItem("step5Display", "none");
            
                // ➤ Afficher la section de résultat et stocker l'état
                resultDiv.style.display = "flex";
                sessionStorage.setItem("resultDisplay", "flex");
            
                // ➤ Gérer la carte
                destroyMap1();
                const mapArea = document.querySelector(".MapArea");
                mapArea.classList.add("slide-out");
            
                setTimeout(() => {
                    mapArea.style.display = "none";
                }, 500);
            
                document.querySelector(".ContentArea .Content").style.width = "100%";
                return;
            }
            

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

export async function getCoordinates() {
    let url = "https://nominatim.openstreetmap.org/search?format=json";
    let address = document.getElementById("Address").value.trim();
    const radius = document.getElementById("radius") ?
        parseInt(document.getElementById("radius").value) * 1000 : 50000;
    
    // Récupérer la valeur de amenityLimit
    let amenityLimit = document.getElementById("amenityLimit") ?
        parseInt(document.getElementById("amenityLimit").value) : MAX_AMENITY_LIMIT;
    
    // Vérifier si c'est un nombre valide
    if (isNaN(amenityLimit)) {
        amenityLimit = 0;
    }
    
    // Limiter à la valeur maximale définie et afficher le popup si la limite est dépassée
    if (amenityLimit > MAX_AMENITY_LIMIT) {
        showMaxLimitPopup();
        amenityLimit = MAX_AMENITY_LIMIT;
    }
    
    // Mettre à jour la valeur dans l'input pour refléter la limite
    if (document.getElementById("amenityLimit")) {
        document.getElementById("amenityLimit").value = amenityLimit;
    }

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
        if (data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            saveToSessionStorage(data);

            updateMap1(lat, lon, radius, amenityLimit);
        } else {
            console.error("Aucune donnée trouvée pour l'adresse fournie.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
    }
}



InitializeSteps();

document.getElementById('PrintButton').addEventListener('click', function () {
    const resultDiv = document.getElementById('ResultArea');
    
    // Convert all canvases to images for printing
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
    
    // Create print styles that handle page breaks better
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
                margin: 0;
                padding: 0;
            }
            
            /* Handle page breaks */
            .FirstLineCharts, #UnemployedChart, #SecuriteCriminalte, 
            .CityDescription, .SecondLine, .ThirdLine, 
            .CityClimat, .UrbanismeDescription, .GrandAxesDescription, 
            .EtudeMarcheLocalDescription, table {
                page-break-inside: avoid;
                break-inside: avoid;
                margin-bottom: 20px;
            }
            
            /* If a chart needs to be on a new page, force it */
            .Chart {
                page-break-inside: avoid;
                break-inside: avoid;
                max-width: 100%;
                max-height: 80vh;
                margin-bottom: 15px;
            }
            
            /* Handle tables */
            table {
                page-break-inside: avoid;
                break-inside: avoid;
                width: 100%;
                max-width: 100%;
                margin-top: 20px;
                margin-bottom: 20px;
            }
            
            /* Hide canvas and show images */
            canvas {
                display: none !important;
            }
            .Chart img, .print-only-image {
                display: block !important;
                max-width: 100%;
                height: auto;
            }
            
            /* Add explicit page breaks before certain sections if needed */
            .PopulationRapartion, .CostEvol, #neighborhoodCostRentTable, #neighborhoodPopulationTable {
                page-break-before: always;
            }
            
            /* Hide popup during print */
            #max-limit-popup {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Trigger print
    window.print();
    
    // Clean up after printing
    setTimeout(() => {
        document.getElementById('print-style').remove();
        chartCanvases.forEach(canvas => {
            canvas.style.display = 'block';
            const imgId = canvas.id.replace('Canvas', 'Image');
            const img = document.getElementById(imgId);
            if (img) {
                img.style.display = 'none';
            }
        });
        const tempImages = document.querySelectorAll('.print-only-image');
        tempImages.forEach(tempImg => {
            tempImg.parentNode.removeChild(tempImg);
        });
    }, 1000);
});


document.getElementById("BackToStep1").addEventListener("click", function () {
        sessionStorage.clear(); // Vide le sessionStorage
        location.reload();      // Recharge la page
    });


// Sauvegarde avant le reload (par exemple à l'événement d'un bouton)
document.getElementById("PrintButton").addEventListener("click", function () {
const resultVisible = window.getComputedStyle(document.getElementById("Result")).display !== "none";
sessionStorage.setItem("keepPrintAreaVisible", resultVisible ? "true" : "false");
location.reload(); // ou autre logique de reload
});

if (sessionStorage.getItem("keepPrintAreaVisible") === "true") {
    document.querySelector(".PrintArea").style.display = "flex";
    // Nettoyage si on veut que ça ne s'applique qu'une fois
    sessionStorage.removeItem("keepPrintAreaVisible");
}

// Fonction qui met à jour l'affichage de PrintArea selon l'état de #Result
function updatePrintAreaVisibility() {
    const result = document.getElementById("Result");
    const printArea = document.getElementById("PrintArea");

    const isResultVisible = window.getComputedStyle(result).display !== "none";
    if (isResultVisible) {
        printArea.style.display = "flex";
    } else {
        printArea.style.display = "none";
}
}


function updateVisibility() {
    const resultVisible = window.getComputedStyle(document.getElementById("Result")).display !== "none";

    // Affichage PrintArea
    const printArea = document.getElementById("PrintArea");
    printArea.style.display = resultVisible ? "flex" : "none";

    // Affichage LocService
    const locService = document.querySelector(".LocService");
    if (locService) locService.style.display = resultVisible ? "block" : "none";
}

// Bouton "imprimer"
document.getElementById("PrintButton").addEventListener("click", function () {
    const resultVisible = window.getComputedStyle(document.getElementById("Result")).display !== "none";
    sessionStorage.setItem("keepVisible", resultVisible ? "true" : "false");
    location.reload(); // ou ta logique de reload
});

const keepVisible = sessionStorage.getItem("keepVisible");

if (keepVisible === "true") {
    document.getElementById("PrintArea").style.display = "flex";
    const locService = document.querySelector(".LocService");
    if (locService) locService.style.display = "block";
    sessionStorage.removeItem("keepVisible");
} else {
    updateVisibility(); // Gère l'affichage initial
}

// Sauvegarde dans sessionStorage avant reload
document.getElementById("PrintButton").addEventListener("click", function () {
    const isResultVisible = window.getComputedStyle(document.getElementById("Result")).display !== "none";
    sessionStorage.setItem("keepPrintAreaVisible", isResultVisible ? "true" : "false");
    location.reload(); // ou une autre logique de reload
});

const restore = sessionStorage.getItem("keepPrintAreaVisible");
if (restore === "true") {
    document.getElementById("PrintArea").style.display = "flex";
    sessionStorage.removeItem("keepPrintAreaVisible");
} else {
    updatePrintAreaVisibility(); // pour l'état initial si pas de sessionStorage
}
