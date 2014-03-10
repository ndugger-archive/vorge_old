/*************************************************************/
// File: map.js
// Purpose: Generate the map editor HTML, and load the map
// Author: Nick Dugger
// Notes: This file is long and messy, because it does a lot.
/*************************************************************/
var editor;
function mapEditor(project, maps, map, loadTiles) {
	// Lots of variables...
	var mapWidth = map.width * map.grid;
	var mapHeight = map.height * map.grid;
	// Set variables to elements
	var editorDiv = document.querySelector("#mapEditor");
	var tilesDiv = document.querySelector("#tiles");
	// "Generate" HTML elements
	console.log("Generating editor HTML...");
	var tilesetHTML = "<img id=\"tilesetUse\" src=\"project/" + map.tileset + "\" />";
	var choiceMark = "<div id=\"choiceMark\"></div>";
	var mapBG = "<div id=\"mapBG\"></div>";
	var ml1 = "<canvas id=\"layer1\" width=\"" + mapWidth + "\" height=\"" + mapHeight + "\"></canvas>";
	var ml2 = "<canvas id=\"layer2\" width=\"" + mapWidth + "\" height=\"" + mapHeight + "\"></canvas>";
	var ml3 = "<canvas id=\"layer3\" width=\"" + mapWidth + "\" height=\"" + mapHeight + "\"></canvas>";
	var ml4 = "<canvas id=\"layer4\" width=\"" + mapWidth + "\" height=\"" + mapHeight + "\"></canvas>";
	var mEvents = "<canvas id=\"layerE\" width=\"" + mapWidth + "\" height=\"" + mapHeight + "\"></canvas>";
	var gridContainer = "<div id=\"gridContainer\"></div>";
	var mapBlanketDiv = "<div id=\"mapBlanket\"></div>";
	var paintMark = "<div id=\"paintMark\"></div>";
	// Put the elements into their parent elements
	editorDiv.innerHTML += mapBG + ml1 + ml2 + ml3 + ml4 + mEvents + gridContainer + mapBlanketDiv + paintMark;
	tilesDiv.innerHTML += choiceMark + tilesetHTML;
	// Display active info in the infoPane div
	document.querySelector("#activeProject").innerHTML = project.title;
	document.querySelector("#activeMap").innerHTML = map.name;
	// Display the choiceMark div over the chosen tile (this is pretty messy):
	document.getElementById("choiceMark").setAttribute(
		"style", 
		"width:" + map.grid + 
		"px; height:" + map.grid + 
		"px; margin-top:" + (- map.grid) + 
		"px; top:" + map.grid + "px; left:0"
	);
	// Set context origin's to their respective canvas elements:
	var layer1 = document.querySelector("#layer1");
	var ctx1 = layer1.getContext("2d");
	var layer2 = document.querySelector("#layer2");
	var ctx2 = layer2.getContext("2d");
	var layer3 = document.querySelector("#layer3");
	var ctx3 = layer3.getContext("2d");
	var layer4 = document.querySelector("#layer4");
	var ctx4 = layer4.getContext("2d");
	var layerE = document.querySelector("#layerE");
	var ctxE = layerE.getContext("2d");
	// Set variables to elements
	var mapBlanket = document.querySelector("#mapBlanket");
	var tilesetImage = document.getElementById("tilesetUse");
	// Set W/H in CSS for non-canvas elements
	document.querySelector("#mapGapX").setAttribute("style", "width:" + mapWidth + "px;");
	document.querySelector("#mapGapY").setAttribute("style", "height:" + mapHeight + "px;");
	document.querySelector("#mapBG").setAttribute("style", "width:" + mapWidth + "px; height:" + mapHeight + "px;");
	document.querySelector("#mapBlanket").setAttribute("style", "width:" + mapWidth + "px; height:" + mapHeight + "px;");
	// Variables to help choose selected map layer
	var mapLayer1 = true, mapLayer2, mapLayer3, mapLayer4, mapEvents;
	var activeLayer = layer1;
	var layerTiles;
	var paintOn = 1;
	layer1.classList.add("activeLayer");
	// Variables to help with tile choosing
	var isAutotile = false;
	var choiceX = 0;
	var choiceY = 0;
	var choiceW = map.grid;
	var choiceH = map.grid;
	// Create empty arrays to store tile data
	var layer1Tiles, layer2Tiles, layer3Tiles, layer4Tiles, events;
	// Functions, now
	// Create custom "tile" objects
	function tileObj1(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
	};
	function tileObj2(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
	};
	function tileObj3(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
	};
	function tileObj4(x, y, img) {
		this.x = x;
		this.y = y;
		this.img = img;
	};
	// Create custom "event" object
	function eventObj(x, y, data) {
		this.x = x;
		this.y = y;
		this.data = data;
	};
	
	// Start
	this.run = function() {
		console.log("> HTML Generated.");
		editor.render();
		// Mousedown listener for choosing the layer to paint on
		document.querySelector("#layer1Radio").addEventListener("click", function() {
			mapLayer2 = mapLayer3 = mapLayer4 = mapEvents = false;
			mapLayer1 = true;
			chooseLayer();
		}, false);
		document.querySelector("#layer2Radio").addEventListener("click", function() {
			mapLayer1 = mapLayer3 = mapLayer4 = mapEvents = false;
			mapLayer2 = true;
			chooseLayer();
		}, false);
		document.querySelector("#layer3Radio").addEventListener("click", function() {
			mapLayer1 = mapLayer2 = mapLayer4 = mapEvents = false;
			mapLayer3 = true;
			chooseLayer();
		}, false);
		document.querySelector("#layer4Radio").addEventListener("click", function() {
			mapLayer1 = mapLayer2 = mapLayer3 = mapEvents = false;
			mapLayer4 = true;
			chooseLayer();
		}, false);
		document.querySelector("#eventRadio").addEventListener("click", function() {
			mapLayer1 = mapLayer2 = mapLayer3 = mapLayer4 = false;
			mapEvents = true;
			chooseLayer();
		}, false);
		// Detecting which layer is chosen, and adding an activeLayer class
		function chooseLayer() {
			if (mapLayer1 === true) {
				activeLayer = layer1;
				ctx = layer1.getContext("2d");
				layerTiles = layer1Tiles;
				paintOn = 1;
				layer1.classList.add("activeLayer");
				layer2.classList.remove("activeLayer");
				layer3.classList.remove("activeLayer");
				layer4.classList.remove("activeLayer");
			} else if (mapLayer2 === true) {
				activeLayer = layer2;
				ctx = layer2.getContext("2d");
				layerTiles = layer2Tiles;
				paintOn = 2;
				layer1.classList.remove("activeLayer");
				layer2.classList.add("activeLayer");
				layer3.classList.remove("activeLayer");
				layer4.classList.remove("activeLayer");
			} else if (mapLayer3 === true) {
				activeLayer = layer3;
				ctx = layer3.getContext("2d");
				layerTiles = layer3Tiles;
				paintOn = 3;
				layer1.classList.remove("activeLayer");
				layer2.classList.remove("activeLayer");
				layer3.classList.add("activeLayer");
				layer4.classList.remove("activeLayer");
			} else if (mapLayer4 === true) {
				activeLayer = layer4;
				ctx = layer4.getContext("2d");
				layerTiles = layer4Tiles;
				paintOn = 4;
				layer1.classList.remove("activeLayer");
				layer2.classList.remove("activeLayer");
				layer3.classList.remove("activeLayer");
				layer4.classList.add("activeLayer");
			} else if (mapEvents === true) {
				activeLayer = layerE;
				ctx = layerE.getContext("2d");
				layerTiles = events;
				paintOn = 5;
				layer1.classList.add("activeLayer");
				layer2.classList.add("activeLayer");
				layer3.classList.add("activeLayer");
				layer4.classList.add("activeLayer");
			}
		};
		chooseLayer();
		// Create SVG-based grid, overlaying the map canvas
		function showGrid() {
			for (var i = map.grid; i < mapWidth; i += map.grid) {
				var lineY = "<line x1=\"0\" y1=\"0\" x2=\"0\" y2=\"" + mapHeight + "\" />";
				var gridSvgY = "<svg width=\"2\" height=\"" + mapHeight + "\" style=\"margin-left:" + (i - 1) + "\">" + lineY + "</svg>";
				document.getElementById("gridContainer").innerHTML += gridSvgY;
			}
			for (var i = map.grid; i < mapHeight; i += map.grid) {
				var lineX = "<line y1=\"0\" x1=\"0\" y2=\"0\" x2=\"" + mapWidth + "\" />";
				var gridSvgX = "<svg height=\"2\" width=\"" + mapWidth + "\" style=\"margin-top:" + (i - 1) + "\">" + lineX + "</svg>";
				document.getElementById("gridContainer").innerHTML += gridSvgX;
			}
		};
		showGrid();
		var gridStatus = true;
		document.querySelector("#gridCheck").addEventListener("mousedown", gridToggle, false);
		function gridToggle() {
			if (gridStatus === true) {
				gridStatus = false;
				document.querySelector("#gridContainer").classList.add("hidden");
			} else if (gridStatus === false) {
				gridStatus = true;
				document.querySelector("#gridContainer").classList.remove("hidden");
			}
		};
		// Clck event to grab tile(s) from the tileset
		tilesetImage.addEventListener("mousedown", tileChoose, false);
		function tileChoose(e) {
			isAutotile = false;
			var clickX = e.pageX - tilesetImage.offsetLeft + tilesetImage.parentNode.scrollLeft;
			var clickY = e.pageY - tilesetImage.offsetTop + tilesetImage.parentNode.scrollTop - 40 - 32;
			// use click coordinates, in conjunction with a modulo, to find the tile coordinates
			var chooseX = clickX - (clickX % map.grid);
			var chooseY = clickY - (clickY % map.grid);
			// Display the choiceMark div over the chosen tile (this is pretty messy):
			document.getElementById("choiceMark").setAttribute(
				"style", 
				"width:" + map.grid + 
				"px; height:" + map.grid + 
				"px; margin-top:" + (- map.grid) + 
				"px; top:" + ((chooseY) + map.grid) + 
				"px; left:" + (chooseX) + "px; display:block;"
			);
			// Set the values for our global Choice variables:
			choiceX = chooseX;
			choiceY = chooseY;
			choiceW = map.grid;
			choiceH = map.grid;
		};
		// Show the paint marker over the map
		mapBlanket.addEventListener("mousemove", function(e) {
			var sideWidth = document.querySelector("#mapSide").offsetWidth;
			var headHeight = document.querySelector("#system").offsetHeight + 32;
			var moveX = e.pageX - mapBlanket.offsetLeft - sideWidth + mapBlanket.parentNode.scrollLeft;
			var moveY = e.pageY - mapBlanket.offsetTop - headHeight + mapBlanket.parentNode.scrollTop;
			// use move coordinates, in conjunction with a modulo, to find the tile coordinates
			var tileX = moveX - (moveX % map.grid);
			var tileY = moveY - (moveY % map.grid);
			// Display the choiceMark div over the chosen tile (this is pretty messy):
			document.getElementById("paintMark").setAttribute(
				"style", 
				"width:" + map.grid + 
				"px; height:" + map.grid + 
				"px; top:" + (tileY) + 
				"px; left:" + (tileX) + "px; display:block;"
			);
		}, false);
		mapBlanket.addEventListener("mouseout", function() {
			document.getElementById("paintMark").setAttribute("style", "display:none;");
		}, false);
		mapBlanket.addEventListener("mousedown", function(e) {
			var sideWidth = document.getElementById("mapSide").offsetWidth;
			var headHeight = document.getElementById("system").offsetHeight + 32;
			var clickX = e.pageX - mapBlanket.offsetLeft - sideWidth + mapBlanket.parentNode.scrollLeft;
			var clickY = e.pageY - mapBlanket.offsetTop - headHeight + mapBlanket.parentNode.scrollTop;
			var tileX = clickX - (clickX % map.grid);
			var tileY = clickY - (clickY % map.grid);
			if (paintOn == 5) {
				eventThis(tileX, tileY);
			} else if (paintOn < 5) {
				paintThis(tileX, tileY);
			}
			mapBlanket.addEventListener("mousemove", clickDrag, false);
			function clickDrag(e) {
				var sideWidth = document.getElementById("mapSide").offsetWidth;
				var headHeight = document.getElementById("system").offsetHeight + 32;
				var clickX = e.pageX - mapBlanket.offsetLeft - sideWidth + mapBlanket.parentNode.scrollLeft;
				var clickY = e.pageY - mapBlanket.offsetTop - headHeight + mapBlanket.parentNode.scrollTop;
				var tileX = clickX - (clickX % map.grid);
				var tileY = clickY - (clickY % map.grid);
				if (paintOn < 5) {
					paintThis(tileX, tileY);
				}
				mapBlanket.addEventListener("mouseup", function(e) {
					mapBlanket.removeEventListener("mousemove", clickDrag, false);
				}, false);
				mapBlanket.addEventListener("mouseout", function(e) {
					mapBlanket.removeEventListener("mousemove", clickDrag, false);
				}, false);
			}
			mapBlanket.addEventListener("mouseup", function(e) {
				mapBlanket.removeEventListener("mousemove", clickDrag, false);
			}, false);
		});
		// Function to paint tile on active layer
		function paintThis(tileX, tileY) {
			// get all tiles in the tiles array for the current layer
			var tilesLength = layerTiles.length;
			for (var i = tilesLength - 1; i >= 0; i--) {
				if (paintOn == 1) {
					var tile = layer1Tiles[i];
				} else if (paintOn == 2) {
					var tile = layer2Tiles[i];
				} else if (paintOn == 3) {
					var tile = layer3Tiles[i];
				} else if (paintOn == 4) {
					var tile = layer4Tiles[i];
				}
				if (isAutotile === false) {
				// match click coordinates with a tile's coordinates
					if (tile.x == tileX && tile.y == tileY) {
						// set tile.img to the coordinates of the tile wanted from the tileset canvas
						tile.img = {
							x: choiceX,
							y: choiceY,
							w: choiceW,
							h: choiceH
						};
						// clear occupying rectangle, then fill with chosen tile(s):
						ctx.clearRect(tileX, tileY, choiceW, choiceH);
						ctx.drawImage(tilesetImage, choiceX, choiceY, choiceW, choiceH, tileX, tileY, choiceW, choiceH);
					}
				} else {
					//autotileThis(tile, tileX, tileY);
				}
			}
		};
		// Function to place an event down
		function eventThis(tileX, tileY) {
			document.querySelector("body").classList.add("eventing");
			document.querySelector("#layer1Radio").classList.add("hidden");
			document.querySelector("#layer2Radio").classList.add("hidden");
			document.querySelector("#layer3Radio").classList.add("hidden");
			document.querySelector("#layer4Radio").classList.add("hidden");
			// get all tiles in the tiles array for the current layer
			var tilesLength = layerTiles.length;
			for (var i = tilesLength - 1; i >= 0; i--) {
				var event = events[i];
				// match click coordinates with a tile's coordinates
				if (event.x == tileX && event.y == tileY) {
					/*document.querySelector("#saveEvent").addEventListener("mousedown", function() {
						saveE(event);
					}, false);
					function saveE(event) {
						event.data = {
							name: document.querySelector("#eventName").value,
							img: null,
							type: document.querySelector("#eventType").value,
							fov: document.querySelector("#eFOV").value,
							orientaion: document.querySelector("#eventOrientation").value,
							trigger: 0,
							functions: eventEditor.getSession().getValue()
						};
					}*/
					eventing(events, event, tileX, tileY); 
					// clear occupying rectangle, then fill with chosen tile(s):
					ctx.clearRect(tileX, tileY, choiceW, choiceH);
					ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
					ctx.fillRect((event.x + 5), (event.y + 5), (map.grid - 10), (map.grid - 10));
					ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
					ctx.lineWidth = 2;
					ctx.strokeRect((event.x + 4), (event.y + 4), (map.grid - 8), (map.grid - 8));
				};
			};
		};
		// Save the map
		document.querySelector("#saveMap").addEventListener("mousedown", editor.saveMap);
	};
	// Render
	this.render = function() {
		// Create empty arrays to store tile data
		layer1Tiles = [];
		layer2Tiles = [];
		layer3Tiles = [];
		layer4Tiles = [];
		events = [];
		// Create tile-grid, map.grid sized rectangles that will adopt tileset images
		function gridTiles() {
			for (var x = 0; x < mapWidth; x += map.grid) {
				for (var y = 0; y < mapHeight; y += map.grid) {
					var newTile1 = new tileObj1(x, y, null);
					layer1Tiles.push(newTile1);
					var newTile2 = new tileObj2(x, y, null);
					layer2Tiles.push(newTile2);
					var newTile3 = new tileObj3(x, y, null);
					layer3Tiles.push(newTile3);
					var newTile4 = new tileObj4(x, y, null);
					layer4Tiles.push(newTile4);
					var newEvent = new eventObj(x, y, null);
					events.push(newEvent);
				}
			}
		};
		gridTiles();
		editor.existingTiles();
	};
	// Existing tiles
	this.existingTiles = function() {
		if (loadTiles === true) {
			var tilesExist = map.layer1.length + map.layer2.length + map.layer3.length + map.layer4.length;
			if (tilesExist > 0) {
				console.log("Painting tiles...");
				tilesetImage.onload = function() {
					var ml1 = map.layer1.length, l1t = layer1Tiles.length;
					for (var i = ml1 - 1; i >= 0; i--) {
						var tile = map.layer1[i];
						ctx1.drawImage(tilesetImage, tile.img.x, tile.img.y, map.grid, map.grid, tile.x, tile.y, map.grid, map.grid);
						for (var p = l1t - 1; p >= 0; p--) {
							var pre = layer1Tiles[p];
							if (tile.x === pre.x && tile.y === pre.y) {
								layer1Tiles.splice(p, 1);
								layer1Tiles.push(tile);
							}
						}
					}
					var ml2 = map.layer2.length, l2t = layer2Tiles.length;
					for (var i = ml2 - 1; i >= 0; i--) {
						var tile = map.layer2[i];
						ctx2.drawImage(tilesetImage, tile.img.x, tile.img.y, map.grid, map.grid, tile.x, tile.y, map.grid, map.grid);
						for (var p = l2t - 1; p >= 0; p--) {
							var pre = layer2Tiles[p];
							if (tile.x === pre.x && tile.y === pre.y) {
								layer2Tiles.splice(p, 1);
								layer2Tiles.push(tile);
							}
						}
					}
					var ml3 = map.layer3.length, l3t = layer3Tiles.length;
					for (var i = ml3 - 1; i >= 0; i--) {
						var tile = map.layer3[i];
						ctx3.drawImage(tilesetImage, tile.img.x, tile.img.y, map.grid, map.grid, tile.x, tile.y, map.grid, map.grid);
						for (var p = l3t - 1; p >= 0; p--) {
							var pre = layer3Tiles[p];
							if (tile.x === pre.x && tile.y === pre.y) {
								layer3Tiles.splice(p, 1);
								layer3Tiles.push(tile);
							}
						}
					}
					var ml4 = map.layer4.length, l4t = layer4Tiles.length;
					for (var i = ml4 - 1; i >= 0; i--) {
						var tile = map.layer4[i];
						ctx4.drawImage(tilesetImage, tile.img.x, tile.img.y, map.grid, map.grid, tile.x, tile.y, map.grid, map.grid);
						for (var p = l4t - 1; p >= 0; p--) {
							var pre = layer3Tiles[p];
							if (tile.x === pre.x && tile.y === pre.y) {
								layer4Tiles.splice(p, 1);
								layer4Tiles.push(tile);
							}
						}
					}
				};
				console.log("> Tiles painted.");
			};
		};
	};
	// Save Map
	this.saveMap = function() {
		// Set layers as new variables so trimming only effects new arrrays
		var l1t, l2t, l3t, l4t, le;
		// Strip layers of their empty tile objects.
		l1t = layer1Tiles.slice();
		for (var i = l1t.length - 1; i >= 0; i--) {
			if (l1t[i].img === null) {
				l1t.splice(i, 1);
			}
		}
		l2t = layer2Tiles.slice();
		for (var i = l2t.length - 1; i >= 0; i--) {
			if (l2t[i].img === null) {
				l2t.splice(i, 1);
			}
		}
		l3t = layer3Tiles.slice();
		for (var i = l3t.length - 1; i >= 0; i--) {
			if (l3t[i].img === null) {
				l3t.splice(i, 1);
			}
		}
		l4t = layer4Tiles.slice();
		for (var i = l4t.length - 1; i >= 0; i--) {
			if (l4t[i].img === null) {
				l4t.splice(i, 1);
			}
		}
		le = events.slice();
		for (var i = le.length - 1; i >= 0; i--) {
			if (le[i].data === null) {
				le.splice(i, 1);
			}
		}
		map.layer1 = l1t;
		map.layer2 = l2t;
		map.layer3 = l3t;
		map.layer4 = l4t;
		var mapJSON = JSON.stringify(map, undefined, 4);
		$.ajax({
			url: "/savemap",
			type: "POST",
			dataType: "json",
			data: mapJSON,
			contentType: "application/json",
			cache: false,
			success: function(data) {
				console.log(data);
			}
		});
	};
};
bootVorge();