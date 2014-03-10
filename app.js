// Include Express in our application...
var express = require("express");
var app = express();

app.use(express.bodyParser());

var fs = require("fs");

// Set view rendering...
app.set("views", __dirname + "/views");
app.engine('html', require('ejs').renderFile);
app.get("/?", function(req, res) {
	res.render("index.html");
});
app.get("/project/play", function(req, res) {
	res.render("../project/play.html");
});

// Set static dirs...
app.use("/public", express.static(__dirname + "/public"));
app.use("/project", express.static(__dirname + "/project"));

// Start server...
app.listen(1337);
console.log("Vorge is now running on http://localhost:1337/");

// Used to load project details...
app.post("/loadproject", function(req, res) {
	var project = req.body;
	fs.readFile(__dirname + "/project/project.json", "utf8", function(err, data) {
		project.info = data;
		res.send(project);
		//console.log("Loaded project.");
	});
});

app.post("/savewizard", function(req, res) {
	var wizard = JSON.stringify(req.body.info, undefined, 4);
	fs.writeFile(__dirname + "/project/project.json", wizard, function(err) {
		console.log("Project Configuration Saved.");
	});
	//console.log(wizard);
});
	
app.post("/maps", function(req, res) {
	var data = req.body;
	fs.readdir(__dirname + "/project/maps", function(err, files) {
		data.maps = files;
		res.send(data);
		//console.log("Counted maps.");
	});
});

// Create a new map
app.post("/newmap", function(req, res) {
	var map = JSON.stringify(req.body.info, undefined, 4);
	var newMap = 0;
	fs.readdir(__dirname + "/project/maps", function(err, files) {
		newMap = files.length + 1;
		fs.mkdir(__dirname + "/project/maps/" + newMap, function() {
			fs.writeFile(__dirname + "/project/maps/" + newMap + "/map.json", map, function(err) {
				//console.log("Map Created.");
			})
		});
	});
	res.send(map);
	//console.log(map);
});

// Used to load project details...
app.post("/latestmap", function(req, res) {
	var map = req.body;
	fs.readdir(__dirname + "/project/maps", function(err, files) {
		var latestmap = files.length;
		fs.readFile(__dirname + "/project/maps/" + latestmap + "/map.json", "utf8", function(err, data) {
			map.info = data;
			res.send(map);
			//console.log("Loaded project.");
		});
	});
});

app.post("/savemap", function(req, res) {
	var mapNumber = req.body.number;
	var map = JSON.stringify(req.body, undefined, 4);
	fs.writeFile(__dirname + "/project/maps/" + mapNumber + "/map.json", map, function(err) {
		//console.log("Map Created.");
	});
	res.send(map);
	//console.log(req.body.number);
});