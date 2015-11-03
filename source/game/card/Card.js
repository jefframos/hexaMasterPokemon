var Card  =  Class.extend({
	init:function(cardModel, callback, context, isRandom){
		this.container = new PIXI.DisplayObjectContainer();	
		this.id = {i:-1,j:-1}	;
		this.backTeam1 = new SimpleSprite("assets/img/backCard.png");
		this.backTeam2 = new SimpleSprite("assets/img/backCard2.png");

		this.actualTeam = cardModel.team;

		this.isRandom = isRandom;
		
		if(this.isRandom)
		{
			this.actualTeam = 2;
			this.randomSpriteCard = new SimpleSprite("assets/img/cardRandom.png");
		}else
			this.container.setInteractive(true);

		if(cardModel.team == 0)
		{
			this.backSprite = this.backTeam1;
			this.arrowIMG = "assets/img/light.png";

		}
		else
		{
			this.backSprite = this.backTeam2;
			this.arrowIMG = "assets/img/light.png";
		}


		this.backSelectedSprite = new SimpleSprite("assets/img/cardBackSelected.png");

		this.container.addChild(this.backSprite.getContent());
		this.container.addChild(this.backSelectedSprite.getContent());

		this.callback = callback;
		this.cardModel = cardModel;
		this.cardSprite = new SimpleSprite(cardModel.imgURL);		
		this.container.addChild(this.cardSprite.getContent());
		this.cardSprite.setPosition(this.backSprite.container.texture.width/2 - this.cardSprite.container.texture.width/2,
			this.backSprite.container.texture.height/2 - this.cardSprite.container.texture.height/2 - 10);
		this.deselect();
		this.context = context;

		this.width = this.backSprite.container.texture.width;
		this.height = this.backSprite.container.texture.height;
		this.putArrows();
		var that = this;
		this.container.mousedown = this.container.touchstart = function(data){
			that.callback(that);
		}

		var tempTextName = new PIXI.Text(cardModel.name, {font:"20px Arial",fill: "#75FAFA"});
		//this.container.addChild(tempTextName);
		tempTextName.position.x = -tempTextName.width / 2 + this.width/2;
		tempTextName.position.y = 30;

		var tempText = new PIXI.Text(cardModel.att+" / "+cardModel.def, {font:"bold 24px Arial",fill: "#75FAFA"});
		this.container.addChild(tempText);
		tempText.position.x = -tempText.width / 2 + this.width/2;
		// tempText.position.y = -tempText.height / 2 + this.height/2 + 10;
		tempText.position.y = this.height  - tempText.height - 35;

		if(this.randomSpriteCard)
			this.container.addChild(this.randomSpriteCard.getContent());
	},
	updateTeam:function(){
		this.container.removeChild(this.backSprite.getContent());

        if(this.isRandom && this.randomSpriteCard.getContent().parent)
			this.randomSpriteCard.getContent().parent.removeChild(this.randomSpriteCard.getContent());

		if(this.actualTeam == 0)
		{
			this.backSprite = new SimpleSprite("assets/img/backCard.png");
		}
		else if(this.actualTeam == 1)
		{
			this.backSprite = new SimpleSprite("assets/img/backCard2.png");
		}

		this.container.addChildAt(this.backSprite.getContent(),0);
	},
	getOppositeDirection:function(direction){

		if(direction == topLeft){
			return hasDirection(bottomRight,this)
		}else if(direction == topRight){
			return hasDirection(bottomLeft,this)
		}else if(direction == left){
			return hasDirection(right,this)
		}else if(direction == right){
			return hasDirection(left,this)
		}else if(direction == bottomLeft){
			return hasDirection(topRight,this)
		}else if(direction == bottomRight){
			return hasDirection(topLeft,this)
		}
		function hasDirection (testDirection, that) {
			for (var i = that.cardModel.sides.length - 1; i >= 0; i--) {
				if(that.cardModel.sides[i] == testDirection)
					return true;
			}
			return false;
		}
	},
	putArrows:function(){
		var arrow;
		var arrowW;
		var arrowH;
		var arrowContent;
		var correction = 0;
		for (var i = this.cardModel.sides.length - 1; i >= 0; i--) {
			arrowContent = new PIXI.DisplayObjectContainer();
			arrow = new SimpleSprite(this.arrowIMG);		
			arrowW = arrow.container.texture.width;
			arrowH = arrow.container.texture.height;
			arrow.container.position.x = -arrowW/2; 
			arrow.container.position.y = -arrowH/2; 
			arrowContent.addChild(arrow.getContent());
			if(this.cardModel.sides[i] == topLeft){				
				arrowContent.position.x = this.width / 4 + Math.sin(arrowContent.rotation) * correction + 1;
				arrowContent.position.y = this.height * 0.125 +  Math.cos(arrowContent.rotation) * correction + 8;
				 arrowContent.rotation = 60 * 3.14 / 180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == topRight){
				arrowContent.position.x = this.width / 2 + this.width / 4 + Math.sin(arrowContent.rotation) * correction-3;
				arrowContent.position.y = this.height * 0.125 +  Math.cos(arrowContent.rotation) * correction +4;
				 arrowContent.rotation = -60 * 3.14 / 180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == left){
				arrowContent.position.x =correction + 8// + 4;
				arrowContent.position.y = this.height /2;
				// arrowContent.rotation = 90 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == right){
				arrowContent.position.x = this.width - correction  - 8;
				arrowContent.position.y = this.height /2;
				// arrowContent.rotation = 270 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == bottomLeft){
				arrowContent.position.x = this.width / 4 - Math.sin(arrowContent.rotation) * correction - 1;
				arrowContent.position.y = this.height - this.height * 0.125 -  Math.cos(arrowContent.rotation) * correction - 8;
				 arrowContent.rotation = -240 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == bottomRight){
				arrowContent.position.x = this.width / 2 + this.width / 4 - Math.sin(arrowContent.rotation) * correction - 7;
				arrowContent.position.y = this.height - this.height * 0.125 -  Math.cos(arrowContent.rotation) * correction - 13;
				 arrowContent.rotation = 240 * 3.14/180;
				this.container.addChild(arrowContent);
			}
		};
	},
	select:function(){
		this.selected = true;
		this.backSprite.getContent().visible = false;
		this.backSelectedSprite.getContent().visible = true;
	},
	deselect:function(onGridCallback){
		this.selected = false;		
		this.backSprite.getContent().visible = true;
		this.backSelectedSprite.getContent().visible = false;
		if(onGridCallback)
			this.callback = onGridCallback;
	},
	getContent:function(){
		return this.container;
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	}
});



