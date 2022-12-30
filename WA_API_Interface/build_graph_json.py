import requests
import os
import pprint
import time
from dotenv import load_dotenv 
import re
import logging
import sys
from pprint import pformat
import networkx as nx
import networkx.algorithms.community as nx_comm
from networkx.algorithms.community import greedy_modularity_communities
import json


load_dotenv()

logPath = os.getenv('LOG_PATH_WA_GRAPHER')
fileName = os.getenv('LOG_FILENAME_WA_GRAPHER')

LOGLEVEL = os.environ.get('LOGLEVEL_WA_GRAPHER', 'INFO').upper()

level = logging.getLevelName(LOGLEVEL)

if logPath is None:
    logPath = "logs"
if fileName is None:
    fileName = "grapher"

if not os.path.exists(logPath):
    os.makedirs(logPath)

logger = logging.getLogger('wa_grapher')
streamHandler = logging.StreamHandler(sys.stdout)
formatter = logging.Formatter('%(asctime)s : %(levelname)s : %(filename)s : %(funcName)s - %(message)s')
streamHandler.setFormatter(formatter)
fileHandler = logging.FileHandler("{0}/{1}.log".format(logPath, fileName))
fileHandler.setFormatter(formatter)
logger.addHandler(fileHandler)
logger.addHandler(streamHandler)
logger.setLevel(level)

header_dict = {
    "Content-type": "application/json",
    "x-auth-token": os.getenv('WA_TOKEN'),
    "x-application-key": os.getenv('WE_APP_KEY'),
    "User-Agent": os.getenv('WE_APP_NAME')+" (localhost, 0.1.0)"
}

url = "https://www.worldanvil.com/api/aragorn/world/"+os.getenv('WA_WORLD_ID')

world_response = requests.get(url, headers=header_dict)

world_response_json = world_response.json()

# pprint.pprint(world_response_json)

logger.info("world response payload: \n%s", pformat(world_response_json))

# print("number of articles: ", world_response_json['count_articles'])

logger.info("number of articles: %s", world_response_json['count_articles'])

# =================

num_articles = int(world_response_json['count_articles'])

seen_articles = 0

offset = 0

params_dict = {}

articles_url = "https://www.worldanvil.com/api/aragorn/world/"+os.getenv('WA_WORLD_ID')+"/articles"

article_map = {}

template_type_map = {}

article_keys = []

# get all articles
while seen_articles < num_articles:
    time.sleep(0.5)

    params_dict['offset'] = str(offset)

    article_response = requests.get(articles_url, headers=header_dict, params=params_dict)

    article_response_json = article_response.json()

    # pprint.pprint(article_response_json)

    logger.debug("articles response payload for offset=%d: \n%s",offset, pformat(article_response_json))

    # print("number of articles in this offset: ", len(article_response_json['articles']))

    logger.debug("number of articles in this offset: %d", len(article_response_json['articles']))

    for article in article_response_json['articles']:
        article_keys = article.keys()
        if not article['id'] in article_map:
            article_map[article['id']] = {}
        article_map[article['id']]['title'] = article['title']
        article_map[article['id']]['url'] = article['url']
        article_map[article['id']]['template_type'] = article['template_type']

        if not article['template_type'] in template_type_map:
            template_type_map[article['template_type']] = 0
        template_type_map[article['template_type']] += 1

    seen_articles = int(len(article_map.keys()))
    # print("Number of articles scanned so far: ", seen_articles)
    logger.info("Number of articles scanned so far: %d", seen_articles)
    offset += len(article_response_json['articles'])

# print("Number of articles scanned: ", seen_articles)
logger.info("Number of articles scanned: %d", seen_articles)

# print(len(article_map.keys()))

# ==========
# get catgories
url = "https://www.worldanvil.com/api/aragorn/world/"+os.getenv('WA_WORLD_ID')+"/categories"

category_map = {}

highest_level_categories = []

category_keys = []

offset = 0

