// debugging: get time for loading the module
var start =  new Date().getTime();
//console.log("graph.js start: "+ start);
var graph = "graph";

document.graph = (function startGraph() {

	// "constants"; do not change during following code
	var LOOP_DURATION = 500;

	// module object; add all methods and properties that should be visible globally
	var module = {};
	module.playLoop = false;
	
	// TODO: bind variables
	module.nextSound = undefined;
	module.nextColor = undefined;

	// all nodes that should be played in the current step
	var nextNodesArray = [];
	
	var width = window.innerWidth - 20;
	var height = window.innerHeight - 76;

	//var fill = d3.scale.category20();

	var force = d3.layout.force()
		.size([width, height])
		//.nodes([{}])// initialize with a single node
		.linkDistance(45).charge(-60).on("tick", tick);

	var svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.on("mousemove", mousemove)
		.on("mousedown", mousedown);

	svg.append("rect")
		.attr("width", width)
		.attr("height", height);

	var nodes = force.nodes(),
		startNodes = [],
		links = force.links(), 
		node = svg.selectAll(".node"), 
		link = svg.selectAll(".link");
		
	module.node = node; // brauchen wir das?
	
	var cursor = svg.append("circle")
		.attr("r", 30)
		.attr("transform", "translate(-100,-100)")
		.attr("class", "cursor");
		
		restart();

	function mousemove() {
		cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
	}
	
	function mousedown() {
		var point = d3.mouse(this), 
			node = { 	
				x : point[0],
				y : point[1],
				sound : document.Sound.getNewSoundObjectForCurrentSound(),
				color   : document.plugin.getRandomColor()
				}, 		
			n = nodes.push(node);
		var isNewNodeConnected = false;
		// add links to any nearby nodes
		nodes.forEach(function(target) {
			if (! (node == target) ) {
				var x = target.x - node.x, y = target.y - node.y;
				if (Math.sqrt(x * x + y * y) < 30) {
					links.push({source : node, target : target});
					isNewNodeConnected = true;
					// TO DO: if a just connected node is inside the startNodes collection, delete it from there
				}
			}
		});
		// if there is no connection to other nodes add the node to the array of nodes to play next
		if (!isNewNodeConnected) {
			nextNodesArray.push(node);
		}
		restart();
	}

	function tick() {
		link.attr("x1", function(d) {return d.source.x;})
			.attr("y1", function(d) {return d.source.y;})
			.attr("x2", function(d) {return d.target.x;})
			.attr("y2", function(d) {return d.target.y;}) ;
		node.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("style",  function(d) {return d.fill;})
	}

	function restart() {
		link = link.data(links);
		link.enter().insert("line", ".node").attr("class", "link");
		node = node.data(nodes);
		node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 7).call(force.drag);
		//node.enter().insert("circle", ".cursor").css("fill", "white").call(force.drag);
		force.start();
	}
	
//////////////////////// new functions 
	// clear the svg content from the graph, restart graph
	function clear() {
		console.log("Function clear");
		d3.select("svg").remove();
		startGraph();
	}

	var toggleLoop = function(){

		module.playLoop = !module.playLoop;

		// TO DO: if nodes.length == 0 show message 'insert nodes first' and leave the switch untoggled
		if (module.playLoop && nodes.length > 0) {

			module.interval = setInterval(function () {

				// array to collect the nodes that will be played in the next step
				var nextStepNodesArray = [];

				nextNodesArray.forEach(function (node) {

					// first play sound
					if (document.Sound.isSoundOn) {
						node.sound.play();
					}

					// now check for connections to other nodes and collect nodes for the next step
					var hasNodeAnyConnection = false;
					links.forEach(function (link) {
						// check if one of the nodes in the edge is the current node
						if (link.source == node) {
							nextStepNodesArray.push(link.target);	
						}
						else if (link.target == node) {
							nextStepNodesArray.push(link.source);	
						}
					});
					// if the node has no connection at all, re-insert him to the nodesToPlay array
					if (!hasNodeAnyConnection) {
						nextStepNodesArray.push(node);
					}
				});

				nextNodesArray = nextStepNodesArray;
				
			}, LOOP_DURATION);
		}
		else {
			// if loop turned off, clear loop
			clearInterval(module.interval);
		}
	}

	module.toggleLoop = toggleLoop;
	module.clear = clear;
	return module;
})(); 

// debugging: get time for loading the module
var end = new Date().getTime();
//console.log("graph.js end: "+  end );
var time = end - start;
console.log("loading time for graph.js: " + time);