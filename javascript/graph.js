document.graph = (function startGraph() {

	// "constants"; do not change during following code
	var LOOP_DURATION = 500;
	var NODE_FILL = "green";
	var NODE_FILL_HIGHLIGHT = "white";

	// module object; add all methods and properties that should be visible globally
	var module = {};
	module.play_flag = false;
	
	// all nodes that should be played in the current step
	var nextNodesArray = [];
	// all nodes that should be appended to the above array after the next play interval
	var appendToNextNodesArray = [];
	
	var width = window.innerWidth - 20;
	var height = window.innerHeight - 76;

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
		module.nodes = nodes; 
			module.links = links; 
	var cursor = svg.append("circle")
		.attr("r", 30)
		.attr("transform", "translate(-100,-100)")
		.attr("class", "cursor");
		
		restart();
    //Load and Save Logic
	function saveGraph() {
		saved_nodes = [];
		nodes.forEach(function(node) {
			saved_nodes.push( {
				x : node.x0, 
				y : node.y0,
				name: node.name,
				group_name: node.group_name,
				color : node.color,
			});
		});
		localStorage["test"] = JSON.stringify(saved_nodes);
		return saved_nodes;
	}
	
	var load_node = function(node) {
			console.log(node);
			new_node = { 	
				x :  node.x,
				y : node.y,
				x0 :  node.x,
				y0 : node.y,
				name : node.name,
				group_name : node.group_name,
				sound : document.Sound.getSoundObject(node.group_name, node.name),
				color : node.color,
				previousNode : undefined, 
				d3circleReference : undefined
				};
			addNode(new_node);
		}
	
	function loadGraph() {
		var jsonData = JSON.parse(localStorage["test"]);
		var index = 0;
		if (index < jsonData.length) {
			setTimeout(function() {
				load_node(jsonData[index]);
				index++;
			}, 100);	
		} 
	}
	module.save = saveGraph;
	module.load = loadGraph;
	function mousemove() {
		cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
	}
	
	function mousedown() {
		var point = d3.mouse(this), 
			node = {
				x : point[0],  
				y : point[1], 			
				x0 : point[0], //save 
				y0 : point[1], //save
				name : document.Sound.currentSelection["sampleName"], //save
				group_name : document.Sound.currentSelection["groupName"], //save for sound
				sound : document.Sound.getNewSoundObjectForCurrentSound(),
				color : document.Sound.getFillColorForCurrentSound(), //save 
				previousNode : undefined, 
				d3circleReference : undefined
				};
				console.log(point[0]);
			addNode(node);
	}
	
	 function addNode(node){				
		n = nodes.push(node);
		var isNewNodeConnected = false;
		// add links to any nearby nodes
		nodes.forEach(function(target) {
			if (! (node == target) ) {
				var x = target.x - node.x, y = target.y - node.y;
				if (Math.sqrt(x * x + y * y) < 30) {
					links.push({source : node, target : target});
					isNewNodeConnected = true;
				}
			}
		});
		// if there is no connection to other nodes add the node to the array of nodes to play next
		if (!isNewNodeConnected) {
			if (!module.playLoop) {
				// when loop is not playing, just push the new node to the nextNodesArray
				nextNodesArray.push(node);
			}
			else {
				// loop is playing; push the new node to an array that will be appended to nextNodesArray after the next play interval
				appendToNextNodesArray.push(node);
			}
		}
		restart();
	}

	function tick() {
		try {
		link.attr("x1", function(d) {return d.source.x;})
			.attr("y1", function(d) {return d.source.y;})
			.attr("x2", function(d) {return d.target.x;})
			.attr("y2", function(d) {return d.target.y;});
		node.attr("cx", function(d) {return d.x;})
			.attr("cy", function(d) {return d.y;})
			.attr("style",  function(d) {return d.fill;});
		}
		catch (err) {
			// an error can occur here when clear button is pressed shortly after loop has stopped
			console.log("tick error");
		}
	}

	function nodeHoverInHandler (node) {
		$('#soundNameField').fadeIn();
		$('#soundNameField').css("color", node.color);
		$('#soundName').text(node.name);
	}

	function nodeHoverOutHandler (node) {
		$('#soundNameField').fadeOut();
	}

	function restart() {
		link = link.data(links);
		link.enter().insert("line", ".node").attr("class", "link");
		node = node.data(nodes);
		node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 7)
			.on("mouseover", nodeHoverInHandler)
			.on("mouseout", nodeHoverOutHandler)
			.call(force.drag);
		// traverse nodes array and push to each node a reference to the corresponding d3 circle
		nodes.forEach(function (currentNode, index) {
			currentNode.d3circleReference = node[0][index];
			if (currentNode.name == "pause") {
				d3.select(currentNode.d3circleReference).attr("stroke", currentNode.color).attr("stroke-width", 2);
				d3.select(currentNode.d3circleReference).attr("fill", "black");
			}
			else {
				d3.select(currentNode.d3circleReference).attr("fill", currentNode.color);
			}
		});
		force.start();
	}
	
	// clear the svg content from the graph, restart graph
	function clear() {
		d3.select("svg").remove();
		// stop loop
		clearInterval(module.interval);
		node = [];
		nodes = [];
		nextNodesArray = [];
		appendToNextNodesArray = [];
		document.graph = startGraph();
	}
	
	var traverseGraph = function () {
		// array to collect the nodes that will be played in the next step
		var nextStepNodesArray = [];

		nextNodesArray.forEach(function (currentNode, index) {

			// first play sound
			if (document.Sound.isSoundOn) {
				if (!currentNode.sound.isEnded()) {
					currentNode.sound.stop();	
				}
				currentNode.sound.play();
			}
			// then highlight node
			var color = currentNode.color;
			if (currentNode.name == "pause") color = "black";
			// node[0] gets array of d3 circles
			d3.select(currentNode.d3circleReference).attr("fill", NODE_FILL_HIGHLIGHT).transition()
				.attr("fill", color).transition();

			// run through the link array one first time to determine if the current node has more than one connection
			var currentNodeHasConnection = false;
			var currentNodeHasMoreThanOneConnection = false;
			$(links).each(function (index, link) {
				// check if one of the nodes in the edge is the current node
				if (link.source == currentNode || link.target == currentNode) {
					if (currentNodeHasConnection) {
						currentNodeHasMoreThanOneConnection = true;
						return false;
					}
					else {
						currentNodeHasConnection = true;
					}
				}
			});

			// if the node has no connection at all, re-insert him to the nodesToPlay array
			if (!currentNodeHasConnection) {
				nextStepNodesArray.push(currentNode);
			}
			else {
				// otherwise check for connections to other nodes and collect nodes for the next step
				links.forEach(function (link) {
					// check if one of the nodes in the edge is the current node
					if (link.source == currentNode) {
						// check if the linked node is the same as previous node, in this case only add it if it's the only connection of the current node
						if (link.target == currentNode.previousNode) {
							if (!currentNodeHasMoreThanOneConnection) {
								// push node
								nextStepNodesArray.push(link.target);
								link.target.previousNode = currentNode;
							}
						}
						else {
							// push node
							nextStepNodesArray.push(link.target);
							link.target.previousNode = currentNode;
						}
					}
					else if (link.target == currentNode) {
						// check if the linked node is the same as previous node, in this case only add it if it's the only connection of the current node
						if (link.source == currentNode.previousNode) {
							if (!currentNodeHasMoreThanOneConnection) {
								// push node
								nextStepNodesArray.push(link.source);
								link.source.previousNode = currentNode;
							}
						}
						else {
							// push node
							nextStepNodesArray.push(link.source);
							link.source.previousNode = currentNode;
						}
					}
				});
			}
		});

		// append possibly newly entered nodes to the nodes to play array
		appendToNextNodesArray.forEach(function (nodeToAppend) {
			nextStepNodesArray.push(nodeToAppend);
		});
		appendToNextNodesArray = [];

		nextNodesArray = [];
		// eliminate duplicates
		nextStepNodesArray.forEach(function (currentNode, index) {
			if($.inArray(currentNode, nextNodesArray) == -1) {
				nextNodesArray.push(currentNode);
			}
		});
	}
	
	function setLoopDuration (d){
		LOOP_DURATION = d;
		toggleLoop();
		toggleLoop();
	};
	
	var toggleLoop = function(){

		module.playLoop = !module.playLoop;

		// TO DO: if nodes.length == 0 show message 'insert nodes first' and leave the switch untoggled
		if (module.playLoop && nodes.length > 0) {
			// 
			module.interval = setInterval(function () {
				// traverse our graph
				traverseGraph();
	
			}, LOOP_DURATION);
		}
		else {
			// if loop turned off, clear loop
			clearInterval(module.interval);
		}
	}

	module.setLoopDuration = setLoopDuration;
	module.toggleLoop = toggleLoop;
	module.clear = clear;
	return module;
})();