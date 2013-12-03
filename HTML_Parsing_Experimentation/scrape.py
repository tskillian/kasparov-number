from bs4 import BeautifulSoup
import requests
import re


# my ID is 12869413 for testing purposes

player_id = raw_input("Enter player ID")
r = requests.get("http://main.uschess.org/datapage/gamestats.php?memid="+player_id)

data = r.text

soup = BeautifulSoup(data)
top_bucket = 0
for link in soup.find_all('a'):
	match = re.search('dkey=(.+?)&', link.get('href'))
	if match:
		if match.group(1) != 'UNR' and match.group(1) > top_bucket:
			top_bucket = int(match.group(1))


drill_url = "http://main.uschess.org/datapage/gamestats.php?memid="+player_id+"&ptype=G&rs=R&dkey="+str(top_bucket)+"&drill=G"
r = requests.get(drill_url)

data = r.text

soup = BeautifulSoup(data)

firstTable = soup.find("table", {"class": "blog"})
opponents_table = firstTable.find_next_sibling()
#print opponents_table.find_itall('tr')[2].children

for opponent in opponents_table.find_all('tr')[2:]:
	print opponent.children
	#if opponent.children[7] == "W":
	#	print opponent.children[5]




#for link in opponents_table.find_all('tr'):
#	print link

