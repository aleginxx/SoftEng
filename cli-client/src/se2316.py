#!/usr/bin/env python3
import argparse
import requests
import sys
import os
import json
import csv

def sendRequest(ns):
    hostName = 'localhost'
    params = None
    
    #Request URL switch-case
    baseURL = f"http://{hostName}:9876/ntuaflix_api/"

    # GET REQUESTS
    if ns.scope == 'healthcheck':
        requestString = baseURL + "admin/healthcheck"
    elif ns.scope == 'title':
        requestString = baseURL + f"title/{ns.titleID}"
    elif ns.scope == 'searchtitle':
        requestString = baseURL + f"searchtitle/{ns.titlepart}"
    elif ns.scope == 'bygenre':
        requestString = baseURL + f"bygenre/{ns.genre}/{ns.min}"
        if ns.from_year:
            requestString += f"/{ns.from_year}"
        if ns.to_year:
            requestString += f"/{ns.to_year}"
    elif ns.scope == 'name':
        requestString = baseURL + f"name/{ns.nameID}"
    elif ns.scope == 'searchname':
        requestString = baseURL + f"searchname/{ns.name}"
    elif ns.scope == 'user':
        requestString = baseURL + f"admin/users/{ns.username}" 

    # POST REQUESTS
    elif ns.scope == 'login':
        requestString = baseURL + f"/login/{ns.username}/{ns.passw}" 
    elif ns.scope == 'logout':
        requestString = baseURL + "/logout"    
    elif ns.scope == 'resetall':
        requestString = baseURL + "admin/resetall"
    elif ns.scope == 'adduser':
        requestString = baseURL + f"admin/usermod/{ns.username}/{ns.passw}" 
    elif ns.scope == 'newtitles':
        requestString = baseURL + "admin/upload/titlebasics"
    elif ns.scope == 'newakas':
        requestString = baseURL + "admin/upload/titleakas"
    elif ns.scope == 'newnames':
        requestString = baseURL + "admin/upload/namebasics"
    elif ns.scope == 'newcrew':
        requestString = baseURL + "admin/upload/titlecrew"
    elif ns.scope == 'newepisode':
        requestString = baseURL + "admin/upload/titleepisode"
    elif ns.scope == 'newprincipals':
        requestString = baseURL + "admin/upload/titleprincipals"
    elif ns.scope == 'newratings':
        requestString = baseURL + "admin/upload/titleratings"
            
    # Check if format is CSV    
    if (ns.format=='csv'):
        requestString += "?format=csv"
    
    if ns.scope in ["healthcheck", "title", "searchtitle", "bygenre", "name", "searchname", "user"]:
        response = sendGetRequest(requestString)
    else:
        requestBody = ''
        if 'filename' in ns:
            requestBody = uploadFile(ns.filename)
        response = sendPostRequest(requestString, requestBody)

    return response

def convert_to_csv(json_data):
    if json_data:
        if isinstance(json_data, list):
            if not json_data:
                print("No data")
                return

            # Check if the first item is a dictionary
            if isinstance(json_data[0], dict):
                # Write to CSV
                with open('output.csv', 'w', newline='', encoding='utf-8') as csvfile:
                    fieldnames = json_data[0].keys()
                    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(json_data)
                print("CSV file created: output.csv")
            else:
                # Check if there are multiple lists
                if all(isinstance(item, list) for item in json_data):
                    # Flatten the list of lists
                    flattened_data = [item for sublist in json_data for item in sublist]

                    # Check if the first item in flattened data is a dictionary
                    if flattened_data and isinstance(flattened_data[0], dict):
                        # Write to CSV
                        with open('output.csv', 'w', newline='', encoding='utf-8') as csvfile:
                            fieldnames = flattened_data[0].keys()
                            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                            writer.writeheader()
                            writer.writerows(flattened_data)
                        print("CSV file created: output.csv")
                    else:
                        print("Invalid JSON format. Expected a list of dictionaries.")
                else:
                    print("Invalid JSON format. Expected a list of dictionaries or a list of lists.")
        else:
            print("Invalid JSON format. Expected a list.")
    else:
        print("No data")

def uploadFile(filename):
    filepath = os.path.abspath(filename)
    tsvFiles = {'file': ('file.tsv', open(filepath, 'rb'))}
    return tsvFiles

def sendPostRequest(requestString, body = ''):
    response = requests.post(requestString, files=body)
    return response

def sendGetRequest(requestString, params=None):
    response = requests.get(requestString, params=params, timeout=10)
    return response

