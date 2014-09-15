$(function() {
	/*--------- graph width and height -----------*/	
	$(window).resize(function () {
		$('#graph').css('width', (window.innerWidth-5)+'px');
		$('#graph').css('height', (window.innerHeight-5)+'px');
		paintDemoGraph();
	});

	paintDemoGraph();
});

function paintDemoGraph() {
	json = {"nodes":[{"uid":3293261897, "nick":"jinshi-10ss", "follows":41, "fans":18},{"uid":1326604140, "nick":"zccshome", "follows":174, "fans":157},{"uid":1563647205, "nick":"焦一丝沉_期待下一站", "follows":474, "fans":319},{"uid":1630461754, "nick":"IT程序猿", "follows":1719, "fans":449602},{"uid":1642634100, "nick":"新浪科技", "follows":898, "fans":8146134},{"uid":1664589774, "nick":"hackerzhou", "follows":439, "fans":2218},{"uid":1680118493, "nick":"wangxinalex", "follows":369, "fans":122},{"uid":1765336564, "nick":"无睑之眼", "follows":107, "fans":79},{"uid":1801741177, "nick":"王门47", "follows":454, "fans":200},{"uid":1846614201, "nick":"徐太阳啊徐太阳", "follows":252, "fans":300},{"uid":1860096194, "nick":"耿琪伟", "follows":180, "fans":141899},{"uid":1867684872, "nick":"真理pierce", "follows":455, "fans":767},{"uid":1894238970, "nick":"developerWorks", "follows":1859, "fans":53445},{"uid":1895964183, "nick":"一起神回复", "follows":106, "fans":4263371},{"uid":1905309852, "nick":"EgoSurfing", "follows":519, "fans":132},{"uid":1906754304, "nick":"trap_in_kernel", "follows":199, "fans":97},{"uid":1911313045, "nick":"HTML5研究小组", "follows":1611, "fans":134655},{"uid":1929644930, "nick":"马少平THU", "follows":698, "fans":13317},{"uid":1962310741, "nick":"微相册", "follows":143, "fans":21175950},{"uid":1963340133, "nick":"VikingMew", "follows":493, "fans":227},{"uid":1967420181, "nick":"考拉熊LYY", "follows":623, "fans":339},{"uid":2093492691, "nick":"程序员的那些事", "follows":745, "fans":240778},{"uid":2119771715, "nick":"一零软愿", "follows":53, "fans":68},{"uid":2126471765, "nick":"萌宠家园", "follows":2575, "fans":576003},{"uid":2282982320, "nick":"小C说生活是自己践踏出来的", "follows":270, "fans":121},{"uid":2364790652, "nick":"精彩Android", "follows":0, "fans":160955},{"uid":2384119090, "nick":"复旦信息办", "follows":170, "fans":3143},{"uid":2480578907, "nick":"hellosword", "follows":195, "fans":79},{"uid":2586754823, "nick":"Matthew609", "follows":15, "fans":14},{"uid":2607464862, "nick":"潇湘8002", "follows":63, "fans":5538},{"uid":2672744005, "nick":"sladezhang", "follows":123, "fans":72},{"uid":2821087024, "nick":"BusyCoding敬潇", "follows":219, "fans":84},{"uid":2825189572, "nick":"学点黑客技术", "follows":30, "fans":1490881},{"uid":2876635527, "nick":"fd_xjhua", "follows":351, "fans":42},{"uid":3206872260, "nick":"因为你长得丑", "follows":20, "fans":37},{"uid":3207555870, "nick":"花露水炒鸡蛋", "follows":16, "fans":8},{"uid":3293367493, "nick":"朱成纯是大_傻_逼", "follows":6, "fans":22},{"uid":3602780292, "nick":"美食丶旅游丶摄影", "follows":20, "fans":4998}], "links":[{"source":3293261897,"target":1326604140},{"source":3293261897,"target":1563647205},{"source":3293261897,"target":1630461754},{"source":3293261897,"target":1642634100},{"source":3293261897,"target":1664589774},{"source":3293261897,"target":1680118493},{"source":3293261897,"target":1765336564},{"source":3293261897,"target":1801741177},{"source":3293261897,"target":1846614201},{"source":3293261897,"target":1860096194},{"source":3293261897,"target":1867684872},{"source":3293261897,"target":1894238970},{"source":3293261897,"target":1895964183},{"source":3293261897,"target":1905309852},{"source":3293261897,"target":1906754304},{"source":3293261897,"target":1911313045},{"source":3293261897,"target":1929644930},{"source":3293261897,"target":1962310741},{"source":3293261897,"target":1963340133},{"source":3293261897,"target":1967420181},{"source":3293261897,"target":2093492691},{"source":3293261897,"target":2119771715},{"source":3293261897,"target":2126471765},{"source":3293261897,"target":2282982320},{"source":3293261897,"target":2364790652},{"source":3293261897,"target":2384119090},{"source":3293261897,"target":2480578907},{"source":3293261897,"target":2586754823},{"source":3293261897,"target":2607464862},{"source":3293261897,"target":2672744005},{"source":3293261897,"target":2821087024},{"source":3293261897,"target":2825189572},{"source":3293261897,"target":2876635527},{"source":3293261897,"target":3206872260},{"source":3293261897,"target":3207555870},{"source":3293261897,"target":3293367493},{"source":3293261897,"target":3602780292}]};

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
}
