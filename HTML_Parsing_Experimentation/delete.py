import re

text = './gamestats.php?memid=12869413&ptype=G&rs=R&dkey=2300&drill=G'

m = re.search('dkey=(.+?)&', text)
print int(m.group(1))
