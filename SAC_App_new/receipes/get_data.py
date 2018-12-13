import json
from pprint import pprint


with open('data.json', 'r') as f:
    data = f.read()
    json_data = json.loads(data)

pprint(json_data)