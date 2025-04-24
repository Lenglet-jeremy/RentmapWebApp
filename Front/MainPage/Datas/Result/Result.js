const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';
function normalizeString(str) {
    return str
        ? str.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        : "";
}

function normalizeAddress(address) {
    return address
        .toUpperCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
        .replace(/'/g, " ")                              
        .replace(/[^A-Z0-9\s]/g, "")                     
        .replace(/\s+/g, " ")                            
        .trim();
}

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        
        return data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

async function fetchNeighborhoodCostRentData(department, city) {
    const data = await fetchData(`${backendUrl}/api/Refined`);
    if (!data) return {};

    let RefinedData = [];
    for (const key in data) {
        if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
            for (const collection of data[key]) {
                if (normalizeString(collection["Ville"]) === normalizeString(city)) {
                    RefinedData.push(collection);
                }
            }
        }
    }
    return RefinedData;
}

async function fetchNeighborhoodCostData(department, city, neighborhood, typeOfProperty) {
    try {
        const response = await fetch(`${backendUrl}/api/Refined`);
        
        const data = await response.json();
        

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Ville"]) === normalizeString(city) && normalizeString(collection["Quartier"]).includes(normalizeString(neighborhood))) {    
                        if(typeOfProperty === "Appartement"){
                            return collection["Prix au m2 appartement"]
                        }   
                        else if(typeOfProperty === "Maison"){
                            return collection["Prix au m2 maison"]
                        }
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fetchNeighborhoodRentData(department, city, neighborhood, typeOfProperty) {
    try {
        const response = await fetch(`${backendUrl}/api/Refined`);
        
        const data = await response.json();
        

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Ville"]) === normalizeString(city) && normalizeString(collection["Quartier"]).includes(normalizeString(neighborhood))) {    
                        if(typeOfProperty === "Appartement"){
                            return collection["Loyer au m2 appartement"]
                        }   
                        else if(typeOfProperty === "Maison"){
                            return collection["Loyer au m2 maison"]
                        }
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fetchVacantsAcommodationsData(department, city) {
    try {
        const response = await fetch(`${backendUrl}/api/TauxHabitationVacants`);
        
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
        const response = await fetch(`${backendUrl}/api/Rentabilite`);
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
        const response = await fetch(`${backendUrl}/api/CitiesDescription`);
        
        const data = await response.json();

        for (const key in data) {
            if (normalizeString(key).includes(normalizeString(cityName))) {            
                return data[key][0].description;
            }

        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de description des villes:', error);
        return {};
    }
    
}

async function fetchCytiesClimat(cityName) {
    try {
        const response = await fetch(`${backendUrl}/api/ClimatVilles`);
        const data = await response.json();

        for (const key in data) {
            if (normalizeString(key).includes(normalizeString(cityName))) {            
                return data[key].description;
            }

        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de climat des villes:', error);
        return {};
    }
    
}

async function fetchCytiesUrbanisme(cityName) {
    try {
        const response = await fetch(`${backendUrl}/api/Urbanisme`);
        const data = await response.json();

        for (const key in data) {
            if (normalizeString(key).includes(normalizeString(cityName))) {            
                return data[key].description;
            }

        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de climat des villes:', error);
        return {};
    }
    
}

async function fetchCytiesGrandsAxes(cityName) {
    try {
        const response = await fetch(`${backendUrl}/api/GrandsAxes`);
        const data = await response.json();

        for (const key in data) {
            if (normalizeString(key).includes(normalizeString(cityName))) {            
                return data[key].description;
            }

        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données de climat des villes:', error);
        return {};
    }
    
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;

    const R = 6371000; // Rayon de la Terre en mètres
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

function removeVoieType(address) {
    const types = ["RUE", "AVENUE", "BOULEVARD", "IMPASSE", "CHEMIN", "ALLEE", "PLACE", "QUAI", "SQUARE"];
    let cleaned = address.toUpperCase();
    types.forEach(type => {
        cleaned = cleaned.replace(new RegExp(`\\b${type}\\b`, 'g'), '');
    });
    return cleaned.trim().replace(/\s+/g, ' ');
}

async function fetchDVFData() {
    const address = document.getElementById("Address").value.toUpperCase().trim();
    const typeOfPropertyValue = sessionStorage.getItem("propertyType");
    const SurfaceUserInputValue = document.getElementById("SurfaceUserInputValue").value;
    const PiecesNumberUsersInputValue = document.getElementById("PiecesNumberUsersInputValue").value;
    const DVFValue = document.getElementById("DVFValue");

    try {
        const response = await fetch(`${backendUrl}/api/DVFData/35`);
        const data = await response.json();

        data.forEach((item, index) => {
            if( normalizeAddress(address).includes(item["No voie"]) && 
                normalizeAddress(address).includes(item["Type de voie"]) && 
                normalizeAddress(address).includes(item["Voie"]) && 
                item["Voie"] !== "" && 
                normalizeAddress(address).includes(item["Code postal"]) && 
                normalizeAddress(address).includes(item["Commune"]) &&
                String(item["Type local"]) === typeOfPropertyValue && 
                String(item["Surface reelle bati"]) === SurfaceUserInputValue && 
                String(item["Nombre pieces principales"]) === PiecesNumberUsersInputValue){

                DVFValue.innerText = item["Valeur fonciere"].toLocaleString() + " €";
                
            }
        });

    } catch (error) {
        console.error("Erreur lors de la récupération des données DVF :", error);
    }
}

async function fetchPopulationData(department, cityName) {
    try {
        const response = await fetch(`${backendUrl}/api/EvolPop`);
        const data = await response.json();
        

        let populationByYear = {};



        return populationByYear;
    } catch (error) {
        console.error('Erreur lors de la récupération des données de population:', error);
        return {};
    }
}

async function fetchNeighborhoodPopulationData(department, city) {
    try {
        const response = await fetch(`${backendUrl}/api/EvolPop`);
        console.log(`${backendUrl}/api/EvolPop`);
        
        const data = await response.json();

        let populationData = [];

        for (const key in data) {
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                for (const collection of data[key]) {
                    if (normalizeString(collection["Libellé commune ou ARM"]) === normalizeString(city)) {
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
    document.getElementById("AverageAge").textContent = populationAverageAge.toFixed(2) + " ans";
    
}


async function fillNeighborhoodPopulationTable(department, city) {
    const neighborhoodPopulationData = await fetchNeighborhoodPopulationData(department, city);
    console.log(neighborhoodPopulationData);
    

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
        const response = await fetch(`${backendUrl}/api/EvolPrixImmo`);
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
        const response = await fetch(`${backendUrl}/api/TensionLocative`);
        
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
        const response = await fetch(`${backendUrl}/api/MedianIncome`);
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
        const response = await fetch(`${backendUrl}/api/OwnerShare`);
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
        const response = await fetch(`${backendUrl}/api/PopulationDensity`);
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
        const response = await fetch(`${backendUrl}/api/InternetConnection`);
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
        const response = await fetch(`${backendUrl}/api/SecuriteCriminalite`);
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

let chartHistogramInstance = null;

let populationAverageAge = 0;
async function createHistogram(canvasId, department, city, label, backgroundColor = 'rgba(75, 192, 192, 0.5)', cityInputId = null) {
    try {
        const response = await fetch(`${backendUrl}/api/EvolPop`);
       
        if (!response.ok) {
            console.error('Erreur lors de la récupération des données');
            return;
        }
       
        const data = await response.json();
       
        // Normaliser le nom du département pour la recherche
        const normalizedDepartment = normalizeString(department);
       
        // Recherche du bon fichier de département
        const departmentKey = Object.keys(data).find(key =>
            normalizeString(key).includes(normalizedDepartment)
        );
       
        if (!departmentKey || !Array.isArray(data[departmentKey])) {
            console.error(`Aucune donnée trouvée pour le département: ${department}`);
            return;
        }
       
       
        // Recherche de la ville dans le département
        const cityData = data[departmentKey].find(item =>
            item &&
            item["Libellé commune ou ARM"] &&
            normalizeString(item["Libellé commune ou ARM"]) === normalizeString(city)
        );
       
        if (!cityData) {
            console.error(`Aucune donnée trouvée pour la ville: ${city} dans le département: ${department}`);
            return;
        }
       
       
        // Extraction des données de population par tranche d'âge
        const labels = ["Pop 0-14 ans", "Pop 15-29 ans", "Pop 30-44 ans", "Pop 45-59 ans", "Pop 60-74 ans", "Pop 75 ans ou plus"];
        const datayears = [];
        const ageGroups = [7, 22, 37, 52, 67, 80]; // Âge moyen estimé pour chaque groupe
        let totalPopulation = 0;
        let weightedAgeSum = 0;
       
        // Recherche des clés correspondantes dans l'objet cityData
        for (let i = 0; i < labels.length; i++) {
            const label = labels[i];
            let value = 0;
            // Chercher la clé exacte ou une clé similaire
            const key = Object.keys(cityData).find(k =>
                k === label ||
                normalizeString(k).includes(normalizeString(label))
            );
           
            if (key) {
                value = parseFloat(cityData[key]) || 0;
                totalPopulation += value;
                weightedAgeSum += value * ageGroups[i];
            }
            datayears.push(value);
        }
        
        // Calcul de l'âge moyen et assignation à la variable externe
        populationAverageAge = totalPopulation > 0 ? weightedAgeSum / totalPopulation : 0;
        console.log(`Âge moyen de la population de ${city}: ${populationAverageAge.toFixed(2)} ans`);
       
        const ctx = document.getElementById(canvasId).getContext('2d');
        if (chartHistogramInstance) {
            chartHistogramInstance.destroy();
        }
       
        chartHistogramInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels.map(label => label.replace('Pop ', '')),
                datasets: [{
                    label: `${label} (Âge moyen: ${populationAverageAge.toFixed(2)} ans)`,
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
        
        // Retourner l'âge moyen pour une utilisation éventuelle
        return populationAverageAge;
    } catch (error) {
        console.error('Erreur lors de la création de l\'histogramme:', error);
        return null;
    }
}

let chartLineInstance = null;
async function createLineChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`${backendUrl}/api/EvolPrixImmo`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageCost = Array(labels.length).fill(0);
        
        // Chercher les données pour le département spécifié
        const departmentKey = Object.keys(data).find(key => 
            key.includes(normalizeString(department))
        );
        
        if (departmentKey) {
            // Filtrer les données pour la ville spécifiée
            const cityData = data[departmentKey].find(item => 
                normalizeString(item["Villes.1"]) === normalizeString(city)
            );
            
            if (cityData) {
                // Récupérer les valeurs annuelles directement des données
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    // Vérifier si l'année existe dans les données
                    if (cityData[year]) {
                        AverageCost[i] = cityData[year];
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
        const response = await fetch(`${backendUrl}/api/EvolPrixMCarre`);
        console.log(`${backendUrl}/api/EvolPrixMCarre`);
        
       
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageCost = Array(labels.length).fill(0);
       
        // Chercher les données pour le département spécifié
        const departmentKey = Object.keys(data).find(key =>
            key.includes(normalizeString(department))
        );
       
        if (departmentKey) {
            // Filtrer les données pour la ville spécifiée
           
            const cityData = data[departmentKey].find(item =>
                normalizeString(item["Villes.2"]) === normalizeString(city)
            );
           
            if (cityData) {
                // Récupérer les valeurs annuelles directement des données
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    // Vérifier si l'année existe dans les données
                    const yearKey = `${year}.1`;
                    if (yearKey in cityData) {
                        AverageCost[i] = cityData[yearKey];
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
                    await createPrixM2Chart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating price per square meter chart:', error);
    }
}

let chartSurfaceInstance = null;
async function createSurfaceChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`${backendUrl}/api/EvolSurface`);
        
       
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const labels = ["2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023"];
        const AverageCost = Array(labels.length).fill(0);
       
        // Chercher les données pour le département spécifié
        const departmentKey = Object.keys(data).find(key =>
            key.includes(normalizeString(department))
        );
       
        if (departmentKey) {
            // Filtrer les données pour la ville spécifiée
           
            const cityData = data[departmentKey].find(item =>
                normalizeString(item["Villes.3"]) === normalizeString(city)
            );
           
            if (cityData) {
                // Récupérer les valeurs annuelles directement des données
                for (let i = 0; i < labels.length; i++) {
                    const year = labels[i];
                    // Vérifier si l'année existe dans les données
                    const yearKey = `${year}.2`;
                    if (yearKey in cityData) {
                        AverageCost[i] = cityData[yearKey];
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
                    await createPrixM2Chart(canvasId, department, newCity, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error('Error creating price per square meter chart:', error);
    }
}

let chartUnemployedInstance = null;
async function CreateUnemployedChart(canvasId, department, city, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`${backendUrl}/api/Unemployed`);
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
                const previousMonthIndex = currentDate.getMonth() - 2;

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
async function CreateCriminalityChart(canvasId, department, city, population, label, borderColor, cityInputId = null) {
    try {
        const response = await fetch(`${backendUrl}/api/SecuriteCriminalite`);
        const statsNationnaleResponse = await fetch(`${backendUrl}/api/StatsNationnale`);
        const data = await response.json();
        const nationalData = await statsNationnaleResponse.json();


        const labelsSet = new Set();
        const Criminalitys = [];

        population = Number(String(population).replace(/[\s ,.]/g, ''));

        Object.entries(data).forEach(([key, collections]) => {
            if (key.includes(normalizeString(department))) {
                collections.forEach(collection => {
                    if (normalizeString(collection["Villes"]) === normalizeString(city)) {
                        labelsSet.add(collection["indicateur"]);

                        const rawNombre = String(collection["nombre"]).replace(/[\s ,.]/g, '');
                        const nombre = Number(rawNombre);
                        const tauxPourMille = (nombre / population) * 1000;
                        Criminalitys.push(tauxPourMille.toFixed(2));
                    }
                });
            }
        });

        const labels = Array.from(labelsSet);

        const totalPopulationFrance = 68290000;
        const nationalRates = [];

        
        Object.entries(nationalData).forEach(([key, collections]) => {
            collections.forEach(collection => {
                
                labelsSet.add(collection["indicateur"]);

                const rawNombre = String(collection["nombre"]).replace(/[\s ,.]/g, '');
                const nombre = Number(rawNombre);
                const tauxPourMille = (nombre / totalPopulationFrance) * 1000;
                nationalRates.push(tauxPourMille.toFixed(2));
            });
        });

        if (labels.length === 0 || Criminalitys.length === 0) {
            console.warn("Pas de données disponibles pour ce département/ville.");
            return;
        }

        const ctx = document.getElementById(canvasId).getContext('2d');

        if (window.chartCriminalityInstance) {
            window.chartCriminalityInstance.destroy();
        }

        window.chartCriminalityInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `${label} (pour 1 000 habitants)`,
                        data: Criminalitys,
                        borderColor: borderColor,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderWidth: 1
                    },
                    {
                        label: "Moyenne nationale (pour 1 000 habitants)",
                        data: nationalRates,
                        backgroundColor: "rgba(255, 99, 132, 0.4)",
                        borderColor: "rgba(255, 99, 132, 1)",
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                scales: {
                    x: {
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
                    await CreateCriminalityChart(canvasId, department, newCity, population, label, borderColor, cityInputId);
                });
                cityInput.dataset.listenerAttached = "true";
            }
        }
    } catch (error) {
        console.error("Erreur lors de la création du graphique :", error);
    }
}

async function fetchLoiLittoralData(department, city) {
    try {
        const response = await fetch(`${backendUrl}/api/LoiLittoral`);
        const data = await response.json();

        for (const key in data) {            
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                
                for (const collection of data[key]) {
                    
                    
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {
                        if(collection["loilitt_simp"] === "NC"){
                            return "Non"
                        }
                        else{
                            return "Oui"
                        }
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
}

async function fetchDepartmentCityNeighborhood() {
    const address = document.getElementById("Address").value;

    try {
        const formattedAddress = address.replace(/ /g, '+');
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${normalizeString(formattedAddress)}&format=json&addressdetails=1`);
        
        

        const data = await response.json();

        if (data && data.length > 0) {
            const departement = data[0].address.county || "";
            const departmentCode = data[0].address["ISO3166-2-lvl6"].split("-")[1];
            const city = data[0].name || data[0].address.city  || data[0].address.town || "";
            const suburb = data[0].address.suburb || "";
            const parts = suburb.split('-') || "";            
            return [departmentCode, departement, city, parts[parts.length - 1].trim() || ""];
        } else {
            console.error("No data found for the address.");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du quartier :", error);
        return null;
    }
}

async function fetchZoneMontagnesData(department, city) {
    try {
        const response = await fetch(`${backendUrl}/api/Montagnes`);
        const data = await response.json();

        for (const key in data) {            
            if (data.hasOwnProperty(key) && key.includes(normalizeString(department))) {
                
                for (const collection of data[key]) {
                    if (normalizeString(collection["libgeo"]) === normalizeString(city)) {
                        if(collection["mont_urb_zpp"] === "out"){
                            return "Non"
                        }
                        else{
                            return "Oui"
                        }
                    }
                }
            }
        }        
    } catch (error) {
        console.error('Erreur lors de la récupération des données de part propriaitaire:', error);
        return "";
    }
}

function TableauFinancier() {
    // ======================= RÉCUPÉRATION DES VALEURS UTILISATEUR =======================
    // Projet
    const prixAchat = parseFloat(document.getElementById('projetPrixAchat').value) || 0;
    const travaux = parseFloat(document.getElementById('projetTravaux').value) || 0;
    
    // Financement
    const dureeCredit = parseFloat(document.getElementById('financementDureeCredit').value) || 25;
    
    // Charges annuelles
    const chargesCopro = parseFloat(document.getElementById('chargesChargesCopro').value) || 0;
    const taxeFonciere = parseFloat(document.getElementById('chargesTaxeFonciere').value) || 0;
    const assurance = parseFloat(document.getElementById('chargesAssurance').value) || 0;
    const fraisDivers = parseFloat(document.getElementById('chargesFraisDivers').value) || 0;
    
    // Loyers prévisionnels HC
    const loyer1 = parseFloat(document.getElementById('loyersLoyer1').value) || 0;
    const typeLoyer1 = document.getElementById('loyersTypeLoyer1').value;
    const loyer2 = parseFloat(document.getElementById('loyersLoyer2').value) || 0;
    const typeLoyer2 = document.getElementById('loyersTypeLoyer2').value;
    const loyer3 = parseFloat(document.getElementById('loyersLoyer3').value) || 0;
    const typeLoyer3 = document.getElementById('loyersTypeLoyer3').value;
    
    // Données additionnelles
    const honorairesChasseur = parseFloat(document.getElementById('donneesHonorairesChasseur').value) || 0;
    const meuble = parseFloat(document.getElementById('donneesMeuble').value) || 0;
    const apportPersonnel = parseFloat(document.getElementById('donneesApportPersonnel').value) || 0;
    const taeg = (parseFloat(document.getElementById('donneesTaeg').value) || 0) / 100;
    
    // ===================================================================

    // =========================== VALEURS FIXES ==========================
    // Temps d'amortissements (récupération des valeurs affichées ou définition des valeurs par défaut)
    const amortMursAns = parseFloat(document.getElementById('TableauRentabiliteValueAmortMurs').innerText) || 20;
    const amortTravauxAns = parseFloat(document.getElementById('TableauRentabiliteValueAmortTravaux').innerText) || 10;
    const amortMeublesAns = parseFloat(document.getElementById('TableauRentabiliteValueAmortMeubles').innerText) || 5;
    // ===================================================================

    // Mise à jour des valeurs dans le tableau de résultats
    
    // Section Projet
    document.getElementById('TableauRentabiliteValuePrixAchat').innerText = prixAchat;
    
    // Notaire (8% du prix d'achat)
    const notaire = prixAchat * 0.08;
    document.getElementById('TableauRentabiliteValueNotaire').innerText = notaire.toFixed(0);
    
    // Travaux
    document.getElementById('TableauRentabiliteValueTravaux').innerText = travaux;
    
    // Total du projet
    const totalProjet = prixAchat + notaire + travaux;
    document.getElementById('TableauRentabiliteValueProjetTotal').innerText = totalProjet.toFixed(0);
    
    // Section Loyers
    document.getElementById('TableauRentabiliteValueLoyer1').innerText = loyer1;
    document.getElementById('TableauRentabiliteValueLoyer2').innerText = loyer2;
    document.getElementById('TableauRentabiliteValueLoyer3').innerText = loyer3;
    
    // Total des loyers
    const totalLoyers = loyer1 + loyer2 + loyer3;
    document.getElementById('TableauRentabiliteValueTotalLoyers').innerText = totalLoyers;
    
    // Section Financement
    // Total emprunt (90% du total projet + honoraires + meubles)
    const totalEmprunt = (totalProjet + honorairesChasseur + meuble) - apportPersonnel;
    document.getElementById('TableauRentabiliteValueTotalEmprunt').innerText = totalEmprunt.toFixed(0);
    
    // Durée du crédit
    document.getElementById('TableauRentabiliteValueDureeCredit').innerText = dureeCredit;
    const duree = document.getElementById('TableauRentabiliteValueDuree').innerText = dureeCredit * 12;
    
    // Tx Per/mois    
    document.getElementById('TableauRentabiliteValueTxPerMois').innerText = (taeg / 12 * 100).toFixed(2);
    
    // Mensualité de crédit
    const mensualite = totalEmprunt * (taeg / 12) / (1 - Math.pow(1 + taeg / 12, -12 * dureeCredit));
    document.getElementById('TableauRentabiliteValueMensualite').innerText = mensualite.toFixed(2);
    
    // Amortissement du capital mensuel
    const amortKMensuel = totalEmprunt / (dureeCredit * 12);
    document.getElementById('TableauRentabiliteValueAmortKMensuel').innerText = amortKMensuel.toFixed(2);
    
    // Intérêt mensuel
    const interetMensuel = mensualite - amortKMensuel;
    document.getElementById('TableauRentabiliteValueInteretMensuel').innerText = interetMensuel.toFixed(2);
    
    // Section Charges
    document.getElementById('TableauRentabiliteValueChargesCopro').innerText = chargesCopro;
    document.getElementById('TableauRentabiliteValueTaxeFonciere').innerText = taxeFonciere;
    document.getElementById('TableauRentabiliteValueAssurance').innerText = assurance;
    document.getElementById('TableauRentabiliteValueFraisDivers').innerText = fraisDivers;
    
    // Total mensuel des charges
    const totalChargesMensuel = (chargesCopro + taxeFonciere + assurance + fraisDivers) / 12;
    document.getElementById('TableauRentabiliteValueTotalMensuel').innerText = totalChargesMensuel.toFixed(2);
    
    // Section Impôts
    // Amortissements
    const amortMeublesMensuel = meuble / amortMeublesAns / 12;
    document.getElementById('TableauRentabiliteValueAmortMeublesMontant').innerText = amortMeublesMensuel.toFixed(4);
    
    const amortMursMensuel = prixAchat * 0.8 / amortMursAns / 12;
    document.getElementById('TableauRentabiliteValueAmortMursMontant').innerText = amortMursMensuel.toFixed(4);
    
    // Amortissement des travaux (10ans)
    const amortTravauxMensuel = totalProjet / amortTravauxAns / 12;
    document.getElementById('TableauRentabiliteValueAmortTravauxMontant').innerText = amortTravauxMensuel.toFixed(2);
    
    // Intérêts totaux
    const interetsTotaux = totalEmprunt - (prixAchat + totalProjet);
    document.getElementById('TableauRentabiliteValueInteretsTotaux').innerText = interetsTotaux.toFixed(0);
    
    // Intérêt mensuel part 2    
    document.getElementById('TableauRentabiliteValueInteretMensuelPart2').innerText =  interetsTotaux / duree;
    
    // Amortissement des intérêts (29%)
    const amortInterets = 0.29 * (interetsTotaux / duree);
    document.getElementById('TableauRentabiliteValueAmortInterets').innerText = amortInterets.toFixed(0);
    
    // Base d'imposition au Réel
    const baseImposition = totalLoyers - (totalChargesMensuel + amortMursMensuel + amortInterets + amortTravauxMensuel );
    document.getElementById('TableauRentabiliteValueBaseImposition').innerText = baseImposition.toFixed(0);
    
    // Impôt 30%
    const impot = baseImposition * 0.3;
    document.getElementById('TableauRentabiliteValueImpot').innerText = impot.toFixed(0);
    
    // Prélèvements sociaux
    const csg = 0.099 * baseImposition;
    document.getElementById('TableauRentabiliteValueCSG').innerText = csg.toFixed(2);
    
    const crds = 0.005 * baseImposition;
    document.getElementById('TableauRentabiliteValueCRDS').innerText = crds.toFixed(2);
    
    const prelevSocial = 0.045 * baseImposition;
    document.getElementById('TableauRentabiliteValuePrelevSocial').innerText = prelevSocial.toFixed(2);
    
    const contribAdd = 0.003 * baseImposition;
    document.getElementById('TableauRentabiliteValueContribAdd').innerText = contribAdd.toFixed(2);
    
    const prelevSolidarite = 0.02 * baseImposition;
    document.getElementById('TableauRentabiliteValuePrelevSolidarite').innerText = prelevSolidarite.toFixed(2);
    
    const totalImpotsSociaux = csg + crds + prelevSocial + contribAdd + prelevSolidarite;
    document.getElementById('TableauRentabiliteValueTotalImpotSociaux').innerText = totalImpotsSociaux.toFixed(2);
    
    // Section Cashflow
    // Cashflow brut
    const cashflowBrut = totalLoyers - mensualite;
    document.getElementById('TableauRentabiliteValueCashflowBrut').innerText = cashflowBrut.toFixed(0);
    
    // Cashflow net net
    const cashflowNetNet = cashflowBrut - totalChargesMensuel - impot - totalImpotsSociaux;
    document.getElementById('TableauRentabiliteValueCashflowNetNet').innerText = cashflowNetNet.toFixed(0);
    
    // Informations supplémentaires
    document.getElementById('TableauRentabiliteValueHonorairesChasseur').innerText = honorairesChasseur;
    document.getElementById('TableauRentabiliteValueMeuble').innerText = meuble;
    document.getElementById('TableauRentabiliteValueApportPersonnel').innerText = apportPersonnel;
    
    document.getElementById('TableauRentabiliteValueTaeg').innerText = (taeg * 100).toFixed(2);
    
    // Bénéfice mensuel net (cashflow net net + amortissement capital)
    const beneficeMensuelNet = cashflowNetNet + amortKMensuel;
    document.getElementById('TableauRentabiliteValueBeneficeMensuelNet').innerText = beneficeMensuelNet.toFixed(0);
    
    // Bénéfice annuel net
    const beneficeAnnuelNet = beneficeMensuelNet * 12;
    document.getElementById('TableauRentabiliteValueBeneficeAnnuelNet').innerText = beneficeAnnuelNet.toFixed(0);
    
    // Rentabilité brute annuelle    
    const rentabiliteBrute = totalLoyers * 12 / totalEmprunt * 100;
    document.getElementById('TableauRentabiliteValueRentabiliteBruteAnnuelle').innerText = rentabiliteBrute.toFixed(2);
    
    // TRI (version simplifiée)
    const tri = beneficeAnnuelNet / totalEmprunt * 0.11 * Math.pow(10 , 4);
    document.getElementById('TableauRentabiliteValueTriAnnuel').innerText = tri.toFixed(2);
    
    // Loyer annuel
    document.getElementById('TableauRentabiliteValueLoyerAnnuel').innerText = (totalLoyers * 12).toFixed(0);
}

async function updateValues() {
    let city = "";
    let department = "";
    let departmentCode = "";

    let typeOfPropertyValue = document.getElementById("TypeOfPropertyValue");
    let nbPiecesValue = document.getElementById("NbPiecesValue");
    let surfaceValue = document.getElementById("SurfaceValue");
    let cityValue = document.getElementById("CityValue");
    let neighbourhoodValue = document.getElementById("neighbourhoodValue");

    let costSquare = document.getElementById("CostSquareValue");
    let RentValue = document.getElementById("RentValue");
    let yieldValue = document.getElementById("YieldValue");

    
    let neighborhoodCost = "";
    let neighborhoodRent = "";

    let costSquareNeighbourhood = document.getElementById("CostSquareValueNeighbourhood");
    let RentValueNeighbourhood = document.getElementById("RentValueNeighbourhood");
    let yieldValueNeighbourhood = document.getElementById("YieldValueNeighbourhood");

    let costSquareNeighbourhoodDiv = document.getElementById("CostSquareAreaNeighbourhood");
    let RentValueNeighbourhoodDiv = document.getElementById("RentAreaNeighbourhood");
    let yieldValueNeighbourhoodDiv = document.getElementById("YieldAreaNeighbourhood");

    let cityDescriptionValue = document.querySelector(".CityDescriptionValue");

    let Population = document.getElementById("Population");
    let StudentsRate = document.getElementById("StudentsRate");
    let UnemployedRate = document.getElementById("UnemployedRate");
    let MedianIncome = document.getElementById("MedianIncome");
    let OwnerShare = document.getElementById("OwnerShare");
    let TenantShare = document.getElementById("TenantShare");
    let PopulationDensity = document.getElementById("PopulationDensity");

    let vacantsCommodations = document.getElementById("VacantsCommodationsRate");
    let LocativeTension = document.getElementById("LocativeTension");
    let InternetConnection = document.getElementById("InternetConnection");
    let LoiLittoral = document.getElementById("LoiLittoral");
    let ZoneMontagnes = document.getElementById("ZoneMontagnes");

    let CityClimatValue = document.querySelector(".CityClimatValue");
    let UrbanismeDescriptionValue = document.querySelector(".UrbanismeDescriptionValue");
    let GrandAxesDescriptionValue = document.querySelector(".GrandAxesDescriptionValue");

    [departmentCode, department, city, neighbourhoodValue.innerText] = await fetchDepartmentCityNeighborhood();
    // department = normalizeString(department)
    
    if (!departmentCode || !department || !city) {
        console.error("Failed to fetch department, city, or neighborhood.");
        return;
    }

    cityValue.innerText = city;
    typeOfPropertyValue.innerText = sessionStorage.getItem("propertyType") || "Non spécifié";
    nbPiecesValue.innerText = (sessionStorage.getItem("PiecesNumberUsersInputValue") || "0") + " Pièces";
    surfaceValue.innerText = (sessionStorage.getItem("SurfaceUserInputValue") || "0") + " M²";

    const data = await fetchRentabiliteData(department, city, typeOfPropertyValue.innerText);

    costSquare.innerText = Number(data.pricePerSquareMeter).toLocaleString("fr-FR") + " €";
    RentValue.innerText = (Number(data.rentPerSquareMeter)).toFixed(1) + " €";
    yieldValue.innerText = (data.yield * 100).toFixed(2) + " %";

    if(neighbourhoodValue.innerText == ""){
        costSquareNeighbourhoodDiv.style.display = "none"
        RentValueNeighbourhoodDiv.style.display = "none"
        yieldValueNeighbourhoodDiv.style.display = "none"
    }
    else{        
        neighborhoodCost = await fetchNeighborhoodCostData(department, city, neighbourhoodValue.innerText, typeOfPropertyValue.innerText);
        neighborhoodCost = Math.round(neighborhoodCost)
        neighborhoodRent = await fetchNeighborhoodRentData(department, city, neighbourhoodValue.innerText, typeOfPropertyValue.innerText);
    }
    if (neighborhoodCost === undefined || neighborhoodRent === undefined) {
        console.error("neighborhoodCost or neighborhoodRent is undefined");
        return;
    }

    costSquareNeighbourhood.innerText = neighborhoodCost.toLocaleString("fr-FR") + " €";
    RentValueNeighbourhood.innerText = neighborhoodRent.toLocaleString("fr-FR") + " €";
    yieldValueNeighbourhood.innerText = (
        ((Number(RentValueNeighbourhood.innerText.replace(" €", "").replace(/\s/g, '')) * 12) /
        Number(costSquareNeighbourhood.innerText.replace(" €", "").replace(/\s/g, ''))) * 100
    ).toFixed(2) + " %";

    cityDescriptionValue.innerText = await fetchCytiesDescription(city);
    CityClimatValue.innerText = await fetchCytiesClimat(city);
    UrbanismeDescriptionValue.innerText = await fetchCytiesUrbanisme(city);
    GrandAxesDescriptionValue.innerText = await fetchCytiesGrandsAxes(city);

    Population.innerText = parseInt(data.population).toLocaleString();
    StudentsRate.innerText = (data.studentsRate * 100).toFixed(2) + "%";
    UnemployedRate.innerText = (data.unemploymentRate * 100).toFixed(2) + "%";
    MedianIncome.innerText = (await fetchMedianIncomeData(department, city)).toLocaleString() + " €";
    OwnerShare.innerText = await fetchOwnerShareData(department, city) + " %";
    TenantShare.innerText = (100 - await fetchOwnerShareData(department, city)).toFixed(1) + " %";
    PopulationDensity.innerText = (await fetchPopulationDensityData(department, city)).toLocaleString() + " hab/km²";

    vacantsCommodations.innerText = await fetchVacantsAcommodationsData(department, city) + " %";
    LocativeTension.innerText = await fetchLocativeTension(city) + "/8";
    InternetConnection.innerText = (await fetchInternetConnectionData(department, city)).toFixed(2) + " /10";
    LoiLittoral.innerText = await fetchLoiLittoralData(department, city);
    ZoneMontagnes.innerText = await fetchZoneMontagnesData(department, city);

    createHistogram('populationChartCanvas', department, city, 'Répartition des âges');
    createLineChart('lineChartCanvas', department, city, 'Prix Moyen', 'rgba(75, 192, 192, 1)', 'cityInputId');
    createPrixM2Chart('prixM2ChartCanvas', department, city, 'Prix au m²', 'rgba(153, 102, 255, 1)', 'cityInputId');
    createSurfaceChart('surfaceChartCanvas', department, city, 'Surface Moyenne', 'rgba(255, 99, 132, 1)', 'cityInputId');
    CreateUnemployedChart('UnemployedChartCanvas', department, city, 'Taux de Chômage', 'rgba(255, 159, 64, 1)', 'cityInputId');
    CreateCriminalityChart("securiteChartCanvas", department, city, Population.innerText, "Criminalité", "rgb(124, 255, 64)");

    fillPopulationTable(department, city);
    fillPrixImmoTable(department, city);

    TableauFinancier();

    fillNeighborhoodCostRentTable(department, city);
    // fillNeighborhoodPopulationTable(department, city);

    // fetchDVFData();
}

const button = document.getElementById('getResult');
button.addEventListener('click', () => {
    
    const PrintArea = document.getElementById("PrintArea");
    if (PrintArea) {
        PrintArea.style.display = "flex";
    }
    updateValues();
});