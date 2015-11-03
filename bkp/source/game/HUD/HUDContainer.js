var HUDContainer = Class.extend({
	init:function()
	{
		this.container = new PIXI.DisplayObjectContainer();
		this.container.interactive = true;

		this.textContainer = new PIXI.DisplayObjectContainer();
		this.textContainer.interactive = true;

		this.topGraphic = new SimpleSprite("assets/GUI/completeTopBar.png");
		this.topGraphic.setPosition(960/2 - this.topGraphic.getContent().width / 2, -this.topGraphic.getContent().height);
		//this.container.addChild(this.topGraphic.getContent());

		this.baseGraphic = new SimpleSprite("assets/GUI/completeBaseBar2.png");
		this.baseGraphic.setPosition(960/2 - this.baseGraphic.getContent().width / 2, 640);
		//this.container.addChild(this.baseGraphic.getContent());

		this.rufus = new SimpleSprite("assets/GUI/rufus.png");
		this.rufus.setPosition(-this.rufus.getContent().width, 640 - this.rufus.getContent().height - 10);
		//this.container.addChild(this.rufus.getContent());

		this.cogus = new SimpleSprite("assets/GUI/cogus.png");
		this.cogus.setPosition(960, 640 - this.cogus.getContent().height - 10);
		//this.container.addChild(this.cogus.getContent());

		this.container.addChild(this.textContainer);
		//this.textContainer.position.x = this.baseGraphic.getContent().position.x + 120;
		//this.textContainer.position.y = this.baseGraphic.getContent().position.y + 15;
		//this.textContainer.alpha = 0;

		this.labels = new Array();

	},
	show:function(callback){
		TweenLite.to(this.topGraphic.getContent().position, 0.6,{delay:0,y : 10,ease:Back.easeOut});
		TweenLite.to(this.baseGraphic.getContent().position, 0.6,{delay:0.1,y : 640 - this.baseGraphic.getContent().height - 30,ease:Back.easeOut, onComplete:completeBase});
		var that = this;
		function completeBase() {
			that.textContainer.position.y = that.baseGraphic.getContent().position.y + 15;
				//TweenLite.to(that.textContainer, 0.2,{alpha:1});
				//this.textContainer.alpha = 1;

			}
			TweenLite.to(this.cogus.getContent().position, 0.6,{delay:0.2,x :960 - this.cogus.getContent().width - 10,ease:Back.easeOut});
			TweenLite.to(this.rufus.getContent().position, 0.6,{delay:0.3,x :20,ease:Back.easeOut, onComplete:callback});
		//console.log(callback);
	},
	hide:function(callback){
		var that = this;
		TweenLite.to(that.textContainer, 0.2,{alpha:0});
		TweenLite.to(this.topGraphic.getContent().position, 0.6,{delay:0,y : -this.topGraphic.getContent().height,ease:Back.easeOut});
		TweenLite.to(this.baseGraphic.getContent().position, 0.6,{delay:0.1,y : 640,ease:Back.easeOut});
		TweenLite.to(this.cogus.getContent().position, 0.6,{delay:0.2,x :960,ease:Back.easeOut});
		TweenLite.to(this.rufus.getContent().position, 0.6,{delay:0.3,x :-this.rufus.getContent().width,ease:Back.easeOut,onComplete:callback});
	},
	getContent:function(){
		return this.container;
	},
	populateList:function(list)
	{
		//var acumW = 0;
		for (var i =  0; i < list.length; i++) {
			this.addRequest(list[i]);
		};

		//this.textContainer.position.x = 960 / 2 - (acumW / 2 - 10);
		//this.textContainer.position.y = this.baseGraphic.getContent().position.y + this.baseGraphic.getContent().height / 2 - itemRequest.getContent().height / 2 - 50;
		
	},
	//remove atraves do label
	destroyRequest:function(obj)
	{
		var that = this;
		
		TweenLite.to(obj.getContent().position, 0.3,{y :80,ease:Back.easeIn, onComplete:removeR, onCompleteParams:[obj]});
		

		function removeR(removeT)
		{
			that.textContainer.removeChild(removeT.getContent());
			//console.log(removeT);
			removeT = null;
		}

	},
	//remove atraves do label
	removeRequest:function(label)
	{
		var that = this;
		var removeTarget;

		for (var i = 0; i < this.labels.length; i++) {
			if(this.labels[i].label == label)
			{
				removeTarget = this.labels[i];
				this.labels.splice(i,1);
				break;
			}
		};
		TweenLite.to(removeTarget.getContent().position, 0.3,{y :80,ease:Back.easeIn, onComplete:removeR, onCompleteParams:[removeTarget]});
		

		function removeR(removeT)
		{
			that.textContainer.removeChild(removeT.getContent());
			//console.log(removeT);
			removeT = null;
		}

	},
	addRequest:function(label)
	{
		//console.log("add request", label);
		var itemRequest = new RequestItemBox(label)
		this.textContainer.addChild(itemRequest.getContent());
		itemRequest.setPosition(this.labels.length * (176 + 20) + 200, 80);
		this.labels.push(itemRequest);
		TweenLite.to(itemRequest.getContent().position, 0.6,{y :-30,ease:Back.easeOut});

	},
	build:function()
	{

	}
});