/**
putArrows:function(){
		var arrow;
		var arrowW;
		var arrowH;
		var arrowContent;
		var correction = 0;
		for (var i = this.cardModel.sides.length - 1; i >= 0; i--) {
			arrowContent = new PIXI.DisplayObjectContainer();
			arrow = new SimpleSprite(this.arrowIMG);		
			arrowW = arrow.container.texture.width;
			arrowH = arrow.container.texture.height;
			arrow.container.position.x = -arrowW/2; 
			arrow.container.position.y = -arrowH/2; 
			arrowContent.addChild(arrow.getContent());
			if(this.cardModel.sides[i] == topLeft){				
				arrowContent.position.x = this.width / 4 + Math.sin(arrowContent.rotation) * correction + 1;
				arrowContent.position.y = this.height * 0.125 +  Math.cos(arrowContent.rotation) * correction - 1;
				 arrowContent.rotation = 60 * 3.14 / 180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == topRight){
				arrowContent.position.x = this.width / 2 + this.width / 4 + Math.sin(arrowContent.rotation) * correction;
				arrowContent.position.y = this.height * 0.125 +  Math.cos(arrowContent.rotation) * correction;
				 arrowContent.rotation = -60 * 3.14 / 180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == left){
				arrowContent.position.x =correction - 2// + 4;
				arrowContent.position.y = this.height /2;
				// arrowContent.rotation = 90 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == right){
				arrowContent.position.x = this.width - correction + 1// - 8;
				arrowContent.position.y = this.height /2;
				// arrowContent.rotation = 270 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == bottomLeft){
				arrowContent.position.x = this.width / 4 - Math.sin(arrowContent.rotation) * correction - 1;
				arrowContent.position.y = this.height - this.height * 0.125 -  Math.cos(arrowContent.rotation) * correction + 2;
				 arrowContent.rotation = -240 * 3.14/180;
				this.container.addChild(arrowContent);
			}else if(this.cardModel.sides[i] == bottomRight){
				arrowContent.position.x = this.width / 2 + this.width / 4 - Math.sin(arrowContent.rotation) * correction + 2;
				arrowContent.position.y = this.height - this.height * 0.125 -  Math.cos(arrowContent.rotation) * correction + 1;
				 arrowContent.rotation = 240 * 3.14/180;
				this.container.addChild(arrowContent);
			}
		};
	},
**/