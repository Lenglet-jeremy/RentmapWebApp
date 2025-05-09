// Map.js

export const amenityConfig = {
    'default': { display: true, color: '#000000' },
    'townhall': { display: false, color: '#478295' },
    'restaurant': { display: false, color: '#FF0000' }, // Rouge
    'cafe': { display: false, color: '#00FF00' },       // Vert
    'bar': { display: false, color: '#0000FF' },        // Bleu
    'fast_food': { display: false, color: '#FFA500' },  // Orange
    'pub': { display: false, color: '#800080' },        // Violet
    'hotel': { display: false, color: '#FFFF00' },      // Jaune
    'motel': { display: false, color: '#808080' },      // Gris (non affiché)
    'guest_house': { display: false, color: '#FFC0CB' }, // Rose
    'bakery': { display: false, color: '#FF69B4' },     // Rose foncé
    'convenience': { display: false, color: '#008000' }, // Vert foncé
    'supermarket': { display: false, color: '#00FFFF' }, // Cyan
    'pharmacy': { display: false, color: '#FF1493' },    // Rose vif
    'hospital': { display: false, color: '#DC143C' },   // Cramoisi
    'clinic': { display: false, color: '#B22222' },     // Rouge brique
    'dentist': { display: false, color: '#FF4500' },    // Orange foncé
    'doctors': { display: false, color: '#FF6347' },    // Tomato
    'school': { display: false, color: '#8B4513' },     // Brun
    'university': { display: false, color: '#FFD700' },  // Or
    'college': { display: false, color: '#DAA520' },    // Or foncé
    'prep_school': { display: false, color: '#CD853F' }, // Peru
    'library': { display: false, color: '#DAA520' },     // Or foncé
    'museum': { display: false, color: '#800000' },     // Marron
    'theatre': { display: false, color: '#A52A2A' },    // Brun foncé
    'cinema': { display: false, color: '#DEB887' },     // Brun clair
    'fuel': { display: false, color: '#5F9EA0' },       // Bleu-vert
    'parking': { display: false, color: '#778899' },    // Gris-bleu
    'parking_space': { display: false, color: '#696969' }, // Gris foncé
    'bicycle_parking': { display: false, color: '#1E90FF' }, // Bleu dodger
    'motorcycle_parking': { display: false, color: '#87CEEB' }, // Bleu ciel
    'parking_entrance': { display: false, color: '#6495ED' }, // Bleu ciel foncé
    'ferry_terminal': { display: false, color: '#00BFFF' }, // Deep Sky Blue
    'bank': { display: false, color: '#B0C4DE' },       // Bleu clair
    'atm': { display: false, color: '#ADD8E6' },        // Bleu très clair
    'post_office': { display: false, color: '#F0E68C' }, // Khaki
    'post_box': { display: false, color: '#FF4500' },   // Orange foncé
    'park': { display: false, color: '#E6E6FA' },       // Lavande
    'garden': { display: false, color: '#FFF0F5' },     // Lavande clair
    'playground': { display: false, color: '#FFE4E1' }, // Rose pâle
    'sports_centre': { display: false, color: '#D8BFD8' }, // Violet clair
    'subway_entrance': { display: false, color: '#DDA0DD' }, // Prune
    'bus_stop': { display: false, color: '#EE82EE' },    // Violet
    'train_station': { display: false, color: '#DA70D6' }, // Orchidée
    'aerodrome': { display: false, color: '#BA55D3' },   // Violet moyen
    'shopping_centre': { display: false, color: '#9370DB' }, // Violet foncé
    'toilets': { display: false, color: '#8A2BE2' },     // Bleu-violet
    'drinking_water': { display: false, color: '#5F9EA0' }, // Bleu-vert
    'charging_station': { display: false, color: '#7FFFD4' }, // Aigue-marine
    'bureau_de_change': { display: false, color: '#40E0D0' }, // Turquoise
    'community_centre': { display: false, color: '#6495ED' }, // Bleu ciel
    'fountain': { display: false, color: '#00CED1' },     // Turquoise foncé
    'bench': { display: false, color: '#2E8B57' },       // Vert mer
    'clock': { display: false, color: '#FFD700' },      // Or
    'waste_basket': { display: false, color: '#8B4513' }, // Brun
    'bicycle_rental': { display: false, color: '#1E90FF' }, // Bleu dodger
    'taxi': { display: false, color: '#FFFF00' },        // Jaune
    'ice_cream': { display: false, color: '#FFB6C1' },  // Rose clair
    'recycling': { display: false, color: '#2E8B57' },  // Vert mer
    'public_bookcase': { display: false, color: '#8B4513' }, // Brun
    'monastery': { display: false, color: '#A9A9A9' },  // Gris foncé
    'bicycle_repair_station': { display: false, color: '#FF4500' }, // Orange foncé
    'nightclub': { display: false, color: '#4B0082' },  // Indigo
    'car_sharing': { display: false, color: '#FF6347' }, // Tomato
    'vending_machine': { display: false, color: '#D2691E' }, // Chocolat
    'shower': { display: false, color: '#1E90FF' }, // Bleu dodger
    'place_of_worship': { display: false, color: '#8A2BE2' }, // Bleu-violet
    'waste_disposal': { display: false, color: '#8B4513' }, // Brun
    'marketplace': { display: false, color: '#FFD700' }, // Or
    'water_point': { display: false, color: '#00CED1' }, // Turquoise foncé
    'social_facility': { display: false, color: '#FF6347' }, // Tomato
    'shelter': { display: false, color: '#FF4500' }, // Orange foncé
    'childcare': { display: false, color: '#FFB6C1' }, // Rose clair
    'device_charging_station': { display: false, color: '#7FFFD4' }, // Aigue-marine
    'parcel_locker': { display: false, color: '#6495ED' }, // Bleu ciel foncé
    'handwashing': { display: false, color: '#00CED1' }, // Turquoise foncé
    'photo_booth': { display: false, color: '#FFD700' }, // Or
    'ticket_validator': { display: false, color: '#FF4500' }, // Orange foncé
    'dojo': { display: false, color: '#FF4500' }, // Orange foncé
    'veterinary': { display: false, color: '#2E8B57' }, // Vert mer
    'food_court': { display: false, color: '#FFD700' }, // Or
    'social_centre': { display: false, color: '#FF6347' }, // Tomato
    'car_wash': { display: false, color: '#1E90FF' }, // Bleu dodger
    'kindergarten': { display: false, color: '#FFB6C1' }, // Rose clair
    'weighbridge': { display: false, color: '#A9A9A9' }, // Gris foncé
    'music_school': { display: false, color: '#FFD700' }, // Or
    'police': { display: false, color: '#1E90FF' }, // Bleu dodger
    'compressed_air': { display: false, color: '#B0E0E6' }, // Bleu très clair
    'driving_school': { display: false, color: '#FF4500' }, // Orange foncé
    'arts_centre': { display: false, color: '#FF69B4' }, // Rose foncé
    'personal_service': { display: false, color: '#FFDAB9' }, // Peach puff
    'grit_bin': { display: false, color: '#8B4513' }, // Brun
    'coworking_space': { display: false, color: '#D2B48C' }, // Tan
    'default': { display: false, color: '#888888' },     // Gris par défaut
    'vacuum_cleaner': { display: false, color: '#A9A9A9' }, // Gris foncé
    'art_school': { display: false, color: '#FFD700' }, // Or
    'language_school': { display: false, color: '#FF4500' }, // Orange foncé
    'events_venue': { display: false, color: '#FF69B4' }, // Rose foncé
    'courthouse': { display: false, color: '#8B4513' }, // Brun
    'money_transfer': { display: false, color: '#2E8B57' }, // Vert mer
};

