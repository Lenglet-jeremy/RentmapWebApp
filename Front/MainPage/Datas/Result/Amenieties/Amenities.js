// Amenities.js

import { fetchMapboxToken } from "../../../Map/Map.js";
import { fetchDepartmentCityNeighborhood } from "../Result.js";
const token = await fetchMapboxToken();


const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';


const MAX_AMENITIES_DISPLAYED = 5
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
  ActivitesCulturelle: ['amenity=library', 'amenity=arts_centre'],
  Bar: ['amenity=bar', 'amenity=pub'],
  CentreSocial: ['amenity=community_centre', 'social_facility=social_facility'],
  Commerces: ['shop=supermarket', 'shop=mall', 'shop=convenience', 'shop=bakery'],
  Divers: ['amenity=place_of_worship', 'amenity=bank', 'amenity=atm'],
  Enseignement: ['amenity=school', 'amenity=college', 'amenity=kindergarten', 'amenity=university'],
  Hebergement: [
    'tourism=hotel',
    'tourism=hostel',
    'tourism=motel',
    'tourism=guest_house',
    'tourism=bed_and_breakfast',
    'tourism=camp_site',
    'tourism=chalet',
    'tourism=caravan_site',
    'tourism=apartment'
  ],  
  InfrastructureSportive: [
    'leisure=sports_centre',
    'leisure=stadium',
    'leisure=fitness_centre',
    'leisure=swimming_pool',
    'leisure=pitch',
    'sport=soccer',
    'sport=tennis',
    'sport=basketball',
    'sport=athletics',
    'sport=climbing',
    'sport=skating',
    'sport=swimming',
    'sport=fitness'
  ],  
  JardinEtParc: [
    'leisure=park',
    'leisure=garden',
    'leisure=nature_reserve',
    'leisure=playground',
    'leisure=dog_park',
    'leisure=common',
    'landuse=forest',
    'landuse=grass',
    'natural=wood',
    'natural=heath',
    'natural=scrub'
  ],  
  Justice: ['amenity=courthouse'],
  Loisirs: ['amenity=cinema', 'amenity=theatre', 'amenity=nightclub'],
  Parking: ['amenity=parking_entrance', 'amenity=bicycle_parking', 'amenity=parking_space'],
  Restaurants: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe'],
  ServicesDeSante: ['amenity=hospital', 'amenity=clinic', 'amenity=pharmacy', 'amenity=doctors'],
  ServicesPourAnimaux: ['amenity=veterinary', 'shop=pet'],
  ServicesPublic: ['amenity=townhall', 'amenity=post_office', 'amenity=police', 'amenity=fire_station'],
  Stationnement: ['amenity=parking', 'amenity=parking_space'],
  Transports: ['amenity=bus_station', 'amenity=taxi', 'railway=subway_entrance', 'railway=station'],
  Utilitaires: ['amenity=toilets', 'amenity=recycling', 'amenity=waste_basket']
};

let map;

