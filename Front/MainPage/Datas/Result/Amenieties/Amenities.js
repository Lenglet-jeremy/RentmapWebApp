// Importer le token Mapbox
import { fetchMapboxToken } from "../../../Map/Map.js";
import { amenityGroups } from "../../../Map/Map.js";

// Variable pour stocker l'instance de la carte
let map;

// Fonction pour construire la requête Overpass avec tous les tags demandés
function buildOverpassQuery([lng, lat], radius = 500) {
    // Utiliser la requête que vous avez fournie avec tous les tags
    return `[out:json][timeout:60];
    (
        node["amenity"](around:${radius},${lat},${lng});
        way["amenity"](around:${radius},${lat},${lng});
        relation["amenity"](around:${radius},${lat},${lng});

        node["shop"](around:${radius},${lat},${lng});
        way["shop"](around:${radius},${lat},${lng});
        relation["shop"](around:${radius},${lat},${lng});

        node["leisure"](around:${radius},${lat},${lng});
        way["leisure"](around:${radius},${lat},${lng});
        relation["leisure"](around:${radius},${lat},${lng});

        node["tourism"](around:${radius},${lat},${lng});
        way["tourism"](around:${radius},${lat},${lng});
        relation["tourism"](around:${radius},${lat},${lng});

        node["healthcare"](around:${radius},${lat},${lng});
        way["healthcare"](around:${radius},${lat},${lng});
        relation["healthcare"](around:${radius},${lat},${lng});

        node["public_transport"](around:${radius},${lat},${lng});
        way["public_transport"](around:${radius},${lat},${lng});
        relation["public_transport"](around:${radius},${lat},${lng});
        
        node["office"](around:${radius},${lat},${lng});
        way["office"](around:${radius},${lat},${lng});
        relation["office"](around:${radius},${lat},${lng});
    );
    out center;`;
}

// Définir les principales catégories de commodités
const MAIN_CATEGORIES = [
  'amenity',
  'shop',
  'leisure',
  'tourism',
  'healthcare',
  'public_transport',
  'office'
];

// Couleurs pour chaque catégorie de marqueur
const CATEGORY_COLORS = {
  'amenity': '#FF7E00',
  'shop': '#4CAF50',
  'leisure': '#2196F3',
  'tourism': '#9C27B0',
  'healthcare': '#F44336',
  'public_transport': '#009688',
  'office': '#795548'
};

async function getNearbyAmenities([lng, lat], radius = 500) {
  try {
    console.log("Recherche de commodités autour de:", lat, lng, "avec rayon:", radius);
    const query = buildOverpassQuery([lng, lat], radius);
    console.log("Requête Overpass:", query);
    
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: query,
    });

    if (!response.ok) {
      console.error("Erreur Overpass API:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    console.log("Résultats Overpass:", data.elements?.length || 0, "éléments trouvés");
    
    // Calculer la distance de chaque commodité par rapport au point de référence
    const elementsWithDistance = data.elements.map(el => {
      // Pour les ways et relations, utiliser le centre si disponible
      const elLat = el.center ? el.center.lat : el.lat;
      const elLon = el.center ? el.center.lon : el.lon;
      
      // Si les coordonnées ne sont pas disponibles, assigner une distance maximale
      if (!elLat || !elLon) {
        return { ...el, distance: Infinity };
      }
      
      // Calculer la distance en mètres (formule de Haversine simplifiée)
      const R = 6371000; // Rayon de la Terre en mètres
      const dLat = (elLat - lat) * Math.PI / 180;
      const dLon = (elLon - lng) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat * Math.PI / 180) * Math.cos(elLat * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      // Déterminer la catégorie principale de l'élément
      let category = null;
      for (const cat of MAIN_CATEGORIES) {
        if (el.tags && el.tags[cat]) {
          category = cat;
          break;
        }
      }
      
      return { ...el, distance, category };
    })
    .filter(el => el.category !== null); // Filtrer les éléments sans catégorie
    
    // Regrouper par catégorie principale
    const elementsByCategory = {};
    
    MAIN_CATEGORIES.forEach(cat => {
      elementsByCategory[cat] = elementsWithDistance
        .filter(el => el.category === cat)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // Prendre les 3 plus proches pour chaque catégorie
    });
    
    console.log("Commodités par catégorie:", elementsByCategory);
    
    // Fusionner tous les résultats dans un seul tableau
    const result = Object.values(elementsByCategory).flat();
    console.log(`${result.length} commodités à afficher au total`);
    
    return result;
  } catch (error) {
    console.error("Erreur lors de la récupération des commodités:", error);
    return [];
  }
}

