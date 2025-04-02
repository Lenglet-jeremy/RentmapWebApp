function normalizeString(str) {
    return str
        ? str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
        : "";
}


async function getCityFromCoords(lat, lon) {
    if (!lat || !lon) return "Coordonnées non disponibles";

    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return (
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            "Ville non trouvée"
        );
    } catch (error) {
        console.error("Erreur :", error);
        return "Erreur lors de la récupération";
    }
}

async function getDepartementFromCoordinates(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.address && data.address['county']) {
            return data.address['county'];
        } else {
            return "Département non trouvé";
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return "Erreur lors de la récupération des données";
    }
}

async function fetchNeighborhoodCostRentData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/Refined`);
        const data = await response.json();
        

        let RefinedData = [];

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Ville"]) === normalizeString(city)) {                        
                        RefinedData.push(collection)
                    }
                }
            }
        }        
        return RefinedData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fetchVacantsAcommodationsData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/TauxHabitationVacants`);
        
        const data = await response.json();

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {                                  
                        return collection["part_logt_vacant"]
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return ;
    }
}

async function fillNeighborhoodCostRentTable(department, city) {
    const neighborhoodCostRentData = await fetchNeighborhoodCostRentData(department, city);

    const tableBody = document.querySelector('#neighborhoodCostRentTable tbody');
    tableBody.innerHTML = '';


    for (let i = 0; i < neighborhoodCostRentData.length; i++) {
        const neighborhoodData = neighborhoodCostRentData[i];

        // Vérifiez si l'élément a la propriété 'Quartier' avant de continuer
        if (neighborhoodData.Quartier) {
            const row = document.createElement('tr');

            const neighborhoodCell = document.createElement('td');
            neighborhoodCell.textContent = neighborhoodData.Quartier;
            row.appendChild(neighborhoodCell);

            const apartmentPriceCell = document.createElement('td');
            apartmentPriceCell.textContent = Number(neighborhoodData['Prix au m2 appartement']).toLocaleString();
            row.appendChild(apartmentPriceCell);

            const housePriceCell = document.createElement('td');
            housePriceCell.textContent = Number(neighborhoodData['Prix au m2 maison']).toLocaleString();
            row.appendChild(housePriceCell);

            const apartmentRentCell = document.createElement('td');
            apartmentRentCell.textContent = Number(neighborhoodData['Loyer au m2 appartement']).toLocaleString();
            row.appendChild(apartmentRentCell);

            const houseRentCell = document.createElement('td');
            houseRentCell.textContent = Number(neighborhoodData['Loyer au m2 maison']).toLocaleString();
            row.appendChild(houseRentCell);

            tableBody.appendChild(row);
        }
    }
}

async function fetchRentabiliteData(department, city, typeOfProperty) {
    try {
        const response = await fetch(`http://localhost:5000/api/Rentabilite`);
        const data = await response.json();

        let cityData = {};

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (collection.Villes && normalizeString(collection.Villes) === normalizeString(city)) {
                        cityData = collection;
                        break;
                    }
                }
            }
        }

        return {
            pricePerSquareMeter: typeOfProperty === "Maison" ? cityData["Prix maison"] : cityData["Prix appart"],
            rentPerSquareMeter: typeOfProperty === "Maison" ? cityData["Loyer maison"] : cityData["Loyer appart"],
            yield: typeOfProperty === "Maison" ? cityData["Renta maisons"] : cityData["Renta Appatements"],
            population: cityData["Population"],
            studentsRate: cityData["Taux detudiants"],
            unemploymentRate: cityData["Taux de chomage"]
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return {};
    }
}