while True: 
    time.sleep(0.1)

    params_dict['offset'] = str(offset)

    categories_response = requests.get(url, headers=header_dict, params=params_dict)

    categories_response_json = categories_response.json()

    # pprint.pprint(categories_response_json)

    # check if no more categories
    if not 'categories' in categories_response_json:
        break

    for cat in categories_response_json['categories']:
        category_keys = cat.keys()
        if not cat['id'] in article_map:
            category_map[cat['id']] = {}

        category_map[cat['id']]['url'] = cat['url']

        category_map[cat['id']]['title'] = cat['title']

        if 'parent' in cat:
            if cat['parent'] != None:
                category_map[cat['id']]['parent'] = cat['parent']['id']
            else:
                category_map[cat['id']]['parent'] = ""
                highest_level_categories.append(cat['id'])

        if 'children' in cat:
            if cat['children'] != None:
                category_map[cat['id']]['children'] = []
                for child in cat['children']:
                    # pprint.pprint(child)
                    category_map[cat['id']]['children'].append(child['id'])

        if 'articles' in cat:
            if cat['articles'] != None:
                category_map[cat['id']]['articles'] = []
                for child in cat['articles']:
                    # pprint.pprint(child)
                    category_map[cat['id']]['articles'].append(child['id'])

    offset += len(categories_response_json['categories'])

    seen_categories = int(len(category_map.keys()))
    logger.info("Number of categories scanned so far: %d", seen_categories)

seen_categories = int(len(category_map.keys()))
logger.info("Number of categories scanned: %d", seen_categories)

# pprint.pprint(category_keys)
logger.info("category dict keys: \n%s", pformat(category_keys))
# pprint.pprint(category_map)
logger.info("category dict: \n%s", pformat(category_map))

# ==========
tags_map = {}
# get article-specific payloads and parse relations and tags
parse_failures = 0
for article in article_map:
    time.sleep(0.1)
    curr_article_url = "https://www.worldanvil.com/api/aragorn/article/"+article
    article_params_dict = {"load_all_properties": True}
    curr_article_response = requests.get(curr_article_url, headers=header_dict, params=article_params_dict)
    curr_article_response_json = curr_article_response.json()

    # pprint.pprint(curr_article_response_json)
    logger.debug("current article payload: \n%s", pformat(curr_article_response_json))

    if not 'refs' in article_map[article]:
        article_map[article]['refs'] = {}

    # parse tags
    if curr_article_response_json['tags'] != None:
        tags = curr_article_response_json['tags'].split(",")
        if len(tags) > 0:
            for tag in tags:
                if tag != '':
                    if not tag in tags_map:
                        tags_map[tag] = []
                    tags_map[tag].append(article)

    # parse form relations
    for relation, relation_val in curr_article_response_json['relations'].items():
        if 'items' in relation_val:
            for items in relation_val['items']:
                if 'id' in items and 'relationshipType' in items:
                    if not items['id'] in article_map[article]['refs']:
                        article_map[article]['refs'][items['id']] = {"count": 1, "ref_type": relation, "relationshipType": items['relationshipType']}
                    else:
                        article_map[article]['refs'][items['id']]["count"] += 1

    # parse mentions
    if curr_article_response_json['content'] != None:
        # finds all mentions as they follow the standard structure of '@[STRING](STRING:STRING)'
        mention_matches = re.findall('@\[([^\)]+)\]\(([^\)]+)\)', curr_article_response_json['content'])
        
        for mention in mention_matches:
            # print(mention)
            logger.debug("current mention: \n%s", pformat(mention))
            title = mention[0]
            try:
                mentioned_id = mention[1].split(':')[1]
            except:
                logger.warning("ID parsing for mention: %s failed for article %s. This couuld mean this is just a placeholder mention, but the failure should be noted.", pformat(mention), article)
                parse_failures += 1
            if not mentioned_id in article_map[article]['refs']:
                article_map[article]['refs'][mentioned_id] = {"count": 1, "ref_type": 'mention', "relationshipType": ''}
            else:
                article_map[article]['refs'][mentioned_id]["count"] += 1

if parse_failures > 0:
    logger.warning("There where %d parse failures throughout the reference parsing process.", parse_failures)

# pprint.pprint(article_keys)
logger.info("article dict keys: \n%s", pformat(article_keys))
# pprint.pprint(article_map)
logger.info("article dict: \n%s", pformat(article_map))
# pprint.pprint(template_type_map)
logger.info("template type dict: \n%s", pformat(template_type_map))

logger.info("tags dict: \n%s", pformat(tags_map))

# =======
# build graph for analysis
G = nx.DiGraph()

master_ref_counter = {}

