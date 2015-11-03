var RequestItemBox = Class.extend({
	init:function(label)
	{
		this.label = label;
		this.texture = PIXI.Texture.fromImage("assets/GUI/button/shapeSquare0001.png");
		this.img = new PIXI.Sprite(this.texture);
		this.container = new PIXI.DisplayObjectContainer();
		this.container.addChild(this.img);
		var  testeTexto = new PIXI.Text(label, {font:"20px Luckiest Guy", fill:"#3F357F", align:"center"});
		var  testeTexto2 = new PIXI.Text(label, {font:"20px Luckiest Guy", fill:"white", align:"center"});
		this.container.addChild(testeTexto);
		this.container.addChild(testeTexto2);
		testeTexto.position.x = this.img.width / 2 - testeTexto.width / 2;
		testeTexto.position.y = this.img.height / 2 - testeTexto.height / 2;

		testeTexto2.position.x = this.img.width / 2 - testeTexto2.width / 2 - 2;
		testeTexto2.position.y = this.img.height / 2 - testeTexto2.height / 2 - 2;
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
	}
})