$(document).ready(function () {
	console.log("load modules // graph: " + document.graph + " // sound: " + document.Sound + " // UI: " + document.UI + " // plugins: " + document.Plugins);
	document.UI.init();
});;

document.graph = (function startGraph() {

	// "constants"; do not change during following code
	var LOOP_DURATION = 500;
	var NODE_FILL = "green";
	var NODE_FILL_HIGHLIGHT = "white";

	// module object; add all methods and properties that should be visible globally
	var module = {};

	// this does not seem to be used?
	module.play_flag = false;
	
	// all nodes that will be played in the current step
	var nextNodesArray = [];
	// all nodes that will be appended to the above array after the next play interval
	var appendToNextNodesArray = [];
	
	// the currently selected (and graphically highlighted) node
	var curr_node = undefined;

	// dimensions of the svg element
	var width = window.innerWidth - 20;
	var height = window.innerHeight - 76;

	var force = d3.layout.force()
		.size([width, height])
		//.nodes([]) // save-reload method should pass saved nodes here (--> the argument of the startGraph method?)
		.linkDistance(45).charge(-60).on("tick", tick);

	var svg = d3.select("body")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.on("mousemove", mousemove)
		.on("mousedown", mousedown);
		
		d3.select(window).on("keydown", keyDown);

	svg.append("rect")
		.attr("width", width)
		.attr("height", height);

	// array which holds ALL nodes
	var nodes = force.nodes(),
		startNodes = [],
		links = force.links(), 
		node = svg.selectAll(".node"), 
		link = svg.selectAll(".link");
	
	// the 'cursor' --> circle to select the nodes you want to make a connection to
	var cursor = svg.append("circle")
		.attr("r", 30)
		.attr("transform", "translate(-100,-100)")
		.attr("class", "cursor");
		
		restart();

	function mousemove() {
		cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
	}

	// why make links available globally?
	module.links = links;

	//Load and Save Logic
	function saveGraph() {
		saved_nodes = [];
		saved_links = [];
		nodes.forEach(function(node) {
			saved_nodes.push( {
			    index: node.index,
				x : node.xStart, 
				y : node.yStart,
				name: node.name,
				group_name: node.group_name,
				color : node.color,
			});
		});
		links.forEach(function(link) {
			saved_links.push( {
				source: link.source.index,
				target: link.target.index,
				});
		});
		localStorage["test"] = JSON.stringify({'nodes': saved_nodes, 'links': saved_links});
		return saved_nodes;
	}
	
	var load_node = function(node) {
			console.log(node);
			new_node = { 
				index: node.index,
				x :  node.x,
				y : node.y,
				xStart :  node.x,
				yStart : node.y,
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
		
			loadNextNode();

		function loadNextNode(){
			console.log("next called");
			if (index < jsonData['nodes'].length) {
				load_node( jsonData['nodes'][index]);
				index++;
				setTimeout(loadNextNode, 500);	
			}
			else {
				//set links
				links = [];
				jsonData['links'].forEach(function(link) {
					console.log(link.source, link.target);
					links.push({source : nodes[link.source], 
									target : nodes[link.target]});
				});
			restart();
			}
		}
	}
	module.save = saveGraph;
	module.load = loadGraph;
	
	// static id counter, is used to generate unique integer ids (called 'index')
	var idx = 0;

	// creates a new node object at the given point with a unique id
	function newNode(point){
		new_node = { 	
			index : idx,
			// current node position
			x : point[0],
			y : point[1],
			// the point of insertion
			xStart : point[0],
			yStart : point[1],
			name : document.Sound.currentSelection["sampleName"],
			group_name:  document.Sound.currentSelection["groupName"],
			sound : document.Sound.getNewSoundObjectForCurrentSound(),
			color : document.Sound.getFillColorForCurrentSound(),
			previousNode : undefined,
			d3circleReference : undefined
		};
		idx += 1;
		curr_node = new_node
		return new_node;
	}
	
	function mousedown() {
		var point = d3.mouse(this), 
			node = newNode(point); 	
			addNode(node);
	}

	// adds a new node and its connections to all relevant arrays
	function addNode(node){
			n = nodes.push(node);
		var isNewNodeConnected = false;
		
		// add links to any nearby nodes
		nodes.forEach(function(target) {
			if (! (node.index == target.index) ) {
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
				console.log(nextNodesArray);
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

	// show sound name on hover
	function nodeHoverInHandler (node) {
		$('#soundNameField').fadeIn();
		$('#soundNameField').css("color", node.color);
		$('#soundName').text(node.name);
	}

	function nodeHoverOutHandler(node) {
		$('#soundNameField').fadeOut();
	}

	function nodeClickHandler(node) {
		console.log(node.index);
		curr_node = node;
		restart();
	}
	
	function linkClickHandler(link) {
		curr_link = link;
		// TODO change link color
		restart();
	}
	
	function spliceLinksForNode(node) {
	  toSplice = links.filter(
		function(l) { 
		  return (l.source === node) || (l.target === node); });
	  toSplice.map(
		function(l) {
		  links.splice(links.indexOf(l), 1); });
	}
	
	function keyDown() {	
		switch (d3.event.keyCode) {
			case 8: // backspace
			case 46: { // delete
				 if (curr_node) {
					nodes.splice(nodes.indexOf(curr_node), 1);
					spliceLinksForNode(curr_node);
				  }
				  else if (curr_link) {
					links.splice(links.indexOf(curr_link), 1);
				  }
				  curr_link = null;
				  curr_node = null;
				  restart();
			}
			case 13 : {
				curr_node.name = document.Sound.currentSelection["sampleName"];
				curr_node.sound = document.Sound.getNewSoundObjectForCurrentSound();
				curr_node.color = document.Sound.getFillColorForCurrentSound();
				restart();
			}
		}	
	}
	
	// restarts the d3 force layout
	// is called every time a change to the graph is made (?)
	function restart() {
		//link = link.data(links);
		link = link.data(force.links(), function( d) {
			return links.indexOf( d);
		});
		
		link.enter().insert("line", ".node").attr("class", "link")
			.on("mousedown", linkClickHandler);
		link.exit().remove();
		//node = node.data(nodes);
		node = node.data(force.nodes(), function( d) {
			return nodes.indexOf( d);
		});
		
		node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 7)
			.on("mouseover", nodeHoverInHandler)
			.on("mouseout", nodeHoverOutHandler)
			.on("mousedown", nodeClickHandler)
			.call(force.drag);
		node.exit().transition()
				.attr("r", 0)
				.remove();
		
		// traverse nodes array and push to each node a reference to the corresponding d3 circle
		nodes.forEach(function (currentNode, index) {
			currentNode.d3circleReference = node[0][index];
			if (currentNode.name == "pause") {
				d3.select(currentNode.d3circleReference).attr("stroke", currentNode.color).attr("stroke-width", 2);
				d3.select(currentNode.d3circleReference).attr("fill", "black");
			}
			else {
				d3.select(currentNode.d3circleReference).attr("stroke", currentNode.color).attr("stroke-width", 2);
				
				if(curr_node && currentNode.index != curr_node.index) {
					d3.select(currentNode.d3circleReference).attr("fill", currentNode.color);
				}
			}
			
			if(curr_node && currentNode.index == curr_node.index) {
				d3.select(currentNode.d3circleReference).attr("stroke", currentNode.color).attr("stroke-width", 2);
				d3.select(currentNode.d3circleReference).attr("fill", "red");
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
			if (curr_node && currentNode.index == curr_node.index) color = "red";
			
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
				restart();
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
})();;

/*
 * additional functions
 */

 // set coordinates of html element to change its position
$.fn.setCoords = function(rebase, x, y){
    return this.each(function() {
        var el = $(this);
        var pos = el.position();
        el.css({ position: "absolute",
            marginLeft: 0, marginTop: 0,
            top: y, left: x });
        if (rebase)
            el.remove().appendTo("body");
    });
};

document.Plugins = (function () {

	// module object; add all methods and properties that should be visible globally
	var module = {};
	
	/*
	 * provides a random generated color
	 */
	function getRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
    	return color;
	};

	/*
	 * provides the html hex code of the color
	 */
	function  getColor(cName) {
		switch(cName){
			case "light_yellow":	c = "#E6FB04";
			case "neon_red": 		c = "#FF0000";
			case "neon_purple": 	c = "#7CFC00";
			case "neon_pink":		c = "#FF00CC";
			case "neon_yellow":	c = "#FFFF00";
			case "neon_green":    c = "#00FF66";
			case "light_blue":       c = "#00FFFF";
			case "dark_blue":       c = "#0033FF";
			default: 					c = '#FAEBD7';
		}
    	return c;
	};
	
	module.getColor = getColor;
	module.getRandomColor = getRandomColor;
	return module;
})();




;

// immediate function
document.Sound = (function () {

    var BUZZ_NEW_SOUND_OPTIONS = {
        preload: true,
        autoplay: false,
    };

    // initialize an array containing sound objects for a scale
    var soundNames = [
	   {
            groupName : "pause1", 
            sampleNames : ["pause"],
            groupColor :  "#E6FB04" 
        },
        {
            groupName : "voiceFX1", 
            sampleNames : ["ChoirHit", "HeyBuddy"],
            groupColor : "#FF0000"
        },
        {
            groupName : "sinusSynth4", 
            sampleNames : ["c4", "cis4", "d4", "dis4", "e4", "f4", "fis4", "g4", "gis4", "a4", "ais4", "b4"],		
            groupColor : "#9900FF"
        },
        {
            groupName : "sinusSynth3",
            sampleNames : ["c3", "cis3", "d3", "dis3", "e3", "f3", "fis3", "g3", "gis3", "a3", "ais3", "b3"],
            groupColor : "#FF00CC"
        },
		{
            groupName : "Snare1", 
            sampleNames : ["BasicClap2", "Clap1", "Snare1", "Snare2", "Snare5", "TrapClap4", "YoungChopSnr7"],
            groupColor :  "#FF8000"
        },
		 {
            groupName : "HH1", 
            sampleNames : ["HH1", "HH2", "HH3", "YChopHat3"],
            groupColor : "#00FFFF"
        },
		{
            groupName : "percussion1", 
            sampleNames : [ "TrapPerc2", "Ting","Timpani"],
            groupColor :  "#00FF66"
        },
		{
            groupName : "Base1", 
            sampleNames : ["Kick1", "Kick2", "Kick3", "Stomp", "YchopHardKick5"],
            groupColor :  "#0033FF"
        }
    ];
    // build the sound datastructure
    var sounds = {};
    for (var i = soundNames.length; i--; ) {

        var groupName = soundNames[i]["groupName"];
        var groupColor = soundNames[i]["groupColor"];
        var samples = [];
        
        for (var j = 0; j < soundNames[i]["sampleNames"].length; j++) {
            var sampleName = soundNames[i]["sampleNames"][j];
            
            samples.push({
                buzzObject: getSoundObject(groupName, sampleName),
                name: sampleName,
                color: groupColor
            });
        }

        sounds[groupName] = samples;
    }

    function getSoundObject (group, name) {
        //console.log("get sound: " + group + "/" + name + ".mp3");
        return new buzz.sound("audio-samples/" + group + "/" + name + ".mp3", BUZZ_NEW_SOUND_OPTIONS);
    }

    function getNewSoundObjectForCurrentSound () {
        return getSoundObject(
            document.Sound.currentSelection["groupName"],
            document.Sound.currentSelection["sampleName"]
            );
    }

    function getFillColorForCurrentSound () {
        return document.Sound.currentSelection["color"];
    }

    function toggleSound () {
        module.isSoundOn = !module.isSoundOn;
    }

    // module object; add all methods and properties that should be visible globally
    var module = {};
    module.sounds = sounds;
    module.getSoundObject = getSoundObject;
    module.getNewSoundObjectForCurrentSound = getNewSoundObjectForCurrentSound;
    module.getFillColorForCurrentSound = getFillColorForCurrentSound;
    module.currentSelection = {groupName: undefined, sampleName: undefined};
    module.isSoundOn = true;
    module.toggleSound = toggleSound;
    return module;
})();;

// immediate function
document.UI = (function () {

	var loopTempo = 120;
	// module object; add all methods and properties that should be visible globally
    var module = {};
	
	var updateSoundList = function () {

		$('ul#sound-list').empty();
		var groupName = $('select#banch-select').find(':selected').attr('value');
		$(document.Sound.sounds[groupName]).each(function (sampleCounter, sample) {
			$('ul#sound-list').append('<li value="' + sampleCounter + '" class="sound-item">' + sample["name"] + '</li>');
		});
		$('.sound-item').click(soundClickHandler);
		document.Sound.currentSelection["groupName"] = groupName;

		// select and highlight first sound
		soundClickHandler.call($('.sound-item[value=0]'));
	};

	var highlightSelection = function (elementToHighlight) {
		$('#sound-list').children().each(function (counter, element) {
			$(element).css("color", "white");
		});
		$(elementToHighlight).css("color", document.Sound.getFillColorForCurrentSound());
	};
	
	var soundClickHandler = function () {
		var currentGroupName = document.Sound.currentSelection["groupName"];
		document.Sound.currentSelection["sampleName"] = document.Sound.sounds[currentGroupName][$(this).attr('value')]["name"];
		document.Sound.currentSelection["color"] = document.Sound.sounds[currentGroupName][$(this).attr('value')]["color"];
		document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"].play();
		var s = document.Sound.sounds[currentGroupName][$(this).attr('value')]["buzzObject"];
		// who needs the above variable 's'?
		highlightSelection(this);
	};

	var init = function () {

		// init interface for sound selection
		var selected = " selected";
		$.each(document.Sound.sounds, function (groupName, samples) {
			$('select#banch-select').append('<option value="' + groupName + '"' + selected + '>' + groupName + '</option>');
			selected = ""; // only add selected attribute to first option
		});

		updateSoundList();

		// assign event handlers
		$('select#banch-select').change(updateSoundList);

		/*
		 *menu click events
		 */
		$('#loopToggle').click(function (e) {
			document.graph.toggleLoop();
			$('#loopOn, #loopOff').toggle();

			// deactivate clear button
			$('#clear').toggleClass('deactivate');
		});

		$('#soundToggle').click(function (e) {
			$('#soundOn, #soundOff').toggle();
			document.Sound.toggleSound();
		});

		$('#clear').click(function (e) {
			if (! $(this).hasClass('deactivate')) {
				document.graph.clear();
			}
		});

		// speed up/ down
		$('#speedUpButton').click(function (e) {
			loopTempo += 2;
			document.graph.setLoopDuration(convertBPMtoMilliseconds(loopTempo));
			updateTimeDisplay(loopTempo);
		});
		$('#speedDownButton').click(function (e) {
			loopTempo -= 2;
			document.graph.setLoopDuration(convertBPMtoMilliseconds(loopTempo));
			updateTimeDisplay(loopTempo);
		});
		
		/*
		 * show short instructions on mouse move over body element
		 */
		var instrFlag = false;
		$("body").hover(function() {
			if(instrFlag == false) {
				$("#instructionText").fadeIn("normal");
		           instrFlag = true;
		        }
		    });
		$("rect").mousedown(function() {
		        if(instrFlag == true) {
					$("#instructionText").fadeOut("normal");
		            //instrFlag = false;
		        }	
		    });
			
		/*
		 * show long instructions on mouse move over the info-button-element
		 */
		$("#info").hover(
			// function on mouse enter
			function() { 
				 //prepare position coord and set position
				var y = $(window).height() - 350 ;
				var x = $(window).width()  - 350;
				$("#infoTextOnHover").css({ position: "absolute", left: x, bottom: y, width: "auto", height: "auto" });
				$("#infoTextOnHover").remove().appendTo("body");
				// fade in 
				$("#infoTextOnHover").fadeIn("normal"); 
			},  
			// function on mouse leave - fade out
			function() { $("#infoTextOnHover").fadeOut("normal");  } 
		);
		
		/*
		 * popup field containing informations by click on info-button-element 
		 */
		var popupFlag = false;
			$("#info").click(function() {
		        if(popupFlag == false) {
		            $("#popup").fadeIn("normal");
		            popupFlag = true;
		        }
				return false;
		    }); 
		 	// close
		    $(".schliessen").click(function() {
		        if(popupFlag == true) {
					$("#popup").fadeOut("normal");
		            $("#popupHintergrund").fadeOut("normal");
		            popupFlag = false;
		            $("#msg").setCoords(true, 10, 90);
		        }	
		    });
		
		/*
		 * hover action on node
		 */	
		$(".node").hover(function() { console.log("hover on node mouse enter");  },  function() { console.log("hover on node mouse leave");  }  );

		updateTimeDisplay(loopTempo);
		
		/*
		 * buttons for save/ load graph in the browsers local storage
		 */
		$('#saveGraph').click(function (e) {
			document.graph.save();
		});
		
		$('#loadGraph').click(function (e) {
			document.graph.load();
		});
		
	};
	
	var getLoopTempo = function () {
		return loopTempo;
	};

	var convertBPMtoMilliseconds = function (bpm) {
		return Math.round((60 / bpm) * 1000);
	};

	var updateTimeDisplay = function (bpm) {
		$('#speed').text(bpm + " bpm");
	};
	
	module.getLoopTempo = getLoopTempo;
    module.init = init;
    return module;
	
	/*
	 * cklick action on node
	 */
})();