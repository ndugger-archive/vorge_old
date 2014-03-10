/*************************************************************/
/* File: boot.js
/* Purpose: Functions (mostly AJAX) to run upon starting Vorge
/* Author: Nick Dugger
/* Notes: jQuery is used, but only for AJAX. Native, otherwise
/*************************************************************/

function bootVorge() {
	// AJAX request to get info from the project.json file
	var project;
	function loadProject() {
		console.log("Loading...");
		// Realisitcally, AJAX should be the only jQuery in vorge...
		$.ajax({
			url: "/loadproject",
			type: "POST",
			dataType: "json",
			data: JSON.stringify({info: null}),
			contentType: "application/json",
			cache: false,
			success: function(data) {
				console.log("> Vorge loaded.");
				project = JSON.parse(data.info);
				if (project.wizard === true) {
					wizard();
				} else {
					console.log("> Project already configured.");
					getMaps();
				}
			},
			error: function() {
				console.log("There was an error... :(");
			}
		});
	};
	loadProject();
	
	// If the project has not had a first-time setup, run the "wizard"
	function wizard() {
		console.log("Running wizard...")
		document.querySelector("#wizard").classList.add("active");
		document.querySelector("#saveWizard").addEventListener("click", function(e) {
			console.log("Saving project configuration...");
			project.title = document.querySelector("#projectTitle").value;
			project.description = document.querySelector("#projectDesc").value;
			project.wizard = false;
			document.querySelector("#wizard").classList.remove("active");
			$.ajax({
				url: "/savewizard",
				type: "POST",
				dataType: "json",
				data: JSON.stringify({info: project}),
				contentType: "application/json",
				cache: false
			});
			console.log("> Configuration saved.");
			getMaps();
		});
	};
	
	// Send another AJAX request to count the number of existing maps
	var maps = [];
	var map = {};
	function getMaps() {
		console.log("Counting maps...");
		$.ajax({
			url: "/maps",
			type: "POST",
			dataType: "json",
			data: JSON.stringify({maps: null}),
			contentType: "application/json",
			cache: false,
			success: function(data) {
				maps = data.maps;
				if (maps.length === 0) {
					console.log("> There are 0 maps.");
					map.number = maps.length + 1;
					newMap();
				} else {
					console.log("> There are " + maps.length + " maps.");
					loadMap();
				}
			},
			error: function() {
				console.log("There was an error... :(");
			}
		});
	};
	
	// If there are no existing maps, run the map "wizard" and create one
	function newMap() {
		console.log("Making a map...");
		document.querySelector("#newMap").classList.add("active");
		document.querySelector("#createMap").addEventListener("mousedown", function() {
			map.name = document.querySelector("#mapName").value;
			map.tileset = document.querySelector("#mapTilesH").value;
			map.width = document.querySelector("#mapWidth").value;
			map.height = document.querySelector("#mapHeight").value;
			map.grid = project.default.tileSize;
			map.layer1 = [];
			map.layer2 = [];
			map.layer3 = [];
			map.layer4 = [];
			document.querySelector("#newMap").classList.remove("active");
			$.ajax({
				url: "/newmap",
				type: "POST",
				dataType: "json",
				data: JSON.stringify({info: map}),
				contentType: "application/json",
				cache: false,
				success: function(data) {
					console.log("> Map created.");
					document.querySelector("#maps ul").innerHTML += 
						"<li data-map=\"1\" class=\"active\">" + map.name + "</li>";
					loadMap();
				},
				error: function() {
					console.log("There was an error... :(");
				}
			});
		});
	};
	// If a map exists, or upon creation of the first map, load the latest map
	function loadMap() {
		console.log("Loading map data...");
		for (var i = 1; i <= maps.length; i++) {
			$.ajax({
				url: "project/maps/" + i + "/map.json",
				dataType: "json",
				data: map,
				async: false,
				success: function(map) {
					document.querySelector("#maps ul").innerHTML += "<li data-map=\"" + map.number + "\">" + map.name + "</li>";
					var last = document.querySelector("#maps ul li[data-map=\"" + maps.length + "\"]");
					last.classList.add("active");
				}
			});
		}
		if (map.name !== undefined) {
			console.log("> Map loaded.");
			editor = new mapEditor(project, maps, map, false);
			editor.run();
		} else {
			$.ajax({
				url: "/latestmap",
				type: "POST",
				dataType: "json",
				data: JSON.stringify({info: null}),
				contentType: "application/json",
				cache: false,
				asynch: false,
				success: function(data) {
					console.log("> Map data loaded.");
					map = JSON.parse(data.info);
					editor = new mapEditor(project, maps, map, true);
					editor.run();
				},
				error: function() {
					console.log("There was an error... :(");
				}
			});
		}
	};
};