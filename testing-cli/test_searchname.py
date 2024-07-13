import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

@pytest.mark.parametrize("name_part, expected_status", [
    ("Fed", 200),
    ("Pad", 200),
     pytest.param("Zoe Genakos", 204, marks=pytest.mark.xfail),
    pytest.param("@#$%^&", 204, marks=pytest.mark.xfail),
    pytest.param("", 400, marks=pytest.mark.xfail),
])
def test_search_name_endpoint(name_part, expected_status):
    endpoint = f"{BASE_URL}searchname"
    request_data = {"namePart": name_part}

    response = requests.get(endpoint, json=request_data)  

    assert response.status_code == expected_status

    if expected_status == 200:
        assert response.headers['Content-Type'].startswith('application/json')
        data = response.json()
        assert isinstance(data, list)
    elif response.status_code == 400:  # Handle 400 Bad Request
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status_code == 401:  # Handle 401 Unauthorized
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status_code == 500:  # Handle 500 Internal Server Error
        assert response.headers['Content-Type'].startswith('application/json')
    elif response.status.code == 404:  # Handle 404 Not Available
        assert response.headers['Content-Type'].startswith('application/json')
    else :
        pass
    
    print(response.content.decode())
