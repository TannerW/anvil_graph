import requests
import os
import pprint
import time
from dotenv import load_dotenv 
import re

load_dotenv()

header_dict = {
    "Content-type": "application/json",
    "x-auth-token": os.getenv('WA_TOKEN'),
    "x-application-key": os.getenv('WE_APP_KEY'),
    "User-Agent": os.getenv('WE_APP_NAME')+" (localhost, 0.1.0)"
}

url = "https://www.worldanvil.com/api/aragorn/article/"+os.getenv('WA_TEST_ARTICLE_ID')
article_params_dict = {"load_all_properties": True}

article_response = requests.get(url, headers=header_dict, params=article_params_dict)

article_response_json = article_response.json()

# finds all mentions as they follow the standard structure of '@[STRING](STRING:STRING)'
print(re.findall('@\[([^\)]+)\]\(([^\)]+)\)', article_response_json['content']))