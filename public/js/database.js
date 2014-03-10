/*// Game
var game = {
	title: project.title
};

// Characters
var characters = [];
function Character(name, level, hp, mp, exp, job, inventory) {
	this.name = name;
	this.level = level;
	this.health = hp;
	this.magic = mp;
	this.exp = {
		overall: 0
	};
	this.class = job;
	this.inventory = inventory;
}

// Variables
var variable = {};*/

if (document.querySelector("#pdb").checked === false) {
	function viewDB() {
		document.querySelector("#databaseRadio").addEventListener("mousedown", function() {
			document.querySelector("body").classList.add("database");
			document.querySelector("#pdb").checked = true;
		}, false)
	}
	viewDB();
}