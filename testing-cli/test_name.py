import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

@pytest.mark.parametrize("name_id, expected_status", [
    ("nm0000019", 200),  
    pytest.param("abc", 404, marks=pytest.mark.xfail),
    pytest.param("123", 404, marks=pytest.mark.xfail),
    ("nm0000085", 200),
    pytest.param("", 400, marks=pytest.mark.xfail),
])

def test_get_name_endpoint(name_id, expected_status):
    endpoint = f"{BASE_URL}name/{name_id}"

    response = requests.get(endpoint)

    assert response.status_code == expected_status

    if expected_status == 200:
        assert response.headers['Content-Type'].startswith('application/json')
        data = response.json()
        assert 'nameID' in data
        assert 'name' in data
        assert 'namePoster' in data
        assert 'birthYr' in data
        assert 'deathYr' in data
        assert 'profession' in data
        assert 'nameTitles' in data
    elif response.status_code == 400:  # Handle 400 Bad Request
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status_code == 401:  # Handle 401 Unauthorized
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status_code == 500:  # Handle 500 Internal Server Error
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status.code == 404:  # Handle 404 Not Available
        assert response.headers['Content-Type'].startswith('application/json')
    else:
        pass

if __name__ == "__main__":
    commands = [
        'python ../../softeng23-16/cli-client/src/se2316.py name --nameID "nm0000019" --fromat csv',
        'python ../../softeng23-16/cli-client/src/se2316.py name --nameID "nm0000085"',
        'python ../../softeng23-16/cli-client/src/se2316.py name --nameID "abc"',
        'python ../../softeng23-16/cli-client/src/se2316.py name --nameID "123" --fromat csv',
        'python ../../softeng23-16/cli-client/src/se2316.py name --nameID ""'
    ]

    for command in commands:
        print(f"Executing command: {command}")
        process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        print(f"Command output:\n{process.stdout}\n")
        print(f"Command errors:\n{process.stderr}\n")