function normalizeCategoryName(category) {
  const normalized = category.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "").toLowerCase();
  console.log(`Normalized category: ${category} -> ${normalized}`); // Log de la normalisation
  return normalized;
}

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
  
  const response = await fetch(url);
  const data = await response.json();
  if (data.length === 0) throw new Error("Adresse introuvable");
  return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Rayon de la Terre en mètres
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * rad) * Math.cos(lat2 * rad) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
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
      
      // S'assurer que le conteneur a une hauteur explicite
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
      
      // Gérer le redimensionnement de la carte
      const handleResize = () => {
        if (map) {
          map.resize();
          console.log('Map resized');
        }
      };

      // Résoudre la promesse lorsque la carte est complètement chargée
      map.on('load', () => {
        // Forcer plusieurs redimensionnements pour s'assurer que la carte s'adapte correctement
        handleResize();
        
        // Planifier plusieurs redimensionnements avec des délais différents
        setTimeout(handleResize, 100);
        setTimeout(handleResize, 500);
        setTimeout(handleResize, 1000);
        setTimeout(handleResize, 2000);
        
        // Observer les changements de taille du conteneur
        if (window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(() => {
            handleResize();
          });
          resizeObserver.observe(mapContainer);
        } else {
          // Fallback pour les navigateurs qui ne supportent pas ResizeObserver
          window.addEventListener('resize', handleResize);
        }
        
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
async function fetchAllAmenities(department, city) {
  const response = await fetch(`${backendUrl}/api/commoditees/`);
  
  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des commodités : ${response.status}`);
  }

  const data = await response.json();
  const key = `${city}commoditees.json`;
  console.log(data[key]);
  

  if (!data[key]) {
    throw new Error(`Aucune donnée trouvée pour la ville : ${city}`);
  }

  return data[key];
}

// Fonction utilitaire pour attacher les écouteurs aux boutons "..."
function attachMoreButtonListeners(amenitiesData) {
  // Modifiez l'écouteur d'événements des boutons pour masquer la div si elle est déjà visible

  // Modifiez l'écouteur d'événements des boutons pour masquer la div si elle est déjà visible
  document.querySelectorAll('.more-button').forEach(button => {
    button.addEventListener('click', function(event) {
      const category = normalizeCategoryName(this.getAttribute('data-category'));
      const additionalAmenitiesDiv = document.getElementById('additionalAmenities');
      const floatingDiv = document.getElementById('floatingDiv');

      // Si la div flottante est déjà visible et correspond à la même catégorie, masquez-la
      if (floatingDiv.style.display === 'block' && floatingDiv.getAttribute('data-category') === category) {
        floatingDiv.style.display = 'none';
        return;
      }

      const rect = this.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const divHeight = floatingDiv.offsetHeight;
      const divWidth = floatingDiv.offsetWidth;

      let top = rect.bottom;
      let left = rect.left;

      if (top + divHeight > windowHeight) {
        top = rect.top - divHeight;
      }
      if (left + divWidth > windowWidth) {
        left = rect.right - divWidth;
      }
      if (top < 0) {
        top = rect.bottom;
      }
      if (left < 0) {
        left = 0;
      }

      floatingDiv.style.top = `${top}px`;
      floatingDiv.style.left = `${left}px`;
      floatingDiv.style.display = 'block';
      floatingDiv.setAttribute('data-category', category);

      additionalAmenitiesDiv.innerHTML = '';

      const additionalAmenities = amenitiesData.find(data => normalizeCategoryName(data.category) === category)?.amenities.slice(3);

      if (additionalAmenities && additionalAmenities.length > 0) {
        additionalAmenities.forEach(item => {
          const amenityDiv = document.createElement('div');
          amenityDiv.classList.add('additional-amenity');
          amenityDiv.innerHTML = `<strong>${item.name || item.category}</strong> - ${Math.round(item.distance)} m`;
          additionalAmenitiesDiv.appendChild(amenityDiv);
        });
      } else {
        additionalAmenitiesDiv.innerHTML = '<p>Aucune commodité supplémentaire disponible.</p>';
      }

      event.stopPropagation();
    });
  });
}

// Fonction principale modifiée
async function getAmenitiesNearby(userAddress) {
  let departmentCode = "";
  let department = "";
  let city = "";

  const neighbourhoodValue = document.getElementById("neighbourhoodValue");

  const { lat, lon } = await geocodeAddress(userAddress);
  [departmentCode, department, city, neighbourhoodValue.innerText] = await fetchDepartmentCityNeighborhood();
  const allAmenities = await fetchAllAmenities(department, city);

  const amenitiesWithDistance = allAmenities.map(amenity => {
    const distance = calculateDistance(lat, lon, amenity.latitude, amenity.longitude);
    return {
      ...amenity,
      distance,
    };
  });

  const flatCategoryMap = {};
  for (const [group, keys] of Object.entries(categories)) {
    keys.forEach(key => {
      flatCategoryMap[key] = group;
    });
  }

  const groupedAmenities = {};
  amenitiesWithDistance.forEach(amenity => {
    const key = `${amenity.type}=${amenity.category}`;
    const group = flatCategoryMap[key] || 'Divers';
    if (!groupedAmenities[group]) {
      groupedAmenities[group] = [];
    }
    groupedAmenities[group].push(amenity);
  });

  const amenitiesData = Object.entries(groupedAmenities).map(([category, amenities]) => ({
    category,
    amenities: amenities.sort((a, b) => a.distance - b.distance).slice(0, MAX_AMENITIES_DISPLAYED)
  }));

  // Ajoutez un écouteur d'événements global pour masquer la div flottante
  window.addEventListener('click', function(event) {
    const floatingDiv = document.getElementById('floatingDiv');
    const isClickInside = floatingDiv.contains(event.target);
    const isMoreButton = event.target.closest('.more-button');

    if (!isClickInside && !isMoreButton) {
      floatingDiv.style.display = 'none';
    }
  });


  try {
    if (document.readyState !== 'complete') {
      await new Promise(resolve => window.addEventListener('load', resolve));
    }

    if (!mapboxgl || !token) {
      console.error("Erreur : Mapbox ou token manquant");
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 100));
    await initializeMap(lon, lat);

    // Injecter les commodités dans le DOM
    amenitiesData.forEach(({ category, amenities }) => injectInDOM(category, amenities));

    // ✅ Réattacher les écouteurs après injection DOM
    attachMoreButtonListeners(amenitiesData);

    // Ajouter les marqueurs pour les commodités
    amenitiesData.forEach(({ category, amenities }) => {
      amenities.forEach(amenity => {
        createMarker(category, [amenity.longitude, amenity.latitude], amenity.name, amenity.distance);
      });
    });

    // Marqueur utilisateur
    new mapboxgl.Marker({ color: 'blue' })
      .setLngLat([lon, lat])
      .setPopup(new mapboxgl.Popup().setText("Votre adresse"))
      .addTo(map);

  } catch (err) {
    console.error("Erreur globale:", err.message);
  }

  saveMapState([lon, lat], map.getZoom(), amenitiesData);
}


async function loadSavedMapState() {
  const center = JSON.parse(sessionStorage.getItem('mapCenter'));
  const zoom = sessionStorage.getItem('mapZoom');
  const amenitiesData = JSON.parse(sessionStorage.getItem('amenitiesData'));

  if (center && zoom && amenitiesData) {
    await initializeMap(center[0], center[1]);

    // Réinjecter dans le DOM
    amenitiesData.forEach(({ category, amenities }) => injectInDOM(category, amenities));

    // Replacer les marqueurs
    amenitiesData.forEach(({ category, amenities }) => {
      amenities.forEach(amenity => {
        createMarker(category, [amenity.longitude, amenity.latitude], amenity.name, amenity.distance);
      });
    });

    const userMarker = new mapboxgl.Marker({ color: 'blue' })
      .setLngLat(center)
      .setPopup(new mapboxgl.Popup().setText("Votre adresse"))
      .addTo(map);

    // Zoom
    map.setZoom(parseFloat(zoom));

    // Réattacher les écouteurs d'événements
    attachMoreButtonListeners(amenitiesData);

    return true;
  }

  return false;
}



// Fonction pour créer un marqueur
function createMarker(category, coordinates, amenityName, distance) {
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

  // Créer le contenu du popup
  const popupContent = `
    <div>
      <strong>Catégorie:</strong> ${category}<br>
      <strong>Nom:</strong> ${amenityName}<br>
      <strong>Distance:</strong> ${Math.round(distance)} m
    </div>
  `;

  const marker = new mapboxgl.Marker(el)
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent)) // Ajouter une infobulle avec le contenu
    .addTo(map);
}

function injectInDOM(category, results) {
  results.forEach((item, index) => {
      if (index < 3) {
          // Injecter les 3 premières commodités dans les éléments existants
          const nameElement = document.querySelector(`#${category}-item-${index + 1} .amenities-name`);
          const distElement = document.querySelector(`#${category}-item-${index + 1} .amenities-distance`);

          if (item.name === "Inconnu") {
              nameElement.innerText = item.category;
              distElement.innerText = `${Math.round(item.distance)} m`;
          } else {
              nameElement.innerText = item.name;
              distElement.innerText = `${Math.round(item.distance)} m`;
          }
      } else {
          // Injecter les commodités supplémentaires dans la div flottante
          const additionalAmenitiesDiv = document.getElementById('additionalAmenities');
          const amenityDiv = document.createElement('div');
          amenityDiv.classList.add('additional-amenity');
          amenityDiv.innerHTML = `
              <strong>${item.name || item.category}</strong> - ${Math.round(item.distance)} m
          `;
          additionalAmenitiesDiv.appendChild(amenityDiv);
      }
  });
}

function saveMapState(center, zoom, amenitiesData) {
  sessionStorage.setItem('mapCenter', JSON.stringify(center));
  sessionStorage.setItem('mapZoom', zoom);
  sessionStorage.setItem('amenitiesData', JSON.stringify(amenitiesData));
}

// Ajoutez un écouteur d'événements global pour masquer la div flottante
document.addEventListener('click', function(event) {
  const floatingDiv = document.getElementById('floatingDiv');
  const isClickInsideFloatingDiv = floatingDiv.contains(event.target);
  const isMoreButton = event.target.closest('.more-button');

  // Si le clic est en dehors de la div flottante et non sur un bouton "...", masquez la div
  if (!isClickInsideFloatingDiv && !isMoreButton) {
    floatingDiv.style.display = 'none';
  }
});


document.getElementById('Address').addEventListener('change', function(event) {
  const address = document.getElementById('Address');
  const newValue = address.value;
  getAmenitiesNearby(newValue);
  console.log('Valeur changée :', newValue);
});
const loaded = await loadSavedMapState();