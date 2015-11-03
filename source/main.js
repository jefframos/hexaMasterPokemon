var windowWidth = 960,
windowHeight = 640;

var topLeft = "topLeft";
var topRight = "topRight";
var right = "right";
var left = "left";
var bottomLeft = "bottomLeft";
var bottomRight = "bottomRight";
var game;
var renderer;
var boardConfig;
var canvas

var initialize = function(serial){
	console.log("Initialize!");
	boardConfig = serial;
	// cria o renter
	renderer = PIXI.autoDetectRenderer(windowWidth, windowHeight);
	// adiciona o render
	document.body.appendChild(renderer.view);

	//inicia o game e da um build
	game = new Game(windowWidth, windowHeight);
	game.build();

	//chama o loop da aplicação
	requestAnimFrame( update );

	// Optimize for Retina Display
	canvas = document.querySelector("canvas"),
	devicePixelRatio = window.devicePixelRatio;
	canvas.style.width = (canvas.width / devicePixelRatio) + "px";
	canvas.style.height = (canvas.height / devicePixelRatio) + "px";
}

//initialize();

//loop da aplicação
function update() {
	requestAnimFrame( update );
	game.update();
	renderer.render(game.stage);
}



