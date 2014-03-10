/*************************************************************/
/* File: vorge.js
/* Purpose: The main JS file for the Vorge engine.
/* Author: Nick Dugger
/* Notes: jQuery is used, but only getJSON. Native, otherwise.
/*************************************************************/

function _engine() {
	var _canvas = document.getElementById('vorge');
	var _ctx = _canvas.getContext('2d');
	var _currentMap, _tileset, _player, _playerSprite, _keysDown;
	this.load = function(_mapNumber) {
		$.getJSON("maps/" + _mapNumber + "/map.json", function(_mapData) {
			_currentMap = _mapData;
			_player = {
				x: 0,
				y: 0,
				w: 0,
				h: 0,
				f: {
					x: 0,
					y: 0
				},
				img: "assets/sprites/testSprite.png",
				s: 1
			};
			_playerSprite = new Image();
			_playerSprite.src = _player.img;
			_playerSprite.onload = function() {
				_player.w = _playerSprite.width / 4;
				_player.h = _playerSprite.height / 4;
				setInterval(_vorge.runFace, _player.s * 200);
			}
			_tileset = new Image();
			_tileset.src = _currentMap.tileset;
			_keysDown = {};
			window.addEventListener("keydown", function(e) {
				_keysDown[e.keyCode] = true;
			});
			window.addEventListener("keyup", function(e) {
				delete _keysDown[e.keyCode];
			});
			_tileset.onload = function() {
				setInterval(_vorge.run, 16.66); // 30 FPS, 60 would be 16.66
			}
		});
	}
	this.run = function() {
		_vorge.move(_player, _keysDown);
		_vorge.render(_currentMap, _tileset, _player, _playerSprite);
		//_player.x += _player.s;
	};
	this.move = function(_player, _keysDown) {
		if (37 in _keysDown) { // left
			_player.x -= _player.s;
			_player.f.y = _player.h;
		}
		if (38 in _keysDown) { // up
			_player.y -= _player.s;
			_player.f.y = _player.h * 3;
		}
		if (39 in _keysDown) { // right
			_player.x += _player.s;
			_player.f.y = _player.h * 2;
		}
		if (40 in _keysDown) { // down
			_player.y += _player.s;
			_player.f.y = 0;
		}
	};
	this.runFace = function() {
		_vorge.face(_player, _keysDown);
	}
	this.face = function(_player, _keysDown) {
		if (37 in _keysDown || 38 in _keysDown || 39 in _keysDown || 40 in _keysDown) {
			if (_player.f.x === _player.w * 3) {
				_player.f.x = 0;
			} else {
				_player.f.x += _player.w;
			}
		} else {
			_player.f.x = 0;
		}
	};
	this.render = function(_currentMap, _tileset, _player, _playerSprite) {
		_ctx.clearRect(0, 0, 640, 480);
		var _i;
		function _drawTile() {
			_ctx.drawImage(_tileset, _t.img.x, _t.img.y, _t.img.w, _t.img.h, _t.x, _t.y, _currentMap.grid, _currentMap.grid);
		}
		// Layer 1
		for (_i = _currentMap.layer1.length - 1; _i >= 0; _i--) {
			var _t = _currentMap.layer1[_i];
			_drawTile();
		};
		// Layer 2
		for (_i = _currentMap.layer2.length - 1; _i >= 0; _i--) {
			var _t = _currentMap.layer2[_i];
			_drawTile();
		};
		// Player
		_ctx.drawImage(_playerSprite, _player.f.x, _player.f.y, _player.w, _player.h, _player.x, _player.y, _player.w, _player.h);
		// Layer 3
		for (_i = _currentMap.layer3.length - 1; _i >= 0; _i--) {
			var _t = _currentMap.layer3[_i];
			_drawTile();
		};
		// Layer 4
		for (_i = _currentMap.layer4.length - 1; _i >= 0; _i--) {
			var _t = _currentMap.layer4[_i];
			_drawTile();
		};
	};
};
var _vorge = new _engine();
_vorge.load(1);