async function fetchCytiesDescription(cityName) {
    try {
        const response = await fetch(`http://localhost:5000/api/CitiesDescription`);
        const data = await response.json();

        for (const key in data) {
            if (normalizeString(key).includes(normalizeString(cityName))) {            
                return data[key].description;
            }

        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de description des villes:', error);
        return {};
    }
    
}

async function fetchPopulationData(department, cityName) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPop`);
        const data = await response.json();
        

        let populationByYear = {};

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    
                    if (normalizeString(collection["Libelle commune ou ARM"]) === normalizeString(cityName)) {
                        const year = collection["Annee"];

                        if (!populationByYear[year]) {
                            populationByYear[year] = {
                                totalPopulation: 0,
                                total0to14: 0,
                                total15to29: 0,
                                total30to44: 0,
                                total45to59: 0,
                                total60to74: 0,
                                total75toMore: 0,
                            };
                        }
                        populationByYear[year].totalPopulation += Math.round(collection["Population"]);
                        populationByYear[year].total0to14 += Math.round(collection["Pop 0-14 ans"]);
                        populationByYear[year].total15to29 += Math.round(collection["Pop 15-29 ans"]);
                        populationByYear[year].total30to44 += Math.round(collection["Pop 30-44 ans"]);
                        populationByYear[year].total45to59 += Math.round(collection["Pop 45-59 ans"]);
                        populationByYear[year].total60to74 += Math.round(collection["Pop 60-74 ans"]);
                        populationByYear[year].total75toMore += Math.round(collection["Pop 75 ans ou plus"]);
                    }
                }
            }
        }

        return populationByYear;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fillPopulationTable(department, cityName) {
    const populationData = await fetchPopulationData(department, cityName);
    const tableBody = document.getElementById("TablePopCityName");  
    

    // Parcourir toutes les lignes du tableau
    const rows = tableBody.querySelectorAll("tr");
    
    rows.forEach(row => {
        const year = row.querySelector("td").innerText;
        if (populationData[year]) {
            row.querySelectorAll("td")[1].innerText = populationData[year].totalPopulation.toLocaleString();
            row.querySelectorAll("td")[2].innerText = populationData[year].total0to14.toLocaleString();
            row.querySelectorAll("td")[3].innerText = populationData[year].total15to29.toLocaleString();
            row.querySelectorAll("td")[4].innerText = populationData[year].total30to44.toLocaleString();
            row.querySelectorAll("td")[5].innerText = populationData[year].total45to59.toLocaleString();
            row.querySelectorAll("td")[6].innerText = populationData[year].total60to74.toLocaleString();
            row.querySelectorAll("td")[7].innerText = populationData[year].total75toMore.toLocaleString();
        }
    });

    
    let firstRow = document.querySelector("tbody tr") || document.querySelector("tr"); 
    let cells = firstRow.querySelectorAll("td");

    let data = Array.from(cells).map(cell => cell.textContent.replace(/\s/g, '')).map(Number);

    if (data.length < 8) {
        console.error("Format inattendu des données !");
    } else {
        let populationTotale = data[1];
        let effectifs = data.slice(2);

        let agesMoyens = [7, 22, 37, 52, 67, 80];

        let sommePonderee = effectifs.reduce((sum, effectif, index) => sum + effectif * agesMoyens[index], 0);
        let ageMoyen = sommePonderee / populationTotale;

        document.getElementById("AverageAge").textContent = ageMoyen.toFixed(2);
    }
    
}

async function fetchNeighborhoodPopulationData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPop`);
        const data = await response.json();

        let populationData = [];

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Libelle commune ou ARM"]) === normalizeString(city) && String(collection["Annee"]) === "2021") {
                        populationData.push(collection);
                    }
                }
            }
        }
        return populationData;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fillNeighborhoodPopulationTable(department, city) {
    const neighborhoodPopulationData = await fetchNeighborhoodPopulationData(department, city);

    const tableBody = document.querySelector('#neighborhoodPopulationTable tbody');
    tableBody.innerHTML = '';

    let i = 0;
    while (neighborhoodPopulationData[i] && neighborhoodPopulationData[i]["Libelle de l'IRIS"]) {
        const row = document.createElement('tr');

        const neighborhoodCell = document.createElement('td');
        neighborhoodCell.textContent = neighborhoodPopulationData[i]["Libelle de l'IRIS"];
        row.appendChild(neighborhoodCell);

        // Calcul de la population totale
        const totalPopulation =
            Math.round(neighborhoodPopulationData[i]['Pop 0-14 ans']) +
            Math.round(neighborhoodPopulationData[i]['Pop 15-29 ans']) +
            Math.round(neighborhoodPopulationData[i]['Pop 30-44 ans']) +
            Math.round(neighborhoodPopulationData[i]['Pop 45-59 ans']) +
            Math.round(neighborhoodPopulationData[i]['Pop 60-74 ans']) +
            Math.round(neighborhoodPopulationData[i]['Pop 75 ans ou plus']);

        const totalPopulationCell = document.createElement('td');
        totalPopulationCell.textContent = totalPopulation.toLocaleString();
        row.appendChild(totalPopulationCell);

        const ageGroup0_14Cell = document.createElement('td');
        ageGroup0_14Cell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 0-14 ans']).toLocaleString();
        row.appendChild(ageGroup0_14Cell);

        const ageGroup15_29Cell = document.createElement('td');
        ageGroup15_29Cell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 15-29 ans']).toLocaleString();
        row.appendChild(ageGroup15_29Cell);

        const ageGroup30_44Cell = document.createElement('td');
        ageGroup30_44Cell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 30-44 ans']).toLocaleString();
        row.appendChild(ageGroup30_44Cell);

        const ageGroup45_59Cell = document.createElement('td');
        ageGroup45_59Cell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 45-59 ans']).toLocaleString();
        row.appendChild(ageGroup45_59Cell);

        const ageGroup60_74Cell = document.createElement('td');
        ageGroup60_74Cell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 60-74 ans']).toLocaleString();
        row.appendChild(ageGroup60_74Cell);

        const ageGroup75PlusCell = document.createElement('td');
        ageGroup75PlusCell.textContent = Math.round(neighborhoodPopulationData[i]['Pop 75 ans ou plus']).toLocaleString();
        row.appendChild(ageGroup75PlusCell);

        tableBody.appendChild(row);

        i++;
    }
}

