import requests
import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

BASE_URL = "http://localhost:9876/ntuaflix_api/"

@pytest.mark.parametrize("reset_params, expected_status, expected_reason", [
    ({"host": "localhost", "user": "root", "password": ""}, 200, "OK"),
    pytest.param({"host": "non-localhost", "user": "root", "password": ""}, 500, "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG HOST>", marks=pytest.mark.xfail),
    ({"host": "localhost", "user": "root", "password": ""}, 200, "OK"),
    pytest.param({"host": "localhost", "user": "incorrect_user", "password": ""}, 401, "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG USERNAME>", marks=pytest.mark.xfail),
    pytest.param({"host": "localhost", "user": "root", "password": "incorrect_password"}, 401, "<ER_DBACCESS_DENIED_ERROR DUE TO WRONG PASSWORD>", marks=pytest.mark.xfail),
])

def test_resetall_endpoint(reset_params, expected_status, expected_reason):
    endpoint = f"{BASE_URL}admin/resetall"

    response = requests.post(endpoint, json=reset_params)

    assert response.status_code == expected_status
    assert response.headers['Content-Type'].startswith('application/json')

    data = response.json()
    assert 'status' in data
    assert data['status'] == expected_reason

    if expected_status == 200:
        assert 'reason' not in data
    elif expected_status == 500 or expected_status == 401:
        assert 'reason' in data
        assert data['reason'] == expected_reason
  
if __name__ == "__main__":
    commands = [
        'python ../../softeng23-16/cli-client/src/se2316.py resetall',
        'python ../../softeng23-16/cli-client/src/se2316.py resetall --format csv --user "non-localhost"',
        'python ../../softeng23-16/cli-client/src/se2316.py resetall --format csv',
        'python ../../softeng23-16/cli-client/src/se2316.py resetall --password "incorrect_password"',
        'python ../../softeng23-16/cli-client/src/se2316.py resetall --host "incorrect_user"'
    ]

    for command in commands:
        print(f"Executing command: {command}")
        process = subprocess.run(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        print(f"Command output:\n{process.stdout}\n")
        print(f"Command errors:\n{process.stderr}\n")
