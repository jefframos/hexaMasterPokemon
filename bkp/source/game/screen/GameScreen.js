var GameScreen =  AbstractScreen.extend({	
	build: function(){
		//tudo começa lendo um json por ajax
		this.mapData;
		var that = this;
		$.ajax({
			url : "assets/tilemap1.json",
			dataType : "json",
			type : "get"
		}).done(function (response) {
			that.mapData = response;
			//apos carregar o mapa, chama a interface

			that.tilesets = that.mapData.tilesets;
			that.tilesetLayers = that.mapData.layers;
			that.arrayFinderModel = new Array();
			that.collectList = new Array();
			that.displayList = new Array();

			//adiciona os elementos a serem carregados
			var assetsToLoader = [
			"assets/GUI/button/shapeSquare0001.png"
			];
			//verifica no json quais os assets que tem que ser carregados e adiciona no loader
			for (var i = that.tilesets.length - 1; i >= 0; i--) {
				that.arrayFinderModel.push(new FinderModel(that.tilesets[i].name,"assets/"+ that.tilesets[i].image, that.tilesets[i].firstgid) );
				assetsToLoader.push("assets/"+ that.tilesets[i].image);
			};

			that.loader = new PIXI.AssetLoader(assetsToLoader);
			that.initLoad();			
		});		
	},


	//onCompleteLoaded
	onAssetsLoaded:function(){
		var that = this;
		//cria a HUD
		this.HUD = new HUDContainer();
		this.objectsContainer = new PIXI.DisplayObjectContainer();
		this.addChild(this.objectsContainer);		
		this.addChild(this.HUD);		
		
		this.HUD.show(onEndShow);
		
		function onEndShow() {
			//inicia a cena após mostrar a HUD
			that.initScene();
		}

		//adiciona um botao e suas callbacks
		this.button = new DefaultButton("assets/GUI/button/shapeButton0001.png","assets/GUI/button/shapeButton0002.png","assets/GUI/button/shapeButton0001.png");
		this.button.build(103,37); 
		this.button.addLabel(new PIXI.Text("BACK", {font:"20px Luckiest Guy", fill:"#3F357F",align:"center"}), 30,7, false)
		this.button.addLabel(new PIXI.Text("BACK", {font:"20px Luckiest Guy", fill:"white",align:"center"}), 28,5, false)	
		this.addChild(this.button);
		this.button.setPosition(20,20);
		this.button.getContent().alpha = 0;
		TweenLite.to(this.button.getContent(), .2, {delay:0.4, alpha:1});
		this.button.clickCallback = function(){
			that.HUD.hide(onEndHide);
			TweenLite.to(that.button.getContent(), .2, {alpha:0});
		};
		function onEndHide() {			
			that.screenManager.change("INITSCREEN");
		}
	},
	//inicia a cena
	initScene:function(){
		//carrega os objetos e coloca na tela e na displaylist
		for (var i = 0; i < this.tilesetLayers.length; i++) {
		//for (var i = this.tilesetLayers.length - 1; i >= 0; i--) {
			if(this.tilesetLayers[i].objects != undefined)
			{
				//for (var j = 0; j < this.tilesetLayers[i].objects.length; j++) {
				for (var j =  this.tilesetLayers[i].objects.length - 1; j >= 0; j--) {
					//console.log(this.getModelById(this.tilesetLayers[i].objects[j].gid));
					var tempModel = this.getModelById(this.tilesetLayers[i].objects[j].gid);
					//this.collectList.push(tempModel.label);

					var tempItem  = new FinderItem(tempModel, this);
					//if(this.tilesetLayers[i].objects[j].properties.interactive){
					//console.log(this.tilesetLayers[i].objects[j].properties.interactive);
					if(this.tilesetLayers[i].objects[j].properties.interactive != undefined){
						this.collectList.push(tempModel.label);
						tempItem.container.interactive = true;
					}
					else
					{
						tempItem.container.interactive = false;
					}

					tempItem.build();
					//console.log(this.tilesetLayers[i].objects[j]);
					tempItem.setPosition(this.tilesetLayers[i].objects[j].x,this.tilesetLayers[i].objects[j].y);			
					this.displayList.push(tempItem);

					

					this.objectsContainer.addChild(tempItem.getContent());


				};
			}
		};
		// console.log("Arrumar os interactive");
		this.collectList = ArrayUtils.shuffle(this.collectList);
		this.HUD.addRequest(this.collectList[0]);
		//this.collectList.splice(0,1);
		this.HUD.addRequest(this.collectList[1]);
		//this.collectList.splice(0,1);

		this.HUD.addRequest(this.collectList[2]);
		//this.collectList.splice(0,1);

		
		// for (var j = 0; j < this.displayList.length; j++) {
		// 	for (var i = 0; i < this.collectList.length; i++) {
		// 		if(this.displayList[j].label == this.collectList[i])
		// 		{
		// 			this.displayList[j].container.interactive = true;
		// 		}
		// 	};
		// 	this.addChild(this.displayList[j]);
		// };			
	},
	destroy:function(){
			this._super();
			this.objectsContainer.parent.removeChild(this.objectsContainer);
			this.objectsContainer = null;
			delete this.objectsContainer;
	},
	getModelById:function(id){
		for (var i = this.arrayFinderModel.length - 1; i >= 0; i--) {
			if(this.arrayFinderModel[i].id == id)
				return this.arrayFinderModel[i];
		}
	},
	clickCallback:function(clickedObject){
		var that = this;
		var idRemove = -1;
		var objRemove;
		for (var i = this.collectList.length - 1; i >= 0; i--) {
			if(this.collectList[i] == clickedObject.label)
			{
				this.collectList.splice(i,1);
				for (var j = this.HUD.labels.length - 1; j >= 0; j--) {

					if(this.HUD.labels[j].label  == clickedObject.label){
						idRemove = j;
					}
				}
				if(idRemove < 0)
					return
				else
				{
					objRemove = this.HUD.labels[idRemove];
					this.HUD.labels.splice(idRemove,1);
				}
				var scl = 1.1;
				this.container.addChildAt(clickedObject.getContent(), this.container.children.length);

				var timeline = new TimelineLite();	
				timeline.add(  
					TweenLite.to(clickedObject.getContent().scale, 0.6, {y: clickedObject.getContent().scale.y < 0 ? -scl : scl , x:clickedObject.getContent().scale.x < 0 ? -scl : scl,ease:Back.easeOut })
					);

				timeline.add(
					TweenLite.to(clickedObject.getContent().position, 0.6, {
						x:objRemove.getContent().position.x + this.HUD.textContainer.position.x +objRemove.img.width / 2 - clickedObject.img.width / 2, 
						y:objRemove.getContent().position.y+  this.HUD.textContainer.position.y +objRemove.img.height / 2 + clickedObject.img.height / 2,
						onComplete:completeGoOut, onCompleteParams:[clickedObject, objRemove] })
					);
				//TODO: DA PAU QUANDO CLICO EM MUITOS OBJETOS
				function completeGoOut(clickedObject, objRemove)
				{
					that.HUD.destroyRequest(objRemove);
					console.log(that.HUD.labels.length);
					//that.HUD.removeRequest(clickedObject.label);
					// that.objectsContainer.removeChild(clickedObject.container.parent);
					clickedObject.container.parent.removeChild(clickedObject.container);

					that.removeChild(clickedObject);
					clickedObject = null;

					if(that.HUD.labels.length <= 0 && that.collectList.length >= 3 && !that.onTimeout)
					{
						that.onTimeout = true;
						setTimeout(function() {
							that.HUD.addRequest(that.collectList[0]);
							//that.collectList.splice(0,1);
							that.HUD.addRequest(that.collectList[1]);
							//that.collectList.splice(0,1);
							that.HUD.addRequest(that.collectList[2]);

							that.onTimeout = false;

						}, 1200);						
					}
				}
			timeline.resume();
			return
			}
		};
	}

});