async function fetchPrixImmoData(department, cityName) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPrixImmo`);
        const data = await response.json();
        

        let prixImmoByYear = {};

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Villes"]) === normalizeString(cityName)) {
                        const year = collection["Annee"];

                        if (!prixImmoByYear[year]) {
                            
                            prixImmoByYear[year] = {
                                PrixMoyen: 0,
                                Prixm2Moyen: 0,
                                SurfaceMoy: 0,
                            };
                        }
                        prixImmoByYear[year].PrixMoyen += Math.round(collection["PrixMoyen"]);
                        prixImmoByYear[year].Prixm2Moyen += Math.round(collection["Prixm2Moyen"]);
                        prixImmoByYear[year].SurfaceMoy += Math.round(collection["SurfaceMoy"]);
                    }
                }
            }
        }

        return prixImmoByYear;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fillPrixImmoTable(department, cityName) {
    const prixImmoData = await fetchPrixImmoData(department, cityName);
    const tableBody = document.getElementById("TablePrixImmoCityName");
    

    // Parcourir toutes les lignes du tableau
    const rows = tableBody.querySelectorAll("tr");
    rows.forEach(row => {
        const year = row.querySelector("td").innerText;
        if (prixImmoData[year]) {
            row.querySelectorAll("td")[1].innerText = prixImmoData[year].PrixMoyen.toLocaleString();
            row.querySelectorAll("td")[2].innerText = prixImmoData[year].Prixm2Moyen.toLocaleString();
            row.querySelectorAll("td")[3].innerText = prixImmoData[year].SurfaceMoy.toLocaleString();
        }
    });
}

async function fetchLocativeTension(cityName) {
    
    try {
        const response = await fetch(`http://localhost:5000/api/TensionLocative`);
        
        const data = await response.json();

        for (const key in data) {
            for (const collection of data[key]) {
                if (normalizeString(collection["Nom"]) === normalizeString(cityName)) {
                    const locTention = collection["Tension locative"];
                    return locTention;
                }
            }
        }

    } catch (error) {
        console.error('Erreur lors de la récupération des données de tension locative :', error);
        return {};
    }
}

async function fetchMedianIncomeData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/MedianIncome`);
        const data = await response.json();

        for (const key in data) {            
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                
                for (const collection of data[key]) {
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {
                        
                        return collection["med_disp"]
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
}

async function fetchOwnerShareData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/OwnerShare`);
        const data = await response.json();

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {
                                             
                        return collection["part_proprio"]
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
}

