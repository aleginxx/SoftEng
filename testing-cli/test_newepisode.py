import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

class TestUploadTitleEpisode:

    @pytest.mark.parametrize("file_content, expected_status, expected_message", [
        pytest.param("valid_file_content", 401, "Constraint violation", marks=pytest.mark.xfail),        
        ("valid_file_content", 200, "File uploaded successfully"),
        pytest.param("valid_file_content", 400, "Duplicate entry", marks=pytest.mark.xfail),
        pytest.param("invalid_file_content", 400, "Only TSV files are allowed", marks=pytest.mark.xfail),  
        pytest.param("invalid_file_content", 500, "Bad Request", marks=pytest.mark.xfail),
        pytest.param("valid_file_content", 500, "Internal service error", marks=pytest.mark.xfail),
        pytest.param("valid_file_content", 401, "Not Authorized", marks=pytest.mark.xfail),
    ])

    def test_upload_titleepisode_endpoint(self, file_content, expected_status, expected_message):
        endpoint = f"{BASE_URL}admin/upload/titleepisode"

        files = {'file': ('dummy_file.tsv', file_content)}

        response = requests.post(endpoint, files=files)

        assert response.status_code == expected_status

        if expected_status == 200:
            assert response.headers['Content-Type'].startswith('application/json')
            data = response.json()
            assert data.get('message') == expected_message
        else:
            error_data = response.json()
            assert error_data.get('error') == expected_message
    
        print(response.content.decode())

if __name__ == "__main__":
    commands = [
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv"',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv"',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv" --format csv',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/README.md" --format csv',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv" --format csv',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv" --format csv --host "non-localhost"',
        'python ../../softeng23-16/cli-client/src/se2316.py newepisode --filename "../../softeng23-16/api/truncated_title.episode.tsv" --format csv --user "incorrect_user" --password "incorrect_password"'
    ]

    for command in commands:
        print(f"Executing command: {command}")
        process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        print(f"Command output:\n{process.stdout}\n")
        print(f"Command errors:\n{process.stderr}\n")
