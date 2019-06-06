var CryptoCoaster = CryptoCoaster || {};

//loading the game assets
CryptoCoaster.Preload = function(){};

CryptoCoaster.Preload.prototype = {
  preload: function() {
    this.background = this.add.sprite(0, 0, 'preloaderBackground');
    this.background.x = (this.camera.width * 0.5 - (this.background.width * 0.5));

    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 200, 'preloaderBar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);

    this.load.setPreloadSprite(this.preloadBar);

    // Character sprite sheets
    this.load.atlas('gameItems', 'assets/images/game-items.png', 'assets/images/game-items.json');
    this.load.image('floor', 'assets/images/floor.png');

    this.load.image('gameBg', 'assets/images/game_background.jpg');
    this.load.image('playingBg', 'assets/images/theme_park_bg.png');

    // Load game fonts
    this.load.bitmapFont('market', 'assets/fonts/market.png', 'assets/fonts/market.fnt');

    // Get the market data
    if (!sessionStorage.btcPrice) {
      this.load.json('btcprice', 'https://cryptocoins.anthony-mills.com/currency/btc');
    }

    // Get the latest BTC news
    if (!sessionStorage.newsdata) {
      this.load.json('coindeskNews', 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2FCoinDesk');
      this.load.json('bitcoinistNews', 'https://api.rss2json.com/v1/api.json?rss_url=http%3A%2F%2Fbitcoinist.com%2Ffeed%2F');
    }

    this.load.audio('gameOver', ['assets/audio/game-over.ogg', 'assets/audio/game-over.mp3']);
    this.load.audio('jump', ['assets/audio/jump.ogg', 'assets/audio/jump.mp3']);    
    this.load.audio('land', ['assets/audio/land.ogg', 'assets/audio/land.mp3']);
    this.load.audio('screams', ['assets/audio/screams.ogg', 'assets/audio/screams.mp3']);
    this.load.audio('jackpot', ['assets/audio/payout.ogg', 'assets/audio/payout.mp3']);          
    this.load.audio('liftOff', ['assets/audio/lift_off.ogg', 'assets/audio/lift_off.mp3']);   
  },
  create: function() {
    this.preloadBar.cropEnabled = false;

    this.game.load.onLoadComplete.add(this.loadComplete, this);

    this.game.load.start();
  },

  loadComplete: function() {
    this.game.time.events.add(1000, this.mainMenu, this);
  },

  mainMenu: function() {
    this.game.state.start('MainMenu');
  },

  update: function () {

  }
};
