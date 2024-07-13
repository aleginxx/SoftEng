import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

@pytest.mark.parametrize("qgenre, minrating, yrFrom, yrTo, expected_status", [
    ("Comedy", 8, None, None, 200),  
    ("Action", 7.8,  None, None, 200),
    ("Action", 6, 1995, None, 200),
    ("Action", 6, 1990, 1995, 200),
    pytest.param("", 5, 2000, 2022, 400, marks=pytest.mark.xfail),
    pytest.param("Comedyy", 8,  None, None, 400, marks=pytest.mark.xfail),
    pytest.param("Action", -8,  None, None, 400, marks=pytest.mark.xfail),
    pytest.param("Western", 18,  None, None, 400, marks=pytest.mark.xfail),
    pytest.param("Comedy", 8, 1991, 1990, 400, marks=pytest.mark.xfail),
    pytest.param("Comedy", 8, -1990, 1991, 400, marks=pytest.mark.xfail),
    pytest.param("Comedy", 8, 1992, 1992, 204, marks=pytest.mark.xfail),
])

def test_by_genre_endpoint(qgenre, minrating, yrFrom, yrTo, expected_status):
    endpoint = f"{BASE_URL}bygenre"
    request_data = {
        "qgenre": qgenre,
        "minrating": minrating,
        "yrFrom": yrFrom,
        "yrTo": yrTo
    }

    response = requests.get(endpoint, json=request_data)  # Send the request with JSON data

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