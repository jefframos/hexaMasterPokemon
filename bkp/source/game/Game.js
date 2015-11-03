var Game = AbstractApplication.extend({
	init:function(canvasWidth, canvasHeight)
	{
		this._super(canvasWidth, canvasHeight);	
	},
	build:function()
	{
		//cria o loader, aqui deve ser carregado todos os assets, a aplicação deve começar na callback
		var assetsToLoader = [
		"assets/GUI/button/shapeButton0001.png",
		"assets/GUI/button/shapeButtonLarge0001.png",
		"assets/GUI/button/shapeButton0002.png",
		"assets/GUI/completeBaseBar2.png",
		"assets/GUI/completeTopBar.png",
		"assets/GUI/rufus.png",
		"assets/GUI/cogus.png",
		"assets/img/bgzao.png",
		"assets/GUI/button/shapeButtonLarge0001.png",
		"assets/GUI/button/shapeButtonLarge0002.png"
		]; 		
		this.loader = new PIXI.AssetLoader(assetsToLoader);
		this.initLoad();

		//this.onAssetsLoaded();

		this.stage.setBackgroundColor(0x06161B);
	},
	onProgress:function(){
		this._super();
	},
	onAssetsLoaded:function()
	{
		this._super();

		//cria e adiciona as telas da aplicação
	    var initScreen = new InitScreen("INITSCREEN");
	    var gameScreen = new GameScreen("GAMESCREEN");
	    var wandoScreen = new WandoScreen("Wando");

	    this.screenManager.addScreen(initScreen);
	    this.screenManager.addScreen(gameScreen);	
	    this.screenManager.addScreen(wandoScreen);	

	    //da um foco para a tela de inicio da aplicação    
	    this.screenManager.change("Wando");
	},
});