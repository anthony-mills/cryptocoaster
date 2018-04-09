var CryptoCoaster = CryptoCoaster || {};

CryptoCoaster.data = {
	"highScore" : 0,
	"currentScore" : 0,
	"worldLoop" : 0,
  "jumpCount" : 0,
  "jumpTime" : 0,
  "inAir" : 0,
  "activePlugins" : {},
  "gameObj" : {}
}

CryptoCoaster.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
CryptoCoaster.Boot.prototype = {
  preload: function() {
    this.load.image('preloaderBackground', 'assets/images/loading_background.png');
    this.load.image('preloaderBar', 'assets/images/preloader-bar.png');
  },
  create: function() {
    this.state.start('Preload');
  }
};