import os
import requests
from getpass import getpass

# 📁 Dossier contenant les JSON
json_folder = "../Data"

# 🌐 URL de ton backend
upload_url = "https://rentmapwebapp.onrender.com/upload-json"  # à adapter si besoin

# 🔐 Demande du mot de passe
password = getpass("Entrez le mot de passe d’upload : ")

# 🔁 Parcours tous les fichiers JSON du dossier
for filename in os.listdir(json_folder):
    if filename.endswith(".json"):
        filepath = os.path.join(json_folder, filename)
        
        with open(filepath, "rb") as f:
            files = {'file': (filename, f, 'application/json')}
            data = {'filename': filename}
            headers = {'x-upload-password': password}

            try:
                response = requests.post(upload_url, files=files, data=data, headers=headers)
                print(f"{filename}: {response.status_code} - {response.json().get('message')}")
            except Exception as e:
                print(f"Erreur lors de l’envoi de {filename} :", e)
