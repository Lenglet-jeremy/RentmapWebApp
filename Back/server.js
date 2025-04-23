const express = require("express");
const cors = require("cors");
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const isRender = process.env.RENDER === "true";
const dataRoot = isRender ? "/Data" : path.resolve(__dirname, "../Data");

const dataFolder = dataRoot;
const DVFDataFolder = path.join(dataRoot, "DVF");
const citiesDescriptionFolder = isRender
  ? "/Data"
  : path.resolve(__dirname, "../../RentabiliteBiensDistance/Description villes/gpt-4");


const app = express();
const https = require('https');

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://rentmapwebapp.onrender.com/', 'http://127.0.0.1:5000', 'rentmapwebapp.onrender.com'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
};

app.use(cors(corsOptions));

app.use(express.static('public'));
app.use(express.static(path.join(__dirname, "../Front")));

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur le port ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../Front", "index.html"));
});

app.get("/api/dvf", async (req, res) => {
  const { lat, lon, dist = 500 } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude et longitude sont obligatoires." });
  }
  const url = `https://api.cquest.org/dvf?lat=${lat}&lon=${lon}&dist=${dist}`;
  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.json(parsed);
      } catch (e) {
        console.error("Erreur de parsing de la réponse DVF :", e);
        res.status(500).json({ error: "Erreur lors du parsing de la réponse DVF." });
      }
    });
  }).on('error', (err) => {
    console.error("Erreur lors de la requête à api.cquest.org :", err);
    res.status(500).json({ error: "Erreur lors de la requête à api.cquest.org" });
  });
});

app.get('/data', (req, res) => {
  res.json({
    years: ['2018', '2019', '2020', '2021', '2022'],
    prices: [3200, 3400, 3600, 3800, 4000]
  });
});


function readAllJsonFilesWithPattern(directory, pattern) {

  try {
    const files = fs.readdirSync(directory);

    const results = {};
    const filteredFiles = files.filter(file => file.includes(pattern) && file.endsWith('.json'));

    filteredFiles.forEach(file => {
      const filePath = path.join(directory, file);

      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        results[file] = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Erreur lors du parsing du fichier ${file}:`, error);
      }
    });
    return results;
  } catch (error) {
    console.error(`Erreur lors de l'accès au répertoire ${directory}:`, error);
    throw error;
  }
}


app.get("/api/Refined", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Refined.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/Rentabilite", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Rentabilite.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/TauxHabitationVacants", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "TauxHabitationVacants.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/TensionLocative", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "TensionLocative.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/run-python", (req, res) => {
  const city = req.query.city || "Rennes";
  console.log("Ville reçue du frontend :", city);
  if (city !== "Coordonnées non disponibles") {
    console.log("Exécution du fichier python");
    const pythonProcess = spawn("python", [path.join(__dirname, "APIChatGPTDescriptionVille.py"), city]);
    let dataString = "";
    pythonProcess.stdout.on("data", (data) => {
      dataString += data.toString();
    });
    pythonProcess.stderr.on("data", (data) => {
      console.error(`Erreur : ${data}`);
    });
    pythonProcess.on("close", () => {
      try {
        const result = JSON.parse(dataString.trim());
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération de la description." });
      }
    });
  }
});

app.get("/api/mapbox-token", (req, res) => {
  res.json({ accessToken: process.env.MAPBOX_TOKEN });
});

app.get("/api/departements", (req, res) => {
  const filePath = path.join(__dirname, "public", "departements.geojson");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier GeoJSON :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération du fichier GeoJSON." });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/api/communes", (req, res) => {
  const filePath = path.join(__dirname, "public", "communes-5m.geojson");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier GeoJSON :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération du fichier GeoJSON." });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});

app.get("/api/quartiers", (req, res) => {
  const filePath = path.join(__dirname, "public", "iris.geojson");
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur de lecture du fichier GeoJSON :", err);
      return res.status(500).json({ error: "Erreur lors de la récupération du fichier GeoJSON." });
    }
    res.setHeader("Content-Type", "application/json");
    res.send(data);
  });
});


app.get("/api/autocomplete", async (req, res) => {
  const query = req.query.query;
  if (!query) return res.status(400).json({ error: "Query parameter is required" });
  
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.MAPBOX_TOKEN}&autocomplete=true&types=address&limit=5&country=fr&bbox=-5.1,41.3,9.7,51.1`;

  https.get(url, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => {
      data += chunk;
    });
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        res.json(parsed);
      } catch (e) {
        console.error("Erreur de parsing de la réponse Mapbox :", e);
        res.status(500).json({ error: "Erreur lors du parsing de la réponse Mapbox." });
      }
    });
  }).on('error', (err) => {
    console.error("Erreur lors de la requête à Mapbox :", err);
    res.status(500).json({ error: "Erreur lors de la requête à Mapbox" });
  });
});

app.get("/api/OwnerShare", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "OwnerTenantShare.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/MedianIncome", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "MedianIncome.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/PopulationDensity", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "PopulationDensity.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/Unemployed", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Unemployed.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/CitiesDescription", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(citiesDescriptionFolder, "DescriptionVille.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/InternetConnection", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "InternetConnection.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/LoiLittoral", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "LoiLittoral.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/Montagnes", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Montagnes.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/StatsNationnale", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Criminalites.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/ClimatVilles", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "ClimatVille.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/Urbanisme", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "Urbanisme.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/GrandsAxes", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "GrandsAxes.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const UPLOAD_PASSWORD = process.env.UPLOAD_PASSWORD;
app.post("/upload-json", upload.single("file"), (req, res) => {
  const password = req.headers["x-upload-password"];
  if (password !== UPLOAD_PASSWORD) {
    return res.status(403).json({ message: "Mot de passe invalide." });
  }

  if (!req.file || !req.body.filename) {
    return res.status(400).json({ message: "Fichier ou nom de fichier manquant." });
  }

  const destinationPath = path.join(dataFolder, req.body.filename);
  fs.writeFile(destinationPath, req.file.buffer, (err) => {
    if (err) {
      console.error("Erreur lors de l’écriture du fichier :", err);
      return res.status(500).json({ message: "Erreur lors de l’écriture du fichier." });
    }
    res.json({ message: `Fichier ${req.body.filename} sauvegardé avec succès.` });
  });
});


app.get("/api/EvolPop", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "EvolPop.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/EvolPrixImmo", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "EvolPrixImmo.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/EvolPrixMCarre", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "EvolPrixMCarre.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/EvolSurface", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "EvolSurface.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});

app.get("/api/SecuriteCriminalite", (req, res) => {
  try {
    const allJsonData = readAllJsonFilesWithPattern(dataFolder, "SecuriteCriminalite.json");
    res.json(allJsonData);
  } catch (error) {
    console.error("Erreur lors de la lecture des fichiers JSON :", error);
    res.status(500).json({ error: "Erreur lors de la récupération des données JSON." });
  }
});