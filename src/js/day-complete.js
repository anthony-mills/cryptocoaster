CryptoCoaster.DayComplete = function (game) {
  this.gameMenu = {};
};

CryptoCoaster.DayComplete.prototype = {

  create: function () {

  	/** 
  	* Check we have a last score to display
  	**/
  	if (!CryptoCoaster.data.currentScore) {
      CryptoCoaster.data.currentScore = 0;
  	} 

    CryptoCoaster.data.jackpotSound = this.game.add.audio('jackpot');
    CryptoCoaster.data.jackpotSound.play();
    CryptoCoaster.data.jackpotSound.loopFull();

    CryptoCoaster.data.screamSound = this.game.add.audio('screams'); 

    CryptoCoaster.data.gameBg = this.add.tileSprite(0, 0, 800, 490, 'gameBg');
    CryptoCoaster.data.gameBg.fixedToCamera = true;

    btcEmitter = this.game.add.emitter(
                                        this.game.camera.width * 0.5, 
                                        this.game.camera.height * 0.5, 
                                        100
                                      );

    btcEmitter.makeParticles('gameItems', 'BTC.png');

    btcEmitter.minParticleSpeed.setTo(-200, -200);
    btcEmitter.maxParticleSpeed.setTo(200, 200);
    btcEmitter.minParticleScale = 0.5;
    btcEmitter.maxParticleScale = 1;
    btcEmitter.maxParticleAlpha = 0.5;
    btcEmitter.gravity = 0;

    //  This will emit a quantity of 5 particles every 500ms. Each particle will live for 2000ms.
    //  The -1 means "run forever"
    btcEmitter.flow(5000, 3000, 10, -1);

    var titleText = this.game.add.text(this.game.camera.width * 0.5, 20, 'Day', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "70px Flea Market Finds", 
                                                                            fill: "#7CFC00"
                                                                        });      

    titleText.x = (this.game.camera.width * 0.5 - 190);  
    titleText.fixedToCamera = true; 

    var titleText1 = this.game.add.text(this.game.camera.width * 0.5, 20, 'Complete!!', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "70px Flea Market Finds", 
                                                                            fill: "#c90404"
                                                                        });      
    titleText1.x = ( this.game.camera.width * 0.5 - 70);  
    titleText1.fixedToCamera = true;

    // Setup the jump key so it can also restart the game
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    var marketColour = "#7CFC00";    	


    var priceText = 'Congratulations on surviving the last 24 hours\n in the BTC market';

    var marketText = this.game.add.text(this.game.camera.width * 0.5,  200, priceText, { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "40px Flea Market Finds", 
                                                                            fill: marketColour,
                                                                            align: "center"
                                                                        });      

    marketText.x = (this.game.camera.width * 0.5 - (marketText.width * 0.5));  
    marketText.fixedToCamera = true; 

    var lastScore = this.game.add.text(this.game.camera.width * 0.5,  320, 'Score: ' + CryptoCoaster.data.currentScore, { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "40px Flea Market Finds", 
                                                                            fill: "#c90404"
                                                                        });      

    lastScore.x = (this.game.camera.width * 0.5 - (lastScore.width * 0.5));  
    lastScore.fixedToCamera = true; 

    var contPrompt = this.game.add.text(this.game.camera.width * 0.5,  430, 'Space to continue', { 
                                                                            stroke: "#000", 
                                                                            strokeThickness: 10, 
                                                                            font: "30px Flea Market Finds", 
                                                                            fill: "#c90404"
                                                                        });      

    contPrompt.x = (this.game.camera.width * 0.5 - (contPrompt.width * 0.5));  
    contPrompt.fixedToCamera = true;     


    this.gameMenu.shoot = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.activeCoasters = this.game.add.group();

    this.CoasterTimer = this.game.time.create(false);

    CryptoCoaster.data.activeCoasters = this.activeCoasters;
    CryptoCoaster.data.gameObj = this.game;
    this.CoasterTimer.loop(Phaser.Timer.SECOND * 15, this.CoasterSetup);     
    this.CoasterTimer.start();    
    this.CoasterSetup();        
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
      this.returnToMenu();
    }

    this.activeCoasters.forEach(function(activeCoaster) {
      if(activeCoaster.x < -300) {
         activeCoaster.kill();
      }
    }, this);

    if(this.cursors.up.isDown || this.spaceBar.isDown ) {
        this.returnToMenu();
    }
  },


  render: function()
  {
    //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
    //this.game.debug.bodyInfo(this.player, 0, 80);
  },

  returnToMenu: function () {

    //  Return to the main menu
    this.state.start('MainMenu', true);
  }

};