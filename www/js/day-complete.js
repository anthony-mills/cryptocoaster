CryptoCoaster.DayComplete=function(t){this.gameMenu={}},CryptoCoaster.DayComplete.prototype={create:function(){CryptoCoaster.data.currentScore||(CryptoCoaster.data.currentScore=0),CryptoCoaster.data.jackpotSound=this.game.add.audio("jackpot"),CryptoCoaster.data.jackpotSound.play(),CryptoCoaster.data.jackpotSound.loopFull(),CryptoCoaster.data.screamSound=this.game.add.audio("screams"),CryptoCoaster.data.gameBg=this.add.tileSprite(0,0,800,490,"gameBg"),CryptoCoaster.data.gameBg.fixedToCamera=!0,btcEmitter=this.game.add.emitter(.5*this.game.camera.width,.5*this.game.camera.height,100),btcEmitter.makeParticles("gameItems","BTC.png"),btcEmitter.minParticleSpeed.setTo(-200,-200),btcEmitter.maxParticleSpeed.setTo(200,200),btcEmitter.minParticleScale=.5,btcEmitter.maxParticleScale=1,btcEmitter.maxParticleAlpha=.5,btcEmitter.gravity=0,btcEmitter.flow(5e3,3e3,10,-1);var t=this.game.add.text(.5*this.game.camera.width,20,"Day",{stroke:"#000",strokeThickness:10,font:"70px Flea Market Finds",fill:"#7CFC00"});t.x=.5*this.game.camera.width-190,t.fixedToCamera=!0;var e=this.game.add.text(.5*this.game.camera.width,20,"Complete!!",{stroke:"#000",strokeThickness:10,font:"70px Flea Market Finds",fill:"#c90404"});e.x=.5*this.game.camera.width-70,e.fixedToCamera=!0,this.cursors=this.game.input.keyboard.createCursorKeys(),this.spaceBar=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);var a=this.game.add.text(.5*this.game.camera.width,200,"Congratulations on surviving the last 24 hours\n in the BTC market",{stroke:"#000",strokeThickness:10,font:"40px Flea Market Finds",fill:"#7CFC00",align:"center"});a.x=.5*this.game.camera.width-.5*a.width,a.fixedToCamera=!0;var r=this.game.add.text(.5*this.game.camera.width,320,"Score: "+CryptoCoaster.data.currentScore,{stroke:"#000",strokeThickness:10,font:"40px Flea Market Finds",fill:"#c90404"});r.x=.5*this.game.camera.width-.5*r.width,r.fixedToCamera=!0;var s=this.game.add.text(.5*this.game.camera.width,430,"Space to continue",{stroke:"#000",strokeThickness:10,font:"30px Flea Market Finds",fill:"#c90404"});s.x=.5*this.game.camera.width-.5*s.width,s.fixedToCamera=!0,this.gameMenu.shoot=this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),this.activeCoasters=this.game.add.group(),this.CoasterTimer=this.game.time.create(!1),CryptoCoaster.data.activeCoasters=this.activeCoasters,CryptoCoaster.data.gameObj=this.game,this.CoasterTimer.loop(15*Phaser.Timer.SECOND,this.CoasterSetup),this.CoasterTimer.start(),this.CoasterSetup()},CoasterSetup:function(){CryptoCoaster.data.screamSound.play();var t=CryptoCoaster.data.gameObj.add.sprite(1e3,100,"gameItems","title_coaster.png");CryptoCoaster.data.gameObj.physics.enable(t,Phaser.Physics.ARCADE),t.body.allowGravity=!1,t.body.velocity.x=-180,CryptoCoaster.data.activeCoasters.add(t)},update:function(){this.gameMenu.shoot.isDown&&this.returnToMenu(),this.activeCoasters.forEach(function(t){t.x<-300&&t.kill()},this),(this.cursors.up.isDown||this.spaceBar.isDown)&&this.returnToMenu()},render:function(){},returnToMenu:function(){this.state.start("MainMenu",!0)}};