// Fonction pour déterminer le type de commodité
function getAmenityType(tags) {
  if (tags.amenity) return tags.amenity;
  if (tags.shop) return `shop_${tags.shop}`;
  if (tags.leisure) return `leisure_${tags.leisure}`;
  if (tags.tourism) return `tourism_${tags.tourism}`;
  if (tags.healthcare) return `healthcare_${tags.healthcare}`;
  if (tags.public_transport) return `transport_${tags.public_transport}`;
  if (tags.office) return `office_${tags.office}`;
  return "autre";
}

// Fonction pour obtenir un nom plus convivial pour l'affichage
function getFriendlyName(tags) {
  // Priorité au nom si disponible
  if (tags.name) return tags.name;
  
  // Sinon, formater selon le type
  if (tags.amenity) {
    const amenityMap = {
      "restaurant": "Restaurant",
      "cafe": "Café",
      "bar": "Bar",
      "fast_food": "Fast food",
      "pub": "Pub",
      "pharmacy": "Pharmacie",
      "hospital": "Hôpital",
      "school": "École",
      "bank": "Banque",
      "parking": "Parking"
      // Ajoutez d'autres mappings selon vos besoins
    };
    return amenityMap[tags.amenity] || `Amenity: ${tags.amenity}`;
  }
  
  // Pour les autres types de tags
  if (tags.shop) return `Magasin: ${tags.shop}`;
  if (tags.leisure) return `Loisir: ${tags.leisure}`;
  if (tags.tourism) return `Tourisme: ${tags.tourism}`;
  if (tags.healthcare) return `Santé: ${tags.healthcare}`;
  if (tags.public_transport) return `Transport: ${tags.public_transport}`;
  if (tags.office) return `Bureau: ${tags.office}`;
  
  return "Point d'intérêt";
}

// Fonction pour obtenir le nom de la catégorie en français
function getFriendlyCategoryName(category) {
  const categoryMap = {
    'public_transport': 'Transports',
    'amenity': 'Services',
    'shop': 'Commerces',
    'leisure': 'Loisirs',
    'tourism': 'Tourisme',
    'healthcare': 'Santé',
    'office': 'Bureau de poste'
  };
  
  return categoryMap[category] || category;
}

// Fonction pour regrouper les commodités par type
function groupAmenities(elements) {
  const groups = {};
  
  elements.forEach(el => {
    const type = getAmenityType(el.tags || {});
    if (!groups[type]) {
      groups[type] = { count: 0, elements: [] };
    }
    groups[type].count++;
    groups[type].elements.push(el);
  });
  
  return Object.entries(groups)
    .sort((a, b) => b[1].count - a[1].count)
    .map(([type, data]) => ({ type, count: data.count }));
}

async function getCoordinatesFromAddress(address, token) {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${token}`);
    
    if (!response.ok) {
      throw new Error(`Erreur lors de la géolocalisation: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      console.log("Coordonnées trouvées pour", address, ":", data.features[0].center);
      return data.features[0].center;
    } else {
      console.warn("Aucun résultat trouvé pour l'adresse:", address);
      return null;
    }
  } catch (error) {
    console.error("Erreur lors de la géolocalisation de l'adresse:", error);
    return null;
  }
}

