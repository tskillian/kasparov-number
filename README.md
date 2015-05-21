Checkmates To Kasparov
==================

This project started because most novice tournament chess players seem to think, with a high degree of confidence, that there is no way they could have 'transitively beaten' (have beaten someone who has beaten someone else, who has beaten someone else, etc.) Russian chess legend Garry Kasparov. These people clearly underestimate the power of networks. Despite these players being relatively low rated (especially compared to Kasparov) and being on the other side of the world, most US chess players, as long as they have at least 1 win (a way into the network), have Kasparov numbers. On top of that, the numbers are usually smaller than people expect.

As the USCF (US Chess Federation) does not provide an API to any of its data, this app uses a crawler that crawls the USCF website in real time as requests are made in order to find the path to Kasparov. The crawler uses a very simple hueristic to guess the best path to take - always assuming that a given player's highest rated win is most likely to lead to the fastest path to Kasparov.
