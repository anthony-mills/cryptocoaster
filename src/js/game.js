var CryptoCoaster = CryptoCoaster || {};

CryptoCoaster.Game = function(){

};

CryptoCoaster.Game.prototype = {
  preload: function() {
      CryptoCoaster.rnd = this.game.rnd;

      this.game.time.advancedTiming = true;
      this.tileSize = 70;

      // Set moon jump timer
      CryptoCoaster.data.moonJump = 0;
      CryptoCoaster.data.moonStatus = "Ready";

      // Enable varying platform heights
      this.platfomHeights = true;

      // Disable newspaper collisions
      this.disableNews = false;

      // Get the BTC market data
      this.pointCutoff = 288;

      var marketJSON = JSON.parse( sessionStorage.btcPrice );

      // The amount of newpapers in the level
      this.newsCount = 0;

      // The amount of tiles since the last newspaper
      this.newsDistance = 0;

      // Load and shuffle the news items
      this.newsJSON = JSON.parse( sessionStorage.newsData );

      this.newsJSON = this.shuffleArray( this.newsJSON );

      var marketPoints = marketJSON.market_data.length;

      if (marketPoints > this.pointCutoff) {
        var startPoint = marketPoints - this.pointCutoff;
      } else {
        var startPoint = 0;
      }

      var marketData = marketJSON.market_data.splice( startPoint, this.pointCutoff);      
      this.marketData = []

      for (var i = 0; i < marketData.length; i = i+7) {
          this.marketData.push(marketData[i]);
      };

      this.pointCutoff = this.marketData.length;

  },


  create: function() {

    this.world.setBounds(0, 0, 3000, 2000);

    CryptoCoaster.data.playerDead = 0;

    // Create layers
    this.backgroundlayer = this.game.add.tileSprite(0, 0, 800, 490, 'playingBg');
    this.backgroundlayer.fixedToCamera = true;
    this.backgroundlayer.game.world.sendToBack(this.backgroundlayer);

    this.tileCount = 0;
    this.tileSize = 70;
    this.probCliff = 0.4;
    this.probVertical = 0.4;
    this.probMoreVertical = 0.5;

    // Initiate groups, we'll recycle elements
    this.floorTiles = this.game.add.group();
    this.floorTiles.enableBody = true;

    this.newsTiles = this.game.add.group();
    this.newsTiles.enableBody = true;

    var initHeight = (this.game.world.height / 2) - this.tileSize;

    var groupConstraints = {
      min: 4,
      max: 15,
      total_count: 0,
      last_height: initHeight,
      group_length: 0,
      current_length: 0,
      paint_platforms: 1,
      current_price: this.marketData[0].price_usd
    }

    CryptoCoaster.data.currentPrice = this.marketData[0].price_usd;

    if (groupConstraints.total_count == 0) {
      var platLength = Math.floor(Math.random() * (groupConstraints.max - groupConstraints.min) + groupConstraints.min); 
    }

    var priceChanges = [];
    for(var dataPoints=0; dataPoints< (this.pointCutoff - 1); ) {
      if (groupConstraints.current_length < platLength) {
        if (groupConstraints.paint_platforms == 1) {
          var tileX = ( groupConstraints.total_count * this.tileSize );
          var tileY = groupConstraints.last_height;

          newItem = this.floorTiles.create( tileX, tileY, 'floor' );
          newItem.price_usd = this.marketData[this.tileCount];
          newItem.body.immovable = true;

          /**
          * Start generating BTC white papers after the first 10 tiles
          */
          if ( groupConstraints.total_count > 8 ) {
            this.createNews( tileX, tileY );            
          }
        } 

        groupConstraints.current_length++;

      } else {
        groupConstraints.paint_platforms = groupConstraints.paint_platforms * -1;

        // Increment the platform count
        if (groupConstraints.paint_platforms === 1) {
          this.tileCount++;
          dataPoints++;

          var priceDiff = Math.round(this.marketData[this.tileCount - 1].price_usd - this.marketData[this.tileCount].price_usd);

          if ( priceDiff < 0 || priceDiff > 0 ) {
            priceChanges.push(priceDiff);

            if ( this.platfomHeights ) {
              var priceChange = Math.abs(priceDiff);
              
              if (priceChange < 35) {
                var priceDiff = priceDiff * 7;
              } else if (priceChange >= 35 && priceChange < 50) {
                var priceDiff = priceDiff * 5;
              } else if (priceChange >= 50 && priceChange < 75) {
                var priceDiff = priceDiff * 2;
              } 

            }
          } 

          if (priceDiff > 250) {
            var priceDiff = 250;
          }

          if (priceDiff < -250) {
            var priceDiff = -250;
          }          

          groupConstraints.last_height = groupConstraints.last_height + priceDiff;
        }

        if ( groupConstraints.paint_platforms > 0 ) {
          var platLength = Math.floor(Math.random() * (groupConstraints.max - groupConstraints.min) + groupConstraints.min); 
        } else {
          // How long should the space be between platforms
          var platLength = this.game.rnd.integerInRange(1, 5); 
        }

        groupConstraints.current_length = 0;
               
      }    

      groupConstraints.total_count++;
    }


    var worldWidth = groupConstraints.total_count * this.tileSize;

    this.world.setBounds(0, 0, worldWidth, 3000);

    //keep track of the last floor
    this.lastFloor = newItem;    

    // Maintain the game state if the world is just looping around
    if (CryptoCoaster.data.worldLoop === 0) {
      CryptoCoaster.data.currentScore = 0;

      this.runSpeed = 300;
      var txtMsg = ['To the moon!', 'Lambo time!', 'HODL tight!', 'Lets hunt bearwhales!', 'Bullish on Bitcoin...' ];

      var startText = this.game.add.bitmapText(this.game.camera.width * 0.5, 200, 'market',txtMsg[Math.floor(Math.random() * txtMsg.length)], 40);
      startText.tint = 0xc90404;
      startText.x = (this.game.camera.width * 0.5 - (startText.width * 0.5));
      startText.fixedToCamera = true;

      this.game.time.events.add(700, function() {
          var fadeTween = this.game.add.tween(startText);
          fadeTween.to({alpha: 0}, 400, Phaser.Easing.Linear.None, true);

          fadeTween.onComplete.add(function () {
              startText.destroy();
          });
      }, this);
    } else {
      this.runSpeed = (this.runSpeed + 50);

      CryptoCoaster.data.worldLoop = 0;
    }

    // Create Roller Coaster Guy
    this.player = this.game.add.sprite(100, 800, 'gameItems', '1.png');

    this.player.animations.add('run', [
                      "1.png",
                      "2.png",
                      "3.png",
                      "4.png",
                      "5.png",
                      "6.png",
                      "7.png"                      
                    ], 9, true);

    this.player.animations.add('explode', [
                      "explode_1.png",
                      "explode_2.png",
                      "explode_3.png",
                      "explode_4.png",
                      "explode_5.png",
                      "explode_6.png",
                      "explode_7.png"                      
                    ], 5, false);

    this.player.play('run');

    //enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //player gravity
    this.player.body.gravity.y = 1000;

    this.player.anchor.setTo(0.5, 1);

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    CryptoCoaster.player = this.player;

    //move player with cursor keys
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.moonKey = this.game.input.keyboard.addKey(Phaser.Keyboard.M);
    this.spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

    // Setup the score object
    CryptoCoaster.data.scoreObject = this.game.add.bitmapText(20, 400, 'market', 'Score: ' + CryptoCoaster.data.currentScore, 50);
    CryptoCoaster.data.scoreObject.tint = 0xc90404;
    CryptoCoaster.data.scoreObject.fixedToCamera = true;

    // Setup the moonjump countdown
    CryptoCoaster.data.moonjumpObject = this.game.add.bitmapText(20, 450, 'market', 'Moon Launch: Ready', 25);
    CryptoCoaster.data.moonjumpObject.tint = 0x7CFC00;
    CryptoCoaster.data.moonjumpObject.fixedToCamera = true;

    // Setup the price object
    CryptoCoaster.data.priceObject = this.game.add.bitmapText(20, 20, 'market', 'Price: $' + CryptoCoaster.data.currentPrice, 50);
    CryptoCoaster.data.priceObject.tint = 0x7CFC00;
    CryptoCoaster.data.priceObject.fixedToCamera = true;    

    // Setup the required sounds
    this.gameOverSound = this.game.add.audio('gameOver');
    this.jumpSound = this.game.add.audio('jump');
    this.landSound = this.game.add.audio('land');
    this.moonSound = this.game.add.audio('liftOff');
    this.paperSound = this.game.add.audio('paperPickup');

    this.game.input.onTap.add(function() {
      this.playerJump();
    }, this);
  },

  createNews: function( tileX, tileY) {
    if (this.newsCount < (this.newsJSON.length - 1)) {
      var tileOffset = 40;
      var randomNum = this.game.rnd.integerInRange(5, 15);
      this.newsDistance++;

      if ( this.newsDistance > 5 && randomNum === 5 ) {
        this.newsDistance = 0;
        
        var newsItem = this.newsTiles.create( tileX, ( tileY - tileOffset ), 'gameItems', 'newspaper.png' );
        
        newsItem.headline = this.newsJSON[this.newsCount];

        this.newsCount++;
      }
    }
  },

  update: function() {
    // Only respond to keys and keep the speed if the player is alive
    if(this.player.alive) {

      // Manage any collisions
      this.game.physics.arcade.collide(this.player, this.floorTiles, this.playerHit, null, this);
      this.game.physics.arcade.overlap(this.player, this.newsTiles, this.collectNews, null, this);

      /**
      * Perform a huge "moon jump"
      */
      if (this.moonKey.isDown) {
        this.moonJump();
        this.player.animations.stop('run');        
      }

      /**
      * Perform a standard 
      */
      if(this.cursors.up.isDown || this.spaceBar.isDown ) {
        this.playerJump();
        this.player.animations.stop('run');
      }

      // Restart the game if reaching the edge
      if(this.player.x >= this.game.world.width) {
        this.state.start('DayComplete', true);
      }

      // Restart the game if reaching the edge
      if(this.player.y >= this.game.world.height) {
      	this.player.kill();

		    this.gameOver();
      }

      if (this.player.body.velocity.x > 0) {
        this.backgroundlayer.tilePosition.x -= 0.5;
      }
    } 
  },

  playerHit: function(player, blockedLayer) {

    // If hits on the right side, die
    if(player.body.blocked.right) {

      this.player.play('explode');
      this.player.body.allowGravity = false;


      // Set to dead (this doesn't affect rendering)
      this.player.alive = false;

      // Stop moving to the right
      this.player.body.velocity.x = 0;

      // Change sprite image
      this.player.loadTexture('gameItems', 'dead.png');

      // Go to gameover after a few miliseconds
      this.gameOver();
    }

    if (player.body.touching.down) {

      if (CryptoCoaster.data.inAir === 1) {

        var curPrice = blockedLayer.price_usd;

        var lastPrice = CryptoCoaster.data.currentPrice;

        // Update the current price
        CryptoCoaster.data.currentPrice = curPrice.price_usd;

        if (curPrice.price_usd < lastPrice) {
          var marketColour = "0xc90404";
        } else {
          var marketColour = "0x7CFC00";     
        }       

        CryptoCoaster.data.priceObject.destroy();

        // Setup the price object
        CryptoCoaster.data.priceObject = this.game.add.bitmapText(20, 20, 'market', 'Price: $' + curPrice.price_usd, 50);
        CryptoCoaster.data.priceObject.tint = marketColour
        CryptoCoaster.data.priceObject.fixedToCamera = true;    
        
        this.landSound.play();

        CryptoCoaster.data.inAir = 0;

        this.add.tween( this.player ).to(
            {
              angle: 0
            }, 
            200, 
            "Linear",
            true, 
            0
        );        
      }

      if((this.cursors.left.isDown || this.cursors.right.isDown) && CryptoCoaster.data.inAir === 0) {
        if ( this.cursors.left.isDown ) {
          if (this.player.body.velocity.x > 50) {
            this.player.body.velocity.x = this.player.body.velocity.x - 20;
          }
        }

        if ( this.cursors.right.isDown ) {
          this.player.body.velocity.x = this.player.body.velocity.x + 20;
        }        
      } else {
        this.player.body.velocity.x = this.runSpeed;
      }

      this.player.play('run');
    }
  },

  collectNews: function(player, newsItem) {
    /**
    * Ignore the collision if news items have been disabled
    */
    if ( this.disableNews ) {
      return;
    }

  	CryptoCoaster.data.currentScore += 50;

  	// Update the score
  	CryptoCoaster.data.scoreObject.kill();
    CryptoCoaster.data.scoreObject = this.game.add.bitmapText(20, 400, 'market', 'Score: ' + CryptoCoaster.data.currentScore, 50);
    CryptoCoaster.data.scoreObject.tint = 0xc90404;
    CryptoCoaster.data.scoreObject.fixedToCamera = true;
    
    var self = this;

    // Pass over the news item and open the paper
    this.openNews( newsItem.headline );

    this.game.paused = true;

    window.onkeydown = function() {
      if (self.enterKey.isDown) {
        var win = window.open(newsItem.headline.link, '_blank');
        win.focus();
      }

      if (self.spaceBar.isDown) {
        CryptoCoaster.data.newspaperBg.destroy();
        CryptoCoaster.data.newsHeadline.destroy();
        CryptoCoaster.data.newsBody.destroy();
        CryptoCoaster.data.newsCont.destroy();
        CryptoCoaster.data.newsRead.destroy();

        // Remove the news paper sprite
        newsItem.destroy();

        self.game.paused = false;
      }
    }    
  },

  /**
  * Open a newspaper article while the game is in a paused state
  *
  * @param object newsHeadline
  */
  openNews: function( newsHeadline ) {

    CryptoCoaster.data.newspaperBg = this.add.tileSprite(0, 0, 800, 490, 'gameItems', 'headlines.png');
    CryptoCoaster.data.newspaperBg.fixedToCamera = true;

    var showHeadline = this.wordWrap( newsHeadline.title, 60 );
    CryptoCoaster.data.newsHeadline = this.game.add.bitmapText(50, 150, 'light', showHeadline, 25);
    CryptoCoaster.data.newsHeadline.tint = 0x000000;
    CryptoCoaster.data.newsHeadline.fixedToCamera = true;

    CryptoCoaster.data.newsRead = this.game.add.bitmapText(50, 330, 'light', 'Press enter to read more', 18);
    CryptoCoaster.data.newsRead.x = (this.game.camera.width / 2) - (CryptoCoaster.data.newsRead.width / 2); 
    CryptoCoaster.data.newsRead.tint = 0x000000;
    CryptoCoaster.data.newsRead.fixedToCamera = true;  

    CryptoCoaster.data.newsCont = this.game.add.bitmapText(50, 360, 'light', 'Space to continue', 18);
    CryptoCoaster.data.newsCont.x = (this.game.camera.width / 2) - (CryptoCoaster.data.newsCont.width / 2); 
    CryptoCoaster.data.newsCont.tint = 0x000000;
    CryptoCoaster.data.newsCont.fixedToCamera = true; 

    var newsBody = newsHeadline.description;
    var newsBody = newsBody.replace(/<(?:.|\n)*?>/gm, '');

    var truncate = function (str, limit) {
        var bits, i;

        bits = str.split('');
        if (bits.length > limit) {
            for (i = bits.length - 1; i > -1; --i) {
                if (i > limit) {
                    bits.length = i;
                }
                else if (' ' === bits[i]) {
                    bits.length = i;
                    break;
                }
            }
            bits.push('...');
        }
        return bits.join('');
    };    

    var newsBody = truncate( newsBody , 300 ); 

    newsBody = this.wordWrap( newsBody, 80 );

    CryptoCoaster.data.newsBody = this.game.add.bitmapText(200, 210, 'light', newsBody, 18);
    CryptoCoaster.data.newsBody.tint = 0x000000;
    CryptoCoaster.data.newsBody.x = (this.game.camera.width / 2) - (CryptoCoaster.data.newsBody.width / 2); 
    CryptoCoaster.data.newsBody.fixedToCamera = true;    
  },

  gameOver: function() {
    if ( CryptoCoaster.data.playerDead === 1 ) {
      return;
    }

    CryptoCoaster.data.playerDead = 1;

    this.gameOverSound.play();

    if (CryptoCoaster.data.currentScore > CryptoCoaster.data.highScore) {
      CryptoCoaster.data.highScore = CryptoCoaster.data.currentScore;

      var scoreData = {
          "highScore" : CryptoCoaster.data.currentScore
      }

      localStorage['high_score'] = JSON.stringify(scoreData);
    }

    // Reset the jump count
    CryptoCoaster.data.jumpCount = 0;

    var txtMsg = [
                  'Crashed to zero!', 
                  'China actually bans bitcoin!', 
                  'Tulip mania is over :-(', 
                  'Shorted by whales...', 
                  'Wiped out by weak hands.', 
                  'Position liquidated',
                  'Private key lost',                  
                  'Mempool full'
                ];
      
    var gameOverText = this.game.add.bitmapText(this.game.camera.width * 0.5, 120, 'market', txtMsg[Math.floor(Math.random() * txtMsg.length)], 40);
    gameOverText.tint = 0xc90404;

    gameOverText.x = (this.game.camera.width * 0.5 - (gameOverText.width * 0.5));
    gameOverText.fixedToCamera = true;

    this.game.time.events.add(3500, function() {
        var fadeTween = this.game.add.tween(gameOverText);
        fadeTween.to({alpha: 0}, 2000, Phaser.Easing.Linear.None, true);

        fadeTween.onComplete.add(function () {
            gameOverText.destroy();
        });
    }, this);

    // Go to gameover after a few miliseconds
    this.game.time.events.add(6000, this.mainMenu, this);
  },

  wordWrap: function(str, maxWidth) {
    var newLineStr = "\n"; done = false; res = '';
    do {                    
        found = false;
        // Inserts new line at first whitespace of the line
        for (i = maxWidth - 1; i >= 0; i--) {
            if (this.testWhite(str.charAt(i))) {
                res = res + [str.slice(0, i), newLineStr].join('');
                str = str.slice(i + 1);
                found = true;
                break;
            }
        }
        if (!found) {
            res += [str.slice(0, maxWidth), newLineStr].join('');
            str = str.slice(maxWidth);
        }

        if (str.length < maxWidth)
            done = true;
    } while (!done);

    return res + str;
  },

  testWhite: function(x) {
    var white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
  },

  mainMenu: function() {
    this.game.state.start('MainMenu', true);
  },

  playerJump: function() {
    if ( CryptoCoaster.data.playerDead === 1) {
      return;
    }
    
    if(this.player.body.touching.down) {
      this.player.body.velocity.y -= 700;
      CryptoCoaster.data.jumpCount = 1;
      CryptoCoaster.data.jumpTime = this.game.time.time;
      CryptoCoaster.data.inAir = 1;

      this.add.tween( this.player ).to(
          {
            angle: -15
          }, 
          200, 
          "Linear",
          true, 
          0
      );

      this.jumpSound.play();
    } else if ((CryptoCoaster.data.jumpCount == 1) && ((this.game.time.time - CryptoCoaster.data.jumpTime) > 1000)) {
      this.player.body.velocity.y -= 700;

      CryptoCoaster.data.jumpCount = 0;
      this.jumpSound.play();
    }
  },

  /**
  * Activate the "moon" jump 
  */
  moonJump: function() {
    if ( CryptoCoaster.data.playerDead === 1) {
      return;
    }
    
    if(this.player.body.touching.down && CryptoCoaster.data.moonJump === 0) {
     
      this.moonSound.play(); 

      this.player.body.velocity.y -= 1500;
      CryptoCoaster.data.moonJump = this.game.time.time;
      CryptoCoaster.data.inAir = 1;

      var moonTimer = this.game.time.create();
     
      CryptoCoaster.data.moonTimer = this.game.time.events.add(
                                            Phaser.Timer.SECOND * 10, 
                                            function() {
                                              CryptoCoaster.data.moonJump = 0;
                                              this.toggleMoonStatus('Moon Launch: Ready', 0x7CFC00);
                                            }, this
                                          );

      this.toggleMoonStatus('Moon Launch: Thrusters Charging', 0xc90404);
      
      this.add.tween( this.player ).to(
          {
            angle: -45
          }, 
          200, 
          "Linear",
          true, 
          0 
      );
    }
  },

  /**
  * Shuffle the elements of an array
  *
  * @param array 
  * @return array
  */
  shuffleArray: function( array ) {
      var counter = array.length;

      // While there are elements in the array
      while (counter > 0) {
          // Pick a random index
          var index = Math.floor(Math.random() * counter);

          // Decrease counter by 1
          counter--;

          // And swap the last element with it
          var temp = array[counter];
          array[counter] = array[index];
          array[index] = temp;
      }

      return array;
  },

  /** 
  * Toggle the status of the moon jump
  *
  */
  toggleMoonStatus: function( textMsg, textColour ) {
      // Setup the moonjump countdown
      CryptoCoaster.data.moonjumpObject.destroy();
      CryptoCoaster.data.moonjumpObject = this.game.add.bitmapText(20, 450, 'market', textMsg, 20);
      CryptoCoaster.data.moonjumpObject.tint = textColour;
      CryptoCoaster.data.moonjumpObject.fixedToCamera = true;
  },

  render: function()
    {
      //this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");
      //this.game.debug.bodyInfo(this.player, 0, 80);
    }
};
