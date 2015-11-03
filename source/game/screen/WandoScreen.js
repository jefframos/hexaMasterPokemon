var WandoScreen = AbstractScreen.extend({
    init: function (label) {
        this._super(label);
    },
    destroy: function () {
        this._super();
        console.log("É PRA DESTRUIR AQUI")


        this.gridList = new Array();
        this.cardModelList = new Array();
        this.cardsList = new Array();

        delete this.boardContainer
        delete this.myCardsContainer
        delete this.opponendCardsContainer
    },
    build: function () {
        var that = this;
        console.log(boardConfig);
        this.selectedCard = null;
        this.hasLoaded = false;
        this.boardContainer = new PIXI.DisplayObjectContainer();
        this.gridList = new Array();
        this.cardModelList = new Array();
        this.cardsList = new Array();
        this.button = new DefaultButton("assets/GUI/button/shapeButton0001.png", "assets/GUI/button/shapeButton0002.png", "assets/GUI/button/shapeButton0001.png");
        this.myCardsContainer = new PIXI.DisplayObjectContainer();
        this.myCardsContainer.position.x = 20;
        this.levels;
        this.builderGameInfo = new Array();
        this.hasOpponent = false;
        this.shuffleGridArray = null;
        this.textScore = new PIXI.Text("0x0", {
            font: "50px Reconstruct",
            fill: "white"
        });

        this.cardsLoaded = 0;
        this.cardsTotal = 0;

        this.textScore.position.x = this.canvasArea.x / 2 - this.textScore.width / 2;

        this.opponendCardsContainer = new PIXI.DisplayObjectContainer();
        this.opponendCardsContainer.position.x = 840;

        this.button.build(180, 50);
        this.button.addLabel(new PIXI.Text("WANDO", {
            font: "50px Luckiest Guy",
            fill: "white",
            align: "center"
        }), 10, 10, true)

        //this.addChild(this.button);
        this.addChild(this.boardContainer);
        this.addChild(this.myCardsContainer);
        this.addChild(this.opponendCardsContainer);
        this.addChild(this.textScore);

        this.button.clickCallback = function () {
            that.screenManager.change("INITSCREEN");
        }

        var that = this;

        //var linkk = $.trim(boardConfig[5].value);

        var jsonLevels = function (response) {
            that.levels = response;
            that.hasLoaded = true;

            var id1 = 0;
            var id2 = 0;
            if (boardConfig[4].value == "low") {
                id1 = 0;
                id2 = 1;
            } else if (boardConfig[4].value == "bal") {
                id1 = 1;
                id2 = 2;
            } else {
                id1 = 3;
                id2 = 4;
            }
            var temp = that.levels.levels[id1];
            temp.concat(that.levels.levels[id2]);
            var arrayPoke = ArrayUtils.shuffle(temp);

            that.loadJSON(arrayPoke.pop(), false, 0);
            that.loadJSON(arrayPoke.pop(), false, 0);
            that.loadJSON(arrayPoke.pop(), false, 0);
            that.loadJSON(arrayPoke.pop(), false, 0);
            that.loadJSON(arrayPoke.pop(), false, 0);

            that.loadJSON(arrayPoke.pop(), false, 1);
            that.loadJSON(arrayPoke.pop(), false, 1);
            that.loadJSON(arrayPoke.pop(), false, 1);
            that.loadJSON(arrayPoke.pop(), false, 1);
            that.loadJSON(arrayPoke.pop(), false, 1);

            // that.loadJSON(arrayPoke.pop(), parseInt(boardConfig[3].value) <= 0, 1);

            for (var i = 0; i < parseInt(boardConfig[3].value); i++) {
                that.loadJSON(Math.floor(Math.random() * 300 + 1), i + 1 == parseInt(boardConfig[3].value), 2);
            };
        }

        if(myDataRef){
	        myDataRef.on('child_added', function (snapshot) {
	        	console.log("2nd child ad9e25d");
	            var message = snapshot.val();
	            that.conectedUsers;

	            if (message.id != window.playerId) {
	                that.hasOpponent = true;

	                if (message.type == "build") {
	                    that.shuffleGridArray = message.shuffleBlocks;
	                    that.totRandomBlocks = message.totRandomBlocks;
	                    console.log(message.builderGameInfo)
	                    for (var i = 0; i < message.builderGameInfo.length; i++) {
	                        that.loadJSON(message.builderGameInfo[i].id, message.builderGameInfo[i].last, message.builderGameInfo[i].team, true, message.infoSideCards);
	                    };
	                }else if(message.type == "putCard"){
	                	console.log(message)
	                	that.selectedCard =  that.getCardByName(message.cardName);
	                	that.clickOnGrid(that.getGrid(message.grid.i,message.grid.j));
	                }
	            }
	            if(message.type != "board"){
	            
		            if (that.hasOpponent)
		                console.log("recebe os paranaue")
		            else if (!that.hasLoaded)
		                $.getJSON("assets/pokemon/pokelevels.json", jsonLevels);
	        	}
	        });
		}else
		 $.getJSON("assets/pokemon/pokelevels.json", jsonLevels);
    },
    loadJSON: function (id, last, team, opponent, infoSideCards) {
        var that = this;
        this.cardsTotal += 1;

        if (parseInt(id) < 10)
            idStr = "00" + id;
        else if (parseInt(id) < 100)
            idStr = "0" + id;
        else
            idStr = id;

        //se nao for opponente
        if (!opponent)
            that.builderGameInfo.push({
                id: parseInt(id),
                last: last,
                team: team
            });

        $.getJSON("assets/pokemon/json/pokedex_full_" + idStr + ".json", function (response) {
            that.jsonLoaded(response, idStr, last, team, infoSideCards);
        });
    },
    //carrega pelo json
    jsonLoaded: function (response, idStr, last, team, infoSideCards) {

        var that = this;
        var tempAtt = 0;
        var tempDef = 0;
        var tempSpcDef = 0;
        var tempSpcAtt = 0;

        this.cardsLoaded += 1;

        tempAtt = parseInt(response.stats.attack);
        tempDef = parseInt(response.stats.defense);
        tempSpcDef = parseInt(response.stats.specDefense);
        tempSpcAtt = parseInt(response.stats.specAttack);
        var sidesArray = null;
        if(infoSideCards){        
	        for (var i = infoSideCards.length - 1; i >= 0; i--) {
	        	if(infoSideCards[i].name == response.name)
	        		sidesArray = infoSideCards[i].sides; 
	        };
    	}
        that.cardModelList.push(new CardModel(
            response.name, (tempAtt + tempSpcAtt) / 2, (tempDef + tempSpcDef) / 2,
            response.stats.speed,
            team,
            "assets/pokemon/" + response.thumb_url, sidesArray));

        if (this.cardsLoaded == this.cardsTotal) {
            setTimeout(function () {
                console.log(that.builderGameInfo)
                that.initLoadScreen();
            }, 100);
        }
    },
    //carrega os XML dos pokemons
    loadXML: function (id, last, team) {
        var that = this;
        var ajax = new XMLHttpRequest();
        var idStr = "";
        if (id < 10)
            idStr = "00" + id;
        else if (id < 100)
            idStr = "0" + id;
        else
            idStr = id;
        ajax.open("GET", "assets/pokemon/xml/pokedex_full_" + idStr + ".xml", true);
        ajax.send();
        ajax.onreadystatechange = function () {
            if (ajax.readyState == 4) {
                var xml = ajax.responseXML;
                var tempAtt = 0;
                var tempDef = 0;
                var tempSpcDef = 0;
                var tempSpcAtt = 0;
                tempAtt = parseInt(xml.getElementsByTagName('stats')[0].getAttribute("attack"));
                tempDef = parseInt(xml.getElementsByTagName('stats')[0].getAttribute("defense"));
                tempSpcDef = parseInt(xml.getElementsByTagName('stats')[0].getAttribute("specDefense"));
                tempSpcAtt = parseInt(xml.getElementsByTagName('stats')[0].getAttribute("specAttack"));
                that.cardModelList.push(new CardModel(
                    xml.getElementsByTagName('pokemon')[0].getAttribute("name"), (tempAtt + tempSpcAtt) / 2, (tempDef + tempSpcDef) / 2,
                    xml.getElementsByTagName('stats')[0].getAttribute("speed"),
                    team,
                    "assets/pokemon/thumbs/" + idStr + ".png"));
                if (last) {
                    setTimeout(function () {
                        that.initLoadScreen();
                    }, 100);
                }

            }
        }
    },
    //inicia o carregamento dos assets da tela
    initLoadScreen: function () {
        //adiciona os elementos a serem carregados
        var assetsToLoader = [
            "assets/img/card.png",
            "assets/img/cardBlock.png",
            "assets/img/backCard.png",
            "assets/img/backCard2.png",
            "assets/img/cardBackSelected.png",
            "assets/img/arrowAttack.png",
            "assets/img/arrowAttack2.png",
            "assets/img/light.png",
            "assets/img/testeGIF.gif",
            "assets/img/teste.png",
            "assets/img/cardRandom.png",
            "assets/img/hexa.png",
        ];
        for (var i = this.cardModelList.length - 1; i >= 0; i--) {
            assetsToLoader.push(this.cardModelList[i].imgURL);
        };
        this.loader = new PIXI.AssetLoader(assetsToLoader);
        this.initLoad();
    },
    //inicia a app com tudo já carregado
    onAssetsLoaded: function () {

    	var sendBuild = false;
        this._super();
        var centerPoint = {
            x: -60,
            y: 0
        };

        //cria o board		
        var isHex = boardConfig[0].value == "hex";
        var boardDimensions = {
            x: parseInt(boardConfig[1].value),
            y: parseInt(boardConfig[2].value)
        };

        console.log("create board");
        this.boardSize = this.createBoard(isHex, boardDimensions, centerPoint, {
            w: 105,
            h: 120
        });


 // this.boardSize = this.createBoard(isHex, boardDimensions, centerPoint, {
 //            w: 102,
 //            h: 117
 //        });


        if (this.shuffleGridArray == null) {
            this.totRandomBlocks = Math.floor(Math.random() * 7 + 1);
            this.shuffleGridArray = new Array();
            for (var i = 0; i < this.gridList.length; i++) {
                this.shuffleGridArray.push(i);
            };
            this.shuffleGridArray = ArrayUtils.shuffle(this.shuffleGridArray);
        	sendBuild = true;
           
        }
        for (var i = 0; i < this.totRandomBlocks; i++) {
            this.gridList[this.shuffleGridArray[i]].setBlock();
        };
        this.boardContainer.position.x = this.canvasArea.x / 2 - this.boardSize.x / 2;
        this.boardContainer.position.y = this.canvasArea.y / 2 - this.boardSize.y / 2;
        var simp = new SimpleSprite("assets/img/testeGIF.gif");

        var xAcum = 2;
        var up = false;
        var oppxAcum = 2;
        var oppup = false;
        var maxY = 0;
        var myYacum = 0;
        var oppYacum = 0;
        var firstSec = false;
        var acumRandons = 9;
        for (var i = 0; i < this.cardModelList.length; i++) {
            var tempCard = new Card(this.cardModelList[i], this.clickCardCallback, this, this.cardModelList[i].team == 2 ? true : false);
            tempCard.id = i;
            this.cardsList.push(tempCard);

            if (this.cardModelList[i].team == 0) {
                this.myCardsContainer.addChild(tempCard.getContent());
                tempCard.setPosition(tempCard.backSprite.container.texture.width / 2 * xAcum, (tempCard.backSprite.container.texture.height - tempCard.backSprite.container.texture.height * 0.25) * myYacum);
                myYacum++;
                tempCard.getContent().scale = {
                    x: 0.8,
                    y: 0.8
                }
                if (up)
                    xAcum++;
                else
                    xAcum--;
                if (xAcum <= 0) {
                    up = true;
                }
            } else if (this.cardModelList[i].team == 1) {
                if (!firstSec) {
                    firstSec = true;
                    oppxAcum = -2;
                    oppup = false;
                }
                this.opponendCardsContainer.addChild(tempCard.getContent());
                tempCard.setPosition(tempCard.backSprite.container.texture.width / 2 * oppxAcum, (tempCard.backSprite.container.texture.height - tempCard.backSprite.container.texture.height * 0.25) * oppYacum);
                oppYacum++;
                tempCard.getContent().scale = {
                    x: 0.8,
                    y: 0.8
                }
                if (oppup)
                    oppxAcum--
                else
                    oppxAcum++;
                if (oppxAcum >= 0) {
                    oppup = true;
                }
            } else {
                this.opponendCardsContainer.addChild(tempCard.getContent());
                tempCard.container.scale = {
                    x: .75,
                    y: .75
                }
                var grid = this.gridList[this.shuffleGridArray[acumRandons]];
                acumRandons++;
                tempCard.id = grid.id;
                tempCard.setPosition(grid.container.position.x - tempCard.getContent().parent.position.x + this.boardContainer.position.x - (tempCard.width * tempCard.container.scale.x) / 2,
                    grid.container.position.y - tempCard.getContent().parent.position.y + this.boardContainer.position.y - (tempCard.height * tempCard.container.scale.y) / 2);

                tempCard.getContent().scale.x = 0;
                tempCard.getContent().scale.y = 0;
                TweenLite.to(tempCard.getContent().scale, .5, {
                    delay: 0.4,
                    x: .75,
                    y: .75,
                    ease: Back.easeOut
                });
            }
        };

        if(sendBuild){
        	var infoSideCards = new Array();
        	for (var i = this.cardsList.length - 1; i >= 0; i--) {
        		infoSideCards.push({name:this.cardsList[i].cardModel.name, sides:this.cardsList[i].cardModel.sides})
        	};
        	console.log(infoSideCards)
        	if(myDataRef) myDataRef.push({
                type: "build",
                totRandomBlocks: this.totRandomBlocks,
                shuffleBlocks: this.shuffleGridArray,
                builderGameInfo: this.builderGameInfo,
                infoSideCards:infoSideCards,
                id: window.playerId
            });
        }
    },
    clickOnGrid: function (grid) {

        if (this.selectedCard && this.getCardOnGrid(grid.id.i, grid.id.j) == null) {

        	//debugger;
        	//enviar o id do card e depois buscar ele

        	if(myDataRef)myDataRef.push({type: "putCard", cardName:this.selectedCard.cardModel.name, selectedCard: this.selectedCard.id, grid: grid.id, id: window.playerId});

            this.selectedCard.container.scale = {
                x: .75,
                y: .75
            }
            this.selectedCard.id = grid.id;
            TweenLite.to(this.selectedCard.getContent().position, 0.3, {
                x: grid.container.position.x - this.selectedCard.getContent().parent.position.x + this.boardContainer.position.x - (this.selectedCard.width * this.selectedCard.container.scale.x) / 2,
                y: grid.container.position.y - this.selectedCard.getContent().parent.position.y + this.boardContainer.position.y - (this.selectedCard.height * this.selectedCard.container.scale.y) / 2
            })
            var that = this;
            setTimeout(function () {
                var neighbors = that.getNeighbors(that.selectedCard);
                var cardNeighbor;
                var atacou = false;
                console.log(neighbors);

                that.attackList = new Array();
                for (temp in neighbors) {
                    cardNeighbor = that.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                    console.log(cardNeighbor);

                    if (cardNeighbor) {
                        that.attackList.push({
                            card: cardNeighbor,
                            side: temp
                        });
                    }
                };
                if (that.attackList.length == 1) {
                    that.attack(that.selectedCard, that.attackList[0].card, that.attackList[0].side, true);
                    atacou = true;
                } else if (that.attackList.length > 1) {
                    var acumopp = 0;
                    for (var i = that.attackList.length - 1; i >= 0; i--) {
                        var oppositeSide = that.attackList[i].card.getOppositeDirection(that.attackList[i].side);
                        if (oppositeSide)
                            acumopp++;
                    };


                    if (acumopp <= 1) {
                        for (var i = that.attackList.length - 1; i >= 0; i--) {
                            that.attack(that.selectedCard, that.attackList[i].card, that.attackList[i].side, true);
                        };
                        atacou = true;
                    } else {

                    }
                } else {}
                // that.selectedCard.setPosition(
                // 	grid.container.position.x-that.selectedCard.getContent().parent.position.x + that.boardContainer.position.x - (that.selectedCard.width * that.selectedCard.container.scale.x) / 2,
                // 	grid.container.position.y-that.selectedCard.getContent().parent.position.y + that.boardContainer.position.y - (that.selectedCard.height * that.selectedCard.container.scale.y) / 2);
                that.selectedCard.deselect(that.callbackCardOnGrid);
                if (atacou) {
                    that.selectedCard = null;
                    that.attackList = new Array();
                }
                that.getScore();
            }, 300);
            //console.log("o card "+this.selectedCard.cardModel.name+" esta na posicao "+this.selectedCard.id.i+"-"+this.selectedCard.id.j+" do grid");
        }
        this.getScore();
    },
    callbackCardOnGrid: function (card) {
        var that = card.context;

        var tempAttackList = new Array();
        var tempFirstCard = null;
        var ableToAttack = false;
        for (var i = that.attackList.length - 1; i >= 0; i--) {
            if (card == that.attackList[i].card) {
                tempFirstCard = that.attackList[i];
                ableToAttack = true;
            } else {
                tempAttackList.push({
                    card: that.attackList[i].card,
                    side: that.attackList[i].side
                });
            }
        };
        if (ableToAttack) {
            that.attackList = new Array();
            if (tempFirstCard)
                that.attackList.push(tempFirstCard)

            for (var i = tempAttackList.length - 1; i >= 0; i--) {
                that.attackList.push(tempAttackList[i]);
            };

            // console.log(that.attackList, tempAttackList)
            for (var i = 0; i < that.attackList.length; i++) {
                that.attack(that.selectedCard, that.attackList[i].card, that.attackList[i].side, true);
            };
        }
        that.getScore();
    },
    /**
	o que está funcionando atualmente:
	ataque simples
	ataque com defesa
	ataque com propagação
	ataque multiplo com cartas sem defesa
	ataque multiplo com ao menos uma carta com defesa
	ataque multiplo com 2 ataques simultaneos

	**/

    attack: function (cardAtt, cardDef, direction, propagation, force) {
        if (force) //força
        {
            cardDef.actualTeam = cardAtt.actualTeam;
            cardDef.updateTeam();
            this.getScore();
        } else if (cardDef.actualTeam != cardAtt.actualTeam) { //ganhei
            var oppositeSide = cardDef.getOppositeDirection(direction);
            if (cardDef.cardModel.def < cardAtt.cardModel.att || !oppositeSide) {


                cardDef.actualTeam = cardAtt.actualTeam;
                cardDef.updateTeam();
                if (!oppositeSide)
                    console.log("o card " + cardAtt.cardModel.name + " ganhou " + cardDef.cardModel.name);
                else
                    console.log("o card " + cardAtt.cardModel.name + " atacou e ganhou de " + cardDef.cardModel.name);

                if (propagation && oppositeSide) {
                    var neighbors = this.getNeighbors(cardDef);
                    var cardNeighbor;
                    for (temp in neighbors) {
                        cardNeighbor = this.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                        if (cardNeighbor && cardNeighbor != cardAtt)
                            this.attack(cardDef, cardNeighbor, temp, false, true);
                    };
                }
            } else // perdi
            {
                if (cardDef.actualTeam == 2) {
                    if (cardAtt.actualTeam == 0) {
                        cardAtt.actualTeam = 1;
                        cardDef.actualTeam = 1;
                    } else if (cardAtt.actualTeam == 1) {
                        cardAtt.actualTeam = 0;
                        cardDef.actualTeam = 0;
                    }

                } else
                    cardAtt.actualTeam = cardDef.actualTeam;
                cardAtt.updateTeam();

                console.log("o card " + cardAtt.cardModel.name + " perdeu de " + cardDef.cardModel.name);


                var neighbors = this.getNeighbors(cardAtt);
                var cardNeighbor;
                for (temp in neighbors) {
                    cardNeighbor = this.getCardOnGrid(neighbors[temp].i, neighbors[temp].j);
                    if (cardNeighbor)
                        this.attack(cardAtt, cardNeighbor, temp, false, true);
                };

                this.getScore();
            }
        }

        this.getScore();
    },
    getScore: function () {
        var temp1 = 0;
        var temp2 = 0;
        for (var i = this.cardsList.length - 1; i >= 0; i--) {
            if (this.cardsList[i].id.i >= 0) {
                if (this.cardsList[i].actualTeam == 0)
                    temp1++;
                else if (this.cardsList[i].actualTeam == 1)
                    temp2++;
            }
        };
        // console.log(temp1, temp2);

        this.textScore.parent.removeChild(this.textScore);
        this.textScore = new PIXI.Text(temp1 + "x" + temp2, {
            font: "50px Reconstruct",
            fill: "white"
        });
        this.textScore.position.x = this.canvasArea.x / 2 - this.textScore.width / 2;
        this.addChild(this.textScore);

        return {
            score1: temp1,
            score2: temp2
        }
    },
    getGrid: function (i, j) {
        for (var k = this.gridList.length - 1; k >= 0; k--) {
            if (this.gridList[k].id.i == i && this.gridList[k].id.j == j)
                return this.gridList[k];
        };
        return null;
    },
    getCardByName: function (name) {
        for (var k = this.cardsList.length - 1; k >= 0; k--) {
            if (this.cardsList[k].cardModel.name == name)
                return this.cardsList[k];
        };
        return null;
    },
    getCardOnGrid: function (i, j) {
        for (var k = this.cardsList.length - 1; k >= 0; k--) {
            if (this.cardsList[k].id.i == i && this.cardsList[k].id.j == j)
                return this.cardsList[k];
        };
        return null;
    },
    getNeighbors: function (card) {

        var returnObject = {};
        for (var i = card.cardModel.sides.length - 1; i >= 0; i--) {
            if (card.cardModel.sides[i] == topLeft) {
                returnObject.topLeft = {
                    i: card.id.i - 1,
                    j: card.id.j - 1
                };
            } else if (card.cardModel.sides[i] == topRight) {
                returnObject.topRight = {
                    i: card.id.i - 1,
                    j: card.id.j + 1
                };
            } else if (card.cardModel.sides[i] == left) {
                returnObject.left = {
                    i: card.id.i,
                    j: card.id.j - 2
                };
            } else if (card.cardModel.sides[i] == right) {
                returnObject.right = {
                    i: card.id.i,
                    j: card.id.j + 2
                };
            } else if (card.cardModel.sides[i] == bottomLeft) {
                returnObject.bottomLeft = {
                    i: card.id.i + 1,
                    j: card.id.j - 1
                };
            } else if (card.cardModel.sides[i] == bottomRight) {
                returnObject.bottomRight = {
                    i: card.id.i + 1,
                    j: card.id.j + 1
                };
            }
        }

        return returnObject
    },
    //callback que seleciona o card
    clickCardCallback: function (card) {
        var that = this.context;
        if (that.selectedCard != card && that.selectedCard != null) {
            that.selectedCard.deselect();
        }
        that.selectedCard = card;
        that.selectedCard.select();
    },
    createBoard: function (isHex, size, centerPoint, tileSize) {
        var tabsize;
        if (isHex) {
            if (size.x && size.y)
                tabsize = size;
            else {
                var midX = size / 2;
                if (midX % 2 != 0)
                    midX++;
                tabsize = {
                    x: midX,
                    y: size
                };
            }
        } else {
            if (size.x && size.y)
                tabsize = size;
            else
                tabsize = {
                    x: size,
                    y: size
                };
        }

        var pairacum = 0;
        var imparacum = 0;
        var pass1;
        var mid = isHex ? tabsize.x / 2 : tabsize.x;
        var that = this;
        var createTile = function (i, j, position) {
            var tempTile = new GridTile(i, j, position, that.gridList, that);
            // var tempTile = new GridTile("assets/img/teste.png", i, j, position, that.gridList, that);
            return tempTile;
        }
        var baseCorners = function (i, j, mid, tabsize) {
            var acum = 2;
            if (i > mid) {
                if (j < tabsize.x / 2) {
                    if (mid % 2 == 0)
                        acum = 1;
                    else
                        acum = 2;

                    for (var k = mid + acum; k < tabsize.x; k += 2) {
                        if (i - j == k) {
                            return false;
                        }
                    };
                } else {
                    if (j > i) {
                        acum = 2;
                        if (i + j > tabsize.y + tabsize.x / 2) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        var tileOK;
        var tempPosition;
        var tempTile;
        var globalAcum = 0;
        var maxX = 0;
        var maxY = 0;
        var tileW = 0;
        var tileH = 0;
        var tileSize = tileSize;

        for (var i = 0; i <= tabsize.x; i++) {
            for (var j = 0; j <= tabsize.y; j++) {
                pass1 = (j + i >= mid) && (i - j >= -(tabsize.y - mid));
                tileOK = pass1 && baseCorners(i, j, mid, tabsize) || !isHex;
                if (i % 2 == 0) {
                    if (!(j % 2 == 0)) {
                        pairacum = 0;
                        if (tileOK) {
                            tempPosition = {
                                x: centerPoint.x + tileSize.w * imparacum + tileSize.w / 2,
                                y: centerPoint.y + tileSize.h * 0.75 * i
                            };
                        }
                        imparacum++;

                    }
                } else {
                    if (j % 2 == 0) {
                        imparacum = 0;
                        if (tileOK) {
                            tempPosition = {
                                x: centerPoint.x + tileSize.w * pairacum,
                                y: centerPoint.y + tileSize.h * 0.75 * i
                            };
                        }

                        pairacum++;
                    }
                }
                //if(tempTile != undefined){
                if (tempPosition) {

                    tempTile = createTile(i, j, tempPosition);
                    this.gridList.push(tempTile);
                    this.boardContainer.addChild(tempTile.getContent());

                    if (tileW <= 0)
                        tileW = tempTile.width;
                    if (tileH <= 0)
                        tileH = tempTile.height;

                    if (maxX < tempPosition.x)
                        maxX = tempPosition.x;
                    if (maxY < tempPosition.y)
                        maxY = tempPosition.y;

                    tempTile.getContent().scale.x = 0.0;
                    tempTile.getContent().scale.y = 0.0;
                    TweenLite.to(tempTile.getContent(), .5, {
                        delay: globalAcum * 0.01,
                        alpha: 1
                    });
                    TweenLite.to(tempTile.getContent().scale, .5, {
                        delay: globalAcum * 0.01,
                        x: 1,
                        y: 1,
                        ease: Back.easeOut
                    });
                    tempTile = undefined;
                    tempPosition = null;
                    globalAcum++;
                }

            };
        };
        return {
            x: maxX,
            y: maxY
        }
    }

});