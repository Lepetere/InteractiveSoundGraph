// debugging: get time for loading the module
var start =  new Date().getTime();
console.log("graph.js start: "+ start);

document.graph = (function startGraph() {

	// module object; add all methods and properties that should be visible globally
	var module = {};
	module.loopFlag = false;
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
				y : point[1]
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
			.attr("cy", function(d) {return d.y;});
	}

	function restart() {
		link = link.data(links);
		link.enter().insert("line", ".node").attr("class", "link");
		node = node.data(nodes);
		node.enter().insert("circle", ".cursor").attr("class", "node").attr("r", 7).call(force.drag);
		force.start();
	}

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
			module.timeVar = setInterval(function () {loopGraph();}, 2500);
		}else clearInterval(module.timeVar);
	}
	
	//set loop
	var loopGraph = function () {
		// loop over nodes function
		nodes.forEach(function(node) {
				console.log("node:" + node.x +  node.y);
				console.log();
			});
	};
	
	module.setLoopFlag = setLoopFlag;

	module.clear = clear;
	return module;
})(); 

// debugging: get time for loading the module
var end = new Date().getTime();
console.log("graph.js end: "+  end );
var time = end - start;
console.log("time graph.js: " + time);