async function fetchPopulationDensityData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/PopulationDensity`);
        const data = await response.json();

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {
                        
                        return Math.round(collection["dens_pop"]);
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
    
}

async function fetchInternetConnectionData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/InternetConnection`);
        const data = await response.json();

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Commune"]) === normalizeString(city)) {   
                        let firstValue = collection["0,5 Mbit/s"] * 1;
                        let secondValue = collection["3 Mbit/s"] * 2;
                        let thirdValue = collection["8 Mbit/s"] * 3;
                        let fourthValue = collection["30 Mbit/s"] * 4;
                        let fivethValue = collection["100 Mbit/s"] * 10;
                        let sixthValue = collection["1 Gbit/s"] * 20;
                        return (firstValue + secondValue + thirdValue + fourthValue + fivethValue + sixthValue) / 40 *10;
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
    
}

async function fetchSecuriteCriminaliteData(department, city) {
    try {
        const response = await fetch(`http://localhost:5000/api/SecuriteCriminalite`);
        const data = await response.json();

        // Initialiser le dictionnaire
        const resultDict = {};

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Villes"]) === normalizeString(city)) {
                        // Ajouter les valeurs au dictionnaire
                        resultDict[collection["indicateur"]] = collection["nombre"];
                    }
                }
            }
        }        
        return resultDict;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
}

async function displaySecuriteCriminaliteData(department, city) {
    const data = await fetchSecuriteCriminaliteData(department, city);
    
    if (data) {
        const container = document.getElementById('SecuriteCriminalte');
        container.innerHTML = ''; // Clear previous content

        // Iterate over the indicators and append them to the container
        for (const [indicator, value] of Object.entries(data)) {
            
            const div = document.createElement('div');
            div.classList.add('data-item');
            div.textContent = `${indicator}, ${value}`;
            container.appendChild(div);
        }

        // Optionally, display the sum if it exists
        if (data.sum !== undefined) {
            const sumDiv = document.createElement('div');
            sumDiv.classList.add('data-item');
            sumDiv.textContent = `Somme pondérée: ${data.sum}`;
            container.appendChild(sumDiv);
        }
    }
}

// Example usage


let chartHistogramInstance = null;
async function createHistogram(canvasId, department, city, label, backgroundColor = 'rgba(75, 192, 192, 0.5)', cityInputId = null) {
    const response = await fetch(`http://localhost:5000/api/EvolPop`);
    const data = await response.json();

    const labels = ["Pop 0-14 ans", "Pop 15-29 ans", "Pop 30-44 ans", "Pop 45-59 ans", "Pop 60-74 ans", "Pop 75 ans ou plus"];
    const datayears = [];
    let year = "2021";

    for (const key in data) {
        if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
            year = Math.max(...data[key].map(collection => collection["Annee"]));

            const filteredData = data[key].filter(collection =>
                collection["Annee"] === year &&
                normalizeString(collection["Libelle commune ou ARM"]) === normalizeString(city)
            );

            if (filteredData.length > 0) {
                for (let i = 0; i < labels.length; i++) {
                    datayears[i] = filteredData.reduce((sum, collection) => sum + (collection[labels[i]] || 0), 0);
                }
            }
        }
    }

    const ctx = document.getElementById(canvasId).getContext('2d');

    if (chartHistogramInstance) {
        chartHistogramInstance.destroy();
    }

    chartHistogramInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(label => label.replace('Pop ', '')),
            datasets: [{
                label: label,
                data: datayears,
                backgroundColor: backgroundColor,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Classes'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Population'
                    }
                }
            }
        }
    });

    if (cityInputId) {
        const cityInput = document.getElementById(cityInputId);
        if (cityInput && !cityInput.dataset.listenerAttached) {
            cityInput.addEventListener("change", () => {
                const newCity = cityInput.value;
                createHistogram(canvasId, department, newCity, label, backgroundColor, cityInputId);
            });
            cityInput.dataset.listenerAttached = "true"; // Pour éviter les doublons
        }
    }
}

