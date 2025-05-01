import { fetchMapboxToken } from "../../../Map/Map.js";
const token = await fetchMapboxToken();

const CATEGORY_ICONS = {
  'Transports': `
    <!-- Voiture -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 17h10v-4H7v4zm11-7l-1.5-4.5h-9L6 10h12z"/>
      <circle cx="7" cy="17" r="2"/>
      <circle cx="17" cy="17" r="2"/>
      <path d="M5 10h14v7h-2M5 17h2"/>
    </svg>
  `,
  'Enseignement': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
    </svg>
  `,
  'Commerces': `
    <!-- Billet -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M6 10h1M6 14h1M17 10h1M17 14h1"/>
    </svg>
  `,
  'ServicesDeSante': `
    <!-- Croix verte de pharmacie -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="6" x2="12" y2="18"/>
      <line x1="6" y1="12" x2="18" y2="12"/>
    </svg>
  `,
  'Loisirs': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 6v6l4 2"/>
    </svg>
  `,
  'ServicesPublic': `
    <!-- Main avec des gens dessus -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 16v-4a2 2 0 0 0-2-2h-1"/>
      <path d="M7 16v-4a2 2 0 0 1 2-2h8"/>
      <path d="M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
      <path d="M18 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      <path d="M6 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
      <path d="M3 19h18c-1-5-4-7-9-7s-8 2-9 7z"/>
    </svg>
  `,
  'Bar': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
      <path d="M5 8h12v9a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V8z"/>
      <line x1="5" y1="3" x2="19" y2="3"/>
    </svg>
  `,
  'Parking': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
    </svg>
  `,
  'Restaurants': `
    <!-- Fourchette -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 3v18"/>
      <path d="M14 3v5M14 12v9"/>
      <path d="M7 3v3c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V3"/>
      <path d="M16 8v4"/>
    </svg>
  `,
  'ActivitesCulturelle': `
    <!-- Masques de théâtre -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 5a2 2 0 0 0-2 2v4a2 2 0 0 0 4 0V7a2 2 0 0 0-2-2z"/>
      <path d="M17 5a2 2 0 0 1 2 2v4a2 2 0 0 1-4 0V7a2 2 0 0 1 2-2z"/>
      <path d="M7 5h10"/>
      <path d="M19 9v2a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V9"/>
      <line x1="8" y1="9" x2="8" y2="9"/>
      <line x1="16" y1="9" x2="16" y2="9"/>
      <path d="M9 13 c 0 2 3 2 3 0"/>
      <path d="M15 13 c 0 2 -3 2 -3 0"/>
    </svg>
  `,
  'ServicesPourAnimaux': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M10 5.172C10 3.782 8.423 2.679 6.5 3c-2.823.47-4.113 6.006-4 7 .08.703 1.725 1.722 3.656 1 1.261-.472 1.96-1.45 2.344-2.5"/>
      <path d="M14.5 5.172c0-1.39 1.577-2.493 3.5-2.172 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.96-1.45-2.344-2.5"/>
      <path d="M8 14v.5"/>
      <path d="M16 14v.5"/>
      <path d="M11.25 16.25h1.5L12 17l-.75-.75z"/>
      <path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444c0-1.061-.162-2.2-.493-3.309"/>
    </svg>
  `,
  'InfrastructureSportive': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="m4.93 4.93 4.24 4.24"/>
      <path d="m14.83 9.17 4.24-4.24"/>
      <path d="m14.83 14.83 4.24 4.24"/>
      <path d="m9.17 14.83-4.24 4.24"/>
      <circle cx="12" cy="12" r="4"/>
    </svg>
  `,
  'Stationnement': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>
      <path d="M3 10h18"/>
    </svg>
  `,
  'Justice': `
    <!-- Marteau de juge -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14 6l4 4M18 6l-4 4"/>
      <path d="M14 10v7l-8 2V15l8-2"/>
      <path d="M10 19v3"/>
      <path d="M14 5v-2"/>
      <path d="M18 10h2"/>
      <rect x="6" y="6" width="4" height="4"/>
    </svg>
  `,
  'JardinEtParc': `
    <!-- Feuille (plante) -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M6 21c4.667-3 8-7.333 8-12 0-2-1-9-8-9C5 6 3 9 3 12c0 2.667 1.333 5.333 3 8"/>
      <path d="M12 9c0 4-2 7-6 9"/>
    </svg>
  `,
  'CentreSocial': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  `,
  'Utilitaires': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  `,
  'Hebergement': `
    <!-- Lit -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M2 9v6h20V9"/>
      <path d="M2 19h20"/>
      <path d="M2 13h20"/>
      <path d="M4 5v4h16V5"/>
      <path d="M4 9h16"/>
    </svg>
  `,
  'Divers': `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  `
};

const categories = {
  Transports: ['amenity=bus_station', 'amenity=taxi', 'railway=subway_entrance', 'railway=station'],
  Enseignement: ['amenity=school', 'amenity=college', 'amenity=kindergarten', 'amenity=university'],
  Commerces: ['shop=supermarket', 'shop=mall', 'shop=convenience', 'shop=bakery'],
  ServicesDeSante: ['amenity=hospital', 'amenity=clinic', 'amenity=pharmacy', 'amenity=doctors'],
  Loisirs: ['amenity=cinema', 'amenity=theatre', 'amenity=nightclub'],
  ServicesPublic: ['amenity=townhall', 'amenity=post_office', 'amenity=police', 'amenity=fire_station'],
  Bar: ['amenity=bar', 'amenity=pub'],
  Parking: ['amenity=parking'],
  Restaurants: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe'],
  ActivitesCulturelle: ['amenity=library', 'amenity=arts_centre'],
  ServicesPourAnimaux: ['amenity=veterinary', 'shop=pet'],
  InfrastructureSportive: ['leisure=sports_centre', 'leisure=stadium', 'leisure=fitness_centre'],
  Stationnement: ['amenity=parking', 'amenity=parking_space'],
  Justice: ['amenity=courthouse'],
  JardinEtParc: ['leisure=park', 'leisure=garden'],
  CentreSocial: ['amenity=community_centre', 'social_facility=social_facility'],
  Utilitaires: ['amenity=toilets', 'amenity=recycling', 'amenity=waste_basket'],
  Hebergement: ['tourism=hotel', 'tourism=hostel', 'tourism=motel'],
  Divers: ['amenity=place_of_worship', 'amenity=bank', 'amenity=atm']
};

// Variable globale pour la carte
let map;
let allAmenitiesData = []; // Stocke toutes les données de commodités avant d'ajouter les marqueurs

// Fonction pour créer un marqueur
function createMarker(category, coordinates) {
  const el = document.createElement('div');
  el.className = 'custom-marker';
  el.innerHTML = CATEGORY_ICONS[category] || `
    <!-- Marqueur par défaut -->
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  `;

  el.style.width = '32px';
  el.style.height = '32px';
  el.style.display = 'flex';
  el.style.alignItems = 'center';
  el.style.justifyContent = 'center';
  el.style.background = '#fff';
  el.style.borderRadius = '50%';
  el.style.border = '2px solid #333';
  el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

  // Ajouter une couleur différente selon la catégorie
  const colors = {
    'Transports': '#3498db',
    'Enseignement': '#f1c40f',
    'Commerces': '#e74c3c',
    'ServicesDeSante': '#2ecc71',
    'Loisirs': '#9b59b6',
    'ServicesPublic': '#34495e',
    'Bar': '#e67e22',
    'Parking': '#7f8c8d',
    'Restaurants': '#d35400',
    'ActivitesCulturelle': '#1abc9c',
    'ServicesPourAnimaux': '#27ae60',
    'InfrastructureSportive': '#2980b9',
    'Stationnement': '#95a5a6',
    'Justice': '#c0392b',
    'JardinEtParc': '#16a085',
    'CentreSocial': '#8e44ad',
    'Utilitaires': '#bdc3c7',
    'Hebergement': '#f39c12',
    'Divers': '#7f8c8d'
  };
  el.style.color = colors[category] || '#333';

  new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .addTo(map);
}

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length === 0) throw new Error("Adresse introuvable");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

function buildOverpassQuery(lat, lon, tags) {
  const radius = 50000;
  const filters = tags.map(t => {
    const [key, value] = t.split('=');
    return `node["${key}"="${value}"](around:${radius},${lat},${lon});`;
  }).join('\n');
  return `[out:json][timeout:25];(${filters});out body;`;
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const rad = deg => deg * Math.PI / 180;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function injectInDOM(category, results) {
  results.forEach((item, index) => {
    const nameElement = document.querySelector(`#${category}-item-${index + 1} .amenities-name`);
    const distElement = document.querySelector(`#${category}-item-${index + 1} .amenities-distance`);
    if (nameElement && distElement) {
      nameElement.innerText = item.name;
      distElement.innerText = `${Math.round(item.distance)} m`;
    }
  });
}