export const amenityTranslations = {
    'hospital': 'Hôpital',
    'dentist': 'Dentiste',
    'doctors': 'Médecins',
    'cafe': 'Café',
    'pub': 'Pub',
    'bar': 'Bar',
    'nightclub': 'Boîte de nuit',
    'prep_school': 'École préparatoire',
    'university': 'Université',
    'school': 'École',
    'college': 'Collège',
    'music_school': 'École de musique',
    'art_school': 'École d\'art',
    'driving_school': 'Auto-école',
    'language_school': 'École de langues',
    'theatre': 'Théâtre',
    'playground': 'Aire de jeux',
    'parking': 'Parking',
    'motorcycle_parking': 'Parking moto',
    'bus_stop': 'Arrêt de bus',
    'subway_entrance': 'Entrée de métro',
    'aerodrome': 'Aérodrome',
    'taxi': 'Taxi',
    'shopping_centre': 'Centre commercial',
    'convenience': 'Supérette',
    'bakery': 'Boulangerie',
    'supermarket': 'Super marché',
    'ice_cream': 'Glacier',
    'fast_food': 'Fast-food',
    'restaurant': 'Restaurant',
    'dojo': 'Dojo',
    'sports_centre': 'Centre sportif',
    'social_centre': 'Centre social',
    'social_facility': 'Établissement social',
    'library': 'Bibliothèque',
    'cinema': 'Cinéma',
    'museum': 'Musée',
    'arts_centre': 'Centre d\'arts',
    'parking_entrance': 'Entrée de parking',
    'parking_space': 'Place de parking',
    'fuel': 'Station-service',
    'charging_station': 'Station de recharge',
    'ferry_terminal': 'Terminal de ferry',
    'coworking_space': 'Espace de coworking',
    'veterinary': 'Vétérinaire',
    'courthouse': 'Tribunal',
    'hotel': 'Hôtel',
    'motel': 'Motel',
    'post_office': 'Bureau de poste',
    'public_bookcase': 'Bibliothèque publique',
    'waste_disposal': 'Déchetterie',
    'police': 'Police',
    'park': 'Parc',
    'garden': 'Jardin',
    'pharmacy': 'Pharmacie',
    'clinic': 'Clinique',
    'bank': 'Banque',
    'train_station': 'Gare',
    'railway': 'Gare',
    'bicycle_rental': 'Location de vélos',
    'childcare': 'Garde d\'enfants',
    'townhall': 'Mairie',
};