let chartLineInstance = null;
async function createLineChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPrixImmo`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageCost = Array(labels.length).fill(0);

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    const filteredData = data[key].filter(collection =>
                        collection["Annee"] === parseInt(year) &&
                        normalizeString(collection["Villes"]) === normalizeString(city)
                    );

                    if (filteredData.length > 0) {
                        AverageCost[i] = filteredData[0]["PrixMoyen"];
                    }
                }
            }
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        if (chartLineInstance) {
            chartLineInstance.destroy();
        }

        chartLineInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: AverageCost,
                    borderColor: borderColor,
                    backgroundColor: borderColor.replace('1', '0.2'),
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (cityInputId) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && !cityInput.dataset.listenerAttached) {
                cityInput.addEventListener("change", async () => {
                    const newCity = cityInput.value;
                    await createLineChart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating line chart:', error);
    }
}

let chartPrixM2Instance = null;
async function createPrixM2Chart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPrixImmo`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageCostPerM2 = Array(labels.length).fill(0);

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    const filteredData = data[key].filter(collection =>
                        collection["Annee"] === parseInt(year) &&
                        normalizeString(collection["Villes"]) === normalizeString(city)
                    );

                    if (filteredData.length > 0) {
                        AverageCostPerM2[i] = filteredData[0]["Prixm2Moyen"];
                    }
                }
            }
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        if (chartPrixM2Instance) {
            chartPrixM2Instance.destroy();
        }

        chartPrixM2Instance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: AverageCostPerM2,
                    borderColor: borderColor,
                    backgroundColor: borderColor.replace('1', '0.2'),
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (cityInputId) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && !cityInput.dataset.listenerAttached) {
                cityInput.addEventListener("change", async () => {
                    const newCity = cityInput.value;
                    await createPrixM2Chart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating PrixM2 chart:', error);
    }
}

let chartSurfaceInstance = null;
async function createSurfaceChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`http://localhost:5000/api/EvolPrixImmo`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageSurface = Array(labels.length).fill(0);

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    const filteredData = data[key].filter(collection =>
                        collection["Annee"] === parseInt(year) &&
                        normalizeString(collection["Villes"]) === normalizeString(city)
                    );

                    if (filteredData.length > 0) {
                        AverageSurface[i] = filteredData[0]["SurfaceMoy"];
                    }
                }
            }
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        if (chartSurfaceInstance) {
            chartSurfaceInstance.destroy();
        }

        chartSurfaceInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: AverageSurface,
                    borderColor: borderColor,
                    backgroundColor: borderColor.replace('1', '0.2'),
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (cityInputId) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && !cityInput.dataset.listenerAttached) {
                cityInput.addEventListener("change", async () => {
                    const newCity = cityInput.value;
                    await createSurfaceChart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating Surface chart:', error);
    }
}

let chartUnemployedInstance = null;

// async function CreateUnemployedChart(canvasId, department, city, label, borderColor, cityInputId = null) {
//     try {
//         const response = await fetch(`http://localhost:5000/api/Unemployed`);
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const data = await response.json();

//         let labels = [];
//         let AverageUnemployed = [];

//         for (const key in data) {
//             if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
//                 // Extraire les clés à partir du premier élément de l'entrée correspondante
//                 labels = Object.keys(data[key][0]).slice(2);

//                 // Récupérer les valeurs correspondantes aux labels
//                 const cityData = data[key].find(entry => normalizeString(entry["Ville"]) === normalizeString(city));
                
//                 if (cityData) {
//                     AverageUnemployed = labels.map(label => cityData[label] ?? 0);
//                 } else {
//                     AverageUnemployed = Array(labels.length).fill(0);
//                 }
//             }
//         }

//         const ctx = document.getElementById(canvasId).getContext('2d');

//         if (chartUnemployedInstance) {
//             chartUnemployedInstance.destroy();
//         }

//         chartUnemployedInstance = new Chart(ctx, {
//             type: 'line',
//             data: {
//                 labels: labels,
//                 datasets: [{
//                     label: label,
//                     data: AverageUnemployed,
//                     borderColor: borderColor,
//                     backgroundColor: borderColor.replace('1', '0.2'),
//                     borderWidth: 2,
//                     fill: true
//                 }]
//             },
//             options: {
//                 responsive: true,
//                 scales: {
//                     y: {
//                         beginAtZero: true
//                     }
//                 }
//             }
//         });

//         if (cityInputId) {
//             const cityInput = document.getElementById(cityInputId);
//             if (cityInput && !cityInput.dataset.listenerAttached) {
//                 cityInput.addEventListener("change", async () => {
//                     const newCity = cityInput.value;
//                     await CreateUnemployedChart(canvasId, department, newCity, label, borderColor, cityInputId);
//                 });
//                 cityInput.dataset.listenerAttached = "true";
//             }
//         }
//     } catch (error) {
//         console.error('Error creating Unemployed chart:', error);
//     }
// }


    
// Version YTD
async function CreateUnemployedChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`http://localhost:5000/api/Unemployed`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        let labels = [];
        let AverageUnemployed = [];

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                // Extraire les clés à partir du premier élément de l'entrée correspondante
                labels = Object.keys(data[key][0]).slice(2);

                const currentDate = new Date();
                const previousMonthIndex = currentDate.getMonth() - 1;

                // Obtenir le nom du mois précédent avec une majuscule en première lettre
                const previousMonthName = new Date(currentDate.getFullYear(), previousMonthIndex, 1)
                    .toLocaleString('fr-FR', { month: 'long' })
                    .replace(/^\w/, c => c.toUpperCase()); // Met la première lettre en majuscule

                    labels = labels.filter(label => label.startsWith(previousMonthName));




                // Récupérer les valeurs correspondantes aux labels
                const cityData = data[key].find(entry => normalizeString(entry["Ville"]) === normalizeString(city));
                
                if (cityData) {
                    AverageUnemployed = labels.map(label => cityData[label] ?? 0);
                    
                    
                } else {
                    AverageUnemployed = Array(labels.length).fill(0);
                }
            }
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        if (chartUnemployedInstance) {
            chartUnemployedInstance.destroy();
        }

        chartUnemployedInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: AverageUnemployed,
                    borderColor: borderColor,
                    backgroundColor: borderColor.replace('1', '0.2'),
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        if (cityInputId) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && !cityInput.dataset.listenerAttached) {
                cityInput.addEventListener("change", async () => {
                    const newCity = cityInput.value;
                    await CreateUnemployedChart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating Unemployed chart:', error);
    }
}

let chartCriminalityInstance = null;

async function CreateCriminalityChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`http://localhost:5000/api/SecuriteCriminalite`);
        const data = await response.json();

        const labelsSet = new Set();
        const Criminalitys = [];

        // Extraction des labels et valeurs
        Object.entries(data).forEach(([key, collections]) => {
            if (key.includes(normalizeString(department))) {
                collections.forEach(collection => {
                    if (normalizeString(collection["Villes"]) === normalizeString(city)) {
                        labelsSet.add(collection["indicateur"]);
                        Criminalitys.push(collection["nombre"]);
                    }
                });
            }
        });

        const labels = Array.from(labelsSet);

        console.log("Labels:", labels);
        console.log("Criminalitys:", Criminalitys);

        // Vérification que les labels et les données sont bien alignés
        if (labels.length === 0 || Criminalitys.length === 0) {
            console.warn("Pas de données disponibles pour ce département/ville.");
            return;
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        // Suppression de l'ancien graphique s'il existe
        if (chartCriminalityInstance) {
            chartCriminalityInstance.destroy();
        }

        // Création du graphique
        chartCriminalityInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: label,
                    data: Criminalitys,
                    borderColor: borderColor,
                    backgroundColor: "#FFFFFF",
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Ajout d'un écouteur sur l'input ville (si fourni)
        if (cityInputId) {
            const cityInput = document.getElementById(cityInputId);
            if (cityInput && !cityInput.dataset.listenerAttached) {
                cityInput.addEventListener("change", async () => {
                    const newCity = cityInput.value;
                    await CreateCriminalityChart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création du graphique :", error);
    }
}


export async function updateValues() {
    let typeOfPropertyValue = document.getElementById("TypeOfPropertyValue");
    let costSquare = document.getElementById("CostSquareValue");
    let nbPiecesValue = document.getElementById("NbPiecesValue");
    let surfaceValue = document.getElementById("SurfaceValue");
    let RentValue = document.getElementById("RentValue");
    let cityValue = document.getElementById("CityValue");
    let Population = document.getElementById("Population");
    let StudentsRate = document.getElementById("StudentsRate");
    let UnemployedRate = document.getElementById("UnemployedRate");
    let yieldValue = document.getElementById("YieldValue");
    let cityDescriptionValue = document.querySelector(".CityDescriptionValue");
    let vacantsCommodations = document.getElementById("VacantsCommodationsRate");
    let LocativeTension = document.getElementById("LocativeTension");
    let MedianIncome = document.getElementById("MedianIncome");
    let OwnerShare = document.getElementById("OwnerShare");
    let TenantShare = document.getElementById("TenantShare");
    let PopulationDensity = document.getElementById("PopulationDensity");
    let InternetConnection = document.getElementById("InternetConnection");
    const lat = sessionStorage.getItem("OSMLatitude");
    const lon = sessionStorage.getItem("OSMLongitude");

    const city = await getCityFromCoords(lat, lon);
    const department = await getDepartementFromCoordinates(lat, lon);
    cityValue.innerText = city;

    typeOfPropertyValue.innerText = sessionStorage.getItem("propertyType") || "Non spécifié";
    nbPiecesValue.innerText = (sessionStorage.getItem("PiecesNumberUsersInputValue") || "0") + " Pièces";
    surfaceValue.innerText = (sessionStorage.getItem("SurfaceUserInputValue") || "0") + " M²";
    cityDescriptionValue.innerText = await fetchCytiesDescription(city)


    const data = await fetchRentabiliteData(department, city, typeOfPropertyValue.innerText);

    costSquare.innerText = Number(data.pricePerSquareMeter).toLocaleString("fr-FR") + " €";
    RentValue.innerText = Number(data.rentPerSquareMeter) * 12 .toLocaleString("fr-FR") + " € Annuel";
    yieldValue.innerText = (data.yield * 100).toFixed(2) + " %";
    Population.innerText = parseInt(data.population).toLocaleString();
    StudentsRate.innerText = (data.studentsRate * 100).toFixed(2) + "%";
    UnemployedRate.innerText = (data.unemploymentRate * 100).toFixed(2) + "%";
    
    vacantsCommodations.innerText = await fetchVacantsAcommodationsData(department, city) + " %"

    createHistogram('populationChartCanvas',department, city, 'Répartition des âges');

    fillPopulationTable(department, city);
    fillPrixImmoTable(department, city);

    fillNeighborhoodCostRentTable(department, city);
    fillNeighborhoodPopulationTable(department, city);

    LocativeTension.innerText = await fetchLocativeTension(city) + "/8"
    MedianIncome.innerText = (await fetchMedianIncomeData(department, city)).toLocaleString() + " €"
    OwnerShare.innerText = await fetchOwnerShareData(department, city) + " %"
    TenantShare.innerText = 100 - await fetchOwnerShareData(department, city) + " %"
    PopulationDensity.innerText = (await fetchPopulationDensityData(department, city)).toLocaleString() + " hab/km²"
    InternetConnection.innerText = (await fetchInternetConnectionData(department, city)).toFixed(2) + " /10"
    
    
    // Créer les graphiques
    createHistogram('populationChartCanvas', department, city, 'Répartition des âges');
    createLineChart('lineChartCanvas', department, city, 'Prix Moyen', 'rgba(75, 192, 192, 1)', 'cityInputId');
    createPrixM2Chart('prixM2ChartCanvas', department, city, 'Prix au m²', 'rgba(153, 102, 255, 1)', 'cityInputId');
    createSurfaceChart('surfaceChartCanvas', department, city, 'Surface Moyenne', 'rgba(255, 99, 132, 1)', 'cityInputId');
    

    CreateUnemployedChart('UnemployedChartCanvas', department, city, 'Taux de Chômage', 'rgba(255, 159, 64, 1)', 'cityInputId');
    CreateCriminalityChart("securiteChartCanvas", department, city, "Criminalité", "rgb(124, 255, 64)");
}

updateValues();