// Fonction pour initialiser la carte et attendre qu'elle soit complètement chargée
async function initializeMap(lon, lat) {
  return new Promise((resolve, reject) => {
    try {
      // Vérifier si l'élément Map2 existe
      const mapContainer = document.getElementById('Map2');
      if (!mapContainer) {
        reject(new Error("L'élément avec l'ID 'Map2' n'existe pas dans le DOM"));
        return;
      }
      
      // S'assurer que le conteneur a une hauteur
      if (mapContainer.clientHeight === 0) {
        mapContainer.style.height = '500px';
      }
      
      // Initialiser la carte
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: 'Map2',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lon, lat],
        zoom: 13,
        minZoom: 9,
        maxZoom: 18,
        attributionControl: true
      });
      
      // Résoudre la promesse lorsque la carte est complètement chargée
      map.on('load', () => {
        console.log("Carte chargée avec succès");
        resolve(map);
      });
      
      map.on('error', (e) => {
        console.error("Erreur lors du chargement de la carte:", e);
        reject(e);
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Fonction pour récupérer toutes les données d'amenities
async function fetchAllAmenities(lat, lon) {
  const categoryEntries = Object.entries(categories);
  const batchSize = 3; // Traiter 3 catégories à la fois
  const allAmenities = [];
  
  for (let i = 0; i < categoryEntries.length; i += batchSize) {
    const batch = categoryEntries.slice(i, i + batchSize);
    
    // Exécuter les requêtes par lots
    const batchResults = await Promise.all(batch.map(async ([category, tags]) => {
      try {
        const query = buildOverpassQuery(lat, lon, tags);
        const response = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          body: query
        });
        
        // Vérifier si la réponse est OK
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        
        const json = await response.json();
        if (!json.elements || !json.elements.length) return null;

        const sorted = json.elements
          .map(e => ({
            name: e.tags?.name || '[Sans nom]',
            lat: e.lat,
            lon: e.lon,
            distance: haversine(lat, lon, e.lat, e.lon)
          }))
          .sort((a, b) => a.distance - b.distance)
          .slice(0, 3);

        return { category, amenities: sorted };
      } catch (categoryError) {
        console.error(`Erreur lors du traitement de la catégorie ${category}:`, categoryError);
        return null;
      }
    }));
    
    // Ajouter les résultats valides au tableau final
    batchResults.forEach(result => {
      if (result) allAmenities.push(result);
    });
    
    // Petite pause entre les lots pour éviter de surcharger l'API
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return allAmenities;
}

// Fonction principale réorganisée pour charger complètement la carte avant d'ajouter les commodités
async function getAmenitiesNearby(userAddress) {
  try {
    // Attendre que DOM soit complètement chargé
    if (document.readyState !== 'complete') {
      await new Promise(resolve => {
        window.addEventListener('load', resolve);
      });
    }

    // Obtenir les coordonnées de l'adresse
    const { lat, lon } = await geocodeAddress(userAddress);
    
    // Vérifier si Mapbox est chargé correctement
    if (!mapboxgl) {
      console.error("Erreur : Mapbox GL JS n'est pas chargé");
      return;
    }
    
    // Vérifier si le token existe
    if (!token) {
      console.error("Erreur : Token Mapbox non disponible");
      return;
    }
    
    // Attendre un court instant pour s'assurer que le DOM est prêt
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Étape 1 : Initialiser et attendre que la carte soit complètement chargée
    try {
      console.log("Initialisation de la carte...");
      await initializeMap(lon, lat);
      console.log("Carte complètement chargée et prête");
      
      // Ajouter le marqueur de l'utilisateur une fois la carte chargée
      new mapboxgl.Marker({ color: 'blue' })
        .setLngLat([lon, lat])
        .setPopup(new mapboxgl.Popup().setText("Votre adresse"))
        .addTo(map);
      
      // Étape 2 : Récupérer toutes les données d'amenities
      console.log("Récupération des données d'amenities...");
      const amenitiesData = await fetchAllAmenities(lat, lon);
      
      // Étape 3 : Mettre à jour le DOM avec les données récupérées
      amenitiesData.forEach(({ category, amenities }) => {
        if (amenities && amenities.length > 0) {
          injectInDOM(category, amenities);
        }
      });
      
      // Étape 4 : Ajouter tous les marqueurs après que la carte et les données sont prêtes
      console.log("Ajout des marqueurs sur la carte...");
      amenitiesData.forEach(({ category, amenities }) => {
        if (amenities && amenities.length > 0) {
          amenities.forEach(amenity => {
            createMarker(category, [amenity.lon, amenity.lat]);
          });
        }
      });
      
      // S'assurer que la carte est correctement redimensionnée
      map.resize();
      console.log("Processus terminé avec succès");
      
    } catch (mapError) {
      console.error("Erreur lors de l'initialisation de la carte:", mapError);
      return;
    }
  } catch (err) {
    console.error("Erreur globale:", err.message);
  }
}

const address = sessionStorage.getItem("UserInputAdress")
console.log(`Adresse SessionStorage : ${address}`);

console.log(`Address : ${document.getElementById("Address").value}`);

if (address) {
  console.log("Adresse trouvée, initialisation de la carte:", address);
  getAmenitiesNearby(address);
} else {
  console.error("Aucune adresse trouvée");
}