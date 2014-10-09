var isStop_trade = false;			
var isStop_notice = false;
var http_request_notice;
var http_request_trade;


//#notice start
function processRequestNotice(url,isMaster) {
	var d = new Date();
	var urls = url + "?" + d.getFullYear() + (d.getMonth()+1) + d.getDate()
			+ d.getHours() + d.getMinutes() + d.getSeconds();
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request_notice = new XMLHttpRequest();

		if (http_request_notice.overrideMimeType) {
			http_request_notice.overrideMimeType('text/xml');
		}

	} else if (window.ActiveXObject) { // IE
		try {
			http_request_notice = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request_notice = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	}

	if (!http_request_notice) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	http_request_notice.onreadystatechange = function(){processResponseNotice(isMaster)};
	http_request_notice.open('GET', urls, true);
	http_request_notice.send(null);
}

function processResponseNotice(isMaster) {
	if (http_request_notice.readyState == 4) {
		if (http_request_notice.status == 200) {
			if(isMaster==1){
				handleMasterResultNotice();
			}else{
				handleBranchResultNotice();
			}
		} else {
			isStop_notice = false;
			// alert('服务器关闭!');
		}
	}
}

function handleMasterResultNotice() {
	var data_notice;
	var code_notice;
	//alert(http_request.responseText.split);
	var result = http_request_notice.responseText.split("|");
	//alert("result.length" + result.length);
	for (var i = 0;i < result.length; i++) {// 循环处理
		data_notice = result[i].split(";");
		if (data_notice.length != 3)
			break;
		
		if (sequence_notice >= parseInt(data_notice[1])) {
			continue;
		}
		code_notice = parseInt(data_notice[0]);//牌价类型或事件类型
	
		if(code_notice == 6){	//通知信息
			if(data_notice[2]){
				var ret = data_notice[2].split(",");
				if(ret.length==1){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function();
					}
				}else if(ret.length==2){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function(ret[1]);
					}
					
				}else if(ret.length==3){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function(ret[1],ret[2]);
					}
					
				}
			}
			
		}
		sequence_notice = parseInt(data_notice[1]);
	}
//	if (!isStop_notice){
//		setTimeout("processRequestNotice('/text/ajax.txt',1)",2000);
//	}
	if (isStop_notice){
		clearInterval(MasterNoticeTimer);
	}
	result=null;
	data_notice = null;
	code_notice = null;
	CollectGarbage();
}




//处理分行的消息请求
function handleBranchResultNotice() {
	var data_notice;
	var code_notice;
	//alert(http_request.responseText.split);
	var result = http_request_notice.responseText.split("|");
	//alert("result.length" + result.length);
	for (var i = 0;i < result.length; i++) {// 循环处理
		data_notice = result[i].split(";");
		if (data_notice.length != 3)
			break;
		
		if (sequence_noticeBranch >= parseInt(data_notice[1])) {
			continue;
		}
		code_notice = parseInt(data_notice[0]);//牌价类型或事件类型
	
		if(code_notice == 6){	//通知信息
			if(data_notice[2]){
				var ret = data_notice[2].split(",");
				if(ret.length==1){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function();
					}
				}else if(ret.length==2){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function(ret[1]);
					}
					
				}else if(ret.length==3){
					if(ret[0]){
						eval("var _function = " + ret[0]);
						_function(ret[1],ret[2]);
					}
					
				}
			}
			
		}
		sequence_noticeBranch = parseInt(data_notice[1]);
	}
//	if (!isStop_notice){
//		setTimeout("processRequestNotice('/text/ajax.txt',0)",2000);
//	}
	if (isStop_notice){
		clearInterval(BranchNoticeTimer);
	}
	result=null;
	data_notice = null;
	code_notice = null;
	CollectGarbage();
}
//#notice end



//#trade start
function processRequestTrade(url,isMaster) {
	var d = new Date();
	var urls = url + "?" + d.getFullYear() + (d.getMonth()+1) + d.getDate()
			+ d.getHours() + d.getMinutes() + d.getSeconds();
	http_request_trade = false;
	if (window.XMLHttpRequest) { // Mozilla, Safari,...
		http_request_trade = new XMLHttpRequest();

		if (http_request_trade.overrideMimeType) {
			http_request_trade.overrideMimeType('text/xml');
		}

	} else if (window.ActiveXObject) { // IE
		try {
			http_request_trade = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try {
				http_request_trade = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e) {
			}
		}
	}

	if (!http_request_trade) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}
	http_request_trade.onreadystatechange =  function(){processResponseTrade(isMaster)};
	http_request_trade.open('GET', urls, true);
	http_request_trade.send(null);
}



//isMaster==1 代表总行
//isMaster==0 代表分行

function processResponseTrade(isMaster) {
	if (http_request_trade.readyState == 4) {
		if (http_request_trade.status == 200) {
			if(isMaster==1){
				handleMasterResultTrade();
			}else{
				handleBranchResultTrade();
			}
		} else {
			isStop_trade = false;
		}
	}
}



//处理总行行的交易列表请求
function handleMasterResultTrade() {
	var data_trade;
	var code_trade;
	//alert(http_request.responseText.split);
	var result = http_request_trade.responseText.split("|");
//	alert("result.length" + result.length);
	for (var i = 0;i < result.length; i++) {// 循环处理
		data_trade= result[i].split(";");
		if (data_trade.length != 3)
			break;
		if (sequence_tradeMaster >= parseInt(data_trade[1])) {
			continue;
		}
		code_trade = parseInt(data_trade[0]);//牌价类型或事件类型
		
		switch(code_trade){
			case 5:
				MasterContext.insertTrade(data_trade[2]);break;//刷新交易
		}
		sequence_tradeMaster = parseInt(data_trade[1]);
	}
	if (isStop_notice){
		clearInterval(MasterTradeTimer);
	}
	result=null;
	data_trade = null;
	code_trade = null;
	CollectGarbage();
}




//处理分行的交易列表请求
function handleBranchResultTrade() {
	var data_trade;
	var code_trade;
	//alert(http_request.responseText.split);
	var result = http_request_trade.responseText.split("|");
	//alert("result.length" + result.length);
	for (var i = 0;i < result.length; i++) {// 循环处理
		data_trade= result[i].split(";");
		if (data_trade.length != 3)
			break;
		if (sequence_tradeBreach >= parseInt(data_trade[1])) {
			continue;
		}
		code_trade = parseInt(data_trade[0]);//牌价类型或事件类型
		
		switch(code_trade){
			case 5:
				BranchContext.insertTrade(data_trade[2]);break;//刷新交易
		}
		sequence_tradeBreach = parseInt(data_trade[1]);
	}
	if (isStop_notice){
		clearInterval(BranchTradeTimer);
	}
	result=null;
	data_trade = null;
	code_trade = null;
	CollectGarbage();
}
//#trade end

