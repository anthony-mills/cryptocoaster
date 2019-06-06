CryptoCoaster.MainMenu = function (game) {
  this.gameMenu = {};
};

CryptoCoaster.MainMenu.prototype = {

  create: function () {

  	/** 
  	* If BTC market data is not stored in session data store it
  	*/
  	if (!sessionStorage.btcPrice) {
      sessionStorage.btcPrice = JSON.stringify( 
      								this.cache.getJSON('btcprice') 
      							);  		
  	}

  	/** 
  	* If BTC news data is not stored in session data store it
  	*/
  	if (!sessionStorage.newsData) {
      var coinDesk = this.cache.getJSON('coindeskNews');
      var bitCoinist = this.cache.getJSON('bitcoinistNews');

      var newsItems = coinDesk.items.concat(bitCoinist.items);

      sessionStorage.newsData = JSON.stringify( newsItems );  		
  	}

  	var marketJSON = JSON.parse( sessionStorage.btcPrice );

    var savedScore = localStorage['high_score'];

    if (savedScore) {
        savedScore = JSON.parse(savedScore);

        CryptoCoaster.data.highScore = savedScore.highScore;
    }
        
    CryptoCoaster.data.screamSound = this.game.add.audio('screams'); 

    CryptoCoaster.data.gameBg = this.add.tileSprite(0, 0, 800, 490, 'gameBg');
    CryptoCoaster.data.gameBg.fixedToCamera = true;

    var titleText = this.game.add.bitmapText(this.game.camera.width * 0.5, 20, 'market','Crypto', 70);      

    titleText.x = (this.game.camera.width * 0.5 - 180); 
    titleText.tint = 0x7CFC00 
    titleText.fixedToCamera = true; 

    var titleText1 = this.game.add.bitmapText(this.game.camera.width * 0.5, 20, 'market','Coaster', 70);  

    titleText1.x = ( this.game.camera.width * 0.5 - 20 );  
    titleText1.tint = 0xc90404; 
    titleText1.fixedToCamera = true;

    // Setup the jump key so it can also restart the game
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    var lastData = marketJSON.market_data[marketJSON.market_data.length-1];

    if (lastData.percent_change_24h < 0) {
    	var marketColour = "0xc90404";
    } else {
    	var marketColour = "0x7CFC00";    	
    }

    var marketText = this.game.add.bitmapText(this.game.camera.width * 0.5,  200, 'market', 'Current Price: $' + lastData.price_usd, 40);  

    marketText.x = (this.game.camera.width * 0.5 - (marketText.width * 0.5));  
    marketText.tint = marketColour;
    marketText.fixedToCamera = true; 

    var moveText = this.game.add.bitmapText(this.game.camera.width * 0.5,  250, 'market', 'Percent Change 24h: ' + lastData.percent_change_24h + '%', 30);  

    moveText.x = (this.game.camera.width * 0.5 - (marketText.width * 0.5));  
    moveText.tint = marketColour;
    moveText.fixedToCamera = true; 

    var highscoreText = this.game.add.bitmapText(this.game.camera.width * 0.5,  300, 'market','Highscore: ' + CryptoCoaster.data.highScore, 30);


    highscoreText.x = (this.game.camera.width * 0.5 - (highscoreText.width * 0.5));  
    highscoreText.tint = marketColour;
    highscoreText.fixedToCamera = true; 


    this.gameMenu.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.activeCoasters = this.game.add.group();

    this.CoasterTimer = this.game.time.create(false);

    CryptoCoaster.data.activeCoasters = this.activeCoasters;
    CryptoCoaster.data.gameObj = this.game;
    this.CoasterTimer.loop(Phaser.Timer.SECOND * 15, this.CoasterSetup);     
    this.CoasterTimer.start();    
    this.CoasterSetup();    

    var contPrompt = this.game.add.bitmapText(this.game.camera.width * 0.5,  430, 'market','Space to continue', 30);
 
    contPrompt.tint = 0xc90404;
    contPrompt.x = (this.game.camera.width * 0.5 - (contPrompt.width * 0.5));  
    contPrompt.fixedToCamera = true;             
  },

  CoasterSetup: function () {
    CryptoCoaster.data.screamSound.play();
    var newCoaster = CryptoCoaster.data.gameObj.add.sprite(1000, 100, 'gameItems','title_coaster.png');

    CryptoCoaster.data.gameObj.physics.enable(newCoaster, Phaser.Physics.ARCADE);
    newCoaster.body.allowGravity = false;
    newCoaster.body.velocity.x = -180;
    CryptoCoaster.data.activeCoasters.add(newCoaster);   

   
  },

  update: function () {
    if (this.gameMenu.shoot.isDown) {
      this.startGame();
    }

    this.activeCoasters.forEach(function(activeCoaster) {
      if(activeCoaster.x < -300) {
         activeCoaster.kill();
      } 
    }, this);

    if(this.cursors.up.isDown || this.spaceBar.isDown ) {
        this.startGame();
    }
  },

  render: function()
  {
    //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
    //this.game.debug.bodyInfo(this.player, 0, 80);
  },

  startGame: function () {

    //  Start the actual game state
   	this.state.start('Game', true);
  }

};