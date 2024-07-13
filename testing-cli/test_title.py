import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

@pytest.mark.parametrize("title_id, expected_status", [
    ("tt0000929", 200),
    ("tt0000977", 200),
    pytest.param("abc", 404, marks=pytest.mark.xfail),
    pytest.param("123", 404, marks=pytest.mark.xfail),
    pytest.param("", 400, marks=pytest.mark.xfail),
])

def test_get_title_endpoint(title_id, expected_status):
    endpoint = f"{BASE_URL}title/{title_id}"

    response = requests.get(endpoint)

    assert response.status_code == expected_status

    if response.status_code == 200:
        assert response.headers['Content-Type'].startswith('application/json')

        data = response.json()
        assert 'titleID' in data
        assert 'type' in data
        assert 'originalTitle' in data
        assert 'titlePoster' in data
        assert 'startYear' in data
        assert 'endYear' in data
        assert 'genres' in data
        assert 'titleAkas' in data
        assert 'principals' in data
        assert 'rating' in data
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
        'python ../../softeng23-16/cli-client/src/se2316.py title --titleID "tt0000929" --fromat csv',
        'python ../../softeng23-16/cli-client/src/se2316.py title --titleID "tt0000977"',
        'python ../../softeng23-16/cli-client/src/se2316.py title --titleID "abc" --format csv',
        'python ../../softeng23-16/cli-client/src/se2316.py title --titleID "123"',
        'python ../../softeng23-16/cli-client/src/se2316.py title --titleID ""'
    ]

    for command in commands:
        print(f"Executing command: {command}")
        process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        print(f"Command output:\n{process.stdout}\n")
        print(f"Command errors:\n{process.stderr}\n")