# add tag relationships
# for tag,vals in tags_map.items():
#     G.add_node(tag)
for tag,vals in tags_map.items():
    for art in vals:
        if art in article_map:
            if not tag in master_ref_counter:
                master_ref_counter[tag] = {}
            if not art in master_ref_counter[tag]:
                master_ref_counter[tag][art] = 0
            master_ref_counter[tag][art] += 1

            #avoid tags in this graph for now because they mess with pagerank
            # G.add_edge(tag, art)
            # G.add_edge(art, tag) # pseudo reverse edge because it is technically undirected

# add categories to output_nodes
for cat,vals in category_map.items():
    G.add_node(cat)

# add articles to output_nodes
for art,vals in article_map.items():
    G.add_node(art)

# add category children to output_edges
for cat,vals in category_map.items():
    if 'articles' in vals:
        for child in vals['articles']:
            if not cat in master_ref_counter:
                master_ref_counter[cat] = {}
            if not child in master_ref_counter[cat]:
                master_ref_counter[cat][child] = 0
            master_ref_counter[cat][child] += 1
            G.add_edge(cat, child)

            if not child in master_ref_counter:
                master_ref_counter[child] = {}
            if not cat in master_ref_counter[child]:
                master_ref_counter[child][cat] = 0
            master_ref_counter[child][cat] += 1
            G.add_edge(child, cat)  # need to be opposite from 
                                    # visualization for algorithms
                                    # to behave propoerly because edge 
                                    # should actually go from higher
                                    # level information to lower level
    if 'children' in vals:
        for child in vals['children']:
            if not cat in master_ref_counter:
                master_ref_counter[cat] = {}
            if not child in master_ref_counter[cat]:
                master_ref_counter[cat][child] = 0
            master_ref_counter[cat][child] += 1
            G.add_edge(cat, child)

            if not child in master_ref_counter:
                master_ref_counter[child] = {}
            if not cat in master_ref_counter[child]:
                master_ref_counter[child][cat] = 0
            master_ref_counter[child][cat] += 1
            G.add_edge(child, cat) # need to be opposite from 
                                    # visualization for algorithms
                                    # to behave propoerly because edge 
                                    # should actually go from higher
                                    # level information to lower level

# add article refs
for art,vals in article_map.items():
    if 'refs' in vals:
        if len(vals['refs']) > 0:
            for ref in vals['refs']:
                if ref in article_map or ref in category_map:
                    if not art in master_ref_counter:
                        master_ref_counter[art] = {}
                    if not ref in master_ref_counter[art]:
                        master_ref_counter[art][ref] = 0

                    if "count" in vals['refs'][ref]:
                        master_ref_counter[art][ref] += vals['refs'][ref]["count"]
                    else:
                        master_ref_counter[art][ref] += 1
                    G.add_edge(art, ref)

for src in master_ref_counter:
    for dst in master_ref_counter[src]:
        if (not src in tags_map) and (not dst in tags_map): #avoid tags in this graph for now because they mess with pagerank
            G[src][dst]['weight'] = master_ref_counter[src][dst]

pagerank = nx.pagerank(G, weight='weight')

logger.info("pagerank: \n%s", pformat(pagerank))

# louvain = nx_comm.louvain_communities(G)

# logger.info("louvain communities: \n%s", pformat(louvain))

louvain = greedy_modularity_communities(G, weight='weight')

logger.info("greedy modularity communities: \n%s", pformat(louvain))

num_louvain_communities = len(louvain)

louvain_map = {}
is_dom_map = {}

for i in range(num_louvain_communities):
    #find dominating set from community
    dom_set = nx.dominating_set(G, list(louvain[i])[0])

    for curr_id in louvain[i]:
        louvain_map[curr_id] = i

        if curr_id in dom_set:
            is_dom_map[curr_id] = True
        else:
            is_dom_map[curr_id] = False


#=======
# Reverse all edges in graph in order to calculate domination properly
G_reverse = G.reverse()

dominator_map = {}
dominator_path_map = {}

for top_cat in highest_level_categories:
    idoms = nx.immediate_dominators(G_reverse, top_cat)
    for node, idom in idoms.items():
        if not node in dominator_map:
            dominator_map[node] = []
        dominator_map[node].append(idom)

        if not node in dominator_path_map:
            dominator_path_map[node] = []
        # for path in nx.all_simple_paths(G_reverse, source=node, target=idom):
        #     dominator_path_map[node].append(path)

logger.info("dominator calculations: \n%s", pformat(dominator_map))
logger.info("dominator path calculations: \n%s", pformat(dominator_path_map))
        

