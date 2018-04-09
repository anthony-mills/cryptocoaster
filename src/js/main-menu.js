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

    var titleText = this.game.add.text(this.game.camera.width * 0.5, 20, 'Crypto', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "70px Flea Market Finds", 
                                                                            fill: "#7CFC00"
                                                                        });      

    titleText.x = (this.game.camera.width * 0.5 - 220);  
    titleText.fixedToCamera = true; 

    var titleText1 = this.game.add.text(this.game.camera.width * 0.5, 20, 'Coaster', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "70px Flea Market Finds", 
                                                                            fill: "#c90404"
                                                                        });      
    titleText1.x = ( this.game.camera.width * 0.5 - 20 );  
    titleText1.fixedToCamera = true;

    // Setup the jump key so it can also restart the game
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    var lastData = marketJSON.market_data[marketJSON.market_data.length-1];

    if (lastData.percent_change_24h < 0) {
    	var marketColour = "#c90404";
    } else {
    	var marketColour = "#7CFC00";    	
    }

    var priceText = 'Current Price: $' + lastData.price_usd + '\r\nPercent Change 24h: ' + lastData.percent_change_24h + '%';

    var marketText = this.game.add.text(this.game.camera.width * 0.5,  200, priceText, { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "40px Flea Market Finds", 
                                                                            fill: marketColour
                                                                        });      

    marketText.x = (this.game.camera.width * 0.5 - (marketText.width * 0.5));  
    marketText.fixedToCamera = true; 

    var highscoreText = this.game.add.text(this.game.camera.width * 0.5,  320, 'Highscore: ' + CryptoCoaster.data.highScore, { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "40px Flea Market Finds", 
                                                                            fill: marketColour
                                                                        });      

    highscoreText.x = (this.game.camera.width * 0.5 - (highscoreText.width * 0.5));  
    highscoreText.fixedToCamera = true; 


    this.gameMenu.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.activeCoasters = this.game.add.group();

    this.CoasterTimer = this.game.time.create(false);

    CryptoCoaster.data.activeCoasters = this.activeCoasters;
    CryptoCoaster.data.gameObj = this.game;
    this.CoasterTimer.loop(Phaser.Timer.SECOND * 15, this.CoasterSetup);     
    this.CoasterTimer.start();    
    this.CoasterSetup();    

    var contPrompt = this.game.add.text(this.game.camera.width * 0.5,  430, 'Space to continue', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "30px Flea Market Finds", 
                                                                            fill: "#c90404"
                                                                        });      

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