def main():
#Parser Initialization
    parser = argparse.ArgumentParser(description = 'Ntuaflix CLI')

    #Format Parser
    formatparse = argparse.ArgumentParser(add_help=False)
    formatparse.add_argument('--format', help = 'Select output format', default = "json", type = str, choices = ['json','csv'])
    formatparse.add_argument('--delimiter', help = 'Select delimiter for CSV file (most common is either ";" or ","). Only used with --passesupd command', default = ";")

    #SubParsers
    sp = parser.add_subparsers(help='Subparser Init', dest='scope')

    #GET METHODS
    #Health Check
    sp_healthcheck = sp.add_parser('healthcheck', parents = [formatparse], help = 'Check Database Connection Status')

    #Title/:titleID
    sp_Title = sp.add_parser('title', parents = [formatparse], help = 'Search via title ID')
    sp_Title.add_argument('--titleID', required=True, help='Valid titleID')

    #Searchtitle/:titlepart
    sp_search_title = sp.add_parser('searchtitle', parents = [formatparse], help = 'Search via title name')
    sp_search_title.add_argument('--titlepart', required=True, help = 'Part of a titleName')

    #bygenre/:genreName/:minimum_rating/:yrFrom?/:yrTo? 
    sp_bygenre = sp.add_parser('bygenre', parents=[formatparse], help='Search via genre and minimum rating')
    sp_bygenre.add_argument('--genre', required=True, dest='genre', help='The name of the Genre')
    sp_bygenre.add_argument('--min', required=True, dest='min', help='The minimum rating')
    sp_bygenre.add_argument('--from', dest='from_year', required=False, help='Enter a starting year')
    sp_bygenre.add_argument('--to', dest='to_year', required=False, help='Enter an ending year')
    
    #Name/:nameID
    sp_Name = sp.add_parser('name', parents = [formatparse], help = 'Search via name ID')
    sp_Name.add_argument('--nameID', required=True, help='Valid nameID')

    #Searchname/:name
    sp_search_name = sp.add_parser('searchname', parents = [formatparse], help = 'Search via name')
    sp_search_name.add_argument ('--name', required=True, help='Valid Name')

    #Users/:username
    sp_user = sp.add_parser('user', parents = [formatparse], help = 'Search via username')
    sp_user.add_argument('--username', required=True, help='Valid Username')

    #POST METHODS 
    #Title_Basics
    sp_titlebasics = sp.add_parser('newtitles', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titlebasics.add_argument('--filename', required=True, help = 'TSV Filename')

    #Title_akas
    sp_titleakas = sp.add_parser('newakas', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titleakas.add_argument('--filename', required=True, help = 'TSV Filename')

    #Name_Basics
    sp_namebasics = sp.add_parser('newnames', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_namebasics.add_argument('--filename', required=True, help = 'TSV Filename')

    #Title_Crew
    sp_titlecrew = sp.add_parser('newcrew', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titlecrew.add_argument('--filename', required=True, help = 'TSV Filename')

    #Title_Episode
    sp_titleepisode = sp.add_parser('newepisode', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titleepisode.add_argument('--filename', required=True, help = 'TSV Filename')

    #Title_Principals
    sp_titleprincipals = sp.add_parser('newprincipals', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titleprincipals.add_argument('--filename', required=True, help = 'TSV Filename')

    #Title_Ratings
    sp_titleratings = sp.add_parser('newratings', parents = [formatparse], help = 'Upload new titles TSV file')
    sp_titleratings.add_argument('--filename', required=True, help = 'TSV Filename')

    #Reset_All
    sp_resetall = sp.add_parser('resetall', parents = [formatparse], help = 'Empty all the Tables in the DB')

    #Login
    sp_login = sp.add_parser('login', parents = [formatparse], help = 'Please provide valid credentials')
    sp_login.add_argument('--username', required=True, help = 'Username')
    sp_login.add_argument('--passw', required=True, help = 'Password')

    #Logout
    sp_logout = sp.add_parser('logout', parents = [formatparse], help = 'You are logging out of your account')

    #Usermod/:username/:password
    sp_adduser = sp.add_parser('adduser', parents = [formatparse], help = 'Please enter a username and password')
    sp_adduser.add_argument('--username', required=True, help = 'Username')
    sp_adduser.add_argument('--passw', required=True, help = 'Password')

    #Pass final arguments to Namespace
    ns = parser.parse_args()

    # Handle None values for optional parameters
    if getattr(ns, 'from_year', None) is None:
        ns.from_year = ''
    if getattr(ns, 'to_year', None) is None:
        ns.to_year = ''

    response = sendRequest(ns)

    # Validate status code
    responseCode = response.status_code
    if (responseCode == 204):
        print("204: No Data\n", file=sys.stderr)
    elif (responseCode == 400):
        print("400: Bad Request\n", file=sys.stderr)
        print(response.content.decode('utf-8'))
    elif (responseCode == 401):
        print("401: Not Authorized\n", file=sys.stderr)
        print(response.content.decode('utf-8'))
    elif (responseCode == 404):
        print("404: Not Available\n", file=sys.stderr)
        print(response.content.decode('utf-8'))
    elif (responseCode == 500):
        print("500: Internal Server Error\n", file=sys.stderr)
    
    if responseCode != 200:
        exit()

    # Print result based on format options
    if ns.format == 'json':
        try:
            print(response.json())
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print(f"Raw response content:\n{response.content.decode('utf-8')}")
    elif ns.format == 'csv':
        # Check if the response content is in JSON format
        try:
            data = response.json()
        except json.JSONDecodeError:
            print(response.content.decode('utf-8'))
        else:
            if isinstance(data, list):
                if data:
                    fieldnames = data[0].keys()
                    writer = csv.DictWriter(sys.stdout, fieldnames=fieldnames)
                    writer.writeheader()
                    writer.writerows(data)
            elif isinstance(data, dict):
                writer = csv.DictWriter(sys.stdout, fieldnames=data.keys())
                writer.writeheader()
                writer.writerow(data)

if __name__== "__main__":
    main()
