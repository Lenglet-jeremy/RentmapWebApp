import os
import requests
from getpass import getpass

json_folder = "../Data"
upload_url = "https://rentmapwebapp.onrender.com/upload-json"
password = getpass("Entrez le mot de passe d’upload : ")

for root, dirs, files in os.walk(json_folder):
    for filename in files:
        if filename.endswith(".json"):
            filepath = os.path.join(root, filename)

            # Chemin relatif à partir de json_folder (ex: "Ille-et-Vilaine/Rennes.json")
            relative_path = os.path.relpath(filepath, json_folder)

            with open(filepath, "rb") as f:
                files_data = {'file': (relative_path, f, 'application/json')}
                data = {'filename': relative_path}
                headers = {'x-upload-password': password}

                try:
                    response = requests.post(upload_url, files=files_data, data=data, headers=headers)
                    print(f"{relative_path}: {response.status_code} - {response.json().get('message')}")
                except Exception as e:
                    print(f"Erreur lors de l’envoi de {relative_path} :", e)
