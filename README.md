## Crypto Coaster

Help the Bitcoin Rollercoaster Guy navigate the last 24 hours of the BTC markets with the side scrolling browser based game.

The game is built using [PhaserJS community](http://phaser.io/) and is dynamically generated using Bitcoin market data from the last 24 hours.

You can play a [running version of the game here](https://gateway.ipfs.io/ipfs/Qma2P61qA2HCnQjjs4nhejLkU6bwbN34fGLYCNxhzsGSqh/).

### Play

You can play a [running version of the game here](https://www.anthony-mills.com/projects/cryptocoaster/index.html).

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

### Game States

The various game functionality is defined within the following game states:

* src/js/boot.js - Set up some global variables, defines the loading screen
* src/js/preloader.js - Define the game assets that need to bbe loaded for the game.
* src/js/main-menu.js - Merges the news articles and defines the game title sscreen
* src/js/game.js - Controls the complete gameplay state and the game over functionality.
* src/day-complete.js - If the BTC Roller Coaster Guy survives the full 24 hours of the Bitcoin market controls the game complete state.

### Licence

Copyright (C) 2018 [Anthony Mills](http://www.anthony-mills.com)

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.


