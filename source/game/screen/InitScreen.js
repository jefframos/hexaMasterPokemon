var InitScreen =  AbstractScreen.extend({
	build: function(){
		var assetsToLoader = [		
		"assets/GUI/button/shapeButtonLarge0001.png",
		"assets/GUI/button/shapeButtonLarge0002.png",
		"assets/GUI/button/midButton0001.png",
		"assets/GUI/button/midButton0002.png",
		"assets/GUI/button/textfield.png",
		"assets/img/back1.png"
		];
		this.loader = new PIXI.AssetLoader(assetsToLoader);
		this.initLoad();

		
	},
	onProgress:function(){
		this._super();
		//console.log("init progress - " + Math.floor(this.loadPercent * 100));
	},
	onAssetsLoaded:function(){
		var that = this;
		this.background = new SimpleSprite("assets/img/back1.png");
		this.addChild(this.background);

		this.button = new DefaultButton("assets/GUI/button/shapeButtonLarge0001.png","assets/GUI/button/shapeButtonLarge0002.png");
		this.button.build(205,80); 
		this.button.addLabel(new PIXI.Text("PLAY", {font:"50px Luckiest Guy", fill:"#3F357F",align:"center"}), 50,11, false)
		this.button.addLabel(new PIXI.Text("PLAY", {font:"50px Luckiest Guy", fill:"white",align:"center"}), 48,9, false)
		this.button.setPosition(this.canvasArea.x -this.button.width -20,this.canvasArea.y);
		this.addChild(this.button);

		this.button2 = new DefaultButton("assets/GUI/button/shapebuttonLarge0001.png","assets/GUI/button/shapebuttonLarge0002.png");
		this.button2.build(205,80); 
		this.button2.addLabel(new PIXI.Text("PLAY2", {font:"50px Luckiest Guy", fill:"#3F357F",align:"center"}), 50,11, false)
		this.button2.addLabel(new PIXI.Text("PLAY2", {font:"50px Luckiest Guy", fill:"white",align:"center"}), 48,9, false)
		this.button2.setPosition(this.canvasArea.x -this.button2.width -20,this.canvasArea.y - 100);
		this.addChild(this.button2);

		this.buttonDesign = new DefaultButton("assets/GUI/button/midButton0001.png","assets/GUI/button/midButton0002.png");
		this.buttonDesign.build(124,42); 
		this.buttonDesign.addLabel(new PIXI.Text("DESIGN", {font:"25px Luckiest Guy", fill:"#3F357F",align:"center"}), 26,9, false)
		this.buttonDesign.addLabel(new PIXI.Text("DESIGN", {font:"25px Luckiest Guy", fill:"white",align:"center"}), 24,7, false)
		this.buttonDesign.setPosition(20,this.canvasArea.y);
		this.addChild(this.buttonDesign);

		this.buttonMenu = new DefaultButton("assets/GUI/button/midButton0001.png","assets/GUI/button/midButton0002.png");
		this.buttonMenu.build(124,42); 
		this.buttonMenu.addLabel(new PIXI.Text("MENU", {font:"25px Luckiest Guy", fill:"#3F357F",align:"center"}), 32,9, false)
		this.buttonMenu.addLabel(new PIXI.Text("MENU", {font:"25px Luckiest Guy", fill:"white",align:"center"}), 30,7, false)
		this.buttonMenu.setPosition(20,-this.buttonMenu.height);
		this.addChild(this.buttonMenu);

		this.txtFieldBg = new SimpleSprite("assets/GUI/button/textfield.png");
		this.addChild(this.txtFieldBg);
		this.txtFieldBg.setPosition(this.buttonDesign.getContent().position.x + 20 + this.buttonDesign.width,this.canvasArea.y);

		this.textField = new PIXI.Text("$ 152", {font:"18px Luckiest Guy", fill:"white",align:"center"}) 
		this.addChild(this.textField);
		this.textField.position.x = (this.buttonDesign.getContent().position.x + 20 + this.buttonDesign.width + 20);
		this.textField.position.y = this.canvasArea.y;

		TweenLite.to(that.button.getContent().position, 0.6,{y : this.canvasArea.y-this.button.height - 20,ease:Back.easeOut});
		TweenLite.to(that.button2.getContent().position, 0.6,{y : this.canvasArea.y-this.button.height - 120,ease:Back.easeOut});
		TweenLite.to(that.buttonDesign.getContent().position, 0.6,{y : this.canvasArea.y-this.buttonDesign.height - 20,ease:Back.easeOut});
		TweenLite.to(that.buttonMenu.getContent().position, 0.6,{y : 20,ease:Back.easeOut});
		TweenLite.to(that.txtFieldBg.getContent().position, 0.6,{y : this.canvasArea.y-this.buttonDesign.height - 10 ,ease:Back.easeOut});
		TweenLite.to(that.textField.position, 0.6,{y : this.canvasArea.y-this.buttonDesign.height - 10 ,ease:Back.easeOut});

		this.button2.clickCallback = function(){
			//console.log(that.childs.length);
			TweenLite.to(that.button.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn, onComplete:changeScreen});
			TweenLite.to(that.button2.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});
			TweenLite.to(that.buttonMenu.getContent().position, 0.6,{y : -that.buttonMenu.height,ease:Power4.easeIn});
			TweenLite.to(that.buttonDesign.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});
			TweenLite.to(that.txtFieldBg.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});
			TweenLite.to(that.textField.position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});

			//that.screenManager.change("GAMESCREEN");
			//that.player.spritesheet.play("idle");
			//that.removeChild(this);
			function changeScreen() {
				console.log("PORRA DO MEU CU")
				that.screenManager.change("Wando");
			}
		};

		this.button.clickCallback = function(){
			//console.log(that.childs.length);
			TweenLite.to(that.button.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn, onComplete:changeScreen});
			TweenLite.to(that.buttonMenu.getContent().position, 0.6,{y : -that.buttonMenu.height,ease:Power4.easeIn});
			TweenLite.to(that.buttonDesign.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});
			TweenLite.to(that.txtFieldBg.getContent().position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});
			TweenLite.to(that.textField.position, 0.6,{y : that.canvasArea.y,ease:Power4.easeIn});

			//that.screenManager.change("GAMESCREEN");
			//that.player.spritesheet.play("idle");
			//that.removeChild(this);
			function changeScreen() {
				that.screenManager.change("GAMESCREEN");
			}
		};
	},
	update: function(){
		this._super();
	}
});