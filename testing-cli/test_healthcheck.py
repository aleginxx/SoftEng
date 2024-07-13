import pytest
import sys
import os
from subprocess import PIPE, Popen
import subprocess
import json

#Healthcheck test
def test_healthcheck_endpoint():
    # Run the CLI command to test the healthcheck endpoint
    command = "python ../../softeng23-16/cli-client/src/se2316.py healthcheck "
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    # Print the stdout and stderr for debugging
    print("stdout:", stdout.decode("utf-8"))
    print("stderr:", stderr.decode("utf-8"))

    # Check if the process exited successfully (return code 0)
    assert process.returncode == 0

    try:
        # Attempt to parse the JSON output
        healthcheck_data = json.loads(stdout.decode("utf-8").replace("'", "\""))
    except json.JSONDecodeError:
        # Handle JSON decoding errors here
        raise AssertionError("Failed to decode JSON response")

    # Now you can perform assertions on the healthcheck_data
    assert healthcheck_data["status"] == "OK"
    assert "dataconnection" in healthcheck_data
    assert "host" in healthcheck_data["dataconnection"]
    
    # Add more assertions based on the expected structure of the healthcheck response

# Run the test
if __name__ == "__main__":
    test_healthcheck_endpoint()
