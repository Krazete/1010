var target;

function distance(a, b) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}
function getBound(element) {
	var bound = element.getBoundingClientRect();
	bound.midpoint = {
		"x": bound.x + (bound.right - bound.left) / 2,
		"y": bound.y + (bound.bottom - bound.top) / 2
	};
	return bound;
}
function getClosestCell(point, table) {
	var closest;
	var epsilon = Number.MAX_VALUE;
	for (var r = 0; r < table.children.length; r++) {
		for (var c = 0; c < table.children[r].children.length; c++) {
			var cell = table.children[r].children[c];
			var bound = getBound(cell);
			var delta = distance(point, bound.midpoint);
			if (delta < epsilon) {
				closest = cell;
				epsilon = delta;
			}
		}
	}
	return closest;
}

function withinElement(point, element) {
	var bound = element.getBoundingClientRect();
	var withinX = bound.left <= point.x && point.x <= bound.right;
	var withinY = bound.top <= point.y && point.y <= bound.bottom;
	return withinX && withinY;
}

function stopGrab(mouse) {
	window.removeEventListener("mousemove", grab);
	window.removeEventListener("mouseup", stopGrab);

	var board = document.getElementById("board");
	var valid = true;
	var splat = [];
	for (var r = 0; valid && r < target.children.length; r++) {
		for (var c = 0; valid && c < target.children[r].children.length; c++) {
			var cell = target.children[r].children[c];
			if (cell.style.background != "transparent") {
				var bound = getBound(cell);
				var boardCell = getClosestCell(bound.midpoint, board);
				valid = withinElement(bound.midpoint, boardCell) && boardCell.style.background == "";
				if (!valid) {
					break;
				}
				splat.push([boardCell, cell]);
			}
		}
	}
	if (valid) {
		for (var i = 0; i < splat.length; i++) {
			splat[i][0].style.background = splat[i][1].style.background;
		}
		target.parentElement.removeEventListener("mousedown", startGrab);
		target.remove();
		calc();
	}
	else {
		target.parentElement.classList.remove("empty");
	}

	target.style = "";
	target.classList.remove("grab");
	target = undefined;

	document.body.className = "";
}

function grab(mouse) {
	target.style.left = "";
	target.style.top = "";
	var bound = getBound(target);
	target.style.left = mouse.x - bound.midpoint.x + "px";
	target.style.top = mouse.y - (bound.bottom + 16) + "px";
}

function startGrab(mouse) {
	target = this.children[0];
	target.classList.add("grab");
	target.style.position = "relative";

	this.classList.add("empty");
	document.body.className = "grab";

	window.addEventListener("mousemove", grab);
	window.addEventListener("mouseup", stopGrab);
}

function newPolyomino(index) {
	var polyominos = [
		{
			"color": "#7c88c2",
			"rows": [
				[1]
			]
		},
		{
			"color": "#ffc63e",
			"rows": [
				[1, 1]
			]
		},
		{
			"color": "#ffc63e",
			"rows": [
				[1],
				[1]
			]
		},
		{
			"color": "#ed954b",
			"rows": [
				[1, 1, 1]
			]
		},
		{
			"color": "#ed954b",
			"rows": [
				[1],
				[1],
				[1]
			]
		},
		{
			"color": "#e76b85",
			"rows": [
				[1, 1, 1, 1]
			]
		},
		{
			"color": "#e76b85",
			"rows": [
				[1],
				[1],
				[1],
				[1]
			]
		},
		{
			"color": "#db6655",
			"rows": [
				[1, 1, 1, 1, 1]
			]
		},
		{
			"color": "#db6655",
			"rows": [
				[1],
				[1],
				[1],
				[1],
				[1]
			]
		},
		{
			"color": "#59cb86",
			"rows": [
				[1, 1],
				[1, 0]
			]
		},
		{
			"color": "#59cb86",
			"rows": [
				[1, 1],
				[0, 1]
			]
		},
		{
			"color": "#59cb86",
			"rows": [
				[1, 0],
				[1, 1]
			]
		},
		{
			"color": "#59cb86",
			"rows": [
				[0, 1],
				[1, 1]
			]
		},
		{
			"color": "#96dc55",
			"rows": [
				[1, 1],
				[1, 1]
			]
		},
		{
			"color": "#5bbde4",
			"rows": [
				[1, 1, 1],
				[1, 0, 0],
				[1, 0, 0]
			]
		},
		{
			"color": "#5bbde4",
			"rows": [
				[1, 1, 1],
				[0, 0, 1],
				[0, 0, 1]
			]
		},
		{
			"color": "#5bbde4",
			"rows": [
				[1, 0, 0],
				[1, 0, 0],
				[1, 1, 1]
			]
		},
		{
			"color": "#5bbde4",
			"rows": [
				[0, 0, 1],
				[0, 0, 1],
				[1, 1, 1]
			]
		},
		{
			"color": "#4ed6b0",
			"rows": [
				[1, 1, 1],
				[1, 1, 1],
				[1, 1, 1]
			]
		}
	];
	if (typeof(index) == "undefined") {
		index = Math.floor(Math.random() * polyominos.length);
	}
	var polyomino = polyominos[index];

	var table = document.createElement("div");
	table.className = "table polyomino";
	for (var r = 0; r < polyomino.rows.length; r++) {
		var row = document.createElement("div");
		row.className = "row";
		for (var c = 0; c < polyomino.rows[r].length; c++) {
			var cell = document.createElement("div");
			cell.className = "cell";
			if (polyomino.rows[r][c]) {
				cell.style.background = polyomino.color;
			}
			else {
				cell.style.background = "transparent";
			}
			row.appendChild(cell);
		}
		table.appendChild(row);
	}
	return table;
}

function calc() {
	var board = document.getElementById("board");
	for (var r = 0; r < board.children.length; r++) {
		for (var c = 0; c < board.children[r].children.length; c++) {
			var cell = board.children[r].children[c];
			cell.dataset.value = 9;
		}
	}
}

function newDock(indices) {
	var dock = document.getElementById("dock");
	for (var i = 0; i < 3; i++) {
		var holder = dock.children[i];
		holder.classList.remove("empty")
		if (typeof(indices) == "undefined") {
			holder.appendChild(newPolyomino());
		}
		else {
			dock.children[i].appendChild(newPolyomino(indices[i]));
		}
		holder.addEventListener("mousedown", startGrab);
	}
}

function init() {
	newDock();
}

window.addEventListener("DOMContentLoaded", init);