export const amenityGroups = {
    "Services de santé" : ["dentist", "hospital", "doctors"],
    "Bar" : ["cafe", "pub", "nightclub", "bar"],
    "Etablissements d'enseignement" : ["prep_school", "university", "school", "music_school", "art_school", "driving_school", "college", "language_school"],
    "Loisir" : ["theatre", "playground"],
    "Parking" : ["parking", "motorcycle_parking"],
    "Transport" : ["bus_stop", "subway_entrance", "aerodrome", "taxi", "train_station", "railway"],
    "Commerces" : ["shopping_centre", "convenience", "bakery", "supermarket"],
    "Restaurants" : ["ice_cream", "fast_food", "restaurant"],
    "Infrastructure sportive" : ["dojo", "sports_centre"],
    "Centre social" : ["social_centre", "social_facility"],
    "Activités culturelle" : ["library", "cinema", "museum", "arts_centre"],
    "Stationnement" : ["parking_space", "parking_entrance"],
    "Utilitaires" : ["fuel", "charging_station", "ferry_terminal", "coworking_space"],
    "Services pour animaux" : ["veterinary"],
    "Justice" : ["courthouse"],
    "Hostels & hébergement" : ["hotel", "motel"],
    "Services public" : ["post_office", "public_bookcase", "police", "waste_disposal"],
    "Jardin et parc" : ["garden", "park"],
    "Divers" : ["pharmacy", "clinic", "bank", "bicycle_rental", "childcare", "townhall"]
};

export let lastValidLat = 50.523110;
export let lastValidLon = 2.625950;
export let lastAddress = "";

export let radiusValue = parseInt(document.getElementById('radius')?.value || defaultRadius / 1000) * 1000;
export let limitValue = parseInt(document.getElementById('amenityLimit')?.value || amenityLimit);

const defaultLatitude = 50.523110;
const defaultLongitude = 2.625950;
const defautKmRadius = 10;
const defaultRadius = defautKmRadius * 1000;
const amenityLimit = 10;

const isProduction = window.location.hostname === 'rentmapwebapp.onrender.com';
const backendUrl = isProduction ? 'https://rentmapwebapp.onrender.com' : 'http://localhost:5000';

let map1;
let centerMarker1;
let markers1 = [];

function getSelectedAmenities() {
    const checkboxes = document.querySelectorAll('#amenityCheckboxes input[type="checkbox"]');
    const selectedAmenities = {};

    checkboxes.forEach(checkbox => {
        selectedAmenities[checkbox.value] = checkbox.checked;
    });

    return selectedAmenities;
}