# pprint.pprint(pagerank)

# =======
# build files for node
output_nodes = []

# add tags to output_nodes
for tag,vals in tags_map.items():
    output_nodes.append({'data': {"label": tag, "url": "", "id": tag, "type": "tag"}})

# add categories to output_nodes
for cat,vals in category_map.items():
    idoms = []
    if art in dominator_map:
        for idom in dominator_map[art]:
            idoms.append(str(idom))
    idoms=list(set(idoms))
    output_nodes.append({'data': {"label": vals['title'], "url": vals['url'], "id": cat, "type": "category", "pagerank": pagerank[cat], "community_id": louvain_map[cat], "is_in_dominating_set": str(is_dom_map[cat]), "idoms_from_parent_cats": idoms}})

# add articles to output_nodes
for art,vals in article_map.items():
    idoms = []
    if art in dominator_map:
        for idom in dominator_map[art]:
            idoms.append(str(idom))
    idoms=list(set(idoms))
    output_nodes.append({'data': {"label": vals['title'], "url": vals['url'], "id": art, "type": "article", "subtype": vals["template_type"], "pagerank": pagerank[art], "community_id": louvain_map[art], "is_in_dominating_set": str(is_dom_map[art]), "idoms_from_parent_cats": idoms}})

# pprint.pprint(output_nodes)

with open("nodes.out", "w") as node_file:
    pprint.pprint(output_nodes, node_file)

# Read in the file
with open('nodes.out', 'r') as file :
  filedata = file.read()

# Replace the target string
filedata = filedata.replace("'data'", "data")
filedata = filedata.replace("'label'", "label")
filedata = filedata.replace("'url'", "url")
filedata = filedata.replace("'id'", "id")
filedata = filedata.replace("'type'", "type")
filedata = filedata.replace("'pagerank'", "pagerank")
filedata = filedata.replace("'community_id'", "community_id")
filedata = filedata.replace("'is_in_dominating_set'", "is_in_dominating_set")
filedata = filedata.replace("'idoms_from_parent_cats'", "idoms_from_parent_cats")

# Write the file out again
with open('nodes.out', 'w') as file:
  file.write(filedata)

output_edges = []

# add tag relationships to output_edges
for tag,vals in tags_map.items():
    for art in vals:
        if art in article_map or art in category_map:
            output_edges.append({'data': {"source": tag, "target": art, "type": "tag", "weight": master_ref_counter[tag][art]}})
        else:
            logger.warning("Reference to %s from %s did not lead to an article or category in the dictionaries.", ref, art)

# add category children to output_edges
for cat,vals in category_map.items():
    if 'articles' in vals:
        for child in vals['articles']:
            if child in article_map or child in category_map:
                output_edges.append({'data': {"source": cat, "target": child, "weight": master_ref_counter[cat][child]}})
                # output_edges.append({'data': {"source": child, "target": cat, "weight": master_ref_counter[child][cat]}})
            else:
                logger.warning("Reference to %s from %s did not lead to an article or category in the dictionaries.", ref, art)
    if 'children' in vals:
        for child in vals['children']:
            if child in article_map or child in category_map:
                output_edges.append({'data': {"source": cat, "target": child, "weight": master_ref_counter[cat][child]}})
                # output_edges.append({'data': {"source": child, "target": cat, "weight": master_ref_counter[child][cat]}})
            else:
                logger.warning("Reference to %s from %s did not lead to an article or category in the dictionaries.", ref, art)

# add article refs
for art,vals in article_map.items():
    if 'refs' in vals:
        if len(vals['refs']) > 0:
            for ref in vals['refs']:
                if ref in article_map or ref in category_map:
                    output_edges.append({'data': {"source": art, "target": ref, "weight": master_ref_counter[art][ref]}})
                else:
                    logger.warning("Reference to %s from article %s did not lead to an article or category in the dictionaries.", ref, art)

# pprint.pprint(output_edges)

with open("edges.out", "w") as edge_file:
    pprint.pprint(output_edges, edge_file)

# Read in the file
with open('edges.out', 'r') as file :
  filedata = file.read()

# Replace the target string
filedata = filedata.replace("'data'", "data")
filedata = filedata.replace("'source'", "source")
filedata = filedata.replace("'target'", "target")
filedata = filedata.replace("'weight'", "weight")

# Write the file out again
with open('edges.out', 'w') as file:
  file.write(filedata)