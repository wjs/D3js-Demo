var g_node_width;
var g_node_radius;
var g_link_width;
var nodes_count = 0;
var links_count = 0;

var WeiboGraph = function (ele) {
	typeof(ele)=='string' && (ele=document.getElementById(ele));
	var w = ele.clientWidth,
		h = ele.clientHeight,
		self = this;

	/* --------- setting node radius and link length ---------------------------- */
	var s = 0;
	if (w > h) {
		// s = Math.PI * (h / 2) * (h / 2) - Math.PI * (h / 3) * (h / 3);
		s = Math.PI * 5 * h * h / 36;
		g_link_width = h / 3;
	} else {
		// s = Math.PI * (w / 2) * (w / 2) - Math.PI * (w / 3) * (w / 3);
		s = Math.PI * 5 * w * w / 36;
		g_link_width = w / 3;
	}
	g_node_width = Math.sqrt(s / 2 / nodes_count);
	g_node_radius = g_node_width / 2;

	if (g_node_radius < 10) {
		g_node_width = 20;
		g_node_radius = 10;
	}


	this.force = d3.layout.force().gravity(.05)
								.distance(function() { return (Math.random() + 0.6) * g_link_width; })
								.charge(-800).size([w, h]);
	this.nodes = this.force.nodes();
	this.links = this.force.links();
	this.vis = d3.select(ele)
				.append("svg:svg")
             	.attr("width", w)
             	.attr("height", h)
             	.attr("pointer-events", "all")
             	.append('g')
             	.attr('id', 'zoomViewport');

    var defs = this.vis.append('svg:defs');
	defs.append('svg:rect')
		.attr('id', 'rect')
		.attr('x', '0')
		.attr('y', '0')
		.attr('width', g_node_width)
		.attr('height', g_node_width)
		.attr('rx', g_node_radius);
	var chipPath = defs.append('svg:clipPath')
						.attr('id', 'circle_img');
	chipPath.append('svg:use')
			.attr('xlink:href', '#rect');

	this.force.on("tick", function(x) {
		self.vis.selectAll('g.node')
				.attr('transform', function(d) { return 'translate('+(d.x-g_node_radius)+','+(d.y-g_node_radius)+')'; });	
		self.vis.selectAll('line.link')
				.attr('x1', function(d) { return d.source.x; })
				.attr('y1', function(d) { return d.source.y; })
				.attr('x2', function(d) { return d.target.x; })
				.attr('y2', function(d) { return d.target.y; });
	});
}

WeiboGraph.prototype.doZoom = function() {
	d3.select(this).select('g')
					.attr('transform', 'translate('+d3.event.translate+') scale('+d3.event.scale+')');
}

WeiboGraph.prototype.addNode = function(node) {
	this.nodes.push(node);
}

WeiboGraph.prototype.addNodes = function(nodes) {
	if (Object.prototype.toString.call(nodes) == '[object Array]') {
		var self = this;
		nodes.forEach(function(node) {
			self.addNode(node);
		});
	}
}

WeiboGraph.prototype.addLink = function(source, target) {
	this.links.push({source: this.findNode(source), 
					target: this.findNode(target)});
}

WeiboGraph.prototype.addLinks = function(links) {
	if (Object.prototype.toString.call(links) == '[object Array]') {
		var self = this;
		links.forEach(function(link) {
			self.addLink(link['source'], link['target']);
		});
	}
}

WeiboGraph.prototype.removeNode = function(uid) {
	var i = 0,
		n = this.findNode(uid),
		links = this.links;
	while (i < links.length) {
		links[i]['source']==n || links[i]['target']==n ? links.splice(i, 1) : ++i;
	}
	this.nodes.splice(this.findNodeIndex(uid), 1);
}

WeiboGraph.prototype.findNode = function(uid) {
	var nodes = this.nodes;
	for (var i in nodes) {
		if (nodes[i]['uid'] == uid)
			return nodes[i];
	}
	return null;
}

WeiboGraph.prototype.findNodeIndex = function(uid) {
	var nodes = this.nodes;
	for (var i in nodes) {
		if (nodes[i]['uid'] == uid)
			return i;
	}
	return -1;
}

WeiboGraph.prototype.clearNodes = function() {
	this.nodes.length = 0;
}

WeiboGraph.prototype.clearLinks = function() {
	this.links.length = 0;
}