export async function fetchAmenities(lat, lon, radius, ignoreDisplayConfig = false) {
    try {
        const overpassUrl = `https://overpass-api.de/api/interpreter`;
        const overpassQuery = `
            [out:json];
            (
                node["amenity"](around:${radius},${lat},${lon});
                way["amenity"](around:${radius},${lat},${lon});
                relation["amenity"](around:${radius},${lat},${lon});
                node["shop"](around:${radius},${lat},${lon});
                way["shop"](around:${radius},${lat},${lon});
                relation["shop"](around:${radius},${lat},${lon});
                node["leisure"](around:${radius},${lat},${lon});
                way["leisure"](around:${radius},${lat},${lon});
                relation["leisure"](around:${radius},${lat},${lon});
                node["tourism"](around:${radius},${lat},${lon});
                way["tourism"](around:${radius},${lat},${lon});
                relation["tourism"](around:${radius},${lat},${lon});
                node["healthcare"](around:${radius},${lat},${lon});
                way["healthcare"](around:${radius},${lat},${lon});
                relation["healthcare"](around:${radius},${lat},${lon});
                node["public_transport"](around:${radius},${lat},${lon});
                way["public_transport"](around:${radius},${lat},${lon});
                relation["public_transport"](around:${radius},${lat},${lon});
                node["office"](around:${radius},${lat},${lon});
                way["office"](around:${radius},${lat},${lon});
                relation["office"](around:${radius},${lat},${lon});
            );
            out center;
        `;

        const response = await fetch(overpassUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${encodeURIComponent(overpassQuery)}`
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();

        const elements = data.elements.filter(e => {
            if (ignoreDisplayConfig) return true;
            const amenityType = getAmenityType(e.tags);
            if (amenityConfig[amenityType]) {
                return amenityConfig[amenityType].display;
            }
            return amenityConfig.default.display;
        });

        return elements.map(e => {
            if (e.type === 'node') {
                return {
                    id: e.id,
                    type: e.type,
                    lat: e.lat,
                    lon: e.lon,
                    tags: e.tags
                };
            } else if (e.type === 'way' || e.type === 'relation') {
                return {
                    id: e.id,
                    type: e.type,
                    lat: e.center.lat,
                    lon: e.center.lon,
                    tags: e.tags
                };
            }
            return null;
        }).filter(item => item !== null);
    } catch (error) {
        console.error("Erreur lors de la récupération des commodités:", error);
        return [];
    }
}

function displayAmenitiesOnMap(map, amenities, userLat, userLon, amenityLimit) {
    const selectedAmenities = getSelectedAmenities();
    const sortedAmenities = sortAmenitiesByDistance(amenities, userLat, userLon);

    const processedAmenities = sortedAmenities.map(amenity => {
        const amenityType = getAmenityType(amenity.tags);
        return { ...amenity, type: amenityType };
    });

    const filteredAmenities = processedAmenities.filter(amenity => {
        const amenityConfigItem = amenityConfig[amenity.type] || amenityConfig['default'];
        return selectedAmenities[amenity.type] !== false && amenityConfigItem.display;
    });

    const limitedAmenities = filteredAmenities.slice(0, amenityLimit);

    limitedAmenities.forEach(amenity => {
        if (amenity.lat && amenity.lon) {
            const amenityConfigItem = amenityConfig[amenity.type] || amenityConfig['default'];
            const markerColor = amenityConfigItem.color;
            const amenityName = amenityTranslations[amenity.type] || amenity.type || "Commodité";

            const marker = new mapboxgl.Marker({ color: markerColor })
                .setLngLat([amenity.lon, amenity.lat])
                .setPopup(new mapboxgl.Popup().setText(amenityName))
                .addTo(map);

            markers1.push(marker);
        }
    });
}

export async function fetchMapboxToken() {
    try {
        const response = await fetch(`${backendUrl}/api/mapbox-token`);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }
        const data = await response.json();
        return data.accessToken;
    } catch (error) {
        console.error("Erreur lors de la récupération du token Mapbox :", error);
        return null;
    }
}

export function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function sortAmenitiesByDistance(amenities, userLat, userLon) {
    return amenities.sort((a, b) => {
        const distA = calculateDistance(userLat, userLon, a.lat, a.lon);
        const distB = calculateDistance(userLat, userLon, b.lat, b.lon);
        return distA - distB;
    });
}
export function destroyMap1() {
    if (map1) {
        // Supprimer tous les marqueurs
        markers1.forEach(marker => marker.remove());
        markers1 = [];
        
        // Supprimer les événements liés à la carte
        map1.off();
        
        // Détruire l'instance de la carte
        map1.remove();
        map1 = null;
    }
}

export async function initializeMap1(mapId) {
    const token = await fetchMapboxToken();
    if (!token) {
        console.error("Le token Mapbox est manquant");
        return;
    }

    mapboxgl.accessToken = token;

    // Récupérer les informations sauvegardées
    const savedCenter = JSON.parse(localStorage.getItem('mapCenter'));
    const savedZoom = localStorage.getItem('mapZoom');

    // Initialiser la carte avec les informations sauvegardées ou les valeurs par défaut
    map1 = new mapboxgl.Map({
        container: mapId,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: savedCenter || [defaultLongitude, defaultLatitude],
        zoom: savedZoom || 8
    });

    map1.addControl(new mapboxgl.NavigationControl());

    centerMarker1 = new mapboxgl.Marker()
        .setLngLat(savedCenter || [defaultLongitude, defaultLatitude])
        .addTo(map1);

    map1.on('load', () => {
        map1.addSource('circle-source', {
            type: 'geojson',
            data: createGeoJSONCircle(savedCenter || [defaultLongitude, defaultLatitude], defautKmRadius)
        });

        map1.addLayer({
            id: 'circle-outline',
            type: 'line',
            source: 'circle-source',
            paint: {
                'line-color': '#4080FF',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });

        map1.addLayer({
            id: 'circle-fill',
            type: 'fill',
            source: 'circle-source',
            paint: {
                'fill-color': '#4080FF',
                'fill-opacity': 0.1
            }
        });

        updateMapWithCurrentValues();
    });

    const amenities = await fetchAmenities(savedCenter ? savedCenter[1] : defaultLatitude, savedCenter ? savedCenter[0] : defaultLongitude, defaultRadius);
    displayAmenitiesOnMap(map1, amenities, savedCenter ? savedCenter[1] : defaultLatitude, savedCenter ? savedCenter[0] : defaultLongitude, amenityLimit);
}


function updateMapWithCurrentValues() {
    const addressInput = document.getElementById('Address');

    if (addressInput && addressInput.value.trim() !== "") {
        const currentAddress = addressInput.value.trim();
        if (currentAddress === lastAddress) {
            updateMap1(lastValidLat, lastValidLon, radiusValue, limitValue);
        } else {
            geocodeAddress(currentAddress).then(coordinates => {
                if (coordinates) {
                    const { lat, lon } = coordinates;
                    lastValidLat = lat;
                    lastValidLon = lon;
                    lastAddress = currentAddress;
                    updateMap1(lat, lon, radiusValue, limitValue);
                }
            });
        }
    } else {
        updateMap1(lastValidLat, lastValidLon, radiusValue, limitValue);
    }
}

export async function updateMap1(lat, lon, radius = defaultRadius, amenityLimit = 100) {
    if (!map1) {
        console.error("La carte n'est pas encore initialisée.");
        return;
    }

    const radiusInKm = radius / 1000;
    if (map1.getSource('circle-source')) {
        map1.getSource('circle-source').setData(createGeoJSONCircle([lon, lat], radiusInKm));
    } else {
        map1.addSource('circle-source', {
            type: 'geojson',
            data: createGeoJSONCircle([lon, lat], radiusInKm)
        });

        map1.addLayer({
            id: 'circle-outline',
            type: 'line',
            source: 'circle-source',
            paint: {
                'line-color': '#4080FF',
                'line-width': 2,
                'line-opacity': 0.8
            }
        });

        map1.addLayer({
            id: 'circle-fill',
            type: 'fill',
            source: 'circle-source',
            paint: {
                'fill-color': '#4080FF',
                'fill-opacity': 0.1
            }
        });
    }

    markers1.forEach(marker => marker.remove());
    markers1 = [];

    const amenities = await fetchAmenities(lat, lon, radius);
    displayAmenitiesOnMap(map1, amenities, lat, lon, amenityLimit);
}

function createGeoJSONCircle(center, radiusInKm) {
    const points = 64;
    const coords = { latitude: center[1], longitude: center[0] };
    const km = radiusInKm;
    const ret = [];
    const distanceX = km / (111.320 * Math.cos(coords.latitude * Math.PI / 180));
    const distanceY = km / 110.574;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * (2 * Math.PI);
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        ret.push([coords.longitude + x, coords.latitude + y]);
    }
    ret.push(ret[0]);

    return {
        type: "FeatureCollection",
        features: [{
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [ret]
            }
        }]
    };
}

const radiusInput = document.getElementById('radius');
if (radiusInput) {
    radiusInput.addEventListener('input', updateMapWithCurrentValues);
}

const amenityLimitInput = document.getElementById('amenityLimit');
if (amenityLimitInput) {
    amenityLimitInput.addEventListener('input', updateMapWithCurrentValues);
}

const amenityCheckboxes = document.getElementById('amenityCheckboxes');
if (amenityCheckboxes) {
    amenityCheckboxes.addEventListener('change', updateMapWithCurrentValues);
}

export function getAmenityType(tags) {
    if (tags.railway === 'station' || tags.amenity === 'train_station') {
        return 'train_station';
    }
    return tags.amenity || tags.shop || tags.railway || 'default';
}

export async function geocodeAddress(address) {
    const token = await fetchMapboxToken();
    if (!token) {
        console.error("Le token Mapbox est manquant");
        return null;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}`);
        }

        const data = await response.json();
        if (data.features && data.features.length > 0) {
            const [lon, lat] = data.features[0].center;
            return { lat, lon };
        } else {
            console.error("Aucun résultat trouvé pour l'adresse donnée.");
            return null;
        }
    } catch (error) {
        console.error("Erreur lors du géocodage de l'adresse :", error);
        return null;
    }
}