function updateHTML(categorie, name, distance) {
  // Get all amenities-category divs
  const categoryDivs = document.querySelectorAll('.amenities-category');
  
  // Loop through each div
  categoryDivs.forEach(div => {
    // Find the category element within this div
    const categoryElement = div.querySelector('.categorie');
    
    // If the category matches the provided category
    if (categoryElement && categoryElement.textContent === categorie) {
      // Check if this name already exists in any of the 3 items
      const nameElements = div.querySelectorAll('.amenities-name');
      let updated = false;
      
      // First, check if this amenity already exists to update it
      for (let i = 0; i < nameElements.length; i++) {
        if (nameElements[i].textContent === name) {
          // Update the corresponding distance
          const parentItem = nameElements[i].closest('.amenities-item');
          if (parentItem) {
            const distanceElement = parentItem.querySelector('.amenities-distance');
            if (distanceElement) {
              distanceElement.textContent = distance;
            }
          }
          updated = true;
          break;
        }
      }
      
      // If not found, find an empty slot to add the new amenity
      if (!updated) {
        // Get all item containers for this category
        const amenitiesItems = div.querySelectorAll('.amenities-item');
        
        // Find the first empty item
        for (let i = 0; i < amenitiesItems.length; i++) {
          const nameElement = amenitiesItems[i].querySelector('.amenities-name');
          
          // Check if this slot is empty
          if (nameElement && (!nameElement.textContent || nameElement.textContent.trim() === '')) {
            // Update name and distance
            nameElement.textContent = name;
            
            const distanceElement = amenitiesItems[i].querySelector('.amenities-distance');
            if (distanceElement) {
              distanceElement.textContent = distance;
            }
            
            updated = true;
            break;
          }
        }
      }
    }
  });
}

