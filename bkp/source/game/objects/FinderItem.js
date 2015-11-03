var FinderItem = Class.extend({
	init:function(finderModel, context)
	{		
		this.label = finderModel.label;
		this.texture = PIXI.Texture.fromImage(finderModel.url)
		this.img = new PIXI.Sprite(this.texture);
		this.container = new PIXI.DisplayObjectContainer();
		this.container.addChild(this.img);

		var that = this;
		//this.img.position.x = -this.texture.width / 2;
		this.img.position.y = -this.texture.height;// / 2;
		this.container.interactive = false;
		this.context = context;
		var that = this;

		this.container.tap = this.container.click = function(data){// click!            
        	//alert(label);
        	that.context.clickCallback(that);
    	}
    	//this.container.tap = function(data){
            // click!
         // that.context.clickCallback(that);
            //this.alpha = 0.5;
       // }
	},
	getContent:function(){
		return this.container;
	},
	build:function()
	{
	},
	setPosition:function(x,y){
		this.container.position.x = x;
		this.container.position.y = y;
	},
	destroy:function(){
		this.texture.destroy();
		delete this.img;
		delete this.container;
	}
});