WeiboGraph.prototype.update = function() {
	var link = this.vis.selectAll('line.link')
						.data(this.links, function(d) { return d.source.uid + '-' + d.target.uid; })
						.attr('class', function(d) { return 'link'; });

	link.enter().insert('svg:line', 'g.node')
				.attr('class', function(d) { return 'link'; });

	link.exit().remove();

	var node = this.vis.selectAll('g.node')
						.data(this.nodes, function(d) { return d.uid; });

	var nodeEnter = node.enter().append('svg:g')
						.attr('class', 'node')
						.call(this.force.drag);
	
	
	nodeEnter.append('svg:image')
			.attr('clip-path', 'url(#circle_img)')
			.attr('xlink:href', function(d) { return 'http://tp2.sinaimg.cn/' + d.uid + '/50/0/1';})
			.attr('width', g_node_width+'px')
			.attr('height', g_node_width+'px')
			.on('dblclick',function(d){ 
				//changeGraphAjax(d.uid);
			});
	
	nodeEnter.append('svg:text')
			.attr('class', 'nodetext')
			.attr('dx', 0)
			.attr('dy', -5)
			.text(function(d) { return d.nick });

	node.exit().remove();

	this.force.start();
	
	$('svg').svgPan('zoomViewport', true, true, true);
	initToolTipEvent();
}


function changeGraphAjax(uid) {
	CURRENT_UID = uid;
	$.ajax({
		type: 'GET',
		url: '/graph',
		contentType: 'application/json; charset=utf-8',
		data: {'uid': uid, 'graph_type': GRAPH_TYPE},
		success: function(data) {
			json = eval("("+data+")");

			nodes_count = json.nodes.length;
			links_count = json.nodes.length;
			d3.select(document.getElementById("graph")).html('');
			weiboGraph = getNewGraph();

			// weiboGraph.clearNodes();
			// weiboGraph.clearLinks();
			weiboGraph.addNodes(json.nodes);
			weiboGraph.addLinks(json.links);
			weiboGraph.update();

			var temp_index = HISTORY_GRAPH_LIST.indexOf(uid+"");
			if (temp_index >= 0) {
				HISTORY_GRAPH_LIST.splice(temp_index, 1);
			}
			HISTORY_GRAPH_LIST.push(uid+"");
			if (HISTORY_GRAPH_LIST.length > HISTORY_GRAPH_LIST_MAX_LENGTH) {
				HISTORY_GRAPH_LIST.shift();
			}
			console.log(HISTORY_GRAPH_LIST);
			repaintHistoryPanel();
		},
		error: function(data) {
			$('#loading-div').hide();
			alert('Ajax to get graph occur error.')
		}
	});
}

var repaintHistoryPanel = function () {
	$('#history').html('');
	var htmlStr = '';
	for (var i = HISTORY_GRAPH_LIST.length-1; i > -1; i--) {
		htmlStr += '<img src="http://tp2.sinaimg.cn/' + HISTORY_GRAPH_LIST[i] + '/50/0/1" uid="' + HISTORY_GRAPH_LIST[i] + '">';
	};
	if (HISTORY_GRAPH_LIST.length > 0) {
		htmlStr += '<span id="clear_history" title="clear history"></span>';
	}
	$('#history').html(htmlStr);

	/*---------- history panel ------------*/
	$('#history img').click(function (event) {
		changeGraphAjax($(this).attr('uid'));
	});
	$('#clear_history').click(function (event) {
		HISTORY_GRAPH_LIST = [];
		repaintHistoryPanel();
	});
};

var initToolTipEvent = function () {
	tipOffsetX = 10;
	tipOffsetY = 10;
	$('.node').each(function (index, element) {
		$(this).on('mouseenter', function (e) {
			var node = weiboGraph.nodes[index];
			var htmlStr = '<div align="center"><img src="http://tp2.sinaimg.cn/' + node.uid + '/50/0/1"></div>'
			htmlStr += 'uid: ' + node.uid + '<br>';
			htmlStr += 'nick: ' + node.nick + '<br>';
			htmlStr += 'follows: ' + node.follows + '<br>';
			htmlStr += 'fans: ' + node.fans + '<br>';
			$('#tooltipDiv').html(htmlStr);
			$("#tooltipDiv").css("top",(e.pageY + tipOffsetY) + "px").css("left",(e.pageX + tipOffsetX) + "px").show();
		});
		$(this).on('mousemove', function (e) {
			$("#tooltipDiv").css("top",(e.pageY + tipOffsetY) + "px").css("left",(e.pageX + tipOffsetX) + "px");
		});
		$(this).on('mouseout', function (e) {
			$("#tooltipDiv").css("top",(e.pageY + tipOffsetY) + "px").css("left",(e.pageX + tipOffsetX) + "px").hide();
		});
	});
};

function getNewGraph() {
	$('#graph').css('width', (window.innerWidth-5)+'px');
	$('#graph').css('height', (window.innerHeight-5)+'px');
	return new WeiboGraph('graph');
}

/*-- Init global variable -----------------------------------------------------*/
var weiboGraph = getNewGraph();
var CURRENT_UID;
var GRAPH_TYPE = 'follows';
var HISTORY_GRAPH_LIST = [];
var HISTORY_GRAPH_LIST_MAX_LENGTH = 5;