// On conserve une liste globale de marqueurs pour pouvoir les retirer
let amenityMarkers = [];
async function updateMapCenter(coordinates) {
  if (!map || !coordinates) {
    console.error("Carte ou coordonnées non disponibles");
    return;
  }

  console.log("Mise à jour du centre de la carte vers:", coordinates);

  try {
    map.flyTo({
      center: coordinates,
      zoom: 15, // Zoom un peu plus prononcé pour voir les détails
      essential: true
    });

    // Supprimer les marqueurs existants
    amenityMarkers.forEach(m => m.remove());
    amenityMarkers = [];

    // Ajouter un marqueur principal pour l'emplacement recherché
    new mapboxgl.Marker({ color: "#3FB1CE" })
      .setLngLat(coordinates)
      .addTo(map);

    // Récupérer les commodités par catégorie
    console.log("Récupération des commodités...");
    const nearbyAmenities = await getNearbyAmenities(coordinates);
    console.log(`${nearbyAmenities.length} commodités trouvées`);

    if (nearbyAmenities.length > 0) {
      // Parcourir chaque commodité trouvée
      nearbyAmenities.forEach((el, index) => {
        // Déterminer la catégorie et le nom convivial
        const category = getFriendlyCategoryName(el.category);
        
      
        
        const name = getFriendlyName(el.tags || {});
        const distance = el.distance < 1000
          ? `${Math.round(el.distance)} m`
          : `${(el.distance / 1000).toFixed(1)} km`;
        console.log(`Catégorie: ${category}, Nom: ${getFriendlyName(el.tags || {})}, Distance : ${distance}`);
        updateHTML(category, getFriendlyName(el.tags || {}), distance)

        // Trouver la balise correspondante dans le DOM
        const categoryElement = document.querySelector(`#category-${el.category}`);
        if (categoryElement) {
          const nameElement = categoryElement.querySelector(`.amenities-item:nth-child(${index + 1}) .amenities-name`);
          const distanceElement = categoryElement.querySelector(`.amenities-item:nth-child(${index + 1}) .amenities-distance`);

          if (nameElement && distanceElement) {
            // Remplir les balises avec les données
            nameElement.textContent = name;
            distanceElement.textContent = distance;
          }
        }
      });

      // Afficher les marqueurs pour toutes les commodités trouvées
      nearbyAmenities.forEach(el => {
        const elLat = el.center ? el.center.lat : el.lat;
        const elLon = el.center ? el.center.lon : el.lon;

        if (!elLat || !elLon) return;

        const color = CATEGORY_COLORS[el.category] || "#FF7E00";

        const marker = new mapboxgl.Marker({ color })
          .setLngLat([elLon, elLat])
          .setPopup(new mapboxgl.Popup().setHTML(
            `<strong>${getFriendlyName(el.tags || {})}</strong><br>
             <span style="color:#666">Catégorie: ${getFriendlyCategoryName(el.category)}</span><br>
             Distance: ${el.distance < 1000
                ? `${Math.round(el.distance)} m`
                : `${(el.distance / 1000).toFixed(1)} km`}`
          ))
          .addTo(map);

        amenityMarkers.push(marker);
      });

      console.log(`${amenityMarkers.length} marqueurs ajoutés sur la carte`);
    } else {
      console.warn("Aucune commodité trouvée dans la zone");
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML("<strong>Aucune commodité trouvée dans cette zone</strong>")
        .addTo(map);
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la carte:", error);
  }
}


// Ajout d'un debounce pour éviter de faire trop de requêtes
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Éviter de faire des recherches à chaque caractère
const debouncedProcessAddress = debounce(async (address) => {
  if (address.length < 3) return; // Ne pas rechercher pour des entrées trop courtes
  
  console.log("Traitement de l'adresse (debounced):", address);
  const token = await fetchMapboxToken();
  const coordinates = await getCoordinatesFromAddress(address, token);
  if (coordinates) {
    updateMapCenter(coordinates);
  }
}, 800); // Attendre 800ms après la dernière frappe

function watchAddressChanges() {
  // Sélectionner l'élément qui contient l'adresse
  const addressElement = document.querySelector('#Address');
  
  if (!addressElement) {
    console.error("L'élément #Address n'a pas été trouvé dans le DOM");
    return;
  }
  
  // Vérifier aussi les événements de saisie pour les champs de formulaire
  addressElement.addEventListener('input', () => {
    const address = addressElement.value || addressElement.textContent;
    if (address && address.trim() !== '') {
      debouncedProcessAddress(address);
    }
  });
  
  // Vérifier également les événements change
  addressElement.addEventListener('change', () => {
    const address = addressElement.value || addressElement.textContent;
    if (address && address.trim() !== '') {
      processAddress(address);
    }
  });
}

// Fonction pour traiter une adresse complète
async function processAddress(address) {
  console.log("Traitement de l'adresse complète:", address);
  const token = await fetchMapboxToken();
  const coordinates = await getCoordinatesFromAddress(address, token);
  if (coordinates) {
    updateMapCenter(coordinates);
  }
}

// Fonction pour initialiser la carte
async function initializeMap() {
  try {
    const token = await fetchMapboxToken();
    if (!window.mapboxgl) {
      console.error("Mapbox GL JS n'est pas chargé. Assurez-vous d'inclure la bibliothèque Mapbox GL JS.");
      return;
    }
    
    window.mapboxgl.accessToken = token;
    
    const mapContainer = document.querySelector('.Map2');
    
    if (!mapContainer) {
      console.error("L'élément avec la classe .Map2 n'a pas été trouvé dans le DOM.");
      return;
    }
    
    map = new window.mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11', // Style par défaut
      center: [2.3522, 48.8566], // Coordonnées par défaut (Paris)
      zoom: 12 // Niveau de zoom par défaut
    });
    
    map.addControl(new window.mapboxgl.NavigationControl());
    
    map.on('load', () => {
      console.log('Carte Mapbox chargée avec succès');
      // Commencer à surveiller les changements d'adresse une fois la carte chargée
      watchAddressChanges();
      
      // Fonction pour tester manuellement la recherche de commodités
      window.testAmenities = async (address) => {
        if (address) {
          processAddress(address);
        } else {
          // Paris comme exemple
          updateMapCenter([2.3522, 48.8566]);
        }
      };
      
      // Ajouter une légende pour les couleurs des catégories
      const legendHTML = `
        <div class="map-legend" style="
          position: absolute;
          bottom: 30px;
          right: 10px;
          background: white;
          padding: 10px;
          border-radius: 4px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          font-size: 12px;
          max-width: 200px;
        ">
          <h4 style="margin-top: 0; margin-bottom: 8px; font-size: 14px;">Légende</h4>
          ${Object.entries(CATEGORY_COLORS).map(([category, color]) => `
            <div style="display: flex; align-items: center; margin-bottom: 4px;">
              <span style="
                display: inline-block;
                width: 12px;
                height: 12px;
                background-color: ${color};
                margin-right: 6px;
                border-radius: 50%;
              "></span>
              <span>${getFriendlyCategoryName(category)}</span>
            </div>
          `).join('')}
          <div style="display: flex; align-items: center; margin-bottom: 4px;">
            <span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              background-color: #3FB1CE;
              margin-right: 6px;
              border-radius: 50%;
            "></span>
            <span>Votre position</span>
          </div>
        </div>
      `;
      
      const legendContainer = document.createElement('div');
      legendContainer.innerHTML = legendHTML;
      mapContainer.appendChild(legendContainer.firstElementChild);
    });
    
    map.on('error', (e) => {
      console.error('Erreur lors du chargement de la carte Mapbox:', e);
    });
    
    return map;
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la carte:', error);
  }
}

// Initialiser la carte
initializeMap();