document.getElementById('Address').addEventListener('blur', async function() {
    const address = this.value.trim();
    if (address === "") {
        return;
    }

    const coordinates = await geocodeAddress(address);
    if (coordinates) {
        const { lat, lon } = coordinates;
        lastValidLat = lat;
        lastValidLon = lon;
        lastAddress = address;

        const radiusValue = parseInt(document.getElementById('radius')?.value || defaultRadius / 1000) * 1000;
        const limitValue = parseInt(document.getElementById('amenityLimit')?.value || amenityLimit);
        updateMap1(lat, lon, radiusValue, limitValue);

        map1.setCenter([lon, lat]);
        centerMarker1.setLngLat([lon, lat]);
    }
});

document.getElementById('Address').addEventListener('keydown', async function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        const address = this.value.trim();
        if (address === "") {
            return;
        }

        const coordinates = await geocodeAddress(address);
        if (coordinates) {
            const { lat, lon } = coordinates;
            lastValidLat = lat;
            lastValidLon = lon;
            lastAddress = address;

            const radiusValue = parseInt(document.getElementById('radius')?.value || defaultRadius / 1000) * 1000;
            const limitValue = parseInt(document.getElementById('amenityLimit')?.value || amenityLimit);
            updateMap1(lat, lon, radiusValue, limitValue);

            map1.setCenter([lon, lat]);
            centerMarker1.setLngLat([lon, lat]);
        }
    }
});

