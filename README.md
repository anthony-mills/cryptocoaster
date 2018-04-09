=== Crypto Coaster ===

Help the Bitcoin Rollercoaster Guy navigate the last 24 hours of the BTC markets with the side scrolling browser based game.

The game is built using [PhaserJS community](http://phaser.io/) and is dynamically generated using Bitcoin market data from the last 24 hours.

You can play a [running version of the game here](https://gateway.ipfs.io/ipfs/Qma2P61qA2HCnQjjs4nhejLkU6bwbN34fGLYCNxhzsGSqh/).

### Screenshots

![Title Screen](/screenshots/title_screen.png?raw=true "Title Screen")

![Gameplay](/screenshots/game_playing.png?raw=true "Gameplay")

![News Item](/screenshots/news_open.png?raw=true "News Item")

![Game Over](/screenshots/game_over.png?raw=true "Game Over")

### Data Sources

* Price data is sourced from the [coinmarketcap API](https://coinmarketcap.com/api/).

* News items are pulled via RSS from [Coindesk](https://www.coindesk.com/) and [Bitcoinist](http://bitcoinist.com/) news sites.

### Installation

For development you can simply point a webserver at the src directory e.g

_cd src/_
_python -m SimpleHTTPServer 8001_

Then point your browser to _http://localhost:8001_.

If you would like to build the codebase for distribution:

_npm install_
_grunt_

The grunt task will minify your JS and copy your files into the www folder for distribution. 

