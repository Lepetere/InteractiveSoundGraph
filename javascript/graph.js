/*
 * module to build a graph, using the force d3.js library
 *
 D3's force layout uses the Barnes–Hut approximation to compute repulsive charge forces between all nodes efficiently. Links are implemented as geometric constraints on top of position Verlet integration, offering greater stability. A virtual spring between each node and the center of the chart prevents nodes from drifting into space
 *
 */
// help function 
var getRandomColor =  function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
    return color;
};

// debugging: get time for loading the module
var start =  new Date().getTime();
//console.log("graph.js start: "+ start);

document.graph = (function startGraph() {

	// module object; add all methods and properties that should be visible globally
	var module = {};
	module.loopFlag = false;
	
	// TODO: bind variables
	module.nextSound = undefined;
	module.nextColor = undefined;
	
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
		links = force.links(), 
		node = svg.selectAll(".node"), 
		link = svg.selectAll(".link");
		
	module.node = node;
	
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
			node = { 	x : point[0],
							y : point[1],
					  sound : module.nextSound ,
					  color   : getRandomColor()
			}, 		
			n = nodes.push(node);
		// add links to any nearby nodes
		nodes.forEach(function(target) {
			var x = target.x - node.x, y = target.y - node.y;
			if (Math.sqrt(x * x + y * y) < 30) {
				links.push({source : node, target : target});
			}
		});
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
		force.start();
	}
	
//////////////////////// new functions 
	// clear the svg content from the graph, restart graph
	function clear() {
		console.log("Function clear");
		d3.select("svg").remove();
		startGraph();
	}
	
	// start and stop  loop functions
	var setLoopFlag = function(){
		module.loopFlag = !module.loopFlag;
		if(module.loopFlag){
			loopGraph();
			module.timeVar = setInterval(function () {
			var nodeIndex =  loopGraph(module.current);
				console.log("node index : " + nodeIndex);
				console.log("node color. : " + nodes[nodeIndex].color);
				console.log();
			}, 2500);
		}else clearInterval(module.timeVar);
	}

	//set loop
	module.current=0;
	var loopGraph = function (current) {
		if(nodes.length <= module.current){
			module.current = 0;
		}
		return module.current++;
	};
	
	module.setLoopFlag = setLoopFlag;
	module.clear = clear;
	return module;
})(); 

// debugging: get time for loading the module
var end = new Date().getTime();
//console.log("graph.js end: "+  end );
var time = end - start;
console.log("loading time for graph.js: " + time);