document.getElementById('toggleAmenityList').addEventListener('click', () => {
    const amenityCheckboxes = document.getElementById('amenityCheckboxes');
    const amenityList = document.getElementById('amenityList');

    amenityCheckboxes.innerHTML = '';

    for (const group in amenityGroups) {
        const groupValue = amenityGroups[group];

        if (!Array.isArray(groupValue)) {
            continue;
        }

        const groupLabel = document.createElement('label');
        const groupCheckbox = document.createElement('input');
        groupCheckbox.type = 'checkbox';
        groupCheckbox.value = group;
        groupCheckbox.id = `group-${group.toLowerCase().replace(/ /g, '-')}`;

        let groupIsChecked = false;

        for (const amenity of groupValue) {
            if (amenityConfig[amenity] && amenityConfig[amenity].display) {
                groupIsChecked = true;
                break;
            }
        }

        groupCheckbox.checked = groupIsChecked;

        groupCheckbox.addEventListener('change', function() {
            const isChecked = this.checked;

            groupValue.forEach(amenity => {
                if (amenityConfig[amenity]) {
                    amenityConfig[amenity].display = isChecked;
                } else {
                    console.warn(`  - ${amenity}: non trouvé dans amenityConfig!`);
                }
            });

            updateMapWithCurrentValues();
        });

        groupLabel.appendChild(groupCheckbox);
        groupLabel.appendChild(document.createTextNode(group));
        amenityCheckboxes.appendChild(groupLabel);
        amenityCheckboxes.appendChild(document.createElement('br'));
    }

    if (amenityList.classList.contains('active')) {
        amenityList.classList.add('slide-out');
        setTimeout(() => {
            amenityList.classList.add('hidden');
            amenityList.classList.remove('active', 'slide-out', 'slide-in');
        }, 500);
    } else {
        amenityList.classList.remove('hidden');
        setTimeout(() => {
            amenityList.classList.add('active', 'slide-in');
        }, 0);
    }
});

window.addEventListener('beforeunload', () => {
    if (map1) {
        const center = map1.getCenter();
        const zoom = map1.getZoom();

        localStorage.setItem('mapCenter', JSON.stringify(center));
        localStorage.setItem('mapZoom', zoom);
    }
});


await initializeMap1("Map");
map1.resize()
