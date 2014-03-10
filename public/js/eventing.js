/*************************************************************/
// File: eventing.js
// Purpose: Functions for creating events on the map
// Author: Nick Dugger
// Notes: //
/*************************************************************/

function eventing(events, event, tileX, tileY) {
	var eBeautify;
	// Show the available event generator buttons
	document.querySelector("#newFunct").addEventListener("mousedown", function() {
		document.querySelector("#addFunct").classList.add("active");
	}, false);
	
	// Clicking the buttons... there will be a lot.
	
	// Dialogue -->
	document.querySelector("#eDialogue").addEventListener("mousedown", function() {
		document.querySelector(".eDialogue").classList.add("active");
		document.querySelector("#addFunct").classList.remove("active");
	}, false);
	document.querySelector("#generateDialogue").addEventListener("mousedown", function() {
		var speakersName = document.querySelector("#speakersName").value;
		var eDialogueText = document.querySelector("#dialogueText").value.replace(/\n/g, "\",\n\"");
		eventEditor.insert("event.dialogue(\"" + speakersName + "\", [\n\"" + eDialogueText + "\"\n], " + undefined + ");");
		eBeautify = js_beautify(eventEditor.session.getValue(), {"indent_size": 1, "indent_char": "\t"});
		eventEditor.session.setValue(eBeautify + "\n");
		eventEditor.navigateFileEnd();
		document.querySelector(".eDialogue").classList.remove("active");
		document.querySelector("#dialogueText").value = document.querySelector("#speakersName").value = "";
	}, false);
	
	// Options -->
	document.querySelector("#eOptions").addEventListener("mousedown", function() {
		document.querySelector(".eOptions").classList.add("active");
		document.querySelector("#addFunct").classList.remove("active");
	}, false);
	document.querySelector("#generateOpts").addEventListener("mousedown", function() {
		var eOptionLines = document.querySelector("#optionLines").value.replace(/\n/g, "\", function() {\n\n}],\n[\"");
		eventEditor.insert("event.options([\n[\"" + eOptionLines + "\", function() {\n\n}]\n]);");
		eBeautify = js_beautify(eventEditor.session.getValue(), {"indent_size": 1, "indent_char": "\t"});
		eventEditor.session.setValue(eBeautify + "\n");
		eventEditor.navigateFileEnd();
		document.querySelector(".eOptions").classList.remove("active");
		document.querySelector("#optionLines").value = "";
	}, false);
	
	// Wait -->
	document.querySelector("#eWait").addEventListener("mousedown", function() {
		document.querySelector(".eWait").classList.add("active");
		document.querySelector("#addFunct").classList.remove("active");
	}, false);
	document.querySelector("#generateWait").addEventListener("mousedown", function() {
		var eWaitTime = document.querySelector("#waitTime").value;
		eventEditor.insert("setTimeout(function() {\n\n}, " + eWaitTime * 1000 + ");");
		eBeautify = js_beautify(eventEditor.session.getValue(), {"indent_size": 1, "indent_char": "\t"});
		eventEditor.session.setValue(eBeautify + "\n");
		eventEditor.navigateFileEnd();
		document.querySelector(".eWait").classList.remove("active");
		document.querySelector("#waitTime").value = "";
	}, false);
	
	// Change Var -->
	document.querySelector("#eChangeVar").addEventListener("mousedown", function() {
		document.querySelector(".eChangeVar").classList.add("active");
		document.querySelector("#addFunct").classList.remove("active");
	}, false);
	document.querySelector("#generateVar").addEventListener("mousedown", function() {
		var eVar = document.querySelector("#eVar").value;
		var eVarTo = document.querySelector("#varTo").value;
		eventEditor.insert("variable." + eVar + " = \"" + eVarTo + "\";");
		eBeautify = js_beautify(eventEditor.session.getValue(), {"indent_size": 1, "indent_char": "\t"});
		eventEditor.session.setValue(eBeautify + "\n");
		eventEditor.navigateFileEnd();
		document.querySelector(".eChangeVar").classList.remove("active");
		document.querySelector("#eVar").value = document.querySelector("#varTo").value = "";
	}, false);
}