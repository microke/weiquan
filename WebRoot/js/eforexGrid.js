//查看原交易详细信息
function queryTradeView(){
	var infoWin = new Ext.LayoutDialog('viewDiv', { 
			                    modal:true,
			                    width:450,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                        autoScroll:false,
			               			tabPosition: "center",
			                		alwaysShowTabs: false
			                    }
	});
	var cBtn = infoWin.addButton('关闭');
	var contentView = new Ext.ContentPanel('viewtrade',{autoCreate : true,fitToFrame:true});
	 var doViewCancleBtn = function(){
	    	contentView.setContent('');// 清除面板数据
	    	infoWin.hide();
	};
	cBtn.setHandler(doViewCancleBtn, infoWin);
    infoWin.setTitle("交易详细信息查看");
    var layout = infoWin.getLayout();
    layout.beginUpdate();
    layout.add('center',contentView);
    var params = eforexGrid.createParam();
    var tradeLoadCb = function(e,b,o){
				infoWin.setContentSize(contentView.getEl().dom.scrollWidth,contentView.getEl().dom.scrollHeight);// 控制授权窗口显示大小
	};
    var update = contentView.getUpdateManager();
   	var url = Ext.get('viewTradeBtn').dom.getAttribute('url');
   	if(url == 'queryDeliveryInfoView'){
   		var type = Ext.get("custDelivery.type").dom.value;
   		if(type == 4){
   			url = '/forex/getSwapTradeDetail.action?subAction=view&swapTrade.type=4';
   			params = 'swapTrade.serialNo='+Ext.get("custDelivery.serialNo").dom.value+'&';
   		}else{
   			url = '/forex/getForwardTradeDetail.action?subAction=view&forwardTrade.type=2';
   			params = 'forwardTrade.serialNo='+Ext.get("custDelivery.serialNo").dom.value+'&';
   		}
   	}
   	
    update.update({
					   url:url,
				       params:params,
				       callback:tradeLoadCb,// 回调函数
				       nocache:true,
					   scope:this		
	}); 
	layout.endUpdate();
	infoWin.show();
	infoWin.moveTo(650,200);
}
var eforexGrid = function(){
	Ext.BLANK_IMAGE_URL='../images/default/s.gif';
	var gridTitleName = 'gridTitle';
	var gridMenu = 'gridMenu';
	var LIMIT = 16;
	var PAGESIZE = 16;
	var rateCodeCombo;
	var tradeXXDiaglogType=3;
	var printDataStore;// 仅打印时候作为数据源装载数据
	var gridTitle,listURL,qParams;
	var eforexRecord,eforexColModel,dataStore,grid,gridMenuForm,infoDlg,myInfoDlg,printDlg,printDlgO,content,mycontent,contentO,printOptionContent,selectModel,paging,cbCounter,btn1,printOptionBtn,dialogWa,infoWin;
	var Right,RightCM,RightDS,RightGrid,app,appCM,appDS,appGrid;
	var showtimeSpan = '<span id="showtime" style="color:#ff0000;width:200px;font:16px"></span>';
	var tradeSecond=0,tradeMin=0,tradeTimer ='',se;
	var actionPath = '/forex/updateOneTradeInfo';
	var btn,mybtn,otherbtn,kondorbtn,relationBtn, printBtn;// 确定按钮，其他按钮用
	var btnDeal;
	var branchProfitIsBuyStore;
	var branchProfitIsBuySelect;
	var SPECIAL_TYPE_NORMAL = 1; 	  // 普通交易
	var SPECIAL_TYPE_E_DELIVERY = 4;  // 提前交割
	var SPECIAL_TYPE_E_DURATION = 2;  // 提前展期
	var SPECIAL_TYPE_DELIVERY = 3; 	  // 交割
	var SPECIAL_TYPE_E_BREACH = 10;   // 提前违约
	var SPECIAL_TYPE_DURATION = 11;   // 到期展期
	var SPECIAL_TYPE_BREACH = 12;     // 到期违约
	var SPECIAL_TYPE_ERASE = 13;      // 冲正
	var SPECIAL_TYPE_N_ERASE = 14;    // 隔日冲正
	var SPECIAL_TYPE_ALL_BREACH = 15; // 全部违约
	var SPECIAL_TYPE_DELIVERY_CANCEL = 16; 	  // 交割撤销
	
	var branchProfitIsBuyData=[
                               ['-1', '所有']
                                ];
    var ACC_RESULT_FLAG_DK = 1,ACC_RESULT_FLAG_ZF =2,ACC_RESULT_FLAG_ECCZ=3,ACCPROCE_STATUS_INIT= 0,ACCPROCE_STATUS_SUCCESS = 1,ACCPROCE_STATUS_EXCEPTION = 2,ACCPROCE_STATUS_NOTDO=3;
	return {
		init : function(){
			Ext.PagingToolbar.prototype.onClick=this.PagingToolbarOnClick;// 分页toolbar点击方法重载，构造函数原型方法
			Ext.PagingToolbar.prototype.onPagingKeydown = this.PagingToolbarOnKeydown;
			if(!Ext.get('NoPage')){
				Ext.get('topic-grid').dom.style.height = Ext.lib.Dom.getViewHeight() - 47;
			}else{
				Ext.get('topic-grid').dom.style.height = Ext.lib.Dom.getViewHeight() -20;
			}
			gridTitle = Ext.get(gridTitleName);	
			listURL = Ext.get(gridTitleName).dom.action;
			gridMenuForm = Ext.get(gridMenu);
			eforexGrid.createGrid();
			if(gridMenuForm){
				this.createHeadToolBar();
			}
			if(Ext.get('getQueryPosListBtn')){
		      // this.getQueryPosListInfo();//查询头寸历史信息，列模型重置
			} else if(Ext.get('latestPrice')){
				
			}else{
			  this.loadGridData();
			}
		},
	    stopTimer : function(){
			clearInterval(se);
			tradeSecond = 0;
			tradeMin = 0;
		},
	    textCounter : function(field,maxlimit){
			if (field.value.length > maxlimit){
				field.value = field.value.substring(0,maxlimit);
				Ext.MessageBox.alert('输入限制','不能大于'+maxlimit+'字符！');
			}
		},
		changeSafeReportMonthCheckBox : function() {
			var monthCheck = Ext.get("safeReport.monthReport").dom.checked;    
			if(monthCheck){
				Ext.get("safeReport.tenDaysReport").dom.checked = false;
				Ext.get("safeReport.monthReport").dom.checked = true;
			}
		},
		createRecordModel : function(){
			var property,properties = new Array();
			var elements = gridTitle.dom.elements;
			for(var i=0; i<elements.length; i++){
				property = new Object();
				property['name'] = elements[i].getAttribute('id');
				if(elements[i].getAttribute('modeltype')!=null){
					property['type'] = elements[i].getAttribute('modeltype');
				}else{
					property['type'] = 'string';
				}
				if(elements[i].getAttribute('mapping')!=null){
					property['mapping'] = elements[i].getAttribute('mapping');
				}
				properties[i]=property;
			}
			eforexRecord = Ext.data.Record.create(properties);
		},
		createColModel :function(){
			var property,properties = new Array();
			var elements = gridTitle.dom.elements;
			for(var i=0; i<elements.length; i++){
				property = new Object();
				property['dataIndex'] = elements[i].getAttribute('id');
				if(elements[i].getAttribute('colTitle')!=null){
					property['header'] = elements[i].getAttribute('colTitle');
				}else{
					property['header'] = elements[i].getAttribute('id');
				}
				if(elements[i].getAttribute('header')!=null){
					property['header'] = elements[i].getAttribute('header');
				}
				if(elements[i].getAttribute('colWidth') != null){
					property['width'] = Number(elements[i].getAttribute('colWidth'));
				}else{
					property['width'] = 700;
				}
				if(elements[i].getAttribute('colAlign') =='right'){
					property['align'] = 'right';
				}else{
				}
				if(elements[i].getAttribute('sortable') != null){
					property['sortable'] = true;
				}else{
					property['sortable'] = false;
				}
				if(elements[i].getAttribute('hidden') != null){
					property['hidden'] = true;
				}
				if(elements[i].getAttribute('renderer') != null){
					property['renderer'] = new Function("value","p", "r", "rowIndex", 
					"colIndex", "ds","return "+elements[i].getAttribute('renderer')+
					"(value,p, r, rowIndex, colIndex, ds)");
				}
				properties[i]=property;
			}
			eforexColModel = new Ext.grid.ColumnModel(properties);
		},
		createDateStore : function(){
			dataStore = new Ext.data.Store({
		        proxy: new Ext.data.HttpProxy({url: listURL}),
		        reader: new Ext.data.JsonReader({
		        	   totalProperty: 'total',
		        	   root: 'data'
		           },
		           eforexRecord)
		    }); 
		    
		    printDataStore = new Ext.data.Store({
		        proxy: new Ext.data.HttpProxy({url: listURL}),
		        reader: new Ext.data.JsonReader({
		        	   totalProperty: 'total',
		        	   root: 'data'
		           },
		           eforexRecord)
		    }); 
		},
		
		passwordInit : function() {
	    	
	    	Ext.MessageBox.confirm("密码初始化","您确认要密码初始化吗？",function(con){
	    		if(con == 'yes'){
	    			var form = content.getEl().child("form");
	    			Ext.lib.Ajax.formRequest(form.dom, "/base/passwordInit.action",
                    	{success: eforexGrid.commentSuccessPassword, failure: eforexGrid.commentFailure});
	    		}
	    	});
	    },
	    
		passwordInitFromGrid : function() {
	    	if(selectModel.hasSelection()){
	    		Ext.MessageBox.confirm("密码初始化","您确认要密码初始化吗？",function(con){
		    		if(con == 'yes'){
		    			var params = eforexGrid.createParam();
		    			var cb = {
						 success: eforexGrid.commentSuccessPasswordForBranch ,
						 failure: eforexGrid.commentFailure
						 }
						 var url = "/base/passwordInit.action?"+params;
						 Ext.lib.Ajax.request("POST",url,cb);	
		    		}
		    	});
	    	}else{
	         	Ext.MessageBox.alert('提示','请选中需要初始化密码的记录。');
	         }
	    },
	    
        printContainter:function(){
	    	var formEl = content.getEl().child("form");
        	var params=Ext.lib.Ajax.serializeForm(formEl);// 对表单下所有数据进行序列化，组合成参数对
        	var url='/forex/printTradeInfo.action';
        	popFullWindow(url+"?"+params);      	
		  },
        
		  printContainterWithUrl:function(url){
			  var params = eforexGrid.createParam();
	        	popFullWindow(url + '?print=true&' + params);     
//		    	var headstr = "<html><head><title></title></head><body>";
//		    	var footstr = "</body>";
//		    	var newstr = document.all.item('containerPrintXX').innerHTML;
//		    	var newwin=window.open("","newwin","resizable=yes,Toolbar=no,menubar=no,Location=no");
//		    	var pr = function (){alert(1);newwin.print();};
//		    	newwin.setTimeout(pr,5000);
//		    	newwin.document.body.innerHTML= '';
//		    	newwin.document.write(headstr +newstr+footstr);
//		    	newwin.focus();
			  }, 
		  
		createGrid : function(){
			this.createRecordModel();
			this.createColModel();
			this.createDateStore();	
		   
		    grid = new Ext.grid.Grid('topic-grid', {
		        ds: dataStore,
		        cm: eforexColModel,
		        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
		        enableColLock:false,
		        loadMask: true
    		});	
    		
    		grid.on("rowdblclick",this.getInfo,this);// Grid网格双击事件，弹出 修改页面
    		selectModel = grid.getSelectionModel();
			grid.render();
		},
		loadGridData : function(){
			var gridFoot = grid.getView().getFooterPanel(true);
			if(!Ext.get('NoPage')){
				paging = new Ext.PagingToolbar(gridFoot, dataStore, {
			        pageSize: PAGESIZE,
			        displayInfo: true,
			        displayMsg: '记录数 {0} - {1} 总共 {2}',
			        emptyMsg: "没有记录"
			    });
			}
		    var param =eforexGrid.queryParam(); 
		    dataStore.load({params:param});
		},
		createHeadToolBar : function(){// 最上层Toolbar，公用，新增，修改，删除，详细，条件查询
			var gridHead = grid.getView().getHeaderPanel(true);
			// var tbHead = new Ext.Toolbar(gridHead);
			
			var toolbarCount=21;
			if(gridMenuForm.dom.getAttribute("toolbarCount")){// 手设Toolbar
																// 每行存放多少数据，默认21个
			 toolbarCount = Number(10);//gridMenuForm.dom.getAttribute("toolbarCount")
			}
			var tbHead = new Ext.Toolbar(gridHead,
			                null,
							{
							nextBlock : function(){
								if (this.items.getCount()>=toolbarCount && this.items.getCount()%toolbarCount==0 ){
									var table = document.createElement("table");// 主体结构div-->Table-->tbody--->tr..td
									var div=this.el.child("div", true)
									div.appendChild(table);
									var tb = document.createElement("tbody");
									table.appendChild(tb);
									var tr = document.createElement("tr");
									tb.appendChild(tr);
                                    this.tr=tr;
								}
								  var td = document.createElement("td");
								  this.tr.appendChild(td);
								  return td;
					          }
							}
					   );
			var elements = gridMenuForm.dom.elements;
			
			if(Ext.get("queryDiv")){// 查询条件Div层，处理所有的条件输入
			     //  tbHead.addSeparator();
			     	tbHead.toolbarCount=10;
			       var a= Ext.get("queryDiv").dom.innerHTML;	 	
                   var b=a.split(';');
                   eforexGrid.createQueryText(tbHead,b);	 	
			}
			
			if(Ext.get("getQueryBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '查询',
					handler : this.getQueryInfo
				});
			}
			
			if(Ext.get("resetInfoBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '重置状态',
					handler : this.resetInfo
				});
				}
			if(Ext.get("accountCheckBtn")){ // 条件查询按钮
			tbHead.addSeparator();
			tbHead.addButton({
				text : '对账',
				handler : this.accountCheckInfo
			});
			}
			if(Ext.get("accountCheckAgainBtn")){ // 条件查询按钮
			tbHead.addSeparator();
			tbHead.addButton({
				text : '重新对账',
				handler : this.accountCheckInfoAgain
			});
			}
			if(Ext.get("accountTranInfoBtn")){ // 预览
			tbHead.addSeparator();
			tbHead.addButton({
				text : '明细',
				handler : this.accountTranInfo
			});
			}
			if(Ext.get("accountTranInfoBtn2")){ 
			tbHead.addSeparator();
			tbHead.addButton({
				text : '账务文本生成',
				handler : this.accountTranInfo2
			});
			}
			if(Ext.get("accountTranInfoBtn3")){ 
			tbHead.addSeparator();
			tbHead.addButton({
				text : '账务分录批量生成',
				handler : this.accountTranInfo3
			});
			}
			
			if(Ext.get("inTradeCheckBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '复核',
					handler : this.getInTradeCheckInfo
				});
			}
			
			if(Ext.get("breachBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '违约',
					handler :  function(){
					//eforexGrid.getBreachInfo(0);
						if(selectModel.hasSelection()){ 
						var worker1=selectModel.getSelected().get('worker1');
						var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='breach';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getBreachInfo(0);
									}
			 		}else{
			 			Ext.MessageBox.alert('提示','请选中要进行违约的记录。');
					 	}
					}
				});
			}
			if(Ext.get("fbreachBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '强制违约',
					handler :  function(){
					//eforexGrid.getBreachInfo(1);
						if(selectModel.hasSelection()){ 
						var worker1=selectModel.getSelected().get('worker1');
						var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='breach';
				 					eforexGrid.checkExamineMessage(1,flag);
							}else{
				  				eforexGrid.getBreachInfo(1);
									}
			 		}else{
			 			Ext.MessageBox.alert('提示','请选中要进行强制违约的记录。');
					 	}
					}
				});
			}
			if(Ext.get("allBreachBtn")){ // 条件查询按钮
				if(Ext.get('allBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('allBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : '全部违约',
					handler : function(){
					//eforexGrid.getAllBreachInfo(0);
						if(selectModel.hasSelection()){ 
						var worker1=selectModel.getSelected().get('worker1');
						var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='allBreach';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getAllBreachInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行全部违约的记录。');
					 	}
					}
				});
				}
			}
			if(Ext.get("fallBreachBtn")){ // 条件查询按钮
				if(Ext.get('fallBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('fallBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : '强制全部违约',
					handler : function(){
					//eforexGrid.getAllBreachInfo(1);
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='allBreach';
				 					eforexGrid.checkExamineMessage(1,flag);
							}else{
				  				eforexGrid.getAllBreachInfo(1);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行强制全部违约的记录。');
					 	}
					
					}
				});
				}
			}
			if(Ext.get("durationBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '展期',
					handler :function(){
					//eforexGrid.getDurationInfo();
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='duration';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getDurationInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行展期的记录。');
					 	}
					}
				});
			}
			
			if(Ext.get("farDurationBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '远端展期',
					handler : function(){
					//eforexGrid.getFarDurationInfo();
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='farduration';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getFarDurationInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行远端展期的记录。');
					 	}
					
					}
				});
			}
			
			if(Ext.get("eraseBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '冲正',
					handler :function(){eforexGrid.checkIfSpot();}
				});
			}
			
			if(Ext.get("tnEraseBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'T+N交易冲正',
					handler : this.getTNEraseInfo
				});
			}
			
			if(Ext.get("deptEraseBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '内部交易冲正',
					handler : this.getDeptEraseInfo
				});
			}
			
			if(Ext.get("delveryedEraseBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '交割后冲正',
					handler : this.getDeliveryedEraseInfo
				});
			}
			
			if(Ext.get("deptDelveryedEraseBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '内部交易交割后冲正',
					handler : this.getDeptDeliveryedEraseInfo
				});
			}
			
			if(Ext.get("rmbDeptPropertiesBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '内部交易附属属性变更',
					handler : this.getRmbDeptPropertiesInfo
				});
			}
			
			if(Ext.get("resendIsBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '补发国结',
					handler : this.getResendIsInfo
				});
			}
			
			if(Ext.get("reverseIsBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '反向平盘',
					handler : this.getReverseIsInfo
				});
			}
			
			if(Ext.get("doGapBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '差额平盘',
					handler : this.getGapInfo
				});
			}
			if(Ext.get("eBreachBtn")){ // 条件查询按钮
				if(Ext.get('eBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('breachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : '提前违约',
					handler : function(){
					//eforexGrid.getEarlyBreachInfo(0);
					if(selectModel.hasSelection()){ 
						var worker1=selectModel.getSelected().get('worker1');
						var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='earlyBreach';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getEarlyBreachInfo(0);
									}
			 		}else{
			 			Ext.MessageBox.alert('提示','请选中要进行提前违约的记录。');
					 	}
					}
				});
				}
			}
			if(Ext.get("feBreachBtn")){ // 条件查询按钮
				if(Ext.get('feBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('feBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : '强制提前违约',
					handler : function(){
					//eforexGrid.getEarlyBreachInfo(1);
						if(selectModel.hasSelection()){ 
						var worker1=selectModel.getSelected().get('worker1');
						var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='earlyBreach';
				 					eforexGrid.checkExamineMessage(1,flag);
							}else{
				  				eforexGrid.getEarlyBreachInfo(1);
									}
			 		}else{
			 			Ext.MessageBox.alert('提示','请选中要进行强制提前违约的记录。');
					 	}
					}
				});
				}
			}
			if(Ext.get("eDeliBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '提前交割',
					handler :function(){
					//eforexGrid.getEdeliveryInfo();
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='earlyDelivery';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getEdeliveryInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行提前交割的记录。');
					 	}
					} 
				});
			}
			if(Ext.get("eDeliSwapBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '提前交割',
					handler : function(){
					//eforexGrid.getSwapEdeliveryInfo();
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='earlyswapDelivery';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getSwapEdeliveryInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行提前交割的记录。');
					 	}
					} 
				});
			}
			if(Ext.get("deliveryCancelBtn")){
				if(Ext.get('deliveryCancelBtn').dom.getAttribute('ignore') && 'true'==Ext.get('deliveryCancelBtn').dom.getAttribute('ignore')){
				} else {
					tbHead.addSeparator();
					tbHead.addButton({
						text : '交割撤销',
						handler : function(){
						//eforexGrid.cancelDeliveryCheckIfChoose();
							if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='deliveryCancel';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.cancelDeliveryCheckIfChoose(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行交割撤销的记录。');
					 	}
						}
					});
				}
			}
			if(Ext.get("doTradeAuthBtn")){//交易申请审核
				if(Ext.get('doTradeAuthBtn').dom.getAttribute('ignore') && 'true'==Ext.get('doTradeAuthBtn').dom.getAttribute('ignore')){
				} else {
					tbHead.addSeparator();
					tbHead.addButton({
						text : '审核',
						handler : this.getTradeAuthInfo
					});
				}
			}
			if(Ext.get("insertBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '新增',
					handler : this.insert
// cls : 'x-btn-text-icon bmenu'
					// icon:'../images/default/dd/drop-yes.gif'
				});
			}
			if(Ext.get("importMtmBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '导入估值',
					handler : this.importMtm
				});
			}
			if(Ext.get("updateBtn")){// lableName="交易冲正"
										// doFunc="函数调用()",doCallBackFunc="",
										// 第一个参数控制toolbar显示，第二个则接管 双击事件和
										// 修改预处理事件,第三个 回调函数
				tbHead.addSeparator();
				var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.getInfo
				});
			}
			if(Ext.get("synchronizeBtn")){// lableName=""
										// doFunc="函数调用()",doCallBackFunc="",
										// 第一个参数控制toolbar显示，第二个则接管 双击事件和
										// 修改预处理事件,第三个 回调函数
				tbHead.addSeparator();
				var lableName=Ext.get('synchronizeBtn').dom.getAttribute('lableName')==undefined?'同步':Ext.get('updateBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.synchronizeKondor
				});
			}
			if(Ext.get("printOptionBtn")){ 
				tbHead.addSeparator();
				var lableName=Ext.get('printOptionBtn').dom.getAttribute('lableName')==undefined?'期权行权交易打印':Ext.get('printOptionBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.getOptionBtnInfo
				});
			}
			if(Ext.get("printOut")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '打印',
					handler : this.getPrintOutInfo
				});
			}
			if(Ext.get("deliveryBtn")){ // 条件查询按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : '交割',
					handler : function(){
					//eforexGrid.getDeliveryInfo();
						if(selectModel.hasSelection()){ 
							var worker1=selectModel.getSelected().get('worker1');
							var tranType=selectModel.getSelected().get('tranType');
							if(tranType=='1' && worker1=='VirtualUser'){
								 var flag='delivery';
				 					eforexGrid.checkExamineMessage(0,flag);
							}else{
				  				eforexGrid.getDeliveryInfo(0);
									}
			 			}else{
			 				Ext.MessageBox.alert('提示','请选中要进行交割的记录。');
					 	}
					}
				});
			}
			
			if(Ext.get("deleteBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '删除',
					handler : this.deleteInfo
				});
			}
			if(Ext.get("resendBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '补发',
					handler : this.resendInfo
				});
			}
			if(Ext.get("rebatchBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '清算当天未清算交易',
					handler : this.rebatchInfo
				});
			}
			
			if(Ext.get("deleteClientBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '删除',
					handler : this.deleteClientInfo
				});
			}
			
			if(Ext.get("delPlBtn")){// 批量删除
				tbHead.addSeparator();
				tbHead.addButton({
					text : '批量删除',
					handler : this.delPlInfo
				});
			}
			if(Ext.get("dealUpdateBtn")){ // 修改交易信息（关联信息）
				tbHead.addSeparator();
				var lableName=Ext.get('dealUpdateBtn').dom.getAttribute('lableName');
				lableName=(lableName==undefined?'修改':lableName);
				tbHead.addButton({
					text : lableName,
					handler : this.getDealInfo
				});
			}
			if(Ext.get("otherTradeBtn")){ // 特殊交易关联查询原交易
				tbHead.addSeparator();
				var lableName=Ext.get('otherTradeBtn').dom.getAttribute('lableName');
				lableName=(lableName==undefined?'关联交易':lableName);
				tbHead.addButton({
					text : lableName,
					handler : this.getOtherTrade
				});
			}
			
						
			if(Ext.get("printBtn")){ // 打印按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel导出当前页',
					handler : this.printGirdInfo
				});
			}
			if(Ext.get("printAllBtn")){ // 打印按钮[要隐藏的列只能放在最后，否则会出现错位]（因为取titile时是根据要显示的个数，从前到后数的）
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel导出所有',
					handler : this.printAllGirdInfo
				});
			}
			if(Ext.get("printAllBackBtn")){ // 打印按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel导出所有',
					handler : this.printAllGirdBackInfo
				});
			}
			if(Ext.get("excelBtn")){ // excel导出按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel导出',
					handler : this.printGirdInfo
				});
			}
			if(Ext.get("exportRightBtn")){ // excel权限导出按钮
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel导出',
					handler : this.exportRightsById
				});
			}
			
			if(Ext.get("dspBankGraph")){ // 显示机构层级关系图
				tbHead.addSeparator();
				tbHead.addButton({
					text : '层级关系图',
					handler : this.displayBankGraph
				});
			}
	
			//tbHead.addSeparator();
			},
			getPrintOutInfo:function(){// 通过拦截使用的处理函数进行自由控制
	        	if(selectModel.hasSelection()){
	        		var serialno = selectModel.getSelected().get('receiptNo');
	        		var url = Ext.get('printOut').dom.getAttribute('action')+"?actCustReceipt.receiptNo="+serialno;
	        	    eforexGrid.myPrint(url);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行打印的记录。');
		         }
        },
        getOtherTrade:function(){
        	if(selectModel.hasSelection()){ 
				var headType=selectModel.getSelected().get('headType');
				var headNo=selectModel.getSelected().get('headNo');
				var url = '/query/queryRelationTradeCondition.action?subAction=init&sqlParam.headNo='+headNo+'&sqlParam.headType='+headType;
				popWindow(url,1000,400);
			 }else{
			 	Ext.MessageBox.alert('提示','请选中特殊交易记录。');
			 }
			
        },
        myPrint :function (url){//urlName,WWidth,WHeight
        	popWindownew(url,780,680);
        },
			checkGetDealInfoAuth : function(value){//交易修改检查是否需要发起交易申请
				if(Ext.get('forwardTrade.customerId')){
					if(Ext.get('forwardTrade.customerId').dom.value==''){
						Ext.MessageBox.alert('提示','客户号不能为空');
						return;
						}
					//if(Ext.get('forwardTrade.account1').dom.value==''||Ext.get('forwardTrade.account2').dom.value==''){
						//Ext.MessageBox.alert('提示','账号不能为空');
						//return;
						//}
				}else if(Ext.get('swapTrade.customerId')){
					if(Ext.get('swapTrade.customerId').dom.value==''){
						Ext.MessageBox.alert('提示','客户号不能为空');
						return;
						}
					//if(Ext.get('swapTrade.account1').dom.value==''
					//||Ext.get('swapTrade.account2').dom.value==''
					//||Ext.get('swapTrade.nearAccount1').dom.value==''
					//||Ext.get('swapTrade.nearAccount2').dom.value==''){
						//Ext.MessageBox.alert('提示','账号不能为空');
						//return;
						//}
				}
				eforexGrid.myUpdateInfo(value);
				//var enable;
				//if(Ext.get('forwardTrade.enabled'))enable=Ext.get('forwardTrade.enabled').dom.checked;
				//if(Ext.get('swapTrade.enabled'))enable=Ext.get('swapTrade.enabled').dom.checked;
				//if(enable==true){
					//eforexGrid.checkExamineMessage(value,'getDealInfo');
				//}else{
					//eforexGrid.myUpdateInfo(value);
				//}
			},
			initTagFunc : function(btnName){
				if(Ext.get(btnName).dom.getAttribute('initFunc')!=null){
	        		gridMenuForm.dom.setAttribute("mainNeedCallback",
	        				Ext.get(btnName).dom.getAttribute('initFunc'));
           		}
			},
			cancelDeliveryCheckIfChoose: function(){
			if(selectModel.hasSelection()){ 
				var type=selectModel.getSelected().get('sourceType');
				if(type=='6'){
				 var flag='deliveryCancel';
				 eforexGrid.checkExamineMessage(0,flag);
				}else{
				  eforexGrid.getCancelDeliveryInfo();
				}
			 }else{
			 	Ext.MessageBox.alert('提示','请选中要进行交割撤销的记录。');
			 }
			
			},
			getCancelDeliveryInfo:function(){// 通过拦截使用的处理函数进行自由控制
	        	if(Ext.get('deliveryCancelBtn').dom.getAttribute('doFunc')!=null){
	        		eval(Ext.get('deliveryCancelBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
		        } else{
		        	if(selectModel.hasSelection()){  
		        		if(!infoDlg){
				        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
				                    modal:true,
				                    width:280,
				                    height:450,
				                    shadow:true,
				                    proxyDrag: true,
				                    center: {	              
				                    	animate: true,
				                        autoScroll:true
				                    }
				            });
				            
				            var action = Ext.get('deliveryCancelBtn').dom.getAttribute('action');
				            btn = infoDlg.addButton('确定');
				            cbtn = infoDlg.addButton('取消');
				            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }else{
			        	 infoDlg.setContentSize(280,450);
			       	 	}
			            btn.setHandler(eforexGrid.doCancelDelivery, infoDlg);
			            
			            cbtn.setHandler(infoDlg.hide, infoDlg);
			            btn.enable();
			            cbtn.enable();
			            var lableName=Ext.get('deliveryCancelBtn').dom.getAttribute('lableName')==undefined?'交割撤销':Ext.get('deliveryCancelBtn').dom.getAttribute('lableName');
			            infoDlg.setTitle( lableName );
			            var layout = infoDlg.getLayout();
			            layout.beginUpdate();
			            layout.add('center',content);
			            var params = eforexGrid.createParam();
			            var update = content.getUpdateManager();
			           	var tempFunc = function(e,b,o){
			           		eforexGrid.initTagFunc('deliveryCancelBtn');
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
			           	};
						update.update(Ext.get('deliveryCancelBtn').dom.getAttribute('url'),params, tempFunc);
						// 控制diaglog对话框实际大小
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
			           	layout.endUpdate();
			            infoDlg.show();
			            if(myInfoDlg)myInfoDlg.setTitle(lableName);
			         }else{
			         	Ext.MessageBox.alert('提示','请选中要进行交割撤销的记录。');
			         }
		        }
	        },
	    getDealInfo : function(){// 通过拦截使用的处理函数进行自由控制
	    if(btn)btn.show();
	    var isSell;
	    var itemId;
			if(Ext.get('dealUpdateBtn')==null){
				Ext.MessageBox.alert('提示','记录集不允许直接修改');
				return;
			}
			if(Ext.get('dealUpdateBtn').dom.getAttribute('doFunc')!=null){
				eval(Ext.get('dealUpdateBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
			} else{
				if(selectModel.hasSelection()){ 
				 isSell=selectModel.getSelected().get('rmbBuyName');
				 itemId=selectModel.getSelected().get('itemId');
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
								modal:true,
								width:860,
								height:500,
								shadow:true,
								proxyDrag: true,
								center: {	              
									animate: true,
									autoScroll:true
								}
						});
						var action = Ext.get('dealUpdateBtn').dom.getAttribute('action');
						btn = infoDlg.addButton('确定');
						infoDlg.addButton('取消', eforexGrid.myCloseDlg, infoDlg);
						content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
					}else{
			        	 infoDlg.setContentSize(860,500);
			        }	
			        	if(!otherbtn){ 
		      				if(itemId!=3)otherbtn=infoDlg.addButton('关联交易', eforexGrid.relDetailsDlg,infoDlg);
		      				}
			        	if(relationBtn)relationBtn.hide();
			        	 if(btn)btn.show();
			        	 if(otherbtn)otherbtn.show();
			        	 if(!btn)btn = infoDlg.addButton('确定');
					  var initBzj = function(e,b,o){
		            	if(specialTradeContext){
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
			            		if(res){
			            			if('error' == res){
			            				return;
			            			}
			            		}
		            		specialTradeContext.bzjInit();
		            		}
		            		var isBuy;
		            		if(isSell=='结汇'){
		            			isBuy='false';
		            		}else if(isSell=='售汇'){
		            			isBuy='true';
		            		}else if(isSell=='S/B'){
		            			isBuy='false';
		            		}else if(isSell=='B/S'){
		            			isBuy='true';
		            		}
		            		eforexGrid.tradeProCodeInfo(isBuy);
		            	};
				     btn.setHandler(function(){eforexGrid.checkGetDealInfoAuth(isSell)}, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('dealUpdateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('dealUpdateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
					var layout = infoDlg.getLayout();
					layout.beginUpdate();
					layout.add('center',content);
					var params = eforexGrid.createParam();
					var update = content.getUpdateManager();
		           	
					update.update(Ext.get('dealUpdateBtn').dom.getAttribute('url'),params,initBzj);
					layout.endUpdate();
					infoDlg.show();
				 }else{
					Ext.MessageBox.alert('提示','请选中要修改的记录。');
				 }
			}
		},
		checkEnableValue:function(value){
		var flag;
		var customerId;
		if(Ext.get('forwardTrade.enabled')){
			flag=Ext.get('forwardTrade.enabled').dom.checked;
			customerId=Ext.get('forwardTrade.customerId').dom.value;
		}
		if(Ext.get('swapTrade.enabled')){
			flag=Ext.get('swapTrade.enabled').dom.checked;
			customerId=Ext.get('swapTrade.customerId').dom.value;
		}
			if(flag==true){
				 document.getElementById("viewInstrument").style.display="none";
				 document.getElementById("updateInstrument").style.display="block";
				 document.getElementById("viewCustomerId").style.display="none";
				 document.getElementById("updateCustomerId").style.display="block";
				 document.getElementById("viewAccount1").style.display="none";
				 document.getElementById("viewAccount2").style.display="none";
				
				 document.getElementById("updateAccount1").style.display="block";
				 document.getElementById("updateAccount2").style.display="block";
				 document.getElementById("enabledCheckBox").style.display="none";
				 //var templistLength=Number(tradeContext.tempAccTagList.length);
				 //var fwdcustomerId=Ext.get('forwardTrade.customerId').dom.value;
				//if(customerId!='')specialTradeContext.initCustomerDarkSearch(customerId);
				 //var aaa=document.getElementsById("updateAccount1");
				 //alert(aaa.length);
				 //if(Ext.get('forwardTrade.enabled'))Ext.get('forwardTrade.enabled').dom.style.enable ="false";
				 //if(Ext.get('swapTrade.enabled'))Ext.get('swapTrade.enabled').dom.style.enable="false";
				 eforexGrid.checkExamineMessage(0,'getDealInfo');
			}else if(flag==false){
			 	 //document.getElementById("viewCustomerId").style.display="block";
				 //document.getElementById("updateCustomerId").style.display="none";
				 //document.getElementById("viewInstrument").style.display="block";
				//document.getElementById("updateInstrument").style.display="none";
				 //document.getElementById("viewAccount1").style.display="block";
				 //document.getElementById("viewAccount2").style.display="block";
				 //document.getElementById("updateAccount1").style.display="none";
				 //document.getElementById("updateAccount2").style.display="none";
			
			}
		},
		checkBreachEnableValue:function(value){
		var falg;
		if(Ext.get('custDelivery.enabled')){
			falg=Ext.get('custDelivery.enabled').dom.checked;
		}
		if(falg==true){
			Ext.get('custDelivery.ifFource').dom.value=1;
		}else{
			Ext.get('custDelivery.ifFource').dom.value=0;
		}
		},
		isBankCardClick:function(){
			var bankCardCheck = Ext.get("ifBankCard").dom.checked; 
			if(Ext.get("ifBankCardNear"))var bankCardCheckNear = Ext.get("ifBankCardNear").dom.checked; 
			var tradeSubProCode='';
			var tradeSubProCodeNear='';
			var firstStr;
			var firstStrNear;
			if(Ext.get("forwardTrade.property9"))tradeSubProCode=Ext.get("tradeSubProCode").dom.value;  
			if(Ext.get("swapTrade.property9")){
				if(Ext.get("swapTrade.tradeSubProCode"))tradeSubProCode=Ext.get("tradeSubProCode").dom.value;  
				if(Ext.get("swapTrade.tradeSubProCodeNear"))tradeSubProCodeNear=Ext.get("tradeSubProCodeNear").dom.value;  
			}
			if(tradeSubProCode!='')firstStr=tradeSubProCode.substring(0,1);
			if(tradeSubProCodeNear!='')firstStrNear=tradeSubProCodeNear.substring(0,1);
			//if(Ext.get("trade.type").dom.value == 4 || Ext.get("trade.type").dom.value == 5){
				//var bankCardCheckNear = Ext.get("ifBankCardNear").dom.checked;   
					//if(bankCardCheckNear){
						//Ext.get("trade.property10").dom.value = 'Y';
					//}else{
						//Ext.get("trade.property10").dom.value = 'N';
					//}
				//}
			if(bankCardCheck){
				if(Ext.get("forwardTrade.property9"))Ext.get("forwardTrade.property9").dom.value = 'Y';
				if(Ext.get("swapTrade.property9")){
					if(firstStr=='1' || firstStr=='2')Ext.get("swapTrade.property9").dom.value = 'Y';
					if(firstStr=='3' || firstStr=='4')Ext.get("swapTrade.property10").dom.value = 'Y';
				}
			}else{
				if(Ext.get("forwardTrade.property9"))Ext.get("forwardTrade.property9").dom.value = 'N';
				if(Ext.get("swapTrade.property9")){
					if(firstStr=='1' || firstStr=='2')Ext.get("swapTrade.property9").dom.value = 'N';
					if(firstStr=='3' || firstStr=='4')Ext.get("swapTrade.property10").dom.value = 'N';
				}
			}
		if(Ext.get("ifBankCardNear")){
			if(bankCardCheckNear){
					if(firstStrNear=='1' || firstStrNear=='2')Ext.get("swapTrade.property9").dom.value = 'Y';
					if(firstStrNear=='3' || firstStrNear=='4')Ext.get("swapTrade.property10").dom.value = 'Y';
			}else{
					if(firstStrNear=='1' || firstStrNear=='2')Ext.get("swapTrade.property9").dom.value = 'N';
					if(firstStrNear=='3' || firstStrNear=='4')Ext.get("swapTrade.property10").dom.value = 'N';
			}
		}
		},  
		tradeProCodeInfo:function(isBuy){
	       if(Ext.get('forwardTrade.tradeProCode')){
				var tradeData1=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeData2=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeSubData1=[
                  ["110","110-货物贸易"],
				  ["121","121-服务贸易-运输"],
				  ["122","122-服务贸易-旅游"],
				  ["123","123-服务贸易-金融和保险服务"],
				  ["124","124-服务贸易-专有权利使用费和特许费"],
				  ["125","125-服务贸易-咨询服务"],
				  ["126","126-服务贸易-其他服务"],
				  ["130","130-服务贸易-收益和经常转移"],
				  ["131","131-收益和经常转移-职工报酬和赡家款"],
				  ["132","132-收益和经常转移--投资收益"],
				  ["133","133-收益和经常转移--其他经常转移"]
                 ];
                 var tradeSubData2=[
                  ["210","210-资本账户"],
				  ["220","220-直接投资"],
				  ["221","221-直接投资-其中：投资资本金"],
				  ["222","222-直接投资-直接投资撤资"],
				  ["223","223-直接投资-房地产"],
				  ["231","231-证券投资-对境外证券投资撤回"],
				  ["232","232-证券投资-证券筹资"],
				  ["240","240-其他投资"],
				  ["241","241-其他投资-其中：跨境贷款"],
				  ["242","242-其他投资-外债转贷款"],
				  ["250","250-国内外汇贷款"],
				  ["260","260-金融机构资金本外币转换"],
				  ["261","261-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["262","262-金融机构资金本外币转换-代债务人结汇"],
				  ["270","270-其他"]
                 ];
                 var tradeSubData3=[
                  ["310","310-货物贸易"],
				  ["321","321-服务贸易-运输"],
				  ["322","322-服务贸易-旅游"],
				  ["323","323-服务贸易-金融和保险服务"],
				  ["324","324-服务贸易-专有权利使用费和特许费"],
				  ["325","325-服务贸易-咨询服务"],
				  ["326","326-服务贸易-其他服务"],
				  ["331","331-收益和经常转移-职工报酬和赡家款"],
				  ["332","332-收益和经常转移-投资收益"],
				  ["333","333-收益和经常转移-其他经常转移"]
                 ];
                 var tradeSubData4=[
                  ["410","410-资本账户"],
				  ["420","420-直接投资"],
				  ["421","421-直接投资-其中：投资资本金"],
				  ["422","422-直接投资-直接投资撤资"],
				  ["423","423-直接投资-房地产"],
				  ["431","431-证券筹资-对境外证券投资撤回"],
				  ["432","432-证券筹资-证券筹资"],
				  ["440","440-其他投资"],
				  ["441","441-其他投资-其中：跨境贷款"],
				  ["442","442-其他投资-外债转贷款"],
				  ["450","450-其他投资-国内外汇贷款"],
				  ["460","460-金融机构资金本外币转换"],
				  ["461","461-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["462","462-金融机构资金本外币转换-代债务人结汇"],
				  ["470","470-其他"]
                 ];
                 var tradeCustType=[
                  ["01","01-银行自身"],
				  ["02","02-金融机构"],
				  ["03","03-中资机构"],
				  ["04","04-外资机构"],
				  ["05","05-居民个人"],
				  ["06","06-非居民个人"],
				  ['99',"99-TC"]
				];
				var fwdtradeProCode;
	            var fwdtradeProCodeName;
	            var fwdtradeProSubCode;
	            var fwdtradeProSubCodeName;
                var fwdproperty1=Ext.get('forwardTrade.property1').dom.value;
	            var fwdproperty6=Ext.get('forwardTrade.property6').dom.value;
	            var fwdtradeProSubCode=(isBuy=="false"?fwdproperty1:fwdproperty6);
	            var firstNum=fwdtradeProSubCode.substring(0,1);
	           
	            if(firstNum=='1'){
	            fwdtradeProSubCodeName=formatDataName(tradeSubData1,fwdtradeProSubCode);
	            fwdtradeProCodeName=formatDataName(tradeData1,'100');
	            fwdtradeProCode='100';
	            }else if(firstNum=='2'){
	            fwdtradeProSubCodeName=formatDataName(tradeSubData2,fwdtradeProSubCode);
	            fwdtradeProCodeName=formatDataName(tradeData1,'200');
	            fwdtradeProCode='200';
	            }else if(firstNum=='3'){
	            fwdtradeProSubCodeName=formatDataName(tradeSubData3,fwdtradeProSubCode);
	            fwdtradeProCodeName=formatDataName(tradeData2,'300');
	            fwdtradeProCode='300';
	            }else if(firstNum=='4'){
	            fwdtradeProSubCodeName=formatDataName(tradeSubData4,fwdtradeProSubCode);
	            fwdtradeProCodeName=formatDataName(tradeData2,'400');
	            fwdtradeProCode='400';
	            }
	            var codeValue = Number(fwdtradeProSubCode);
    			if(parseInt(codeValue/10) == 12 || parseInt(codeValue/10) == 32){
    				Ext.get('bankcardDiv').dom.style.display = "block";
    				if(Ext.get('forwardTrade.property9'))var property9=Ext.get('forwardTrade.property9').dom.value;
    				if(property9=='Y')Ext.get("ifBankCard").dom.checked = true;
    			}
				var store1 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : (firstNum=='1'||firstNum=='2')?tradeData1:tradeData2 // 数据填充下拉框
	                  });
		        var tradeProCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.tradeProCode",
		             store: store1 ,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"forwardTrade.tradeProCode",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:fwdtradeProCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		             tradeProCodeBox.applyTo("forwardTrade.tradeProCode");
		        var store2 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : firstNum=='1'?tradeSubData1:(firstNum=='2'?tradeSubData2:(firstNum=='3'?tradeSubData3:tradeSubData4)) // 数据填充下拉框
	                  });
		        var tradeProSubCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.tradeSubProCode",
		             store: store2,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"forwardTrade.tradeSubProCode",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:fwdtradeProSubCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		        var store3 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : tradeCustType // 数据填充下拉框
	                  });
		        tradeCustTypeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.forCusType",
		             store: store3,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"forwardTrade.forCusType",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'01',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true,
				     disabled:false
		             });
		             tradeProCodeBox.applyTo("forwardTrade.tradeProCode");
		             tradeProSubCodeBox.applyTo("forwardTrade.tradeSubProCode");
		             //tradeCustTypeBox.applyTo("forwardTrade.forCusType");
		             tradeProCodeBox.on("select",function(){
		             	$("tradeSubProCode").value="";
		             	if(tradeProCodeBox.getValue()==100){
		             		store2.loadData(tradeSubData1,[]);
		             		tradeProSubCodeBox.setValue("110");
		             		$("tradeSubProCode").value=110;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("forwardTrade.property9").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==200){
		             		store2.loadData(tradeSubData2,[]);
		             		tradeProSubCodeBox.setValue("210");
		             		$("tradeSubProCode").value=210;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("forwardTrade.property9").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==300){
		             		store2.loadData(tradeSubData3,[]);
		             		tradeProSubCodeBox.setValue("310");
		             		$("tradeSubProCode").value=310;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("forwardTrade.property9").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==400){
		             		store2.loadData(tradeSubData4,[]);
		             		tradeProSubCodeBox.setValue("410");
		             		$("tradeSubProCode").value=410;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("forwardTrade.property9").dom.value = '';
		             	}
		             },tradeProCodeBox);
		             tradeProSubCodeBox.on("select",function(){
		            	 $("tradeSubProCode").value=tradeProSubCodeBox.getValue();
		            	 var codeValue = Number($("tradeSubProCode").value);
    					if(parseInt(codeValue/10) == 12 || parseInt(codeValue/10) == 32){
    						Ext.get('bankcardDiv').dom.style.display = "block";
    					} else {
    						Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("forwardTrade.property9").dom.value = '';
    						}
		             	$("forwardTrade.tradeSubProCode").value=tradeProSubCodeBox.getValue();
		             },tradeProSubCodeBox);
		             $("tradeSubProCode").value=fwdtradeProSubCode;
			}
		 if(Ext.get('swapTrade.tradeProCode')){
				var tradeData1=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeData2=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeSubData1=[
                  ["110","110-货物贸易"],
				  ["121","121-服务贸易-运输"],
				  ["122","122-服务贸易-旅游"],
				  ["123","123-服务贸易-金融和保险服务"],
				  ["124","124-服务贸易-专有权利使用费和特许费"],
				  ["125","125-服务贸易-咨询服务"],
				  ["126","126-服务贸易-其他服务"],
				  ["130","130-服务贸易-收益和经常转移"],
				  ["131","131-收益和经常转移-职工报酬和赡家款"],
				  ["132","132-收益和经常转移--投资收益"],
				  ["133","133-收益和经常转移--其他经常转移"]
                 ];
                 var tradeSubData2=[
                  ["210","210-资本账户"],
				  ["220","220-直接投资"],
				  ["221","221-直接投资-其中：投资资本金"],
				  ["222","222-直接投资-直接投资撤资"],
				  ["223","223-直接投资-房地产"],
				  ["231","231-证券投资-对境外证券投资撤回"],
				  ["232","232-证券投资-证券筹资"],
				  ["240","240-其他投资"],
				  ["241","241-其他投资-其中：跨境贷款"],
				  ["242","242-其他投资-外债转贷款"],
				  ["250","250-国内外汇贷款"],
				  ["260","260-金融机构资金本外币转换"],
				  ["261","261-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["262","262-金融机构资金本外币转换-代债务人结汇"],
				  ["270","270-其他"]
                 ];
                 var tradeSubData3=[
                  ["310","310-货物贸易"],
				  ["321","321-服务贸易-运输"],
				  ["322","322-服务贸易-旅游"],
				  ["323","323-服务贸易-金融和保险服务"],
				  ["324","324-服务贸易-专有权利使用费和特许费"],
				  ["325","325-服务贸易-咨询服务"],
				  ["326","326-服务贸易-其他服务"],
				  ["331","331-收益和经常转移-职工报酬和赡家款"],
				  ["332","332-收益和经常转移-投资收益"],
				  ["333","333-收益和经常转移-其他经常转移"]
                 ];
                 var tradeSubData4=[
                  ["410","410-资本账户"],
				  ["420","420-直接投资"],
				  ["421","421-直接投资-其中：投资资本金"],
				  ["422","422-直接投资-直接投资撤资"],
				  ["423","423-直接投资-房地产"],
				  ["431","431-证券筹资-对境外证券投资撤回"],
				  ["432","432-证券筹资-证券筹资"],
				  ["440","440-其他投资"],
				  ["441","441-其他投资-其中：跨境贷款"],
				  ["442","442-其他投资-外债转贷款"],
				  ["450","450-其他投资-国内外汇贷款"],
				  ["460","460-金融机构资金本外币转换"],
				  ["461","461-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["462","462-金融机构资金本外币转换-代债务人结汇"],
				  ["470","470-其他"]
                 ];
                 var tradeCustType=[
                  ["01","01-银行自身"],
				  ["02","02-金融机构"],
				  ["03","03-中资机构"],
				  ["04","04-外资机构"],
				  ["05","05-居民个人"],
				  ["06","06-非居民个人"],
				  ['99',"99-TC"]
				];
                 var swaptradeProCode;
                 var swapNeartradeProCode;
	            var swaptradeProSubCode;
	            var swapNeartradeProSubCode;
	            var firstNum;
	            var NearfirstNum;
                var swapproperty1=Ext.get('swapTrade.property1').dom.value;
	            var swapproperty6=Ext.get('swapTrade.property6').dom.value;
	           	swaptradeProSubCode=(isBuy=="true"?swapproperty6:swapproperty1);
	            firstNum =swaptradeProSubCode.substring(0,1);
	           	swapNeartradeProSubCode=(isBuy=="true"?swapproperty1:swapproperty6);
	            NearfirstNum =swapNeartradeProSubCode.substring(0,1);
	           
	            if(firstNum=='1'){
	            swaptradeProSubCodeName=formatDataName(tradeSubData1,swaptradeProSubCode);
	            swaptradeProCodeName=formatDataName(tradeData1,'100');
	            swaptradeProCode='100';
	            }else if(firstNum=='2'){
	            swaptradeProSubCodeName=formatDataName(tradeSubData2,swaptradeProSubCode);
	            swaptradeProCodeName=formatDataName(tradeData1,'200');
	            swaptradeProCode='200';
	            }else if(firstNum=='3'){
	            swaptradeProSubCodeName=formatDataName(tradeSubData3,swaptradeProSubCode);
	            swaptradeProCodeName=formatDataName(tradeData2,'300');
	            swaptradeProCode='300';
	            }else if(firstNum=='4'){
	            swaptradeProSubCodeName=formatDataName(tradeSubData3,swaptradeProSubCode);
	            swaptradeProCodeName=formatDataName(tradeData2,'400');
	            swaptradeProCode='400';
	            }
	            
	             var codeValue = Number(swaptradeProSubCode);
    			if(parseInt(codeValue/10) == 12 ){
    				Ext.get('bankcardDiv').dom.style.display = "block";
    				if(Ext.get('swapTrade.property9'))var property9=Ext.get('swapTrade.property9').dom.value;
    				if(property9=='Y')Ext.get("ifBankCard").dom.checked = true;
    			}else if(parseInt(codeValue/10) == 32){
    				Ext.get('bankcardDiv').dom.style.display = "block";
    				if(Ext.get('swapTrade.property10'))var property10=Ext.get('swapTrade.property10').dom.value;
    				if(property10=='Y')Ext.get("ifBankCard").dom.checked = true;
    			
    			}
				var store1 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : (firstNum=='1'||firstNum=='2')?tradeData1:tradeData2 // 数据填充下拉框
	                  });
		        var tradeProCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeProCode",
		             store: store1 ,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.tradeProCode",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:swaptradeProCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		             tradeProCodeBox.applyTo("swapTrade.tradeProCode");
		              tradeProCodeBox.on("select",function(){
		             	$("tradeSubProCode").value="";
		             	if(tradeProCodeBox.getValue()==100){
		             		store2.loadData(tradeSubData1,[]);
		             		tradeProSubCodeBox.setValue("110");
		             		$("tradeSubProCode").value=110;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("swapTrade.property9").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==200){
		             		store2.loadData(tradeSubData2,[]);
		             		tradeProSubCodeBox.setValue("210");
		             		$("tradeSubProCode").value=210;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("swapTrade.property9").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==300){
		             		store2.loadData(tradeSubData3,[]);
		             		tradeProSubCodeBox.setValue("310");
		             		$("tradeSubProCode").value=310;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("swapTrade.property10").dom.value = '';
		             	}else if(tradeProCodeBox.getValue()==400){
		             		store2.loadData(tradeSubData4,[]);
		             		tradeProSubCodeBox.setValue("410");
		             		$("tradeSubProCode").value=410;
		             		Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						Ext.get("swapTrade.property10").dom.value = '';
		             	}
		             },tradeProCodeBox);
		             
		             
		             var store2 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : firstNum=='1'?tradeSubData1:(firstNum=='2'?tradeSubData2:(firstNum=='3'?tradeSubData3:tradeSubData4))// 数据填充下拉框
	                  });
		        var tradeProSubCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeSubProCode",
		             store: store2,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.tradeSubProCode",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:swaptradeProSubCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		             tradeProSubCodeBox.applyTo("swapTrade.tradeSubProCode");
		             //tradeCustTypeBox.applyTo("swapTrade.forCusType");
		             tradeProSubCodeBox.on("select",function(){
		             	$("tradeSubProCode").value=tradeProSubCodeBox.getValue();
		             	$("swapTrade.tradeSubProCode").value=tradeProSubCodeBox.getValue();
		             	 var codeValue = Number($("tradeSubProCode").value);
		             	 var firstStr=($("tradeSubProCode").value).substring(0,1);
    					if(parseInt(codeValue/10) == 12 || parseInt(codeValue/10) == 32){
    						Ext.get('bankcardDiv').dom.style.display = "block";
    					} else {
    						Ext.get('bankcardDiv').dom.style.display = "none";
    						Ext.get("ifBankCard").dom.checked = false;
    						if(firstStr =='1' || firstStr =='2')Ext.get("swapTrade.property9").dom.value = '';
    						if(firstStr =='3' || firstStr =='4')Ext.get("swapTrade.property10").dom.value = '';
    						}
		             },tradeProSubCodeBox);
		             $("tradeSubProCode").value=swaptradeProSubCode;
		             
		             }
		if(Ext.get('swapTrade.tradeProCodeNear')){
			var tradeData1=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeData2=[
                  ["100","100-经常项目"],
                  ["200","200-资本与金融项目"],
                  ["300","300-经常项目"],
                  ["400","400-资本与金融项目"]
                 ];
                 var tradeSubData1=[
                  ["110","110-货物贸易"],
				  ["121","121-服务贸易-运输"],
				  ["122","122-服务贸易-旅游"],
				  ["123","123-服务贸易-金融和保险服务"],
				  ["124","124-服务贸易-专有权利使用费和特许费"],
				  ["125","125-服务贸易-咨询服务"],
				  ["126","126-服务贸易-其他服务"],
				  ["130","130-服务贸易-收益和经常转移"],
				  ["131","131-收益和经常转移-职工报酬和赡家款"],
				  ["132","132-收益和经常转移--投资收益"],
				  ["133","133-收益和经常转移--其他经常转移"]
                 ];
                 var tradeSubData2=[
                  ["210","210-资本账户"],
				  ["220","220-直接投资"],
				  ["221","221-直接投资-其中：投资资本金"],
				  ["222","222-直接投资-直接投资撤资"],
				  ["223","223-直接投资-房地产"],
				  ["231","231-证券投资-对境外证券投资撤回"],
				  ["232","232-证券投资-证券筹资"],
				  ["240","240-其他投资"],
				  ["241","241-其他投资-其中：跨境贷款"],
				  ["242","242-其他投资-外债转贷款"],
				  ["250","250-国内外汇贷款"],
				  ["260","260-金融机构资金本外币转换"],
				  ["261","261-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["262","262-金融机构资金本外币转换-代债务人结汇"],
				  ["270","270-其他"]
                 ];
                 var tradeSubData3=[
                  ["310","310-货物贸易"],
				  ["321","321-服务贸易-运输"],
				  ["322","322-服务贸易-旅游"],
				  ["323","323-服务贸易-金融和保险服务"],
				  ["324","324-服务贸易-专有权利使用费和特许费"],
				  ["325","325-服务贸易-咨询服务"],
				  ["326","326-服务贸易-其他服务"],
				  ["331","331-收益和经常转移-职工报酬和赡家款"],
				  ["332","332-收益和经常转移-投资收益"],
				  ["333","333-收益和经常转移-其他经常转移"]
                 ];
                 var tradeSubData4=[
                  ["410","410-资本账户"],
				  ["420","420-直接投资"],
				  ["421","421-直接投资-其中：投资资本金"],
				  ["422","422-直接投资-直接投资撤资"],
				  ["423","423-直接投资-房地产"],
				  ["431","431-证券筹资-对境外证券投资撤回"],
				  ["432","432-证券筹资-证券筹资"],
				  ["440","440-其他投资"],
				  ["441","441-其他投资-其中：跨境贷款"],
				  ["442","442-其他投资-外债转贷款"],
				  ["450","450-其他投资-国内外汇贷款"],
				  ["460","460-金融机构资金本外币转换"],
				  ["461","461-金融机构资金本外币转换-其中：资本金（营运资金）"],
				  ["462","462-金融机构资金本外币转换-代债务人结汇"],
				  ["470","470-其他"]
                 ];
                 var tradeCustType=[
                  ["01","01-银行自身"],
				  ["02","02-金融机构"],
				  ["03","03-中资机构"],
				  ["04","04-外资机构"],
				  ["05","05-居民个人"],
				  ["06","06-非居民个人"],
				  ['99',"99-TC"]
				];
                 var swaptradeProCode;
                 var swapNeartradeProCode;
	            var swaptradeProSubCode;
	            var swapNeartradeProSubCode;
	            var firstNum;
	            var NearfirstNum;
                var swapproperty1=Ext.get('swapTrade.property1').dom.value;
	            var swapproperty6=Ext.get('swapTrade.property6').dom.value;
	           	swaptradeProSubCode=(isBuy=="true"?swapproperty6:swapproperty1);
	            firstNum =swaptradeProSubCode.substring(0,1);
	           	swapNeartradeProSubCode=(isBuy=="true"?swapproperty1:swapproperty6);
	            NearfirstNum =swapNeartradeProSubCode.substring(0,1);
	            
	            
				if(NearfirstNum=='1'){
	            swapNeartradeProSubCodeName=formatDataName(tradeSubData1,swapNeartradeProSubCode);
	            swapNeartradeProCodeName=formatDataName(tradeData1,'100');
	            swapNeartradeProCode='100';
	            }else if(NearfirstNum=='2'){
	            swapNeartradeProSubCodeName=formatDataName(tradeSubData2,swaptradeProSubCode);
	            swapNeartradeProCodeName=formatDataName(tradeData1,'200');
	            swapNeartradeProCode='200';
	            }else if(NearfirstNum=='3'){
	            swapNeartradeProSubCodeName=formatDataName(tradeSubData3,swaptradeProSubCode);
	            swapNeartradeProCodeName=formatDataName(tradeData2,'300');
	            swapNeartradeProCode='300';
	            }else if(NearfirstNum=='4'){
	            swapNeartradeProSubCodeName=formatDataName(tradeSubData3,swaptradeProSubCode);
	            swapNeartradeProCodeName=formatDataName(tradeData2,'400');
	            swapNeartradeProCode='400';
	            }
	             var codeValue = Number(swapNeartradeProSubCode);
    			if(parseInt(codeValue/10) == 12 ){
    				Ext.get('bankcardDivNear').dom.style.display = "block";
    				if(Ext.get('swapTrade.property9'))var property9=Ext.get('swapTrade.property9').dom.value;
    				if(property9=='Y')Ext.get("ifBankCardNear").dom.checked = true;
    			}else if(parseInt(codeValue/10) == 32){
    				Ext.get('bankcardDivNear').dom.style.display = "block";
    				if(Ext.get('swapTrade.property10'))var property10=Ext.get('swapTrade.property10').dom.value;
    				if(property10=='Y')Ext.get("ifBankCardNear").dom.checked = true;
    			
    			}
		        var store11 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : (NearfirstNum=='1'||NearfirstNum=='2')?tradeData1:tradeData2 // 数据填充下拉框
	                  });
		        var tradeProCodeNearBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeProCodeNear",
		             store: store11 ,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.tradeProCodeNear",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:swapNeartradeProCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		             tradeProCodeNearBox.applyTo("swapTrade.tradeProCodeNear"); 
		         var store22 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : NearfirstNum=='1'?tradeSubData1:(NearfirstNum=='2'?tradeSubData2:(NearfirstNum=='3'?tradeSubData3:tradeSubData4))// 数据填充下拉框
	                  });
		        var tradeProSubCodeNearBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeSubProCodeNear",
		             store: store22,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.tradeSubProCodeNear",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:swapNeartradeProSubCode,
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
		        tradeProSubCodeNearBox.applyTo("swapTrade.tradeSubProCodeNear");
		        tradeProCodeNearBox.on("select",function(){
		             	$("tradeSubProCodeNear").value="";
		             	if(tradeProCodeNearBox.getValue()==100){
		             		store22.loadData(tradeSubData1,[]);
		             		tradeProSubCodeNearBox.setValue("110");
		             		$("tradeSubProCodeNear").value=110;
		             		Ext.get('bankcardDivNear').dom.style.display = "none";
    						Ext.get("ifBankCardNear").dom.checked = false;
    						Ext.get("swapTrade.property9").dom.value = '';
		             	}else if(tradeProCodeNearBox.getValue()==200){
		             		store22.loadData(tradeSubData2,[]);
		             		tradeProSubCodeNearBox.setValue("210");
		             		$("tradeSubProCodeNear").value=210;
		             		Ext.get('bankcardDivNear').dom.style.display = "none";
    						Ext.get("ifBankCardNear").dom.checked = false;
    						Ext.get("swapTrade.property9").dom.value = '';
		             	}else if(tradeProCodeNearBox.getValue()==300){
		             		store22.loadData(tradeSubData3,[]);
		             		tradeProSubCodeNearBox.setValue("310");
		             		$("tradeSubProCodeNear").value=310;
		             		Ext.get('bankcardDivNear').dom.style.display = "none";
    						Ext.get("ifBankCardNear").dom.checked = false;
    						Ext.get("swapTrade.property10").dom.value = '';
		             	}else if(tradeProCodeNearBox.getValue()==400){
		             		store22.loadData(tradeSubData4,[]);
		             		tradeProSubCodeNearBox.setValue("410");
		             		$("tradeSubProCodeNear").value=410;
		             		Ext.get('bankcardDivNear').dom.style.display = "none";
    						Ext.get("ifBankCardNear").dom.checked = false;
    						Ext.get("swapTrade.property10").dom.value = '';
		             	}
		             },tradeProCodeNearBox);
		         tradeProSubCodeNearBox.on("select",function(){
		             	$("tradeSubProCodeNear").value=tradeProSubCodeNearBox.getValue();
		             	$("swapTrade.tradeSubProCodeNear").value=tradeProSubCodeNearBox.getValue();
		             	 var codeValue = Number($("tradeSubProCodeNear").value);
		             	 var firstStr=($("tradeSubProCodeNear").value).substring(0,1);
    					if(parseInt(codeValue/10) == 12 || parseInt(codeValue/10) == 32){
    						Ext.get('bankcardDivNear').dom.style.display = "block";
    					} else {
    						Ext.get('bankcardDivNear').dom.style.display = "none";
    						Ext.get("ifBankCardNear").dom.checked = false;
    						if(firstStr =='1' || firstStr =='2')Ext.get("swapTrade.property9").dom.value = '';
    						if(firstStr =='3' || firstStr =='4')Ext.get("swapTrade.property10").dom.value = '';
    						}
		             },tradeProSubCodeBox);
		             $("tradeSubProCodeNear").value=swapNeartradeProSubCode;
		        var store3 = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : tradeCustType // 数据填充下拉框
	                  });
		        tradeCustTypeBox = new Ext.form.ComboBox({
		             name:"swapTrade.forCusType",
		             store: store3,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.forCusType",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'01',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true,
				     disabled:false
		             });
		            
		             
		             
			}
			if(Ext.get('forwardTrade.deptBussinessType')){
				var direction = isBuy=="true"?"1":"0";
				businessTypeDs = new Ext.data.Store({
       		        proxy: new Ext.data.HttpProxy({url: '/forex/queryDeptBusinessType.action?pageFlag=1&deptBusinessType.direction='+direction}),
       		        reader: new Ext.data.JsonReader({
       		        	   id: 'id',
       		        	   totalProperty: 'total',
       		        	   root: 'data'   
       		           },
       		        ['id','bussinessType'])
       		    });
				businessTypeDs.load({params:{start:0}});// 下拉数据
    			var bTypeCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.deptBussinessType",
		             store: businessTypeDs,
		             displayField:'bussinessType',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"forwardTrade.deptBussinessType",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
    			bTypeCodeBox.applyTo("forwardTrade.deptBussinessType");
			}
			if(Ext.get('forwardTrade.cpty')){
				var cptyData=[
                  ["0","境内"],
                  ["1","境外"]
                 ];
				var cptyStore = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : cptyData // 数据填充下拉框
	                  });
				var cptyBox = new Ext.form.ComboBox({
		             name:"forwardTrade.cpty",
		             store: cptyStore,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"forwardTrade.cpty",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             value: '0',
		             mode: 'local',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
				cptyBox.applyTo('forwardTrade.cpty');
			}
			if(Ext.get('swapTrade.deptBussinessType')){
				var direction = isBuy=="true"?"1":"0";
				businessTypeDs = new Ext.data.Store({
       		        proxy: new Ext.data.HttpProxy({url: '/forex/queryDeptBusinessType.action?pageFlag=1&deptBusinessType.direction='+direction}),
       		        reader: new Ext.data.JsonReader({
       		        	   id: 'id',
       		        	   totalProperty: 'total',
       		        	   root: 'data'   
       		           },
       		        ['id','bussinessType'])
       		    });
				businessTypeDs.load({params:{start:0}});// 下拉数据
    			var bTypeCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.deptBussinessType",
		             store: businessTypeDs,
		             displayField:'bussinessType',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.deptBussinessType",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
    			bTypeCodeBox.applyTo("swapTrade.deptBussinessType");
			}
			if(Ext.get('swapTrade.cpty')){
				var cptyData=[
                  ["0","境内"],
                  ["1","境外"]
                 ];
				var cptyStore = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : cptyData // 数据填充下拉框
	                  });
				var cptyBox = new Ext.form.ComboBox({
		             name:"swapTrade.cpty",
		             store: cptyStore,
		             displayField:'name',// 交易类型
		             valueField:'id',     // 传递值
		             hiddenName:"swapTrade.cpty",
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             value: '0',
		             mode: 'local',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });
				cptyBox.applyTo('swapTrade.cpty');
			}
	        },checkMgamt : function(){
	        	var marginCode;
		 		var marginAmount;
	        	 if(Ext.get('forwardTrade.rateCode')){//保证金货币和保证金金额必须同时录入  xujie 2014-02-10
	         		if(Ext.get('forwardTrade.marginCodeStr').dom) marginCode = Formatter.toNumber(Ext.get('forwardTrade.marginCodeStr').dom.value);
	         		if(Ext.get('forwardTrade.marginAmount').dom) marginAmount = Formatter.toNumber(Ext.get('forwardTrade.marginAmount').dom.value);
	         	}else if(Ext.get('swapTrade.rateCode')){
	         		if(Ext.get('swapTrade.marginCodeStr').dom) marginCode = Formatter.toNumber(Ext.get('swapTrade.marginCodeStr').dom.value);
	         		if(Ext.get('swapTrade.marginAmount').dom) marginAmount = Formatter.toNumber(Ext.get('swapTrade.marginAmount').dom.value);
	         	}
	         	if(((marginCode == '' || marginCode == '-请选择-' )  && (marginAmount != 0 && marginAmount != ''))||((marginCode != '' && marginCode != '-请选择-' )  && (marginAmount == 0 || marginAmount == '')) ){
	         		Ext.MessageBox.alert('提示','保证金货币和金额必须同时录入！');
	         		return -1;
	            }else{
		         	 if(marginCode == 0){
				           if(Ext.get('forwardTrade.rateCode')){//保证金货币和保证金金额必须同时录入  xujie 2014-02-10
				         		 Ext.get('forwardTrade.marginCodeStr').dom.value = '';
			         	  		 Ext.get('forwardTrade.marginAmount').dom.value = '';
				         	}else if(Ext.get('swapTrade.rateCode')){
					             Ext.get('swapTrade.marginCodeStr').dom.value = '';
			         	  		 Ext.get('swapTrade.marginAmount').dom.value = '';
				         	}
		         	 }
	         	}
	         	return 0;
	        },   
		myUpdateInfo : function(isSell){

		
			/*var checkRelInfo = eforexGrid.validateTradeRelevancyInfoFunc();//验证关联信息
			if(!checkRelInfo){
         		return;
         	}
			if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{*/
            if(eforexGrid.checkMgamt() == -1)return;
			var isBuy;
			//alert(isSell);
			if(isSell=='B/S'|| isSell=='结汇'){
		        isBuy='false';
		        if(Ext.get('swapTrade.amount1')){
		            isBuy='true';}
		    }else if(isSell=='S/B'|| isSell=='售汇'){
		        isBuy='true';
		        if(Ext.get('swapTrade.amount1')){
		            isBuy='false';}
		      }
		if(isBuy=='true'){
			if(Ext.get('forwardTrade.property1')){
    		document.getElementsByName("forwardTrade.property1")[0].value = "";
    		if(Ext.get('forwardTrade.tradeSubProCode'))document.getElementsByName("forwardTrade.property6")[0].value = Ext.get('forwardTrade.tradeSubProCode').dom.value;
    		}else if(Ext.get('swapTrade.property1')){
    			//if(Ext.get('swapTrade.specialType').dom.value!=2 &&Ext.get('swapTrade.specialType').dom.value!=11){
    		if(Ext.get('swapTrade.tradeSubProCodeNear'))document.getElementsByName("swapTrade.property1")[0].value = Ext.get('swapTrade.tradeSubProCodeNear').dom.value;
    		if(Ext.get('swapTrade.tradeSubProCode'))document.getElementsByName("swapTrade.property6")[0].value = Ext.get('swapTrade.tradeSubProCode').dom.value;
    		}
    		//}
   		 }else if(isBuy=='false'){
   		 	if(Ext.get('forwardTrade.property1')){
    		if(Ext.get('forwardTrade.tradeSubProCode'))document.getElementsByName("forwardTrade.property1")[0].value = Ext.get('forwardTrade.tradeSubProCode').dom.value;
    		if(Ext.get('forwardTrade.property6'))document.getElementsByName("forwardTrade.property6")[0].value = "";
    		}else if(Ext.get('swapTrade.property1')){
    		if(Ext.get('swapTrade.tradeSubProCode'))document.getElementsByName("swapTrade.property1")[0].value = Ext.get('swapTrade.tradeSubProCode').dom.value;
    		if(Ext.get('swapTrade.tradeSubProCodeNear'))document.getElementsByName("swapTrade.property6")[0].value = Ext.get('swapTrade.tradeSubProCodeNear').dom.value;
    		}
   		 }
			
					var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('dealUpdateBtn').dom.getAttribute('action'),
							{success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
		 /*	}*/
		}, 
		/**
 * 对客交易 itemid != 5
 * true  - 售汇
 * false - 结汇
 **/
 isSellCny:function(){
 var itemid,rateCode,cyCode1,cyCode2,calAmount,isBuy;
 	if(Ext.get("forwardTrade.rateCode")){
 		itemid = Ext.get("forwardTrade.itemId").dom.value;
 		rateCode = document.getElementsByName("forwardTrade.rateCode")[0].value;
 		calAmount =getRadioChecked("forwardTrade.calAmount"); 
 		isBuy = getRadioChecked("forwardTrade.isBuy");
 		if(isBuy == null){
			isBuy = Ext.get("forwardTrade.buy").dom.value;
		}
 	}else if(Ext.get("swapTrade.rateCode")){
 		itemid = Ext.get("swapTrade.itemId").dom.value;
 		rateCode = document.getElementsByName("swapTrade.rateCode")[0].value;
 		calAmount =getRadioChecked("swapTrade.calAmount"); 
 		isBuy = getRadioChecked("swapTrade.isBuy");
 		if(isBuy == null){
			isBuy = Ext.get("swapTrade.buy").dom.value;
		}
 	}
	var cyCode1 = parseInt(rateCode/100);
	var cyCode2 = rateCode%100;
	if(itemid == 5){
		if(cyCode2 == 1 || cyCode2 == '1'){
			if((isBuy=='false'&&calAmount=='false')||(isBuy=='true'&&calAmount=='true')){
				return true;
			}else{
				return false;
			}
		}else{
			if((isBuy=='false'&&calAmount=='false')||(isBuy=='true'&&calAmount=='true')){
				return false;
			}else{
				return true;
			}
		}
	}else{
		if(cyCode2 == 1 || cyCode2 == '1'){
			if((isBuy=='false'&&calAmount=='false')||(isBuy=='true'&&calAmount=='true')){
				return false;
			}else{
				return true;
			}
		}else{
			if((isBuy=='false'&&calAmount=='false')||(isBuy=='true'&&calAmount=='true')){
				return true;
			}else{
				return false;
			}
		}
	}
},
		formatProperty5 : function(amtObj){
			if(!/^([0-9]*|[0-9]{1}\d*\.\d{1}?\d*)$/.exec(amtObj.value.replace(/^\s+|\s+$/g,""))){
				amtObj.value = 0;
			}else if(amtObj.value == ""){
				amtObj.value = 0;
			}
			amtObj.value = Formatter.formatPrec(amtObj.value,2);
		},
	    hrefPrev : function(){
	       		location.href = Ext.get("ratePrev").dom.getAttribute('url');
	       },
	       
		insert : function(){
			var dlgTabs = Ext.get("dlgTabs");
			 var initBnakListse = function(e,b,o){//机构下拉框渲染 xujie
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
			            		if(res){
			            			if('error' == res){
			            				return;
			            			}
			            		}
			            		if(typeof initBnakListsele!='undefined'&& initBnakListsele instanceof Function){ 
			            		 var flag="insert"        
    									initBnakListsele (flag);  
    									}
		            	};
			if(dlgTabs){
				cbCounter = 0; 
				if(!infoDlg){
					infoDlg = new Ext.LayoutDialog('my-dlg', { 
		                    modal:true,
		                    width:360,
		                    height:450,
		                    shadow:true,
		                    proxyDrag: true,
		                    resizable:false,
		                    center: {
		                    	animate: true,
		                        autoScroll:false,
		                        tabPosition: 'top',
		                        alwaysShowTabs: true
		                    }
		            });
			         btn = infoDlg.addButton('确定');
			         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
		        }
		        btn.setHandler(eforexGrid.doAllAction, infoDlg);
		        btn.enable();
		        infoDlg.setTitle('添加');
		       	var layout = infoDlg.getLayout();
	            layout.beginUpdate();
		        var eles = dlgTabs.dom.elements;		  
		        var region = layout.getRegion("center");  	           
	            if(!region.getTabs()){	          	    	                         
				for(var i=0; i<eles.length; i++){
					if(i ==0){
		        		content = new Ext.ContentPanel('panel0',{autoCreate : true,title: eles[i].getAttribute('tabTitle')});
		        		layout.add('center',content);
		        	}else{	 		 
		        		layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,background:true,title: eles[i].getAttribute('tabTitle')}));
		        	}
		        } 		     		    
	            }
		        for(var i=1; i<eles.length; i++){
	            	 var panel = region.panels.itemAt(i);  
	            	 var panelUpdate = panel.getUpdateManager();   
			         panelUpdate.update(eles[i].getAttribute('url'),null);
	            }        		        
	            var update = content.getUpdateManager();   
			    update.update(Ext.get('insertBtn').dom.getAttribute('url'),null,eforexGrid.dlgLoadCallback);
	           	layout.endUpdate();
			}else{
				if(!infoDlg){
					infoDlg = new Ext.LayoutDialog('my-dlg', { 
		                    modal:true,
		                    width:600,
		                    height:450,
		                    shadow:true,
		                    proxyDrag: true,
		                    resizable:false,
		                    center: {
		                    	animate: true,
		                        autoScroll:false,
		                        tabPosition: 'top'
		                    }
		            });
					if(Ext.get('updateBtn') && Ext.get('updateBtn') != null){
			            var url = Ext.get('updateBtn').dom.getAttribute('url');
		            	if(url.indexOf('posswordinit')!=-1) {
		            		 btn1 = infoDlg.addButton('密码初始化',eforexGrid.passwordInit);
		            	}
					}
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true});
		        }
		        if(btn1) {
		        	btn1.hide();
		        }
	      		btn.setHandler(eforexGrid.saveData, infoDlg);
	      		btn.enable();
	            infoDlg.setTitle('添加');
	            var layout = infoDlg.getLayout();
	            layout.beginUpdate();
	            layout.add('center',content);
	            var update = content.getUpdateManager();   
				update.update(Ext.get('insertBtn').dom.getAttribute('url'),null,initBnakListse);
	           	layout.endUpdate();
			}
           	infoDlg.show();
		},
		importMtm : function(){
			var dlgTabs = Ext.get("dlgTabs");
			if(dlgTabs){
				cbCounter = 0; 
				if(!infoDlg){
					infoDlg = new Ext.LayoutDialog('my-dlg', { 
		                    modal:true,
		                    width:360,
		                    height:450,
		                    shadow:true,
		                    proxyDrag: true,
		                    resizable:false,
		                    center: {
		                    	animate: true,
		                        autoScroll:false,
		                        tabPosition: 'top',
		                        alwaysShowTabs: true
		                    }
		            });
			         //btn = infoDlg.addButton('确定');
			         infoDlg.addButton('关闭', infoDlg.hide, infoDlg);
		        }
		        //btn.setHandler(eforexGrid.doAllAction, infoDlg);
		        //btn.enable();
		        infoDlg.setTitle('导入估值');
		       	var layout = infoDlg.getLayout();
	            layout.beginUpdate();
		        var eles = dlgTabs.dom.elements;		  
		        var region = layout.getRegion("center");  	           
	            if(!region.getTabs()){	          	    	                         
				for(var i=0; i<eles.length; i++){
					if(i ==0){
		        		content = new Ext.ContentPanel('panel0',{autoCreate : true,title: eles[i].getAttribute('tabTitle')});
		        		layout.add('center',content);
		        	}else{	 		 
		        		layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,background:true,title: eles[i].getAttribute('tabTitle')}));
		        	}
		        } 		     		    
	            }
		        for(var i=1; i<eles.length; i++){
	            	 var panel = region.panels.itemAt(i);  
	            	 var panelUpdate = panel.getUpdateManager();   
			         panelUpdate.update(eles[i].getAttribute('url'),null);
	            }        		        
	            var update = content.getUpdateManager();   
			    update.update(Ext.get('importMtmBtn').dom.getAttribute('url'),null,eforexGrid.dlgLoadCallback);
	           	layout.endUpdate();
			}else{
				if(!infoDlg){
					infoDlg = new Ext.LayoutDialog('my-dlg', { 
		                    modal:true,
		                    width:600,
		                    height:450,
		                    shadow:true,
		                    proxyDrag: true,
		                    resizable:false,
		                    center: {
		                    	animate: true,
		                        autoScroll:false,
		                        tabPosition: 'top'
		                    }
		            });
					/**if(Ext.get('updateBtn') && Ext.get('updateBtn') != null){
			            var url = Ext.get('updateBtn').dom.getAttribute('url');
		            	if(url.indexOf('posswordinit')!=-1) {
		            		 btn1 = infoDlg.addButton('密码初始化',eforexGrid.passwordInit);
		            	}
					}**/
			            //btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true});
		        }
		        if(btn1) {
		        	btn1.hide();
		        }
	      		//btn.setHandler(eforexGrid.doImportMtm, infoDlg);
	      		//btn.enable();
	            infoDlg.setTitle('导入估值');
	            var layout = infoDlg.getLayout();
	            layout.beginUpdate();
	            layout.add('center',content);
	            var update = content.getUpdateManager();   
				update.update(Ext.get('importMtmBtn').dom.getAttribute('url'),null,eforexGrid.dlgLoadCallback);
	           	layout.endUpdate();
			}
           	infoDlg.show();
		},
		
	//上传文件时javascript读取文件的本地路径的问题（"C:\fakepath\"）的解决方案
	getPath : function(obj) {
	  	if (obj) {
	  		if (window.navigator.userAgent.indexOf("MSIE") >= 1) {
	  			obj.select(); return document.selection.createRange().text;
	  		}else if (window.navigator.userAgent.indexOf("Firefox") >= 1) {
	  			if (obj.files) {
	  				return obj.files.item(0).getAsDataURL();
	 			}
	  			return obj.value;
	 		}
	  		return obj.value;
	 	 }
	  },
		
		doImportMtm : function(){
				//var file = document.getElementById("attachment").value;
				var file = eforexGrid.getPath(document.getElementById("attachment"));
			
				if(file==null ||file== ''){
					Ext.MessageBox.alert('错误','请选择文件!');
					return;
				}
				var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, 'importMtm.action?file='+file,
		                    {success: eforexGrid.commentSuccessImportMtm, failure: eforexGrid.commentFailure}); 
		},
		
		commentSuccessImportMtm : function(o){
			var data = o.responseText;
			Ext.MessageBox.hide();
			if(data){
				 if(data !="" && data.indexOf('INFO')!= -1){
				 	 if(data.indexOf('ERROR')!= -1){
						alert("FXDEALMTM_I4错误过滤汇总："+data.substring(data.indexOf('INFO')+4,data.indexOf('ERROR')));
					  }else{
					  	alert("FXDEALMTM_I4错误过滤汇总："+data.substring(data.indexOf('INFO')+4));
					  }
					  
				 }
				 if(data.indexOf('ERROR')!= -1){
				     Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));
				}else{
					if(infoDlg){
							infoDlg.hide();
					}
					 Ext.MessageBox.alert('提示','导入成功');
				 }
			}else{
				if(infoDlg){
							infoDlg.hide();
					}
					 Ext.MessageBox.alert('提示','导入成功');
				 }
        },
		
		dlgLoadCallback : function(e,b,o){
			var data = '';
			if(typeof(o) != 'undefined'){data = o.responseText;}
			 if(data.indexOf('ERROR')!= -1){
				infoDlg.hide();
				Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));
				return 'error';
			}
			if(data.indexOf('TipOk')!= -1){
				infoDlg.hide();
				Ext.MessageBox.alert('提示',data.substring(data.indexOf('TipOk')+5));
				return 'error';
			}
			if(gridMenuForm.dom.getAttribute("mainNeedCallback")){
				eval(gridMenuForm.dom.getAttribute("mainNeedCallback"));
			}else{
				if(gridMenuForm.dom.getAttribute("needCallback")){
					eval(gridMenuForm.dom.getAttribute("needCallback"));
				}
			}
			if(Ext.get('insertBtn')&&Ext.get('insertBtn').dom.getAttribute('url').indexOf("initParam=1")!=-1){
				initParam();
			}
			if(Ext.get('updateBtn') && Ext.get('trade.amount1')) {
				$('trade.amount1').value = Formatter.formatAmt($('trade.amount1').value);
			}
			if(Ext.get('reverseIsBtn')) {
				eval('isAmountTD1').innerText = Formatter.formatAmt(Math.abs(Ext.get('isAmount1').dom.value));
			}
			if(Ext.get('doGapBtn')) {
				if(Ext.get('isAmountTD1')){
					eval('isAmountTD1').innerText = Formatter.formatAmt(Math.abs(Ext.get('isAmount1').dom.value));
				}
				if(Ext.get('isAmountTD2'))
					eval('isAmountTD2').innerText = Formatter.formatAmt(Math.abs(Ext.get('isAmount2').dom.value));
			}
			// 不同的页面初始化日期字段名称不同
			var _name = "";
			if(Ext.get("user.validDate")!=null){
					_name = 'user.validDate';
					// 日期控制作用
					var cvalueDate = new Ext.form.DateField({// 如何在进入页面就初始化日期控件
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			if(Ext.get("userExt.beginDate")!=null){
					_name = 'userExt.beginDate';
					// 日期控制作用
					var cvalueDate = new Ext.form.DateField({// 如何在进入页面就初始化日期控件
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			if(Ext.get("userExt.endDate")!=null){
					_name = 'userExt.endDate';
					// 日期控制作用
					var cvalueDate = new Ext.form.DateField({// 如何在进入页面就初始化日期控件
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			//提前展期展期金额不可变，只能全额展
			if(Ext.get('durationBtn')){
				if(Ext.get('durationBtn').dom.getAttribute('url').indexOf("&ery=true")>0){
					if(Ext.get('durationTrade.durationAmount')){
						$('durationTrade.durationAmount').readOnly = true;
		            	$('durationTrade.durationAmount').className = 'input_NoBoder';
	            	}
	            }	
            }
            
			//提前展期展期金额不可变，只能全额展
			if(Ext.get('farDurationBtn')){
				if(Ext.get('farDurationBtn').dom.getAttribute('url').indexOf("&ery=true")>0 ){
					if(Ext.get('durationTrade.durationAmount')){
						$('durationTrade.durationAmount').readOnly = true;
		            	$('durationTrade.durationAmount').className = 'input_NoBoder';
	            	}
	            }	
            }
            
			if(Ext.get("appList")&&Ext.get("app-grid")){// 初始化 产品列表 Grid数据内容
				eforexGrid.initRoleRightGrid();
				infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);  // 对话框
																							// 大小设置
			}else{
				if(content.getEl().dom.firstChild.offsetHeight!=undefined) {
					infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
				}
			}
		},
		
		initRoleRightGrid:function(){// 初始化角色 产品 权限
		    app = Ext.data.Record.create([
			        	   {name: 'appid'},
			        	   {name: 'appname'}                                 	                      
	                  ]);	  
	        appCM = new Ext.grid.ColumnModel([
				{header: "权限大类",width:326,align:'center', sortable: false,dataIndex:'appname'}
			]);
			
	         appDS = new Ext.data.Store({
		        proxy: new Ext.data.HttpProxy({url: '/base/getApplList.action'}),
     	        reader: new Ext.data.JsonReader({
		        	   totalProperty: 'total',
		        	   root: 'data'
		           },app)     
		    }); 		 
		   var params = {};
		   Ext.get('app-grid').dom.innerHTML='';
		    appGrid = new Ext.grid.Grid('app-grid', {
		        ds: appDS,
		        cm: appCM,
		        selModel: new Ext.grid.RowSelectionModel({singleSelect:true}),
		        enableColLock:false,
		        loadMask: false
    		});	  
    		appGrid.on("rowdblclick",eforexGrid.appRowDblClick,this);// 处理点击事件操作
			appGrid.render();
		    appDS.load({params:params});	
		    eforexGrid.initApplRightGrid();// 初始化Grid内容
	    },

	    initApplRightGrid:function(){
	    	 Right = Ext.data.Record.create([ 
	    		{name : 'id'}, 
				{name : 'name'}, 
				{name : 'enabled'},
				{name : 'permit'}
				]);
			var RightIdRendererFnc = function(value, p, r, rowIndex, colIndex,ds) { // 权限编码绘制
				var t = new Ext.Template('<input id="{id}" type="checkbox" {checked} name="{name}"  value="{value}">');
				var checkedStr = r.get('enabled') ? 'checked="checked"' : '';
				var html = t.applyTemplate( {
					id : 'appid-cbx-'+value,
					checked : checkedStr,
					name : 'selItems',
					value : value
				});
				return html;
			};
			
			 RightCM = new Ext.grid.ColumnModel([ 
			{header : "<input id=right-allcbx type=checkbox onclick='eforexGrid.rightCheckChange(this)' >",width : 50,sortable : false,dataIndex : 'id',renderer : RightIdRendererFnc},
			{header : "权限代码",width : 200,sortable : false,dataIndex : 'permit'}, 
			{header : "权限名",width : 220,sortable : false,dataIndex : 'name'}
			]);
			
			 RightDS = new Ext.data.Store( {
				proxy : new Ext.data.HttpProxy( {
					url : '/base/getApplRightList.action'
				}),
				reader : new Ext.data.JsonReader( {
					id:'id',
					totalProperty : 'total',
					root : 'data'
				}, Right)
			});
			Ext.get('appRight-grid').dom.innerHTML='';
			 RightGrid = new Ext.grid.Grid('appRight-grid', {
				ds : RightDS,
				cm : RightCM,
				selModel : new Ext.grid.RowSelectionModel( {
					singleSelect : true
				}),
				enableColLock : false,
				loadMask : false
			});
			RightGrid.render();
			   
           var checkAll = function(e) {
				var tempid, cbxChecked = e.getTarget().checked;
				for (var i = 0;i < RightDS.getCount(); i++) {
					tempid = RightDS.getAt(i).get('id');
					Ext.get('appid-cbx-' + tempid).dom.checked = cbxChecked;
				}
			};

    		var columnMoveAfter = function(){	
		        Ext.get('right-allcbx').on('click',checkAll,this);
		    };
    		RightGrid.on('columnmove',columnMoveAfter,this);  
			RightGrid.render();	
			columnMoveAfter();
	    },
	    
	    rightCheckChange : function(checkBox){
			if(!checkBox.checked){
				Ext.get("right-allcbx").dom.checked = false; 
				return;
			}

			var selItems = document.getElementsByName("selItems");
			for(var i=0;i<selItems.length;i++){
				if (!selItems[i].checked)
					return;
			}
			Ext.get("right-allcbx").dom.checked = true;      
		},
		
	    appRowDblClick : function(grid,rowIndex,e){
	    	var record = grid.getDataSource().getAt(rowIndex);
	    	infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);
	    	if(infoDlg&content){
	    	infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);
	    	}
	    	Ext.get('role.appid').dom.value=record.get('appid');
	    	var roleId=-1;
	    	if(Ext.get('role.roleid')){
	    		roleId=Ext.get('role.roleid').dom.value;
	    	}
            eforexGrid.loadApplRightGrid(record.get('appid') , roleId);// 装载数据内容
	    },
	    
	    loadApplRightGrid:function(appid,roleid){// 选择产品代码装载 对应权限数据到grid中
	    	var params = {'logRight.appid' :appid,'logRight.roleid' :roleid};
			RightDS.load({params : params}); // 装载指定参数数据
	    },

	    ppRowRender:function(value, p, r, rowIndex, colIndex,ds) { // 牌价参数管理列头部的复选框
				var t = new Ext.Template('<input id="{id}" type="checkbox" {checked} name="{name}"  value="{value}">');
				var checkedStr = '';
				var html = t.applyTemplate( {
					id : 'pp-cbx-'+value,
					checked : '',
					name : 'plItems',
					value : r.get('paramid')+','+r.get('ratecode')+','+r.get('transtype')+','+r.get('transtime')
				});
				return html;
		},
		
		ppRowRender:function(value, p, r, rowIndex, colIndex,ds) { // 牌价参数管理列头部的复选框
				var t = new Ext.Template('<input id="{id}" type="checkbox" {checked} name="{name}"  value="{value}">');
				var checkedStr = '';
				var html = t.applyTemplate( {
					id : 'pp-cbx-'+value,
					checked : '',
					name : 'plItems',
					value : r.get('id')
				});
				return html;
		},
		
		fetRowRender:function(value, p, r, rowIndex, colIndex,ds) {  
				var t = new Ext.Template('<input id="{id}" type="checkbox" {checked} name="{name}"  value="{value}">');
				var checkedStr = '';
				var html = t.applyTemplate( {
					id : 'pp-cbx-'+value,
					checked : '',
					name : 'plItems',
					value : r.get('serialNo')+','+r.get('cyCode1')+','+r.get('cyCode2')+','+r.get('costRate')+','+r.get('usdcnyrate')+','+r.get('amount1')+','+r.get('amount2')+','+r.get('date')+','+r.get('time')
				});
				return html;
		},
		
		ppCheckChange:function(checkBox){ // 牌价参数 单选选择
			if(!checkBox.checked){
				Ext.get("price-allcbx").dom.checked = false; 
				return;
			}

			var selItems = document.getElementsByName("selItems");
			for(var i=0;i<selItems.length;i++){
				if (!selItems[i].checked)
					return;
			}
			Ext.get("price-allcbx").dom.checked = true;      
		},
	  	checkBankInfo : function(_bankId){
	  	 var params = 'bank.bankId='+_bankId;
		   Ext.Ajax.request({
					url : '/base/checkBankInfo.action',
					params : params,
					callback:function(opts,success,response){
						data = response.responseText;
						if(success){// 回调函数
						 if(data.indexOf('dipname')==-1&&_bankId!=''){
				     		Ext.MessageBox.alert('错误','不存在该机构，请重新选择!');
				     		if(btn)btn.disable();
				     	    return;
						 }else{
						 	if(btn)btn.enable();
						 }
						// if((Ext.decode(response.responseText).data)[0].applyState==0){}
						}}
					});
	  	},
		saveData : function(){
			if(document.getElementById("inputErrorNum")){
				checkPageSubmit("insert");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
				var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('insertBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure}); 
			}
		},
		
		initAuthSystem:function(){
			 dialogWa= new Ext.LayoutDialog("authDiv", {// 通过div层创建对话框
			            modal: true,
			            resizable : false,
			            width:450,
			            height:425,
		            	shadow:true,
			            minWidth:500,
			            minHeight:350,
			            proxyDrag:false,          
			            // layout config merges with the dialog config
			            center:{
			            	autoScroll:false,
			                tabPosition: "center",
			                alwaysShowTabs: false
			            }
			    });	    
				btnWa = dialogWa.addButton('确定');
				cancelBtnWa = dialogWa.addButton('取消');
				contentWa = new Ext.ContentPanel('auth',{autoCreate : true,fitToFrame:false});
			    dialogWa.setTitle("交易授权验证");        // 对话框设置TITLE标题
			    btnWa.setHandler(eforexGrid.doAuthBtn,dialogWa);// 提交按钮处理器
			    cancelBtnWa.setHandler(eforexGrid.doAuthCancleBtn, dialogWa);
		},
		
		 doAuthBtn:function(){
	    	// 赋值到冲正 页面数据中去，并执行下去，需要初步验证非自身柜员
	    	var userId=Ext.get('authUser').dom.value;
	    	var userPwd=Ext.get('authPwd').dom.value;
	    	if(Ext.get('sysParam.userId')){
	    	var cuserId=Ext.get('sysParam.userId').dom.value;
	    	if(userId.trim()==cuserId.trim()){
	    		  alert("授权柜员不能是自己，请重新输入");
	    		  return;
	        	}
	    	}
	    	// 取输入的授权柜员，口令,如何验证。都可以此步骤完成
	    	Ext.MessageBox.wait('授权信息验证中...','请稍后...');// 滚动条效果
	    	// TradeCalc.checkUserRight(userId,userPwd,'/base/updateSysParam',eforexGrid.AuthCallBackFunc);
	    	// Add by wdw 20101217 21:58 dwr改造
		   var params = 'userId='+userId+'&userPwd='+userPwd+'&actionPath=/base/updateSysParam';
		   Ext.Ajax.request({
					url : '../forex/checkUserRight.action',
					params : params,
					callback:function(opts,success,response){
						data = response.responseText;
						if(success){// 回调函数
							eforexGrid.AuthCallBackFunc(data);
						}}
					});
	    },
	    
	    AuthCallBackFunc:function(data){
	    	Ext.MessageBox.hide();// 回调执行完毕ok
	    	var code=data.substring(0,4);// 4位有效长度
			var pos=data.indexOf('|');
			if(code!='0000'){// 远期，掉期远端，返回码0000 成功
			 	alert('错误:'+data.substring(pos+1,data.length));
			 	return;
			}else {
			    alert(data.substring(pos+1,data.length));// 正确信息
			}
			contentWa.setContent('');// 清除面板数据
	    	dialogWa.hide();// 授权窗口隐藏起来
	    	eforexGrid.doUpdateSystem();
	    },
	    
	    doUpdateSystem:function(){// 系统参数修改实际操作，前面进行授权验证
			var formEl = content.getEl().child("form").dom;	
			Ext.MessageBox.wait('数据保存中...','请稍后...');
			Ext.lib.Ajax.formRequest(formEl, '../base/updateSysParam.action',
            {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
	    },
	    
	    doAuthCancleBtn:function(){
	    	contentWa.setContent('');// 清除面板数据
	    	dialogWa.hide();
	    },
		commentSuccessPassword:function(o){
	    	var data = o.responseText;
			if(data=='relogin'){
				alert("密码初始化成功，请重新登录");
				window.close();
//				window.opener.close();
				window.opener.location.href = '/base/Login.jsp';
			}else if(data == 'true'){
				Ext.Msg.alert("提示","密码初始化成功");
			}else if(data == 'false'){
				Ext.Msg.alert("提示","密码初始化失败");
			}else{
				Ext.Msg.alert("提示",data+123);
			}
			
		},
		commentSuccessPasswordForBranch:function(o){
	    	var data = o.responseText;
			if(data=='relogin'){
				alert("密码初始化成功，请重新登录");
				window.close();
				window.opener.location.href = '/base/Login.jsp';
			}else if(data == 'true'){
				Ext.Msg.alert("提示","密码初始化成功");
			}else if(data == 'false'){
				Ext.Msg.alert("提示","密码初始化失败");
			}else{
				Ext.Msg.alert("提示",data);
			}
		},
		commentSuccess : function(o){
			var data = o.responseText;
			Ext.MessageBox.hide();
			if(data){
				if(data.indexOf('html')!= -1 || data.indexOf('total') != -1){
					try{
						var RoleRight = Ext.get("RoleRight").dom.value;
					}catch(e){
					}
					if(RoleRight && RoleRight=='true'){
						var appid = Ext.get("role.appid").dom.value;
						var roleid = Ext.get("role.roleid").dom.value
						eforexGrid.loadApplRightGrid(appid , roleid);
						alert('权限设置成功,请继续...');
					}else{
						if(infoDlg){
							infoDlg.hide();
						}
						eforexGrid.refresh();
					}
				}else if(data.indexOf('ERROR')!= -1){
				     Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));
				}else if(data.indexOf('TipOk')!= -1){
				     Ext.MessageBox.alert('提示',data.substring(data.indexOf('TipOk')+5));
				     eforexGrid.refresh();		
				}else if(data.indexOf('ACCRESULT')!= -1){
					 //1|1|0|success;2|1|0|success;actcrt|299
				     var accdate = "";
				     if(data.indexOf('#ACTCRT#')!= -1){
					 	accdate = data.substring(data.indexOf('ACCRESULT')+9,data.indexOf('#ACTCRT#'));
					 }else{
					 	accdate = data.substring(data.indexOf('ACCRESULT')+9);
					 }
					 var receiptNo = data.substring(data.indexOf('#ACTCRT#')+8);
					 var temp = "";
				     var rultArr = accdate.split(";");
				     for(var i=0;i<rultArr.length-1;i++){
							var rultArr2 = rultArr[i].split("\|");		
							if(rultArr2[0] == ACC_RESULT_FLAG_DK){
								temp += "对客交易";
							}else if(rultArr2[0] == ACC_RESULT_FLAG_ZF){
								temp += "分总交易";
							}else if(rultArr2[0] == ACC_RESULT_FLAG_ECCZ){
							    temp += "再次扣账";
							}
							
							if(rultArr2[1] == ACCPROCE_STATUS_INIT){
							   temp +="  交易和账务未生成！";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_SUCCESS){
							   temp +="  交易和账务生成成功！";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_EXCEPTION){
							   temp +="  交易和账务生成失败！";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_NOTDO){
							   temp +="  交易和账务无需生成！";
							}  
							if(rultArr2[1] == 4){
							   temp +="  交易和账务生成未知状态！";
							}
							temp += "<br/> 返回码："+  rultArr2[2];
							temp += "<br/> 返回信息："+  rultArr2[3];
							temp += "<hr width='250' align='left' color='blue'/>";
							//temp += "<a href class='linkStyle' onClick='javacript:alert(1);'>xxxxxxxxxxxxxxxx</a>";
							//alert(temp);
				     }
				      if(data.indexOf('#ACTCRT#')!= -1){
				     	if(parseInt(receiptNo) == 0 ){
				     		Ext.MessageBox.alert('交易和账务发送结果',temp);
				     	}else if(parseInt(receiptNo) == -1){
				     	   	 temp += "交割回单生成结果","交割回单生成失败！请暂时手动出单，或者联系管理员谢谢！！";
				     	   	 Ext.MessageBox.alert('交易和账务发送结果',temp);
				     	}else{
						     var url = "/forex/printOutActCustReceipt.action?actCustReceipt.receiptNo="+receiptNo;
							 temp += "<a href onClick=eforexGrid.myPrint('"+url+"')>点击[是]打印客户回单</a>";
					   		 Ext.Msg.confirm("请确认是否打印客户回单", temp, function(button,text){
								if(button=='yes'){
											var url = "/forex/printOutActCustReceipt.action?actCustReceipt.receiptNo="+receiptNo;
											eforexGrid.myPrint(url);
								}else{
										    
								}
							});
					   }
				     }else{
				         Ext.MessageBox.alert('交易和账务发送结果',temp);
				     }

				     eforexGrid.refresh(); 			
				}else{
					 Ext.get('msg').dom.innerHTML='';
					 if(Ext.get('msg').dom.style.display = "none") {
					 	Ext.get('msg').dom.style.display = "block";
					 }
					 var str="<img src='../images/default/form/exclamation.gif 'width='16' height='16' align='absmiddle' /><font color='red'>"+data+"</font>";
					 Ext.get('msg').dom.innerHTML=str;
					 infoDlg.setContentSize(content.getEl().dom.scrollWidth,content.getEl().dom.scrollHeight);
				 }
			}else{
				eforexGrid.refresh();
			}
        },
        showDeliveryPrintPage : function(){
        	
        },
        commentFailure : function(o){
        	Ext.MessageBox.hide();
        	Ext.MessageBox.alert('错误','服务器错误,数据提交失败');
        	if(infoDlg){
        		infoDlg.hide();
        	}
        },
        
        initAuthDialog:function(){
	  		    dialogWa= new Ext.LayoutDialog("authDiv", {// 通过div层创建对话框
			            modal: true,
			            resizable : false,
			            width:450,
			            height:425,
		            	shadow:true,
			            minWidth:500,
			            minHeight:350,
			            proxyDrag:false,          
			            // layout config merges with the dialog config
			            center:{
			            	autoScroll:false,
			                tabPosition: "left",
			                alwaysShowTabs: false
			            }
			    });
				btnWa = dialogWa.addButton('确定');
				cancelBtnWa = dialogWa.addButton('取消');
				contentWa = new Ext.ContentPanel('auth',{autoCreate : true,fitToFrame:false});
			    dialogWa.setTitle("交易授权验证");        // 对话框设置TITLE标题
			    btnWa.setHandler(eforexGrid.doAuthTradeBtn,dialogWa);// 提交按钮处理器
			    cancelBtnWa.setHandler(eforexGrid.doAuthTradeCancleBtn, dialogWa);
	  },
        
      checkAuthRight:function(){
	    	var tradeLoadCb = function(e,b,o){
				dialogWa.setContentSize(360,contentWa.getEl().dom.scrollHeight);// 控制授权窗口显示大小
		    };
	          if(!dialogWa){// 授权窗口
	                  this.initAuthDialog();
	           }
			    var layoutWa = dialogWa.getLayout();
	    	    layoutWa.beginUpdate();
			    layoutWa.add('center',contentWa);
	            var update = contentWa.getUpdateManager(); // 面板更新器设置
				update.update({
					   url:'/base/Auth.jsp',
				       params:{},
				       callback:tradeLoadCb,// 回调函数
				       nocache:true,
					   scope:this		
				});     // 提交后台刷新数据
				layoutWa.endUpdate();
				dialogWa.show();   // 对话框显示
	    },
	    
	    doAuthTradeBtn:function(){
	    	// 赋值到冲正 页面数据中去，并执行下去，需要初步验证非自身柜员
	    	var userId=Ext.get('authUser').dom.value;
	    	var userPwd=Ext.get('authPwd').dom.value;
	    	// 取输入的授权柜员，口令,如何验证。都可以此步骤完成
	    	Ext.MessageBox.wait('授权信息验证中...','请稍后...');// 滚动条效果
	    	// TradeCalc.checkUserRight(userId,userPwd,'/forex/updateOneTradeInfo',eforexGrid.AuthTradeCallBackFunc);
	    	// Add by wdw 20101217 21:58 dwr改造
		   var params = 'userId='+userId+'&userPwd='+userPwd+'&actionPath='+actionPath;
		   Ext.Ajax.request({
					url : '../forex/checkUserRight.action',
					params : params,
					callback:function(opts,success,response){ 
						data = response.responseText;
						if(success){// 回调函数
							eforexGrid.AuthCallBackFunc(data);
						}}
					});
	    },
	   AuthCallBackFunc:function(data){
			    	Ext.MessageBox.hide();//回调执行完毕ok
			    	var code=data.substring(0,4);//4位有效长度
					var pos=data.indexOf('|');
					if(code!='0000'){//远期，掉期远端，返回码0000 成功
					 	Ext.Msg.alert('提示','错误:'+data.substring(pos+1,data.length));
					 	return;
					}else {
					    Ext.Msg.alert('提示',data.substring(pos+1,data.length));//正确信息
					}
					contentWa.setContent('');//清除面板数据
			    	dialogWa.hide();//授权窗口隐藏起来
			    	//进行逻辑判断，启用一个授权 全局变量标识何种交易授权
			    	eforexGrid.authCommit();//授权后执行此步操作，关键句
			    	
		 },
		 authCommit : function(){
		 },
	    
	    doAuthTradeCancleBtn:function(){
	    	contentWa.setContent('');// 清除面板数据
	    	dialogWa.hide();
	    },
	    
	    callRoleAuthUpdate:function(){// 角色授权回调
				eforexGrid.initRoleRightGrid();
				infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);  // 对话框
																							// 大小设置
	    },
	    
	    doRoleAuthUpdate:function(){
	    	        this.doInitDialg();
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		           // btn.setHandler(eforexGrid.updateInfo,
					// infoDlg);//重新绑定特点处理函数
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
				    var callBackFunc = function(e,b,o){
	                     eval(Ext.get('updateBtn').dom.getAttribute('doCallBackFunc'));	// 执行的回调函数
				    };
		           	
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
					layout.endUpdate();
		            infoDlg.show();
	    },
	    
	 callBackPrintGetInfo : function(){ 
		   infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);  // 对话框
																															// 大小设置
	  },
	  
	 callBackSpotTradeCzAndStatusUpdate:function(){// 主要操作对象 otherbtn
													// 作用,控制窗体大小注意
      	   if(document.getElementById('czEnabled') && document.getElementById('czEnabled').value.trim()=='true'){// 可以冲正
		      otherbtn.enable();
		   }
		   
		   if(document.getElementById('kondorEnabled') && document.getElementById('kondorEnabled').value.trim()=='true'){// 可以冲正
		      kondorbtn.enable();
		   }
		   infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);  // 对话框
																															// 大小设置
	  },	  
	  
	  

        
        sendOneToKondor:function(){
        	var formEl = content.getEl().child("form").dom;	
			Ext.MessageBox.wait('数据保存中...','请稍后...');
	    	Ext.lib.Ajax.formRequest(formEl, "/forex/sendOneTradeInfo.do",
            {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
            infoDlg.hide();
        },
        
	    printContainterEforex:function(){
	    	  var PrintWin=window.open('about:blank','打印详细');
		      PrintWin.document.write('<object id="WebBrowser" width=0 height=0 classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>' + 
		      document.getElementById("containerPrintXX").innerHTML);
		      PrintWin.document.all.WebBrowser.ExecWB(6,1); // 打印
		      PrintWin.close();
		      // PrintWin.document.all.WebBrowser.ExecWB(7,1);//打印预览
		      return;
		  },        
        
       doPrintGetInfo:function(){					// 打印功能
       	 if(selectModel.hasSelection()) {  
	       this.doInitDialg();
	        if(!otherbtn){
	            otherbtn = infoDlg.addButton('打印'); 
				otherbtn.setHandler(eforexGrid.printContainterEforex,infoDlg);// 提交按钮处理器
				// otherbtn.disable();
	        }
	        // var
			// lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
	        // infoDlg.setTitle( lableName );
	        var layout = infoDlg.getLayout();
	        layout.beginUpdate();
	        layout.add('center',content);
	        var params = eforexGrid.createParam();
	        params=params+'getinfo=1&'; 
	        var update = content.getUpdateManager();
		    var callBackFunc = function(e,b,o){
	             eval(Ext.get('getinfoBtn').dom.getAttribute('doCallBackFuncPrint'));	// 执行的回调函数
// if(document.getElementById('changeTransStatusEnabled') &&
// document.getElementById('changeTransStatusEnabled').value.trim()=='true'){//可以进行头寸拆分操作
// btn.enable();
// }else{
// btn.disable();
// }
		    };
	       	
			update.update(Ext.get('getinfoBtn').dom.getAttribute('url'),params,callBackFunc); 
	       	layout.endUpdate();
	        infoDlg.show();
	        	        }else{
                Ext.MessageBox.alert('提示','请选中要查看的记录。');	        	
	        }
        },         
      dozqTradeUpdate:function(){					// 择期状态修改
      	if(selectModel.hasSelection()){
        	var type=selectModel.getSelected().get('type');
        	if(Number(type)!= 0 && Number(type)!=8  && Number(type)!=6){
        		Ext.MessageBox.alert('提示','对应交易已冲正');
        		return ;
        	}
                   this.doInitDialg();
		            if(!otherbtn){
			            otherbtn = infoDlg.addButton('冲正');
						otherbtn.setHandler(eforexGrid.updateTradeInfo,infoDlg);// 提交按钮处理器
						otherbtn.disable();
		            }
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
				    var callBackFunc = function(e,b,o){
				    	 eval(Ext.get('updateBtn').dom.getAttribute('doCallBackFunc'));	// 执行的回调函数
				    	 infoDlg.setContentSize(400,336);// 固定页面大小
				    };
		           	
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		   }else{
		         	Ext.MessageBox.alert('提示','请选中要择期交割的记录。');
		         }
        },        

        doCheckTradeTypeStatusUpdate:function(){
        	var type=selectModel.getSelected().get('type');
        	if(Number(type)!= 0 && Number(type)!=8){
        		Ext.MessageBox.alert('提示','对应交易已冲正');
        		return ;
        	}
                    this.doInitDialg();
                    var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		            var callBackFunc = function(e,b,o){
		            	if(document.getElementById('changeTransStatusEnabled') && document.getElementById('changeTransStatusEnabled').value.trim()=='true'){// 可以进行头寸拆分操作
		            	     btn.enable();
		            	}else{
		            		 btn.disable();
		            	}
	                     infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
				    };
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
					layout.endUpdate();
					// infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);
		            infoDlg.show();
        },
        
        
        doPrint: function(){
        	if(!selectModel.hasSelection()){  
	      		Ext.MessageBox.alert('提示','请选中您要处理的交易记录。');
	      		return;
	      	}
	      	 if(!infoDlg){
	        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
	                    modal:true,
	                    width:400,
	                    height:450,
	                    shadow:true,
	                    proxyDrag: true,
	                    center: {	              
	                    	animate: true,
	                        autoScroll:true
	                    }
	            });
	            printBtn = infoDlg.addButton('打印',eforexGrid.printContainter);
	            infoDlg.addButton('关闭', infoDlg.hide, infoDlg);
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'交易信息':Ext.get('updateBtn').dom.getAttribute('lableName');
      		infoDlg.setTitle( lableName );
        	var layout = infoDlg.getLayout();
       	 	layout.beginUpdate();
        	layout.add('center',content);
        	var params = eforexGrid.createParam();
        	 var callBackFunc = function(e,b,o){
	            infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
        	 }
      	    var update = content.getUpdateManager();
      	    update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
			layout.endUpdate();
			// infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);
	        infoDlg.show();
        },
        
	    doProccessTrade:function(){
	      	if(!selectModel.hasSelection()){  
	      		Ext.MessageBox.alert('提示','请选中您要处理的交易记录。');
	      		return;
	      	}
	        if(!infoDlg){
	        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
	                    modal:true,
	                    width:400,
	                    height:450,
	                    shadow:true,
	                    proxyDrag: true,
	                    center: {	              
	                    	animate: true,
	                        autoScroll:true
	                    }
	            });
	            infoDlg.addButton('关闭', infoDlg.hide, infoDlg);
				printBtn = infoDlg.addButton('打印',eforexGrid.printContainter);
	            btn = infoDlg.addButton('确认');
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
		    btn.setHandler(infoDlg.hide, infoDlg);
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
	        infoDlg.setTitle( lableName );
	        var layout = infoDlg.getLayout();
	        layout.beginUpdate();
	        layout.add('center',content);
	        var params = eforexGrid.createParam();
	        var update = content.getUpdateManager();
	        var callBackFunc = function(e,b,o){
	            infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
	        };
			update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
			layout.endUpdate();
	        infoDlg.show();
	    },
        
        doInitDialg:function(){
        	       if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:400,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            btn.setHandler(eforexGrid.updateInfo, infoDlg);
		            btn.disable();
        },
		getInTradeCheckInfo: function(){
			if(Ext.get('inTradeCheckBtn')==null){
        		Ext.MessageBox.alert('提示','记录集符合操作');
        		return;
        	}
        	if(Ext.get('inTradeCheckBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('inTradeCheckBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
		        	  var dlgTabs = Ext.get("dlgTabs");
					  if(dlgTabs){
					  	cbCounter = 0; 
						if(!infoDlg){
							infoDlg = new Ext.LayoutDialog('my-dlg', { 
				                    modal:true,
				                    width:360,
				                    shadow:true,
				                    proxyDrag: true,	                    
				                    center: {
				                        autoScroll:false,
				                        tabPosition: 'top',
				                        alwaysShowTabs: true
				                    }
				            });
				             btn = infoDlg.addButton('通过');
					         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
				        }
				        btn.setHandler(eforexGrid.doAllAction, infoDlg);
				        btn.enable();
				        infoDlg.setTitle('核实');
				       	var layout = infoDlg.getLayout();
			            layout.beginUpdate(); 
			            var region = layout.getRegion("center");    
			            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
			            if(!region.getTabs()){	            	          
						    for(var i=0; i<eles.length; i++){
							   if(i ==0){
				        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
				        		   layout.add('center',content);
				        	   }else{
				        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
				        	   }
				            }       
			            }	        
			            for(var i=1; i<eles.length; i++){
			            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
			            	 var panelUpdate = panel.getUpdateManager();   
					         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
			            }   	                  	    
			            var params = eforexGrid.createParam();
			            var update = content.getUpdateManager(); 
			            update.update(Ext.get('inTradeCheckBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
			           	layout.endUpdate();
					 }else{
		        		if(!infoDlg){
				        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
				                    modal:true,
				                    width:360,
				                    height:450,
				                    shadow:true,
				                    proxyDrag: true,
				                    center: {	              
				                    	animate: true,
				                        autoScroll:true
				                    }
				            });
			            var action = Ext.get('inTradeCheckBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('通过');
			            infoDlg.addButton('不通过',function(){eforexGrid.doInputCheck(1)}, infoDlg);
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }
			            if(btn1) {
				        	btn1.show();
				        }
			            btn.setHandler(function(){eforexGrid.doInputCheck(3)}, infoDlg);
			            btn.enable();
			            var lableName=Ext.get('inTradeCheckBtn').dom.getAttribute('lableName')==undefined?'复核':Ext.get('inTradeCheckBtn').dom.getAttribute('lableName');
			            infoDlg.setTitle( lableName );
			            var layout = infoDlg.getLayout();
			            layout.beginUpdate();
			            layout.add('center',content);
			            var params = eforexGrid.createParam();
			            var update = content.getUpdateManager();
						update.update(Ext.get('inTradeCheckBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
						// 控制diaglog对话框实际大小
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
			           	layout.endUpdate();
					   }
			           infoDlg.show();
			         }else{
			         	Ext.MessageBox.alert('提示','请选中要进行复核的交易记录。');
			         }
	        }
		},
		doInputCheck : function(inTradeState){
			if(document.getElementById("operStr")){
				eforexGrid.getOperStr();
			}
			var formEl = content.getEl().child("form").dom;	
//			formEl.action = formEl.action.replace('doTrade.action','doInputTradeCheck.action?trade.inTradeState='+inTradeState);
			if(Ext.get('inTradeCheckBtn').dom.getAttribute('url').indexOf('type=2')!=-1){
				tradeType = 'forwardTrade';
			}else if(Ext.get('inTradeCheckBtn').dom.getAttribute('url').indexOf('type=0')!=-1){
				tradeType = 'trade';
			}else if(Ext.get('inTradeCheckBtn').dom.getAttribute('url').indexOf('type=4')!=-1){
				tradeType = 'swapTrade';
			}
			var tempAction = Ext.get('inTradeCheckBtn').dom.getAttribute('action')+'?'+tradeType+'.inCheckState='+inTradeState;
			Ext.MessageBox.wait('数据保存中...','请稍后...');
			Ext.lib.Ajax.formRequest(formEl, tempAction,
                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
			infoDlg.hide();
		},
        getBreachInfo:function(isFource){// 通过拦截使用的处理函数进行自由控制
        var butnoName;
        var titleMes;
        if(isFource==1){
			   butnoName='fbreachBtn';  
			   titleMes='强制违约'   
			   }
		else{
			  butnoName='breachBtn';  
			   titleMes='违约'    
			   }
        	if(Ext.get('breachBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('breachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('breachBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        		var calAmt = selectModel.getSelected().get('calAmount');
		            var amt1 = Math.abs(selectModel.getSelected().get('amount1'));
		            var amt2 = Math.abs(selectModel.getSelected().get('amount2'));
		            var surplusamt1 = selectModel.getSelected().get('surplusamount1');
		            var isFarDelivery=selectModel.getSelected().get('isFarDelivery');
		            var tranType=selectModel.getSelected().get('tranType');
			        if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			           	Ext.MessageBox.alert('提示','请选择特殊交易类型为【普通交易】发起'+titleMes);
			           	return;
			        }
		            if(isFarDelivery == 1){
		           		Ext.MessageBox.alert('提示','掉期近端不允许发起'+titleMes);
		            	return;
		            }
		             var breachInit = function(e,b,o){
		            	if(specialTradeContext){
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		            		specialTradeContext.initBreach();
		            	}
		            };
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:650,
			                    height:550,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(650,550);
			        }
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle(titleMes);
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get(butnoName).dom.getAttribute('url'),params,breachInit);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:650,
			                    height:550,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get(butnoName).dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(650,550);
			        }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(function(){eforexGrid.doBreach(isFource)}, infoDlg);
		            btn.enable();
		            var lableName=Ext.get(butnoName).dom.getAttribute('lableName')==undefined?titleMes:Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get(butnoName).dom.getAttribute('url'),params,breachInit);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		           	if(myInfoDlg)myInfoDlg.setTitle(lableName);
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行违约的交易记录。');
		         }
	        }
        
        	
        },
        
        getEraseInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('eraseBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('eraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eraseBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '0'){
	        			Ext.MessageBox.alert('提示','请选中代客交易进行冲正');
	            		return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('eraseBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }else{
			        	 infoDlg.setContentSize(360,450);
			        }
			        if(otherbtn)otherbtn.hide();
			        if(relationBtn)relationBtn.hide();
			        if(btn)btn.show();
				    infoDlg.setContentSize(360,450);
				     btn.setHandler(eforexGrid.authErase, infoDlg);
		            btn.enable();
		            if(Ext.get('eraseBtn').dom.getAttribute('url').indexOf('&type=3')>0){
		            	var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'远期冲正':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            }else if(Ext.get('eraseBtn').dom.getAttribute('url').indexOf('&type=5')>0){
		            	var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'掉期冲正':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            }else{
		            	if(selectModel.getSelected().get('specialType') == 12 || selectModel.getSelected().get('specialType') == 3){
		            		 var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'违约冲正':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            	}else{
		           			 var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'隔日冲正':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            	}
		            }
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		            if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
	        }
        },
        
        //add by mzb  20130826 T+N冲正
        getTNEraseInfo:function(){// 通过拦截使用的处理函数进行自由控制
      	if(Ext.get('tnEraseBtn')==null){
      		Ext.MessageBox.alert('提示','记录集不允许直接修改');
      		return;
      	}
      	if(Ext.get('tnEraseBtn').dom.getAttribute('doFunc')!=null){
      		eval(Ext.get('tnEraseBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '40'){
	        			Ext.MessageBox.alert('提示','请选中即期T+N交易进行冲正');
	            		return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('tnEraseBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('tnEraseBtn').dom.getAttribute('lableName')==undefined?'T+N交易冲正':Ext.get('tnEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('tnEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
	        }
      },
     
        getDeptEraseInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('deptEraseBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('deptEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deptEraseBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('提示','请选中内部交易进行冲正');
	            		return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('deptEraseBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('deptEraseBtn').dom.getAttribute('lableName')==undefined?'内部交易冲正':Ext.get('deptEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('deptEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
	        }
        },
        
        getRmbDeptPropertiesInfo:function(){
        	if(Ext.get('rmbDeptPropertiesBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('提示','请选中内部交易进行属性变更');
	            		return;
	        		}
	        		if(selectModel.getSelected().get('typeStr') == '即期交易冲正'
	        			||  selectModel.getSelected().get('eraseNo') != '0'){
	        			Ext.MessageBox.alert('提示','冲正交易不能进行资金属性变更');
	        			return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
	        		var btnFuc = function(){
	        			if(Ext.get('trade.serialNo')){
	        				eforexGrid.updateDeptPropertyAuth();
	        			}else{
	        				eforexGrid.myCloseDlg();
	        			}
	        		}
	        		if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				    btn.setHandler(btnFuc, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('lableName')==undefined?'资金属性变更':Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行修改的交易记录。');
		         }
	        }
        },
        
    	getDeliveryedEraseInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('delveryedEraseBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('delveryedEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('delveryedEraseBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '0'
	        			&& selectModel.getSelected().get('itemId') != '40'){
	        			Ext.MessageBox.alert('提示','请选中代客交易进行冲正');
	            		return;
	        		}
	        		if(selectModel.getSelected().get('specialType')!='1'&&selectModel.getSelected().get('specialType')!='0'){
	        			Ext.MessageBox.alert('提示','特殊交易产生的即期不能发起交割后冲正');
	            		return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('delveryedEraseBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authDeliveryedErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('delveryedEraseBtn').dom.getAttribute('lableName')==undefined?'交割后冲正':Ext.get('delveryedEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('delveryedEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
	        }
        },
        
        getDeptDeliveryedEraseInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('deptDelveryedEraseBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('提示','请选中内部交易进行冲正');
	            		return;
	        		}
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('deptDelveryedEraseBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('关闭', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authDeliveryedErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('deptDelveryedEraseBtn').dom.getAttribute('lableName')==undefined?'内部交易交割后冲正':Ext.get('deptDelveryedEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
	        }
        },
        
        getResendIsInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('resendIsBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('resendIsBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('resendIsBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('补发国结');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('resendIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('resendIsBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doResendIs, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('resendIsBtn').dom.getAttribute('lableName')==undefined?'补发国结':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('resendIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行补发国结的交易记录。');
		         }
	        }
        },
        
        getReverseIsInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('reverseIsBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('reverseIsBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('reverseIsBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('反向平盘');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('reverseIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('reverseIsBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doReverseIs, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('reverseIsBtn').dom.getAttribute('lableName')==undefined?'反向平盘':Ext.get('reverseIsBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('reverseIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行反向平盘的交易记录。');
		         }
	        }
        },
        
        getGapInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('doGapBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('doGapBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('doGapBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('差额平盘');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('doGapBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('doGapBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doGapTrade, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('doGapBtn').dom.getAttribute('lableName')==undefined?'差额平盘':Ext.get('doGapBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('doGapBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行差额平盘的交易记录。');
		         }
	        }
        },
        
        getDurationInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('durationBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('durationBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('durationBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        		if(Ext.get('durationBtn').dom.getAttribute('url').indexOf("&ery=true")>0){
		        		if(selectModel.getSelected().get('surplusamount1') != 0 || selectModel.getSelected().get('surplusamount2')!=0 ){
		        			Ext.MessageBox.alert('提示','请选中未处理交易进行提前展期');
		            		return;
		        		}
	        		}else{
	        			 if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
				           	Ext.MessageBox.alert('提示','请选择特殊交易类型为【普通交易】发起展期');
				           	return;
			        	}
	        		}
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(360,450);
			        }
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('展期');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('durationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('durationBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(360,450);
			        }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doDuration, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('durationBtn').dom.getAttribute('lableName')==undefined?'展期':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('durationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行展期的交易记录。');
		         }
	        }
        },

        getFarDurationInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('farDurationBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('farDurationBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('farDurationBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        	if( selectModel.getSelected().get('isFarDelivery')!=2){	
	        			Ext.MessageBox.alert('提示','请选中远端到期的交易进行远端展期');
	            		return;
	            }
	        	if(Ext.get('farDurationBtn').dom.getAttribute('url').indexOf("&ery=true")>0 ){
	        		if( selectModel.getSelected().get('surplusamount1')!=0 ||selectModel.getSelected().get('surplusamount2')!=0 ){
	            		Ext.MessageBox.alert('提示','请选中未处理交易进行提前展期');
		            	return;
	            	}	
	        	}
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(360,450);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('远端展期');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('farDurationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:360,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('farDurationBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(360,450);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doFarDuration, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('farDurationBtn').dom.getAttribute('lableName')==undefined?'远端展期':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('farDurationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行远端展期的交易记录。');
		         }
	        }
        },
		getAllBreachInfo : function(isFource){// 通过拦截使用的处理函数进行自由控制
		    var butnoName;
        	var titleMes;
        	if(isFource==1){
			   butnoName='fallBreachBtn';  
			   titleMes='强制全部违约'   
			   }
			else{
			  butnoName='allBreachBtn';  
			   titleMes='全部违约'    
			   }
        	if(Ext.get('allBreachBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('allBreachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('allBreachBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){ 
	        		var calAmt = selectModel.getSelected().get('calAmount');
		            var amt1 = Math.abs(selectModel.getSelected().get('amount1'));
		            var amt2 = Math.abs(selectModel.getSelected().get('amount2'));
		            var surplusamount1 = selectModel.getSelected().get('surplusamount1');
		            if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			         	Ext.MessageBox.alert('提示','请选择特殊交易类型为【普通交易】发起全部违约');
			           	return;
			     	}
		            var allBreachInit = function(e,b,o){
		            	if(specialTradeContext){
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		            		specialTradeContext.initAllBreach();
		            	}
		            };
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:480,
			                    height:500,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get(butnoName).dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(480,500);
			        }
		            if(btn1) {
			        	btn1.show();
			        }
		            infoDlg.on("hide", function() {
		            	eforexGrid.stopTimer();
					});
		            btn.setHandler(function(){eforexGrid.doAllBreach(isFource)}, infoDlg);
		            btn.enable();
		            var lableName=Ext.get(butnoName).dom.getAttribute('lableName')==undefined?titleMes:Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName +showtimeSpan);
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		           
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get(butnoName).dom.getAttribute('url'),params,allBreachInit);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		           // eforexGrid.timer();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
	        		 
	        	}else{
		         	Ext.MessageBox.alert('提示','请选中要进行违约的交易记录。');
		         }
	        }
        },
         doAllBreach : function(isFource){
        	// var amountflag=eforexGrid.checkTradePositionAmount2();
        	// if(!amountflag){
        	// return;
        	// }
        	
        	if(Ext.get("allBreachTrade.nearCustLongPoints").dom.value=="" || Ext.get("allBreachTrade.nearCustLongPoints").dom.value=="NaN.00" ){
				Ext.MessageBox.alert('提示','全部违约客户升贴水不能为空');
			return;
			}
        	var amountflag=eforexGrid.checkDLFunc("allBreachTrade.instrument"); //Kgr选择
         	if(!amountflag){
         		return;
         	}
       		 var amountflag=eforexGrid.checkDLFunc("allBreachTrade.marginCode"); //保证金货币
         	if(!amountflag){
         		return;
         	}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
//				if(!valiAllBreachTradeElement()){
//					return;
//				}
				if(isFource==1){//强制违约
					 eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_ALL_BREACH,'fallBreachBtn');
				}else{
				    eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_ALL_BREACH,'allBreachBtn');
				}
			}
        }, 
         initTradeAuthPage : function(serialNo,typeStr){
         	if(Ext.get('tradeAuth.serialNo'))$('tradeAuth.serialNo').value=serialNo;
			if(Ext.get('tradeAuth.typeStr'))$('tradeAuth.typeStr').value=typeStr;
         },
         doTradeApply : function(serialNo,type){
        	 if(infoDlg)infoDlg.hide();
         	if(Ext.get('useMemo'))var useMemo= Ext.get('useMemo').dom.value;
         	var params = 'sqlParam.tempSerial='+serialNo+'&sqlParam.type='+type+'&useMemo='+useMemo;
         	var url = '../base/insertTradeApply.action';
         	Ext.MessageBox.wait('申请中...','请稍后...');
         	 Ext.Ajax.request({
					url : url,
					params : params,
					callback:function(opts,success,response){
						if(success){// 回调函数
							Ext.MessageBox.alert('提示','申请成功，等待子行审核!');
						}}
					});
         },
        showApplyPage : function(serialNo,type,flag){//交易授权申请页面初始化   xujie 2014-01-23
        var width1=450;
        var height1=250;
        //if(flag=='earlyBreach'){
        	//width1=670;
        	//height1=500;
        //}else if(flag=='breach'){
        	//width1=650;
        	//height1=550;
        //}else if(flag=='allBreach'){
        	//width1=480;
        	//height1=550;
        //}else if(flag=='duration'||flag=='farduration'||flag=='earse'){
        	//width1=500;
        	//height1=450;
        //}else if(flag=='earlyDelivery' ||flag=='earlyswapDelivery'){
        	//width1=600;
        	//height1=400;
        //}else if(flag=='delivery'){
        	//width1=500;
        	//height1=450;
        //}else if(flag=='deliveryCancel'){
        	//width1=500;
        	//height1=450;
        //}
        
        if(!infoDlg){
         infoDlg= new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:width1,
			                    height:height1,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			        	 btn = infoDlg.addButton('确定');
			        	 cbtn= infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			         	content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			}else{
			 infoDlg.setContentSize(width1,height1);
			
			}
			        if(flag=='earse'||flag=='getDealInfo'){
			        	if(otherbtn){
			        	otherbtn.hide();
			        	}
			        	if(btn)btn.show();
			        	if(relationBtn)relationBtn.hide();
			        }
			        btn.setHandler(function(){eforexGrid.doTradeApply(serialNo,type)}, infoDlg.hide);
			        btn.enable();
				    infoDlg.setTitle('交易申请');
				    var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
			    var update = content.getUpdateManager();
			    var params='sqlParam.tempSerial='+serialNo+'&sqlParam.type='+type;
			    update.update({
					   url:'../base/getTradeApplyDetail.action',
					   params:params,
					   scope:this		
				});     
			    layout.endUpdate();
		        infoDlg.show();
		        //if(infoDlg){
		        //infoDlg.setTitle('交易申请');
		        //}
        },
        checkIfSpot	:function(){//即期只有违约或提前违约生成的特殊交易冲正才需要交易申请,远掉期冲正都需要交易申请
        	  if(selectModel.hasSelection()){
        	  	 var type = parseInt(selectModel.getSelected().get('type'));
        	  	 if(type==0){
        	  	 	// var specialType = parseInt(selectModel.getSelected().get('specialType'));
        	  	 	 //if(specialType==3|| specialType==12){
        	  	 	 	//eforexGrid.checkExamineMessage(0,'earse');
        	  	 	 //}else{
        	  	 	 	eforexGrid.getEraseInfo();
        	  	 	 //}
        	  	 }else{
        	  	 	eforexGrid.checkExamineMessage(0,'earse');
        	  	 }
        	  
        	  }
        },
         checkExamineMessage : function(ifFource,flag){//检查特殊交易是否已经有审核记录  xujie 2014-01-23
         var serialNo;
         var type;
         var alertMessage='';
         if(ifFource=='1')alertMessage='强制';
         if(flag=='earlyBreach')alertMessage=alertMessage+'提前违约';
		if(flag=='breach')alertMessage=alertMessage+'违约';
		if(flag=='allBreach')alertMessage=alertMessage+'全部违约';
		if(flag=='duration')alertMessage=alertMessage+'提前展期';
		if(flag=='farduration')alertMessage=alertMessage+'到期展期';
		if(flag=='earlyDelivery')alertMessage=alertMessage+'提前交割';
		if(flag=='earlyswapDelivery')alertMessage=alertMessage+'提前交割';
		if(flag=='earse')alertMessage=alertMessage+'冲正';
		if(flag=='delivery')alertMessage=alertMessage+'交割';
		if(flag=='deliveryCancel')alertMessage=alertMessage+'交割撤销';
         if(selectModel.hasSelection()){
         	if(flag=='deliveryCancel'){
         	serialNo= selectModel.getSelected().get('sourceNo');
         	type = selectModel.getSelected().get('sourceType');
         	state = selectModel.getSelected().get('state');
         	if(state == 1){
         		Ext.MessageBox.alert('提示','该交割记录已撤销！');
        		return ;
         	}
         	}else if(flag=='getDealInfo'){
         		if(Ext.get('forwardTrade.serialNoInt')){
         		serialNo=Ext.get('forwardTrade.serialNoInt').dom.value;
         		type=Ext.get('forwardTrade.type').dom.value;
         		}	
         		if(Ext.get('swapTrade.serialNoInt')){
         		serialNo=Ext.get('swapTrade.serialNoInt').dom.value;
         		type=Ext.get('swapTrade.type').dom.value;
         		}	
         	
         	}else{
         	 serialNo= selectModel.getSelected().get('serialNo');
         	 type = selectModel.getSelected().get('type');
         	 }
		 var typeStr = selectModel.getSelected().get('typeStr');
          var flag_=1;//
			var params = 'sqlParam.tempSerial='+serialNo+'&sqlParam.type='+type+'&sqlParam.flag='+flag_;
         	var url = '../base/getTradeAuthList.action';
         	 Ext.Ajax.request({
					url : url,
					params : params,
					callback:function(opts,success,response){
						if(success){// 回调函数
							if(response.responseText.indexOf('serialNo')==-1){
							Ext.Msg.confirm("请确认", "确定要发起特殊交易申请？", function(button,text){   
								if(button=='yes'){
								eforexGrid.showApplyPage(serialNo,type,flag);
								}else{
								if(infoDlg)infoDlg.hide();
								}
							  });
							}
							else{
								if((Ext.decode(response.responseText).data)[0].applyState==0){//子行未审核
									if(infoDlg)infoDlg.hide();
									Ext.MessageBox.alert('提示','已发起申请,待子行审核！');
									return;
								}else{
									if(flag=='earlyBreach')eforexGrid.getEarlyBreachInfo(ifFource);
									if(flag=='breach')eforexGrid.getBreachInfo(ifFource);
									if(flag=='allBreach')eforexGrid.getAllBreachInfo(ifFource);
									if(flag=='duration')eforexGrid.getDurationInfo();
									if(flag=='farduration')eforexGrid.getFarDurationInfo();
									if(flag=='earlyDelivery')eforexGrid.getEdeliveryInfo();
									if(flag=='earlyswapDelivery')eforexGrid.getSwapEdeliveryInfo();
									if(flag=='earse')eforexGrid.getEraseInfo();
									if(flag=='delivery')eforexGrid.getDeliveryInfo();
									if(flag=='deliveryCancel')eforexGrid.getCancelDeliveryInfo();
									//if(flag=='getDealInfo')eforexGrid.myUpdateInfo(ifFource);
								}
							}
						}}
					});
				}else{
				Ext.MessageBox.alert('提示','请选中要进行'+alertMessage+'的交易记录。');
				}
         },
         tradeAuthOK : function(){//审核通过
         	var btname='doTradeAuthBtn';
         	if(Ext.get('tradeAuth.applyState'))Ext.get('tradeAuth.applyState').dom.value=2;
         	eforexGrid.confirmTradeAction(btname);
         },
         tradeAuthNO : function(){//审核拒绝
         	var btname='doTradeAuthBtn';
         	if(Ext.get('tradeAuth.applyState'))Ext.get('tradeAuth.applyState').dom.value=1;
         	eforexGrid.confirmTradeAction(btname);
         },
         getTradeAuthInfo:function(){// 通过拦截使用的处理函数进行自由控制
	        	if(Ext.get('doTradeAuthBtn').dom.getAttribute('doFunc')!=null){
	        		eval(Ext.get('doTradeAuthBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
		        } else{
		        	if(selectModel.hasSelection()){  
		        	var applyStateStr=selectModel.getSelected().get('applyStateStr');
		        	 var serialNo = selectModel.getSelected().get('serialNo');
		 			var type = selectModel.getSelected().get('type');
		 			var applyTime = selectModel.getSelected().get('applyTime');
		 			var applyDate = selectModel.getSelected().get('applyDate');
		        	if(applyStateStr=='待审核'){
		        		if(!infoDlg){
				        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
				                    modal:true,
				                    width:500,
				                    height:200,
				                    shadow:true,
				                    proxyDrag: true,
				                    center: {	              
				                    	animate: true,
				                        autoScroll:true
				                    }
				            });
				            
				            var action = Ext.get('doTradeAuthBtn').dom.getAttribute('action');
				            btn = infoDlg.addButton('通过');
				            dtn = infoDlg.addButton('拒绝');
				            cbtn = infoDlg.addButton('关闭');
				            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }
			            btn.setHandler(eforexGrid.tradeAuthOK, infoDlg);
			            dtn.setHandler(eforexGrid.tradeAuthNO, infoDlg);
			            
			            cbtn.setHandler(infoDlg.hide, infoDlg);
			            btn.enable();
			            cbtn.enable();
			            var lableName=Ext.get('doTradeAuthBtn').dom.getAttribute('lableName')==undefined?'申请审核':Ext.get('deliveryCancelBtn').dom.getAttribute('lableName');
			            infoDlg.setTitle( lableName );
			            var layout = infoDlg.getLayout();
			            layout.beginUpdate();
			            layout.add('center',content);
			            var params = 'sqlParam.tempSerial='+serialNo+'&sqlParam.type='+type+'&applyTime='+applyTime+'&applyDate='+applyDate;
			            var update = content.getUpdateManager();
			           	var tempFunc = function(e,b,o){
			           		eforexGrid.initTagFunc('doTradeAuthBtn');
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
			           	};
						update.update(Ext.get('doTradeAuthBtn').dom.getAttribute('url'),params, tempFunc);
						// 控制diaglog对话框实际大小
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
			           	layout.endUpdate();
			            infoDlg.show();
			            }else{
			            	Ext.MessageBox.alert('提示','只能对待审核的申请发起审核');
			            }
			         }else{
			         	Ext.MessageBox.alert('提示','请选中要进行申请审核的记录。');
			         }
		        }
	        },
        getEarlyBreachInfo : function(isFource){// 通过拦截使用的处理函数进行自由控制
        	var alertMes;
        	var lableName;
        	if(Ext.get('eBreachBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('eBreachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eBreachBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        		var calAmt = selectModel.getSelected().get('calAmount');
		            var amt1 = Math.abs(selectModel.getSelected().get('amount1'));
		            var amt2 = Math.abs(selectModel.getSelected().get('amount2'));
		            var tranType = selectModel.getSelected().get('typeStr');
		            var surplusamt1 = selectModel.getSelected().get('surplusamount1');
		            var isFarDelivery=selectModel.getSelected().get('isFarDelivery');
		            var earlyBreachInit = function(e,b,o){
		            	if(specialTradeContext){
		            	  var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		            		specialTradeContext.initEarlyBreach();
		            	}
		            }
		            if(isFource==1){
		            alertMes='强制提前违约';
		            }else{
		            alertMes='提前违约';
		            }
		            if(isFarDelivery == 1){
		            Ext.MessageBox.alert('提示','掉期近端不允许发起'+alertMes);
		            		return;
		            }
		             if(tranType == '远期交易' || tranType == '掉期交易'){
		              if(surplusamt1>0){
		               Ext.MessageBox.alert('提示','已部分或全部处理，不能进行'+alertMes);
		            		return;
		              }
		            }
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:670,
			                    height:500,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('eBreachBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            
		            }else{
		            infoDlg.setContentSize(670,500);
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            infoDlg.on("hide", function() {
		            	eforexGrid.stopTimer();
					});
		            btn.setHandler(function(){eforexGrid.doEarlyBreach(isFource)}, infoDlg);
		            btn.enable();
		           	lableName =Ext.get('eBreachBtn').dom.getAttribute('lableName')==undefined?alertMes:Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName +showtimeSpan);
		            infoDlg.setTitle( alertMes);
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	if(isFource==1){
					update.update(Ext.get('feBreachBtn').dom.getAttribute('url'),params,earlyBreachInit);
					}else{
					update.update(Ext.get('eBreachBtn').dom.getAttribute('url'),params,earlyBreachInit);
					}
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		            eforexGrid.stopTimer();
		            if(myInfoDlg)myInfoDlg.setTitle(lableName);
	        	}else{
		         	Ext.MessageBox.alert('提示','请选中要进行违约的交易记录。');
		         }
	        }
        },
        checkDLFunc:function(idname){//检查代录交易 对手机构行号选择必选
			if(Ext.get(idname)){
			    var idvalue=$(idname).value;
			    var textName;
			    if(Ext.getCmp(idname)){
			    	textName=Ext.getCmp(idname).alertName;
			    }
			    if(textName == null){
			    	textName = $(idname).parentNode.parentNode.innerText;
			    	textName = textName.substring(0,textName.length-1);
			    }
			    if(String(idvalue).trim().length==0){//长度为0，必须选择
			    	Ext.Msg.alert('提示',textName+"为空,请重新选择！");
			    	return false;
			    }
			}
		    return true;
		},
        doEarlyBreach : function(isFource){	
	        var amountflag=eforexGrid.checkDLFunc("earlyBreachTrade.instrument"); //Kgr选择
	         	if(!amountflag){
	         		return;
	         	}
       		 var amountflag=eforexGrid.checkDLFunc("earlyBreachTrade.marginCode"); //保证金货币
         		if(!amountflag){
         			return;
         		}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
				if(!valiEarlyBreachTradeElement()){
					return;
				}
				var formEl = content.getEl().child("form").dom;	
				if(isFource == 1){//强制违约
					 eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_BREACH,'feBreachBtn');
				}else{
					eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_BREACH,'eBreachBtn');	
				}
				
			}
        }, 
       confirmTradeAction : function(bnname) {
			var formEl = infoDlg.getEl().child("form");// 交易页面表单提交
			if (formEl && formEl.dom) {
				var params = Ext.lib.Ajax.serializeForm(formEl);// 对表单下所有数据进行序列化，组合成参数对
				Ext.MessageBox.wait('数据保存中...','请稍后...');
				Ext.lib.Ajax.formRequest(formEl.dom, Ext.get(bnname).dom.getAttribute('action'), {
							success : eforexGrid.commentSuccess,
							failure : eforexGrid.commentFailure
						});
			   eforexGrid.myCloseDlg();
			} else {
				infoDlg.hide();
				infoDlg.setContent('');
			}
		},
        getSwapEdeliveryInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('eDeliSwapBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('eDeliSwapBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eDeliSwapBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        	  var dlgTabs = Ext.get("dlgTabs");
	        	  var func = function(e,b,o){
		            	if(specialTradeContext){
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		            		specialTradeContext.initSwapEarlyDelivery();
		            	}
		            }
		       		var isFarDelivery = selectModel.getSelected().get('isFarDelivery');
		            if(isFarDelivery == 1){
		            Ext.MessageBox.alert('提示','掉期近端不允许发起提前交割');
		            		return;
		            }
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:600,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('提前交割');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('eDeliSwapBtn').dom.getAttribute('url'),params,func);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:600,
			                    height:565,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('eDeliSwapBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doEarlyDeli, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('eDeliSwapBtn').dom.getAttribute('lableName')==undefined?'提前交割':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eDeliSwapBtn').dom.getAttribute('url'),params,func);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行提前交割的交易记录。');
		         }
	        }
        
        	
        },
        
        getEdeliveryInfo:function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('eDeliBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('eDeliBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eDeliBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){ 
	        	  var dlgTabs = Ext.get("dlgTabs");
	        	  var func = function(e,b,o){
		            	if(specialTradeContext){
		                    var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		            		specialTradeContext.initFwdEarlyDelivery();
		            	}
		            }
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:600,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('提前交割');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		           
		            update.update(Ext.get('eDeliBtn').dom.getAttribute('url'),params,func);
		           	layout.endUpdate();
				 }else{
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:600,
			                    height:565,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('eDeliBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doEarlyDeli, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('eDeliBtn').dom.getAttribute('lableName')==undefined?'提前交割':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eDeliBtn').dom.getAttribute('url'),params,func);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行提前交割的交易记录。');
		         }
	        }
        
        	
        },
        
        getDeliveryInfo : function(){// 通过拦截使用的处理函数进行自由控制
        	if(Ext.get('deliveryBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('deliveryBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deliveryBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){
	        	 /**if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			           	Ext.MessageBox.alert('提示','请选择特殊交易类型为【普通交易】发起交割');
			           	return;
			      }**/
	        	 //var func = function(e,b,o){
		            	//if(specialTradeContext){
		                   // var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		//if(res){
		            			//if('error' == res){
		            				//return;
		            			//}
		            		//}
		            		//specialTradeContext.initDelivery();
		            	//}
		         var tranType=Number(selectModel.getSelected().get('tranType'));
	        	  var dlgTabs = Ext.get("dlgTabs");
				  if(dlgTabs){
				  	cbCounter = 0; 
					if(!infoDlg){
						infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:500,
			                    shadow:true,
			                    proxyDrag: true,	                    
			                    center: {
			                        autoScroll:false,
			                        tabPosition: 'top',
			                        alwaysShowTabs: true
			                    }
			            });
			             btn = infoDlg.addButton('确定');
	
				         infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(500,350);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.disable();
			        infoDlg.setTitle('当日交割');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab格子对话输入框
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// 创建多个面板存放数据
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // 对面板进行数据刷新
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// 刷新多个面板初始化数据
		            }   	                  	    
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager(); 
		            var tempFunc = function(e,b,o){
		           		eforexGrid.initTagFunc('deliveryBtn');
		           			//specialTradeContext.initBreach();
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		           	};
		            update.update(Ext.get('deliveryBtn').dom.getAttribute('url'),params, tempFunc);
		           	layout.endUpdate();
				 }else{//交割走这个分支
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:500,
			                    height:350,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            
			            var action = Ext.get('deliveryBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			            infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(500,350);
			        }
			        if(tranType==3||tranType==12||tranType==15){
			        	infoDlg.setContentSize(530,300);
			        }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doDelivery, infoDlg);
		            btn.disable();
		            var lableName=Ext.get('deliveryBtn').dom.getAttribute('lableName')==undefined?'交割':Ext.get('deliveryBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		            var tempFunc = function(e,b,o){
		           			eforexGrid.initTagFunc('deliveryBtn');
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
		            		if(res){
		            			if('error' == res){
		            				return;
		            			}
		            		}
		           	};
					update.update(Ext.get('deliveryBtn').dom.getAttribute('url'),params,tempFunc);
					//控制diaglog对话框实际大小
					//update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		           if(tranType!=1){
		           	if(btn)btn.enable();
		           }
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要进行交割的交易记录。');
		         }
	        }
        
        	
        },
        getOptionBtnInfo : function(){
        	if(Ext.get('printOptionBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('printOptionBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        }	
        },
        getInfo : function(){// 通过拦截使用的处理函数进行自由控制
         var initBnakListse = function(e,b,o){//机构下拉框渲染 xujie
		            		var res = eforexGrid.dlgLoadCallback(e,b,o);
			            		if(res){
			            			if('error' == res){
			            				return;
			            			}
			            		}
			            		if(typeof initBnakListsele!='undefined'&& initBnakListsele instanceof Function){
			            		var flag="update"         
    									initBnakListsele (flag);  
    									}
		            	};
        	if(Ext.get('updateBtn')==null){
        		Ext.MessageBox.alert('提示','记录集不允许直接修改');
        		return;
        	}
        	if(Ext.get('updateBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('updateBtn').dom.getAttribute('doFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	        } else{
	        	if(selectModel.hasSelection()){  
	        		if(!infoDlg){
			        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
			                    modal:true,
			                    width:450,
			                    height:450,
			                    shadow:true,
			                    proxyDrag: true,
			                    center: {	              
			                    	animate: true,
			                        autoScroll:true
			                    }
			            });
			            var action = Ext.get('updateBtn').dom.getAttribute('action');
			            btn = infoDlg.addButton('确定');
			           	cbtn = infoDlg.addButton('取消', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(printBtn){printBtn.hide();}
		            if(btn1) {
			        	btn1.show();
			        }else{
			        	var url = Ext.get('updateBtn').dom.getAttribute('url');
				        if(url.indexOf('posswordinit')!=-1) {
			            		btn1 = infoDlg.addButton('密码初始化',eforexGrid.passwordInit);
		            	}
				        if(url.indexOf('getClientInfo')!=-1) {
			            		btn1 = infoDlg.addButton('账户添加OR更新',eforexGrid.cleintAccountMngtadd);
			            		btn1 = infoDlg.addButton('账户管理',eforexGrid.cleintAccountMngt);
		            	}
			        }
		            btn.setHandler(eforexGrid.updateInfo, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'修改':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,initBnakListse);
					// 控制diaglog对话框实际大小
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//包含页面文件脚本可执行
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('提示','请选中要修改的记录。');
		         }
	        }
        },
		cleintAccountMngt : function() {
            var customerId = $('clientCustomerId').value;
            var flag_ = 1;//从客户跳往账号标示
			var url = '/base/getAccountList.action?subAction=init&account.customerId='+customerId+'&flag_='+flag_;
			popWindow(url,1000,400);
        },
		relDetailsDlg : function() {
            var serialNo;
            var type;
          if(Ext.get('trade.serialNo')){
          serialNo = $('trade.serialNo').value;
          type= $('trade.type').value;
          }  
          if(Ext.get('forwardTrade.serialNo')){
           serialNo = $('forwardTrade.serialNoInt').value;
          type= $('forwardTrade.type').value;
          } 
          if(Ext.get('swapTrade.serialNo')){
          serialNo = $('swapTrade.serialNoInt').value;
          type= $('swapTrade.type').value;
          }  
			var url = '/query/queryRelationTradeCondition.action?subAction=init&sqlParam.headNo='+serialNo+'&sqlParam.headType='+type;
			popWindow(url,1000,400);
        },
		relationNoDlg : function() {
            var flag_ = 1;//从交易跳往关联流水号管理标示
		 var tradeType;
          var serialNo;
          var itemId;
           if(Ext.get('trade.serialNo'))  tradeType ="trade";
          if(Ext.get('forwardTrade.serialNo'))  tradeType = "forwardTrade";
          if(Ext.get('swapTrade.serialNo'))  tradeType = "swapTrade";
          if(Ext.get('trade.serialNo')) {
         	 serialNo = $(tradeType+'.serialNo').value;
          }else{
          	 serialNo = $(tradeType+'.serialNoInt').value;
          }
          itemId = $(tradeType+'.itemId').value; 
          type =  $(tradeType+'.type').value; 
          if(type == 1 || type == 5 || type == 7 || type == 3){
          	type--;
          }
          if(type == 0 && itemId != 0){
          	itemId = 50;
          }
			var url = '/base/queryTradeRelationNoCondition.action?subAction=init&tradeRelationNo.itemId='+itemId+'&tradeRelationNo.serialNo='+serialNo+'&tradeRelationNo.type='+type+'&flag_='+flag_;
			popWindow(url,1000,400);
        },
		 cleintAccountMngtadd : function() {
		 
		    	var customerId = $('clientCustomerId').value;
    			Ext.MessageBox.confirm('提示','您确定要更新该客户的账号信息吗？',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('更新账号中...', '请稍后...');
					 var cb = {
						 success: eforexGrid.commentSuccess ,
						 failure: eforexGrid.commentFailure
					 }
					var url = '/base/ajaxGetAccountInfotoManger.action?client.customerId='+customerId;
					 Ext.lib.Ajax.request("POST",url,cb);
				} else {

				}
			})
				
        },
		 synchronizeKondor : function() {
		  if(selectModel.hasSelection()){
		    	var type=selectModel.getSelected().get('type');
		    	var downloadKey = selectModel.getSelected().get('downloadKey');
		    	var relationType =selectModel.getSelected().get('relationType');//关联类型 1 - kondor 2 - KTP
		    	var serialNo =selectModel.getSelected().get('serialNo');//交易流水号
		    	//var falg="1";//kondor downloadkey
		    	if(Number(relationType)!=3){
		    		Ext.MessageBox.alert('提示',"只能对关联类型为downloadKey的记录发起同步!");
		    		return;
		    	}
    			Ext.MessageBox.confirm('提示','您确定要同步更新该Kondor信息吗？',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('同步更新kondor中...', '请稍后...');
					 var cb = {
						 success: eforexGrid.commentSuccess ,
						 failure: eforexGrid.commentFailure
					 }
					var url = '/base/ajaxGetKondorInfotoManger.action?tradeRelationNo.type='+type+'&tradeRelationNo.downloadKey='+downloadKey+'&tradeRelationNo.relationType='+relationType+'&tradeRelationNo.serialNo='+serialNo;
					 //alert('url: '+url);
					 //Ext.lib.Ajax.request("POST",url,cb);
					 var params = eforexGrid.createParam();
					 Ext.Ajax.request({
    		  			  	method: 'POST',
    		  			  	url: url,
    		  			  	params : params,
    		  			  	callback:function(opts,success,response){
							data = response.responseText;
							if(success){// 回调函数
								var data = response.responseText;
								if(data.indexOf('ERROR')!= -1){
				     				Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));
				     				return;
				     			}else{
				     				Ext.MessageBox.alert('提示','同步成功!');
				     				return;
				     			}
								}
							}
    		  			});
				} else {
					
				}
			})
			}else{
				Ext.MessageBox.alert('提示','请选中要修改的记录。');
			
			}
				
        },
        myCloseDlg : function (){
        	infoDlg.hide();
        	if(btn){btn.show();}
        	if(btnDeal){btnDeal.hide();}
        },
        
 	 doShowInfo: function(){
        var itemId=0;
        	if(!selectModel.hasSelection()){  
	      		Ext.MessageBox.alert('提示','请选中您要显示的交易记录。');
	      		return;
	      	}
	      	if(selectModel.hasSelection()){  
	      	itemId= parseInt(selectModel.getSelected().get('itemId'));
	      	}
	      	 if(!infoDlg){
	        	infoDlg = new Ext.LayoutDialog('my-dlg', { 
	                    modal:true,
	                    width:400,
	                    height:450,
	                    shadow:true,
	                    proxyDrag: true,
	                    center: {	              
	                    	animate: true,
	                        autoScroll:true
	                    }
	            });
	            btn = infoDlg.addButton('确定');
	            btnDeal = infoDlg.addButton('确定');
	            infoDlg.addButton('取消', eforexGrid.myCloseDlg, infoDlg);
	            if(itemId!=3) otherbtn=infoDlg.addButton('关联交易', eforexGrid.relDetailsDlg,infoDlg);
	            relationBtn=infoDlg.addButton('外部流水号管理', eforexGrid.relationNoDlg,infoDlg);
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
		     if(btnDeal){btnDeal.hide()}
		     if(btn){btn.hide();}
		     if(otherbtn)otherbtn.show();
		     if(relationBtn)relationBtn.show();
		     if(!otherbtn){ 
		      if(itemId!=3)otherbtn=infoDlg.addButton('关联交易', eforexGrid.relDetailsDlg,infoDlg);}
		      if(!relationBtn){ 
		    	 relationBtn=infoDlg.addButton('外部流水号管理', eforexGrid.relationNoDlg);
		     }
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'交易信息':Ext.get('updateBtn').dom.getAttribute('lableName');
      		infoDlg.setTitle( lableName );
        	var layout = infoDlg.getLayout();
       	 	layout.beginUpdate();
        	layout.add('center',content);
        	var params = eforexGrid.createParam();
        	 var callBackFunc = function(e,b,o){
	            infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
        	 }
      	    var update = content.getUpdateManager();
      	    update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
			layout.endUpdate();
			// infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);
	        infoDlg.show();
        },
        
        doShowOptionInfo: function(){
        	if(!selectModel.hasSelection()){  
	      		Ext.MessageBox.alert('提示','请选中您要打印的期权行权交易记录。');
	      		return;
	      	}
        	var params = eforexGrid.createParam();
	      	 if(!printDlgO){
	      		printDlgO = new Ext.LayoutDialog('my-printdlgO', { 
	                    modal:true,
	                    width:400,
	                    height:450,
	                    shadow:true,
	                    proxyDrag: true,
	                    center: {	              
	                    	animate: true,
	                        autoScroll:true
	                    }
	            });
	        	printOptionBtn = printDlgO.addButton('打印',function(){eforexGrid.printContainterWithUrl(Ext.get('printOptionBtn').dom.getAttribute('url'));});
	        	printDlgO.addButton('关闭', function (){
	        		printDlgO.hide();
				}, printDlgO);
	        	contentO = new Ext.ContentPanel('printCenterO',{autoCreate : true,fitToFrame:true});
		     }
	        var lableName=Ext.get('printOptionBtn').dom.getAttribute('lableName')==undefined?'期权行权交易打印':Ext.get('printOptionBtn').dom.getAttribute('lableName');
	        printDlgO.setTitle( lableName );
        	var layout = printDlgO.getLayout();
       	 	layout.beginUpdate();
        	layout.add('center',contentO);
        	
        	 var callBackFunc = function(e,b,o){
        		 printDlgO.setContentSize(contentO.getEl().dom.firstChild.offsetWidth+2,contentO.getEl().dom.firstChild.offsetHeight);
        	 }
      	    var update = contentO.getUpdateManager();
      	    update.update(Ext.get('printOptionBtn').dom.getAttribute('url'),params,callBackFunc);
			layout.endUpdate();
			// printDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);
			printDlgO.show();
        },
        
        beforeQueryRateCodeFunc:function(combo,qStr,force,cancel){// 全局构造生成参数传递值
        	// combo.getName();
        	if(rateCodeCombo.getRawValue()==''){
        		rateCodeCombo.setValue('');// 空值
        	}
        },
        
        bankBeforeFunc:function(){// 强制查询所有
        	this.store.baseParams["bank.type"]=0;
        },
        
           createQueryText:function(tbar,arr){     // 根据参数动态生成条件文本输入框
        		 var channelTypeData = [
        		    ['', '所有'],
        		    ["MT", "柜面"],
        		    ["FR", "企业网银"],
        		    ["BH", "个人网银"],
        		    ["RL", "YRL"]
        		    
        		 ];
                 var profitStatusData = [
                	['-1', '所有'],
               		['0', '拆分'],
                    ['1', '不拆分'],
                    ['2', '待确认']       
                 ];
                  
                var forCustTypeData=[
                    ['-1', '所有'],
					['01', "银行自身"],
					['02', "金融机构"],
					['03', "中资机构"],
					['04', "外资机构"],
					['05', "居民个人"],
					['06', "非居民个人"],
					['07', "TC"],
					['500', "内部户"]
                  ];
               var clientTypeData=[
                    ['0', '所有客户'],
                    ['2', '对私'],
                    ['3', '对公']
                  ];
               var applTypeData=[
                  ['-1', '所有产品'],
//                 ['0', '基础模块'],
                  ['1', '外汇买卖'],
// ['2', '黄金买卖'],
                  ['3', '结售汇']
//                  ['4', '套汇交易']
                  ];
               var tradeDireData=[
                                  ['-1', '所有'],
                                  ['1', '结汇'],
                                  ['2', '售汇']
                                ];
               var bracnhProfitClientTypeData=[
                                 ['-1', '所有'],
                                 ['1', '个人'],
                                 ['2', '机构'],
                                 ['3', '其他']
                                  ];
               var rfqClientData=[
                                  ['-1', '所有'],
                                  ['1', '是'],
                                  ['0', '否']
                                    ];
               var transtypeData=[
                                               ['-1', '所有'],
                                               ['1', '竞价最小金额'],
                                               ['2', '竞价最大金额'],
                                               ['3', '询价最小金额'],
                                               ['4', '询价最大金额']
                                                ];
               var sysParamTypeData=[
                  ['0', '所有产品'],
                  ['1', '基础模块'],
                  ['2', '牌价模块'],
                  ['3', '交易模块'],
                  ['4', '报表模块']
                  ];
                  var countTypeData=[
                  ['-1', '所有'],
                  ['0', '分行对客户优惠'],
                  ['1', '总行对分行优惠']
                  ];   
                var applCurrencyNothTypeData=[
                  ['-1', '所有'],
                  ['1', '外汇买卖'],
// ['2', '黄金买卖'],
                  ['3', '结售汇']
                  ];
                 
                 var bankTypeData=[  /* 机构类型 -1 所有 0-行内机构 1-行间机构 */
                  ['-1', '所有'],
                  ['0', '行内机构'],
                  ['1', '行间机构']
                 ];
                 
                 var bankFlagData=[
                  ['-1', '所有'],
                  ['0', '部门'],
                  ['1', '机构']
                 ];
                  var kgrTTParamData=[
	                 ['-1', '所有'],
	                 ['0', '即期'],
	                 ['2', '远期交易'],
	                 ['4', '掉期交易']
                 ];
                  var kgrSTTParamData=[
                  	 ['0', '所有'],
	                 ['1', '普通交易'],
	                 ['2', '提前展期'],
	                 ['3', '提前违约'],
	                 ['4', '提前交割'],
	                 ['11', '到期展期'],
	                 ['12', '到期违约'],
	                 ['13', '冲正'],
	                 ['14', '隔日冲正'],
	                 ['15', '全部违约']
                 ];
                  var specialTradeQueryParamData=[
                  	 ['0', '所有'],
	                 ['2', '提前展期'],
	                 ['3', '提前违约'],
	                 ['4', '提前交割'],
	                 ['11', '到期展期'],
	                 ['12', '到期违约'],
	                 ['15', '全部违约']
                 ];
                  var cashFlowTypeData=[
                  ['-1', '所有'],
                  ['2', '远期'],
                  ['4', '掉期']
                 ];
                 
                 var otherItemIdData=[  /* 交易种类 -1 所有 6-同业拆借 7-定期同业存放 8-资金调拨 */
                  ['-1', '所有'],
                  ['6', '同业拆借'],
                  ['7', '同业存放'],
                  ['8', '资金调拨']
                 ];
                 var kParamData=[
	                 ['0', '所有'],
	                 ['1', 'USER'],
	                 ['2', 'FOLDER']
                 ];
                 var execStateData=[
                                 ['0', '所有'],
                                 ['1', '执行中'],
                                 ['2', '执行失败'],
                                 ['3', '执行成功'],
                                 ['4', '等待关联批处理执行']
                                 ];
                 var execModelData=[
                                    ['0', '所有'],
                                    ['1', '自动调用'],
                                    ['2', '手动调用']
                                    ];
                 var spotStatusTypeData=[
                  ['-1', '所有'],
                  ['0', '分行录入'],
                  ['1', '总行补录']
// ['2', 'cfets录入'],
// ['3', '核心录入']
                  ];
                  var inputTradeSystemData=[
                  ['-1', '所有'],
                  ['0', 'YFX'],
                  ['1', 'NDS核心系统'],
                  ['4', 'DCI']
  //                ['2', '外汇交易中心'],
 //                 ['3', '国结系统']
                  ];
                 var itemIdData=[  /* 交易种类 -1 所有 */
                  ['-1', '所有'],
                  ['3', '平盘交易'],
                  ['5', '内部交易']
                 ];
                 
                 var stateData1=[  
                  ['-1', '所有'],
                  ['0', '正常']
//                  ['1', '删除'],
 //                 ['2', '违约']
                 ];
                 
                 var stateData2=[ 
                  ['-1', '所有'],
                  ['0', '正常'],
                  ['1', '删除'],
                  ['2', '部分处理'],
                  ['3', '全额处理']
                 ];
                 var itemIdFLATData=[
                 ['-1','所有'],
                 ['2','外汇平盘'],
                 ['3','结售汇平盘'],
                 ['9','内部交易']
                 ];
                 var brnachGcItemIdData=[
                 ['-1','所有'],
                 ['2','对客交易'],
                 ['5','内部交易']
                 ];
                 var isSummaryData=[
	                 ['-1','所有'],
	                 ['1','汇总'],
	                 ['0','自身']
                 ];
                 var isitemIdData =[
                 ['','所有'],
                 ['OSPAY','代付'],
				 ['IGCL','理赔'],
				 ['IMBL','进口到单'],
				 ['IMCLPAY','代收'],
				 ['LOAN','打包贷款'],
				 ['YQJSH','远期结售汇'],
				 ['LCTF','转让开立'],
				 ['EXNG','议付'],
				 ['EXCL','托收'],
				 ['TFAB','转让到单'],
				 ['OR','汇出汇款'],
				 ['IMLG','保函开立'],
				 ['EXLG','保函通知'],
				 ['EGCL','索赔'],
				 ['FRFT','福费庭包卖'],
				 ['FRFTBUY','福费庭自行买入'],
				 ['OA','赊销'],
				 ['CBCL','光票'],
				 ['IR','汇入汇款'],
				 ['SG','提货担保'],
				 ['IMLC','进口开证业务'],
				 ['EXAD','出口通知业务'],
				 ['JSHORG','手工结售汇']
                 ];
                 var checkTypeData=[
                 	['-1', '所有'],
                 	['0', 'YFX缺失交易'],
                 	['1', 'NDS缺失交易'],
                 	['2', '交易信息不一致'],
                 	['3', '交易信息一致']
                 ];
                 var checkStateData=[
                 	['-1', '所有'],
                 	['0','未核销'],
                 	['1','已核销'],
                 	['2', '系统已自动核销']
                 ];
                 var tranModeData=[
                 ['-1','所有'],
                 ['0','竞价交易'],
                 ['1','询价交易']
                 ];
                 var eventFlagData=[
                 ['-1','所有'],
                 ['0','分行询价'],
                 ['3', '分行超时'],
                 ['1','总行报价'],
                 ['4','总行响应'],
                 ['6','总行放弃'],
                 ['7','总行超时']
                 ];
                  var isCheckFlagData=[
                 ['-1','所有'],
                 ['0','未复核'],
                 ['1','已复核']
                 ];
                 
                  
                  var  tradeTypeData= [
                  ['-1', '所有'],
                  ['0', '即期交易'],
                  ['1', '即期交易冲正'],
                  ['2', '远期交易'],
                  ['3', '远期交易冲正'],
                  ['4', '掉期交易'],
                  ['5', '掉期交易冲正'],
                  ['6', '择期交易'],
                  ['7', '择期交易冲正'],
                  ['30', '已交割即期冲正']
                  ];
                  
                  var  sourceTypeData= [
                  ['-1', '所有'],
                  ['0', '无'],
                  ['2', '远期交易'],
                  ['4', '掉期交易'],
                  ['6', '择期交易']
                  ];
                  
                 var cashFLowItemIdData=[  /* 交易种类 -1 所有 6-同业拆借 8-资金调拨 */
               	  ['-1', '所有'],
                  ['0', '即期交易'],
                  ['2', '远期交易'],
                  ['6', '择期交易'],
                  ['4', '掉期交易']
                  ];
                  
                 var spotFwdTradeTypeData=[ 
                  ['-1', '所有'],
                  ['0', '即期交易'],
                  ['2', '远期交易'],
                  ['6', '择期交易'],
                  ['4', '掉期交易(远端)']
                  ];
                  
                 var possTransTypeData=[
                 	['0','即期'],
                 	['1','远期']
                 ];
                 var effectiveTypeData=[
                                        ['-1','所有'],
                                        ['3','未生效'],
                                        ['1','有效'],
                                        ['2','过期']
                                         ];
                 var ctpyData=[
                    ['-1', '所有'],
                    ['FXSPOT', 'FXSPOT'],
                    ['FXFORWARD', 'FXFORWARD'],
                    ['FXSWAP', 'FXSWAP']
                 ];
                 var kondorSendStateData=[
                 	['-1', '所有'],
                 	['1', '文件生成失败'],
                 	['2', 'FTP上传失败'],
                 	['3', 'KONDOR上送成功']
                 ];
                 var custTradeQueryItemData=[
                    ['-1', '所有'],
                 	['0','代客'],
                 	['5','内部'],
                    ['20','期权行权'],
                    ['40','即期T+N交易']
                 ];
                 var inCheckStateData=[
                    ['-1','全部'],
                    ['0','未复核'],
              	    ['1','复核拒绝 '],
              	    ['2','无须复核'],
              	    ['3','复核通过']
                 ];
                 var flatTradeQueryItemData=[
                 	['-1', '所有'],
                 	['3','平盘'],
                 	['5','内部'],
                 	 ['6','内部展期交易'],
                 	 ['7','内部平盘交易'],
                 	 ['30','已交割冲正反向平盘']
                 ];
                 var custTradeQueryItemData=[
                     ['-1', '所有'],
                     ['0','代客'],
                     ['3','分总'],
                     ['5','内部'],
                     ['50','总分']
                  ];
                 var sendStateData=[
                     ['-1', '所有'],
                     ['0','未清算'],
                     ['1','清算中'],
                     ['2','已清算'],
                     ['3','清算失败'],
                     ['4','汇总金额为零，无需清算']
                 ];
                 var custFxTradeQueryItemData=[
                     ['-1', '所有'],
                     ['0','代客'],
                     ['5','内部'],
                     ['20','期权行权'],
                     ['40','即期T+N交易']
                  ];
                 var deptDirectionData=[
                    ['-1','全部'],
                 	['0','结汇'],
                 	['1','售汇']
                 ];
                 
                 var  branchProfitTypeData= [
                  ['-1', '所有'],
                  ['0', '即期交易'],
                  ['2', '远期交易'],
                  ['4', '掉期交易']
                  ];
                  
                  var  isStateData= [
                  ['-1', '所有'],
                  ['0', '待处理'],
                  ['1', '已平盘']
                  ];
                  
                  var rmbTenDayMonthTradeTypeData = [
                  ['0','即期'],
                  ['2','远期']  
                  ];
                  var rmbTenDayMonthDirectionData = [
                  ['-1','所有'],
                  ['1','结汇'],
                  ['2','售汇']
                  ];
                  var rmbTenDayMonthReportTypeData = [
                  ['-1','所有'],
                  ['1','月报'],
                  ['2','上旬报'],
                  ['3','中旬报'],
                  ['4','下旬报']
                  ];
                /////ACC 
                 var accTranTypeData=[
                	 ['-1', '所有'],
                	 ['5','正常'],
                	 ['4','冲正']
                	 ];
                 
                 var accTranTranCodeData = [
                	 ['-1','所有'],
                	 ['0-1','即期外汇'],
                	 ['1-1','即期外汇冲正'],
                	 ['0-3','即期结售汇'],
                	 ['1-3','即期结售汇冲正'],
                	 ['2-1','远期外汇'],
                	 ['3-1','远期外汇冲正'],
                	 ['2-3','远期结售汇'],
                	 ['3-3','远期结售汇冲正'],
                	 ['4-1','掉期外汇'],
                	 ['5-1','掉期外汇冲正'],
                	 ['4-3','掉期结售汇'],
                	 ['5-3','掉期结售汇冲正'],
                	 ['6-1','择期外汇'],
                	 ['7-1','择期外汇冲正'],
                	 ['6-3','择期结售汇'],
                	 ['7-3','择期结售汇冲正']
                	 ];
                 
                 var accTranStatusData = [
                	 ['-1','所有'],
                	 ['0','未处理'],
                	 ['1','处理成功'],
                	 ['2','处理失败'],
                	 ['3','不生成']
                	 ];
                 var accTranAgentTypeData =  [
	                                     	 ['-1','所有'],
	                                     	 ['11','代客交易'],
	                                     	 ['13','二次扣账'],
	                                     	 ['21','内部自身'],
	                                     	 ['53','内部代客'],
	                                     	 ['50','分总平盘'],
	                                     	 ['51','内部分总平盘'],
	                                     	 ['60','自动差异轧平']
	                                     	 ];
                var accTranTableTypeData =  [
	                                     	 ['-1','所有'],
	                                     	 ['0','即期交易'],
	                                     	 ['2','远期交易'],
	                                     	 ['4','掉期交易'],
	                                     	 ['5','代客交易'],
	                                     	 ['6','估值交易'],
	                                     	 ['7','头寸重估']
	                                     	];
                 var accProductTypeData = [
                	 ['-1', '所有'],
                	 ['10','即期外汇对'],
                	 ['30','即期结售汇']
                	 ];
                 var accTranTypeData = [
                	 ['-1', '所有'],
                	 ['1','普通交易']
                	 ];
                 var accDateTypeData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','交易日'],
                	 ['2','交割日'],
                	 ['3','批处理']
                	 ];
                 var accTremTypeData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','T+0'],
                	 ['2','T+1/2'],
                	 ['3','远期']
                	 ];
                 var accDeliveryTypeData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','正常交易'],
                	 ['2','正常交割'],
                	 ['3','平仓交割'],
                	 ['4','违约交割'],
                	 ['5','提前交割'],
                	 ['6','展期交割']
                	 ];
                 var accIncomeTypeData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','收益'],
                	 ['2','亏损']
                	 ];
                 var accSettlementSaleData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','结汇'],
                	 ['2','售汇']
                	 ];
                 var accTypeFLData = [
                	 ['-1', '所有'],
                	 ['0','默认'],
                	 ['1','内部帐'],
                	 ['2','内部+客户账'],
                	 ['3','客户帐'],
                	 ['4','内部帐']
                	 ]
                 /////ACC
                for( var i = 0; i < arr.length;i++){
                var obj = arr[i];
                var p=obj.split("=");
                var tttt;
                if(p[2]=='dateT'){                  
		            var d=new Date();
					var mon=d.getMonth()+1;
					var year=d.getFullYear();
					var date=d.getDate();
					if(date < 10){
						date = '0' + date;
					}
					if(mon < 10){
						mon = '0' + mon;
					}
					var nowdays = year+''+mon+''+date;
					
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 value:nowdays,
	            		 allowBlank:true
            	    });
                }
                if(p[2]=='dateTNoNull'){                  
		            var d=new Date();
					var mon=d.getMonth()+1;
					var year=d.getFullYear();
					var date=d.getDate();
					if(date < 10){
						date = '0' + date;
					}
					if(mon < 10){
						mon = '0' + mon;
					}
					var nowdays = year+''+mon+''+date;
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 value:nowdays,
	            		 allowBlank:false
            	    });
                }
                if(p[2]=='dateT1'){                  
		            var d=new Date();
					var mon=d.getMonth()+1;
					var year=d.getFullYear();
					var date=d.getDate();
					if(date < 10){
						date = '0' + date;
					}
					if(mon < 10){
						mon = '0' + mon;
					}
					var nowdays = year+''+mon+''+date;
					
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 value:'',
	            		 allowBlank:true
            	    });
                }
                if(p[2]=='dateT2'){                  
		            /*var d=new Date();
					var mon=d.getMonth()+1;
					var year=d.getFullYear();
					var date=d.getDate();
					if(date < 10){
						date = '0' + date;
					}
					if(mon < 10){
						mon = '0' + mon;
					}
					var nowdays = year+''+mon+''+date;*/
					
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 allowBlank:true
            	    });
                }
                if(p[2]=='dateTT'){
                	var nowdays = document.getElementsByName("sysDate")[0].value;
					tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 value:nowdays,
	            		 allowBlank:true
					});	 
                }	
                if(p[2]=='dateTF'){
					var nowdays = document.getElementsByName("sysDate")[0].value;
					tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:75,
	            		 format:'Ymd',
	            		 value:nowdays,
	            		 allowBlank:true,
	            		 maxValue : nowdays,
	            		 menuListeners :{
		                		select: function(m, d){ 
		                	        var mon=d.getMonth()+1;
		       						var year=d.getFullYear();
		       						var date=d.getDate();
		       						
		       						var arg_sysDate = document.getElementsByName("sysDate")[0].value;
		       						if(parseInt(year+''+mon+''+date) > parseInt(arg_sysDate) ){
		       							Ext.MessageBox.alert('提示', '查询日期不能为当前系统日期');
		       						}else{
		       							this.setValue(d); 
		       						}
	                	   		}
	                		}
					});
                }
                if(p[2]=='dateYearMonth'){              
		            var d=new Date();
					var mon=d.getMonth()+1;
					var year=d.getFullYear();
					var date=d.getDate();
					if(date < 10){
						date = '0' + date;
					}
					if(mon < 10){
						mon = '0' + mon;
					}
					var nowdays = year+''+mon;
					
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:70,
	            		 format:'Ym',
	            		 value:nowdays,
	            		 allowBlank:true
            	    });
                }
                if(p[2]=='year'){
		            var d=new Date(); 
					var year=d.getFullYear(); 
					var nowdays = year; 
                	tttt =  new Ext.form.DateField({
	            		 name:p[0],
	            		 width:70,
	            		 format:'Y',
	            		 value:nowdays,
	            		 allowBlank:true
            	    }); 
                }
                else if(p[2]=='textT'){
                  tttt =  new Ext.form.TextField({
            		 name:p[0],
            		 width:100,
            		 allowBlank:true
            	});
                }
                else if(p[2]=='textReadOnly'){
                  tttt =  new Ext.form.TextField({
            		 name:p[0],
            		 width:100,
            		 allowBlank:true,
            		 readOnly:true
            	});
                }
                else if(p[2]=='kParamSelectT'){ 	// 即期交易录入方下拉
               	 var store = new Ext.data.SimpleStore({
                    fields: ['qtype', 'qtypeStr'],
                    data : kParamData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'qtypeStr', 
   	             valueField:'qtype',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'0',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
   	             else if(p[2]=='execStateSelectT'){ 	// 批处理状态下拉
               	 var store = new Ext.data.SimpleStore({
                    fields: ['qtype', 'qtypeStr'],
                    data : execStateData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'qtypeStr', 
   	             valueField:'qtype',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'0',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
   	              else if(p[2]=='kgrRCParamSelectT'){ 	//KGR货币对下拉
               	  var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true

   	             });
   	             }
   	              else if(p[2]=='kgrTTParamSelectT'){ 	//KGR交易类型下拉
               	 var store = new Ext.data.SimpleStore({
                    fields: ['qtype', 'qtypeStr'],
                    data : kgrTTParamData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'qtypeStr', 
   	             valueField:'qtype',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'-1',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
   	             else if(p[2]=='kgrSTTParamSelectT'){ 	//KGR特殊交易类型下拉
               	 var store = new Ext.data.SimpleStore({
                    fields: ['qtype', 'qtypeStr'],
                    data : kgrSTTParamData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'qtypeStr', 
   	             valueField:'qtype',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'0',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
   	             else if(p[2]=='specialTradeParamSelectT'){ 	//特殊交易查询下拉菜单
               	 var store = new Ext.data.SimpleStore({
                    fields: ['qtype', 'qtypeStr'],
                    data : specialTradeQueryParamData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'qtypeStr', 
   	             valueField:'qtype',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'0',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
                else if(p[2]=='spotTradeStatusselectT'){ 	// 即期交易录入方下拉
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : spotStatusTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                else if(p[2]=='execModelSelectT'){ 	// 即期交易录入方下拉
                	var store = new Ext.data.SimpleStore({
                		fields: ['execModel', 'execModelStr'],
                		data : execModelData 
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'execModelStr', 
                		valueField:'execModel',
                		hiddenName:p[0],
                		emptyText:'请选择',
                		editable:false,
                		typeAhead: true,
                		mode: 'local',
                		value:'0',
                		width:70,
                		triggerAction: 'all',
                		selectOnFocus:true,
                		resizable:true
                	});
                }
                else if(p[2]=='execStateSelectT'){ 	// 即期交易录入方下拉
                	var store = new Ext.data.SimpleStore({
                		fields: ['execState', 'execStateStr'],
                		data : execStateData 
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'execStateStr', 
                		valueField:'execState',
                		hiddenName:p[0],
                		emptyText:'请选择',
                		editable:false,
                		typeAhead: true,
                		mode: 'local',
                		value:'0',
                		width:90,
                		triggerAction: 'all',
                		selectOnFocus:true,
                		resizable:true
                	});
                }
	              else if(p[2]=='accTranTypeDataT'){ 	// 核算模块账务交易查询页面交易状态    
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTranTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='accTranTranCodeDataT'){ 	// 核算模块账务交易查询页面交易类型    
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTranTranCodeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                
                else if(p[2]=='accTranStatusDataT'){ 	// 核算模块账务交易查询页面交易类型    
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTranStatusData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                else if(p[2]=='accTranAgentTypeDataT'){ 	 
               	 var store = new Ext.data.SimpleStore({
                    fields: ['status', 'statusStr'],
                    data : accTranAgentTypeData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'statusStr', 
   	             valueField:'status',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'-1',
   	             width:100,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
   	          else if(p[2]=='accTranTableTypeDataT'){ 	 
               	 var store = new Ext.data.SimpleStore({
                    fields: ['status', 'statusStr'],
                    data : accTranTableTypeData 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'statusStr', 
   	             valueField:'status',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'-1',
   	             width:100,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
              else if(p[2]=='flatTradeItemIdData'){// 平盘交易类型交易类型
              	var store = new Ext.data.SimpleStore({
                 fields: ['itemId', 'ItemIdStr'],
                 data : itemIdFLATData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'ItemIdStr', 
	             valueField:'itemId',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
              else if(p[2]=='branchGcItemT'){// 分行轧差交易类型交易类型
                	var store = new Ext.data.SimpleStore({
                   fields: ['itemId', 'ItemIdStr'],
                   data : brnachGcItemIdData 
                    });
  	             tttt = new Ext.form.ComboBox({
  	             name:p[0],
  	             store: store,
  	             displayField:'ItemIdStr', 
  	             valueField:'itemId',
  	             hiddenName:p[0],
  	             emptyText:'请选择',
  	             editable:false,
  	             typeAhead: true,
  	             mode: 'local',
  	             value:'-1',
  	             width:70,
  	             triggerAction: 'all',
  	             selectOnFocus:true,
  			     resizable:true
  	             });
                }
              else if(p[2]=='isSummarySelectT'){// 分行轧差交易类型交易类型
              	var store = new Ext.data.SimpleStore({
                 fields: ['isSummary', 'isSummaryStr'],
                // data : brnachGcItemIdData 
                 data : isSummaryData
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'isSummaryStr', 
	             valueField:'isSummary',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
              else if(p[2]=='stateDataSelectT'){//
              	var title = document.title;
              	var stateDataTemp;
              	if(title.indexOf('即期')!=-1){
              		stateDataTemp = stateData1;
              	}else{
              		stateDataTemp = stateData2;
              	}
              	var store = new Ext.data.SimpleStore({
                 fields: ['itemId', 'ItemIdStr'],
                 data : stateDataTemp 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'ItemIdStr', 
	             valueField:'itemId',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
              
              else if(p[2]=='inputSystemSelectT'){// 录入系统下拉菜单
              	var store = new Ext.data.SimpleStore({
                 fields: ['systemId', 'systemIdStr'],
                 data : inputTradeSystemData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'systemIdStr', 
	             valueField:'systemId',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:90,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              } 
              else if(p[2]=='custTradeQueryItemSelectT'){
              	var store = new Ext.data.SimpleStore({
                 fields: ['systemId', 'systemIdStr'],
                 data : custTradeQueryItemData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'systemIdStr', 
	             valueField:'systemId',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:90,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
              else if(p[2]=='sendStateSelectT'){
            	  var store = new Ext.data.SimpleStore({
            		  fields: ['sendState', 'sendStateName'],
            		  data : sendStateData
            	  });
            	  tttt = new Ext.form.ComboBox({
            		  name:p[0],
            		  store: store,
            		  displayField:'sendStateName', 
            		  valueField:'sendState',
            		  hiddenName:p[0],
            		  emptyText:'请选择',
            		  editable:false,
            		  typeAhead: true,
            		  mode: 'local',
            		  value:'-1',
            		  width:90,
            		  triggerAction: 'all',
            		  selectOnFocus:true,
            		  resizable:true
            	  });
              }
              else if(p[2]=='custFxTradeQueryItemSelectT'){
            	  var store = new Ext.data.SimpleStore({
            		  fields: ['systemId', 'systemIdStr'],
            		  data : custFxTradeQueryItemData 
            	  });
            	  tttt = new Ext.form.ComboBox({
            		  name:p[0],
            		  store: store,
            		  displayField:'systemIdStr', 
            		  valueField:'systemId',
            		  hiddenName:p[0],
            		  emptyText:'请选择',
            		  editable:false,
            		  typeAhead: true,
            		  mode: 'local',
            		  value:'-1',
            		  width:90,
            		  triggerAction: 'all',
            		  selectOnFocus:true,
            		  resizable:true
            	  });
              }
              else if(p[2]=='inCheckStateSelectT'){
                	var store = new Ext.data.SimpleStore({
                   fields: ['inCheckState', 'inCheckStateStr'],
                   data : inCheckStateData
                    });
  	             tttt = new Ext.form.ComboBox({
  	             name:p[0],
  	             store: store,
  	             displayField:'inCheckStateStr', 
  	             valueField:'inCheckState',
  	             hiddenName:p[0],
  	             emptyText:'请选择',
  	             editable:false,
  	             typeAhead: true,
  	             mode: 'local',
  	             value:'-1',
  	             width:90,
  	             triggerAction: 'all',
  	             selectOnFocus:true,
  			     resizable:true
  	             });
                }
              else if(p[2]=='kondorSendStateSelectT'){
              	var store = new Ext.data.SimpleStore({
                 fields: ['state', 'stateStr'],
                 data : kondorSendStateData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'stateStr', 
	             valueField:'state',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:90,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
               else if(p[2]=='flatTradeQueryItemSelectT'){
               var store = new Ext.data.SimpleStore({
                 fields: ['systemId', 'systemIdStr'],
                 data : flatTradeQueryItemData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'systemIdStr', 
	             valueField:'systemId',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:90,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
              }
              else if(p[2]=='gcTradeTypeT'){ 	//branchGc交易类型下拉
               	 var store = new Ext.data.SimpleStore({
                    fields: ['type', 'typeStr'],
                    data : tradeDataStore.tradeTypeAllDate 
                     });
   	             tttt = new Ext.form.ComboBox({
   	             name:p[0],
   	             store: store,
   	             displayField:'typeStr', 
   	             valueField:'type',
   	             hiddenName:p[0],
   	             emptyText:'请选择',
   	             editable:false,
   	             typeAhead: true,
   	             mode: 'local',
   	             value:'-1',
   	             width:70,
   	             triggerAction: 'all',
   	             selectOnFocus:true,
   			     resizable:true
   	             });
   	             }
               else if(p[2]=='custTradeQueryItemSelectT'){
            	   var store = new Ext.data.SimpleStore({
            		   fields: ['itemId', 'itemIdStr'],
            		   data : custTradeQueryItemData 
            	   });
            	   tttt = new Ext.form.ComboBox({
            		   name:p[0],
            		   store: store,
            		   displayField:'itemIdStr', 
            		   valueField:'itemId',
            		   hiddenName:p[0],
            		   emptyText:'请选择',
            		   editable:false,
            		   typeAhead: true,
            		   mode: 'local',
            		   value:'-1',
            		   width:90,
            		   triggerAction: 'all',
            		   selectOnFocus:true,
            		   resizable:true
            	   });
               }
               else if(p[2]=='deptBussinessTypeSelectT'){
            	   var store = new Ext.data.Store({
           	        proxy: new Ext.data.HttpProxy({url: '/forex/queryDeptBusinessType.action'}),
           		        reader: new Ext.data.JsonReader({
           		        	   totalProperty: 'total',
           		        	   root: 'data',
           		        	   id:'id'
           		           },['id','bussinessType'])       
           		    }); 
            	   store.load({});
            	   var tttt = new Ext.form.ComboBox({
            		hiddenName:p[0],
                   	store: store,
                   	displayField:'bussinessType',// 显示货币对中文名称
                   	valueField:'id', // 传值 货币对
                   	emptyText:'请选择',
                   	value : '',
                   	editable:true,
                   	width:120,
                   	minChars:0,
                   	queryParam:'query',
                   	triggerAction: 'all',
                   	typeAhead: false,
                   	selectOnFocus:true,
                   	resizable:true
                   });	  
               }
                else if(p[2]=='bankComUnionT'){		// bankComT,机构行名代码模糊查询,银行间机构
                	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryInterBankList.action?queryType=bySearchMark'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 显示货币对中文名称
		              valueField:'bankId', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:120,
		              minChars:0,
		              mode: 'local',
		              queryParam:'query',
		              triggerAction: 'all',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
        	          // tttt.applyTo('bankCodeCombo');
        	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
                }                
				else if(p[2]=='bankComIn') {		// bankComT,机构行名代码模糊查询,内部机构
                	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryInternalBankList.action?queryType=bySearchMark&bank.flag=-1'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 显示货币对中文名称
		              valueField:'bankId', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              minChars:0,
		              queryParam:'query',
		              triggerAction: 'all',
		              mode: 'local',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
        	          // tttt.applyTo('bankCodeCombo');
        	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
                }
				else if(p[2]=='bankAllT') {		// 
                	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryAllBankList.action'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 
		              valueField:'bankId', // 
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              mode: 'local',
		              minChars:0,
		              queryParam:'query',
		              triggerAction: 'all',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
        	          // tttt.applyTo('bankCodeCombo');
        	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
                }
                else if(p[2]=='bankComInSubBank') {		// bankComInSubBank,机构行名代码模糊查询 当前行子行（包含当前行）
                	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryInternalBankList.action?queryType=bySearchSubBank&bank.flag=-1'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 显示货币对中文名称
		              valueField:'bankId', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              minChars:0,
		              queryParam:'query',
		              triggerAction: 'all',
		              mode: 'local',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
        	          // tttt.applyTo('bankCodeCombo');
        	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
                }              
				else if(p[2]=='bankComInM') {		// bankComT,机构行名代码模糊查询,内部机构
               	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryInternalBankList.action?queryType=bySearchMark&bank.flag=-1&isContainsMaster=1'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 显示货币对中文名称
		              valueField:'bankId', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              minChars:0,
		              mode: 'local',
		              queryParam:'query',
		              triggerAction: 'all',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
       	          // tttt.applyTo('bankCodeCombo');
       	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
               }
				else if(p[2]=='bankComInM1') {		// bankComT,机构行名代码模糊查询,内部机构
               	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/getAjaxInternalBankList.action?queryType=bySearchMark&bank.flag=-1&isContainsMaster=1&ifNeedZH=noNeedZHY'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'bankId'
				           },['idName','bankId'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'idName',// 显示货币对中文名称
		              valueField:'bankId', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              minChars:0,
		              mode: 'local',
		              queryParam:'query',
		              triggerAction: 'all',
		              mode: 'local',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
       	          // tttt.applyTo('bankCodeCombo');
       	          tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
               }
				else if(p[2]=='bankComInMA') {		// bankComT,机构行名代码模糊查询,内部机构
					var store = new Ext.data.Store({
						proxy: new Ext.data.HttpProxy({url: '/base/queryInternalBankList.action?queryType=bySearchMark&bank.flag=-1&isContainsMaster=1&allFlag=allFlag'}),
						reader: new Ext.data.JsonReader({
							totalProperty: 'total',
							root: 'data',
							id:'bankId'
						},['idName','bankId'])       
					}); 
					
					store.load({});
					var tttt = new Ext.form.ComboBox({
						store: store,
						displayField:'idName',// 显示货币对中文名称
						valueField:'bankId', // 传值 货币对
						hiddenName:p[0],
						emptyText:'请选择',
						value:'',
						editable:true,
						width:150,
						minChars:0,
						queryParam:'query',
						triggerAction: 'all',
						typeAhead: false,
						mode: 'local',
						selectOnFocus:true,
						resizable:true
					});	  
					// tttt.applyTo('bankCodeCombo');
					tttt.on("beforequery", eforexGrid.bankBeforeFunc, tttt);
				}
				else if(p[2]=='allCyCodeSelectT') {
               	 var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryCurrencyAjax.action'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data',
				        	   id:'cyCode'
				           },['cyCode','engName'])       
				      }); 
				      
				      store.load({});
		          var tttt = new Ext.form.ComboBox({
		              store: store,
		              displayField:'engName',// 显示货币对中文名称
		              valueField:'cyCode', // 传值 货币对
	                  hiddenName:p[0],
		              emptyText:'请选择',
		              value:'',
		              editable:true,
		              width:150,
		              minChars:0,
		              queryParam:'query',
		              triggerAction: 'all',
		              typeAhead: false,
		              selectOnFocus:true,
				      resizable:true
		             });	  
       	          // tttt.applyTo('bankCodeCombo');
               }      
                
               else if(p[2]=='AllRateCodeselectT'){ 				// 所有货币对下拉
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }
	              
               else if(p[2]=='AllCnyRateCodeselectT'){ 				// 所有结售汇货币对下拉
																	// (包括丹麦克朗这些)
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllCnyAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	           }else if(p[2]=='channelTypeSelectT'){
	        	   var store = new Ext.data.SimpleStore({
	          		fields: ['channelType','channelTypeStr'],
	          		data : channelTypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'channelTypeStr',　// 显示值
		              valueField: 'channelType',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'请选择客户类型',
				      selectOnFocus:true,
				      resizable:true,
				      value:''
		              });
	           
	           }else if(p[2]=='tradeTypeFwdSwapSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeDataStore.tradeTypeFwdSwapData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='tradeTypeAllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeDataStore.tradeTypeAllDate 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='tradeTypeSelectTT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeDataStore.tradeTypeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='relationTypeAllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['relationType', 'relationTypeStr'],
						data : tradeDataStore.relationTypeAllDate 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'relationTypeStr', 
						valueField : 'relationType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='specialTypeAllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeDataStore.specialTypeAllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='itemIdAllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.itemIdAllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='itemId03SelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.itemIdAllData.slice(0,-1) 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='tradeApplyStateSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.tradeApplyStateAllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :0,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='tradeAuthUseStateSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.tradeAuthUseStateAllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='itemId03SelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.itemId03Data 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :0,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='itemId03AllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['itemId', 'itemIdStr'],
						data : tradeDataStore.itemId03AllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'itemIdStr', 
						valueField : 'itemId',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='dealTypeSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['dealType', 'dealTypeStr'],
						data : tradeDataStore.dealTypeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'dealTypeStr', 
						valueField : 'dealType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :'Fwd',
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='folderSpecialAllSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['specialType', 'specialTypeStr'],
						data : tradeDataStore.folderSpecialAllData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'specialTypeStr', 
						valueField : 'specialType',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='rmbBuySellSelectT'){
	        	   var store = new Ext.data.SimpleStore( {
						fields : ['rmbBuySell', 'rmbBuySellStr'],
						data : tradeDataStore.rmbBuySellData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'rmbBuySellStr', 
						valueField : 'rmbBuySell',  
						hiddenName : p[0],
						editable : false,
						typeAhead : true,
						value :-1,
						mode : 'local',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
	           }else if(p[2]=='clientTypeSelect'){  // 客户类型下拉
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['type','typeStr'],
	          		data : clientTypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'typeStr',　// 显示值
		              valueField: 'type',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'请选择客户类型',
				      selectOnFocus:true,
				      resizable:true,
				      value:'0'
		              });
                }else if(p[2]=='channeltypeSelect'){  // 客户类型下拉
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['type','typeStr'],
	          		data : tradeDataStore.channeltypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'typeStr',　// 显示值
		              valueField: 'type',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'请选择客户类型',
				      selectOnFocus:true,
				      resizable:true,
				      value:'-1'
		              });
                }else if(p[2]=='forCustSelect'){  // 客户类型下拉
                	var store = new Ext.data.SimpleStore({
                		fields: ['forCusType','forCusTypeStr'],
                		data : forCustTypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'forCusTypeStr',　// 显示值
                		valueField: 'forCusType',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'请选择客户类型',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
	           else if(p[2]=='clientRfqClientSelect'){  // 客户类型下拉
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['rfqClient','rfqClientStr'],
	          		data : rfqClientData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'rfqClientStr',　// 显示值
		              valueField: 'rfqClient',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'请选择客户类型',
				      selectOnFocus:true,
				      resizable:true,
				      value:'-1'
		              });
	             }
                else if(p[2]=='ratePrevTranstypeSelectT'){  // 客户类型下拉
                	var store = new Ext.data.SimpleStore({
                		fields: ['transtype','transtypeStr'],
                		data : transtypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'transtypeStr',　// 显示值
                		valueField: 'transtype',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'请选择客户类型',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
                else if(p[2]=='effectiveSelectT'){  // 客户类型下拉
                	var store = new Ext.data.SimpleStore({
                		fields: ['isEffective','isEffectiveStr'],
                		data : effectiveTypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'isEffectiveStr',　// 显示值
                		valueField: 'isEffective',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'请选择客户类型',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
	           else if(p[2]=='AllCurrencyChsNameT'){ 				// 所有货币中文下拉下拉
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryCurrencyList.action'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','cyCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币中文名称
	              valueField:'cyCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });
	             
	             
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }                         
                
               else if(p[2]=='rateCodeselectT'){ 				// 所有货币对下拉,除套汇
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=-1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }    
	          
	           else if(p[2]=='rateCyUsdselectT'){ 				// 结售汇，直盘
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byPosCyRate&sqlParam.appl=-1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }
              
	           else if(p[2]=='userDeptSelectT'){ // 部门对下拉
		              var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryAjaxDeptList.action'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data'
				           },['deptName','deptId'])    
				      }); 
		              store.load({params:{start:0}});// 部门下拉数据
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'deptName',// 部门显示中文名称
		              valueField:'deptId', // 部门传值 
		              hiddenName:p[0],
		              emptyText:'请选择',
		              // value:'0000',
		              // editable:false,//内容不可编辑
		              typeAhead: true,
		              mode: 'local',
		              width:120,
		              triggerAction: 'all',
		              selectOnFocus:true,
				      resizable:true
		             });	
		             
		               rateCodeCombo=tttt;// 赋值全局变量
		               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
		          }  
              
              else if(p[2]=='forginRateCodeselectT'){ // 外币对货币对下拉
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])    
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:120,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }    
	              
	          else if(p[2]=='cnyRateCodeselectT'){ // 结售汇货币对下拉
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=3'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])    
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:120,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }
	              else if(p[2]=='counttypeselectT'){ 			// 客户优惠下拉
            	 var store = new Ext.data.SimpleStore({
                 fields: ['counttypesec', 'counttypeStr'],
                 data : countTypeData 						// 数据填充下拉框
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'counttypeStr',
	             valueField:'counttypesec',     // 传递值
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:120,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });	
              }
               else if(p[2]=='igxzSelectT'){ 	
            	 var store = new Ext.data.SimpleStore({
                 fields: ['igxz', 'igxzStr'],
                 data : igxzData // 数据填充下拉框
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'igxzStr',// 交易类型
	             valueField:'igxz',     // 传递值
	             hiddenName:p[0],
	             emptyText:'',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:70,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });	
              }
              else if(p[2]=='ratePosSelectT'){ 				// 所有货币对下拉,除套汇
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byPosRate'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// 下拉数据
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// 显示货币对中文名称
	              valueField:'rateCode', // 传值 货币对
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// 赋值全局变量
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }
            else if(p[2]=='bankSelectT'){ // 分行下拉
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/getBankList.do'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['dipname','bankid'])         
			      }); 
	              store.load({params:{start:0}});
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'dipname',
	              valueField:'bankid', 
	              hiddenName:p[0],
	              emptyText:'请选择',
	              // value:'0000',
	              // editable:false,//内容不可编辑
	              typeAhead: true,
	              mode: 'local',
	              width:150,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             rateCodeCombo=tttt;// 赋值全局变量
	             tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	        }
              
				
				else if (p[2] == 'bankTypeSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['bankType', 'bankTypeStr'],
						data : bankTypeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'bankTypeStr', 
						valueField : 'bankType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 80,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}else if (p[2] == 'cashFlowTypeSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['cashFlowType', 'cashFlowTypeStr'],
						data : cashFlowTypeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'cashFlowTypeStr', 
						valueField : 'cashFlowType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 80,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'bankFlagSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['bankFlag', 'bankFlagStr'],
						data : bankFlagData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'bankFlagStr', 
						valueField : 'bankFlag',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 80,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'tradeTypeSelectT') {
					var title = document.title;
					var tradeTypeDataTemp = new Array();
						tradeTypeDataTemp.push(tradeTypeData[0]);
					if(title.indexOf('即期')!=-1){
						tradeTypeDataTemp.push(tradeTypeData[1]);
						tradeTypeDataTemp.push(tradeTypeData[2]);
						tradeTypeDataTemp.push(tradeTypeData[9]);
					}else if(title.indexOf('远期')!=-1){
						tradeTypeDataTemp.push(tradeTypeData[3]);
						tradeTypeDataTemp.push(tradeTypeData[4]);
						tradeTypeDataTemp.push(tradeTypeData[7]);
						tradeTypeDataTemp.push(tradeTypeData[8]);
					}else if(title.indexOf('掉期')!=-1){
						tradeTypeDataTemp.push(tradeTypeData[5]);
						tradeTypeDataTemp.push(tradeTypeData[6]);
					}
					var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeTypeDataTemp 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'sourceTypeSelectT') {
					var title = document.title;
					var tradeTypeDataTemp = new Array();
						tradeTypeDataTemp.push(sourceTypeData[0]);
						tradeTypeDataTemp.push(sourceTypeData[1]);
						tradeTypeDataTemp.push(sourceTypeData[2]);
						tradeTypeDataTemp.push(sourceTypeData[3]);
						tradeTypeDataTemp.push(sourceTypeData[4]);
//					if(title.indexOf('即期')!=-1){
//						tradeTypeDataTemp.push(sourceTypeData[1]);
//						tradeTypeDataTemp.push(sourceTypeData[2]);
//					}else if(title.indexOf('远期')!=-1){
//						tradeTypeDataTemp.push(sourceTypeData[3]);
//						tradeTypeDataTemp.push(sourceTypeData[4]);
//						tradeTypeDataTemp.push(sourceTypeData[7]);
//						tradeTypeDataTemp.push(sourceTypeData[6]);
//					}else if(title.indexOf('掉期')!=-1){
//						tradeTypeDataTemp.push(sourceTypeData[5]);
//						tradeTypeDataTemp.push(sourceTypeData[6]);
//					}
					var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : tradeTypeDataTemp 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}				
                //ACC
				else if(p[2]=='accTranSelectT'){ // 货币起息日产品类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applCurrencyNothTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
				else if (p[2] == 'isitemIdSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['tradeType', 'tradeTypeStr'],
						data : isitemIdData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tradeTypeStr', 
						valueField : 'tradeType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '',
						width : 90,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'ischeckflagSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['ischeckflag', 'ischeckflagStr'],
						data : isCheckFlagData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'ischeckflagStr', 
						valueField : 'ischeckflag',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 60,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}	
				else if (p[2] == 'checkTypeSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['checkType', 'checkTypeStr'],
						data : checkTypeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'checkTypeStr', 
						valueField : 'checkType',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 100,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'checkStateSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['checkState', 'checkStateStr'],
						data : checkStateData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'checkStateStr', 
						valueField : 'checkState',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 100,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}
				else if (p[2] == 'tranModeSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['tranMode', 'tranModeStr'],
						data : tranModeData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'tranModeStr', 
						valueField : 'tranMode',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 80,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}	
				else if (p[2] == 'eventFlagSelectT') {
					var store = new Ext.data.SimpleStore( {
						fields : ['flag', 'flagStr'],
						data : eventFlagData 
					});
					tttt = new Ext.form.ComboBox( {
						name : p[0],
						store : store,
						displayField : 'flagStr', 
						valueField : 'flag',  
						hiddenName : p[0],
						emptyText : '请选择',
						editable : false,
						typeAhead : true,
						mode : 'local',
						value : '-1',
						width : 60,
						triggerAction : 'all',
						selectOnFocus : true,
						resizable : true
					});
				}	
	           
	            else if(p[2]=='applTypeselectT'){ // 货币产品类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
	              }
	            else if(p[2]=='tradeDireT'){ // 交易方向下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDireData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
	              }
	            else if(p[2]=='tradeDireTNoAll'){ // 交易方向下拉
	            	var tradeDireDataTemp = new Array();
						tradeDireDataTemp.push(tradeDireData[1]);
						tradeDireDataTemp.push(tradeDireData[2]);
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDireDataTemp // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
	              }
	            else if(p[2]=='tradeBSDireT'){ // 交易B/S方向下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDataStore.tradeBSDireData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
	              }
	            else if(p[2]=='branchProfitApplTypeselectT'){ // 货币产品类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		             tttt.on("select",function(){
		            	 var value = this.getValue();
		            	 branchProfitIsBuySelect.setValue('-1');
		            	 if(value == '-1'){
		            		 branchProfitIsBuyStore.loadData([
				                                                ['-1', '所有']
				                                                 ],[]);
		            	 }else if(value == '1'){
		            		 branchProfitIsBuyStore.loadData([
				                                                ['-1', '所有']
				                                                 ],[]);
		            	 }else if(value == '3'){
		            		 branchProfitIsBuyStore.loadData([
		  	                                                ['-1', '所有'],
			                                                ['1', '结汇'],
			                                                ['2', '购汇']
			                                                 ],[]);
		            	 }
		             });
	              }
	            else if(p[2]=='branchProfitClientTypeSelectT'){ // 分行
	            	var store = new Ext.data.SimpleStore({
	            		fields: ['type', 'typeStr'],
	            		data : bracnhProfitClientTypeData // 数据填充下拉框
	            	});
	            	tttt = new Ext.form.ComboBox({
	            		name:p[0],
	            		store: store,
	            		displayField:'typeStr',// 交易类型
	            		valueField:'type',     // 传递值
	            		hiddenName:p[0],
	            		emptyText:'请选择',
	            		editable:false,
	            		typeAhead: true,
	            		mode: 'local',
	            		value:'-1',
	            		width:90,
	            		triggerAction: 'all',
	            		selectOnFocus:true,
	            		resizable:true
	            	});	
	            }
	            else if(p[2]=='branchProfitIsBuySelectT'){ // 分行
	            	var store = new Ext.data.SimpleStore({
	            		fields: ['type', 'typeStr'],
	            		data : branchProfitIsBuyData // 数据填充下拉框
	            	});
	            	branchProfitIsBuyStore = store;
	            	tttt = new Ext.form.ComboBox({
	            		name:p[0],
	            		store: store,
	            		displayField:'typeStr',// 交易类型
	            		valueField:'type',     // 传递值
	            		hiddenName:p[0],
	            		emptyText:'请选择',
	            		editable:false,
	            		typeAhead: true,
	            		mode: 'local',
	            		value:'-1',
	            		width:90,
	            		triggerAction: 'all',
	            		selectOnFocus:true,
	            		resizable:true
	            	});	
	            	branchProfitIsBuySelect = tttt;
	            }
	              else if(p[2]=='sysParamTypeselectT'){ // 参数类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : sysParamTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'0',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
	              }
	           else if(p[2]=='applCurrencyTypeselectT'){ // 货币起息日产品类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
		       else if(p[2]=='applCurrencyNothTypeselectT'){ // 货币起息日产品类型下拉
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applCurrencyNothTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:90,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
		         else if(p[2]=='itemIdselectT'){ // 所有
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : itemIdData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// 交易类型
		             valueField:'itemId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:140,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
		         else if(p[2]=='otherItemIdselectT'){ // 同业交易
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : otherItemIdData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// 交易类型
		             valueField:'itemId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	      
		         } else if(p[2]=='spotFwdTradeTypeSelectT'){ // 
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['typeId', 'typeIdStr'],
	                 data : spotFwdTradeTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeIdStr',// 交易类型
		             valueField:'typeId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'0',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	       
		         }else if(p[2]=='branchProfitTypeSelectT'){ // 
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : branchProfitTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// 交易类型
		             valueField:'type',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	       
		         }else if(p[2]=='possTransTypeDataSelectT'){ // 
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['typeId', 'typeIdStr'],
	                 data : possTransTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeIdStr',// 交易类型
		             valueField:'typeId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'0',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	       
		         }else if(p[2]=='ctpySelectT'){
		        	 var store = new Ext.data.SimpleStore({
		                 fields: ['ctpy', 'ctpyStr'],
		                 data : ctpyData // 数据填充下拉框
		                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'ctpyStr',// 交易类型
		             valueField:'ctpy',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	   
		         }else if(p[2]=='deptDirectionDataSelectT'){
	            	 var store = new Ext.data.SimpleStore({
		                 fields: ['direction', 'directionStr'],
		                 data : deptDirectionData // 数据填充下拉框
		                  });
			             tttt = new Ext.form.ComboBox({
			             name:p[0],
			             store: store,
			             displayField:'directionStr',// 交易类型
			             valueField:'direction',     // 传递值
			             hiddenName:p[0],
			             emptyText:'请选择',
			             editable:false,
			             typeAhead: true,
			             mode: 'local',
			             value:'-1',
			             width:120,
			             triggerAction: 'all',
			             selectOnFocus:true,
					     resizable:true
			             });	       
			         }
		         else if(p[2]=='isStateDataSelectT'){ // 
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['isState', 'isStateStr'],
	                 data : isStateData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'isStateStr',// 交易类型
		             valueField:'isState',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	       
		         }else if(p[2]=='rmbTenDayMonthTradeTypeT'){
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['tradeType', 'tradeTypeStr'],
	                 data : rmbTenDayMonthTradeTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'tradeTypeStr',// 交易类型
		             valueField:'tradeType',     // 传递值
		             hiddenName:p[0],
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'0',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
		         else if(p[2]== 'rmbTenDayMonthReportTypeT'){
		        	 var store = new Ext.data.SimpleStore({
	                 fields: ['reportType', 'reportTypeStr'],
	                 data : rmbTenDayMonthReportTypeData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'reportTypeStr',// 交易类型
		             valueField:'reportType',     // 传递值
		             hiddenName:p[0],
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
                else if(p[2]== 'hasSubT'){
		        	 var store = new Ext.data.SimpleStore({
	                 fields: ['hasSubAllData', 'hasSubAllDataStr'],
	                 data : tradeDataStore.hasSubAllData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'hasSubAllDataStr',// 交易类型
		             valueField:'hasSubAllData',     // 传递值
		             hiddenName:p[0],
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:100,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
                else if(p[2]== 'matchFlagT'){
		        	 var store = new Ext.data.SimpleStore({
	                 fields: ['matchFlagData', 'matchFlagDataStr'],
	                 data : tradeDataStore.matchFlagData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'matchFlagDataStr',// 交易类型
		             valueField:'matchFlagData',     // 传递值
		             hiddenName:p[0],
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'0',
		             width:100,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
                else if(p[2]== 'rmbTenDayMonthDirectionT'){
		        	 var store = new Ext.data.SimpleStore({
	                 fields: ['direction', 'directionStr'],
	                 data : rmbTenDayMonthDirectionData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'directionStr',// 交易类型
		             valueField:'direction',     // 传递值
		             hiddenName:p[0],
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }
                
                
                
                
		         
		         else if(p[2]=='cashFLowItemIdselectT'){ //
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : cashFLowItemIdData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// 交易类型
		             valueField:'itemId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		         }else if(p[2]=='accProductTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accProductTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }else if(p[2]=='accTranTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTranTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             } else if(p[2]=='accDateTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accDateTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }else if(p[2]=='accTremTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTremTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='accDeliveryTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accDeliveryTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='accIncomeTypeDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accIncomeTypeData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='actStateSelectT'){ 	 //交割状态下拉框  
            	 var store = new Ext.data.SimpleStore({
                 fields: ['actState', 'actStateStr'],
                 data : tradeDataStore.actStateData
                  });
             
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'actStateStr', 
	             valueField:'actState',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
	             else if(p[2]=='deliveryStateAllSelectT'){ 	 //交割状态下拉框  
	            	  var store = new Ext.data.SimpleStore({
		                 fields: ['state', 'stateStr'],
		                 data : tradeDataStore.deliveryStateAllData
	                  });
	             
			          tttt = new Ext.form.ComboBox({
			             name:p[0],
			             store: store,
			             displayField:'stateStr', 
			             valueField:'state',
			             hiddenName:p[0],
			             emptyText:'请选择',
			             editable:false,
			             typeAhead: true,
			             mode: 'local',
			             value:'-1',
			             width:100,
			             triggerAction: 'all',
			             selectOnFocus:true,
					     resizable:true
		             });
	             }
                 else if(p[2]=='deliveryStateSelectT'){ 	 //交割状态下拉框  
            	 var store = new Ext.data.SimpleStore({
                 fields: ['state', 'stateStr'],
                 data : tradeDataStore.deliveryStateData
                  });
             
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'stateStr', 
	             valueField:'state',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
	             else if(p[2]=='accTypeSelectT'){ 	 //交割状态下拉框  
            	 var store = new Ext.data.SimpleStore({
                 fields: ['accType', 'accTypeStr'],
                 data : tradeDataStore.accTypeData
                  });
             
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'accTypeStr', 
	             valueField:'accType',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='tranTypeSelectT'){ 	 //交易类型下拉框  
            	 var store = new Ext.data.SimpleStore({
                 fields: ['tranType', 'tranTypeStr'],
                 data : tradeDataStore.specialTypeData
                  });
             
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'tranTypeStr', 
	             valueField:'tranType',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
                 else if(p[2]=='accSettlementSaleDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accSettlementSaleData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }else if(p[2]=='accTypeFLDataT'){ 	   
            	 var store = new Ext.data.SimpleStore({
                 fields: ['status', 'statusStr'],
                 data : accTypeFLData 
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'statusStr', 
	             valueField:'status',
	             hiddenName:p[0],
	             emptyText:'请选择',
	             editable:false,
	             typeAhead: true,
	             mode: 'local',
	             value:'-1',
	             width:100,
	             triggerAction: 'all',
	             selectOnFocus:true,
			     resizable:true
	             });
	             }
				else if(p[2]=='statisticsSelectionT'){ // 
		         	var custType=[
                  ["0","按到期日"],["1","按期限"]];
	            	 var store = new Ext.data.SimpleStore({
		                 fields: ['type', 'typeStr'],
		                 data : custType // 数据填充下拉框
		                  });
			             tttt = new Ext.form.ComboBox({
			             name:p[0],
			             store: store,
			             displayField:'typeStr',// 交易类型
			             valueField:'type',     // 传递值
			             hiddenName:p[0],
			             emptyText:'请选择',
			             editable:false,
			             typeAhead: true,
			             mode: 'local',
			             value:'0',
			             width:80,
			             triggerAction: 'all',
			             selectOnFocus:true,
					     resizable:true
			             });	       
			    }else if(p[2]=='cashFLowItemIdselectT'){ //
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : cashFLowItemIdData // 数据填充下拉框
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// 交易类型
		             valueField:'itemId',     // 传递值
		             hiddenName:p[0],
		             emptyText:'请选择',
		             editable:false,
		             typeAhead: true,
		             mode: 'local',
		             value:'-1',
		             width:120,
		             triggerAction: 'all',
		             selectOnFocus:true,
				     resizable:true
		             });	
		             }
            	tbar.addText(p[1]);// 添加文本
            	tbar.addField(tttt);
 // if(i%5==0){
 // }
            }
           }, 
         getQueryInfo : function(){         // 条件查询按钮
              var param =eforexGrid.queryParam();         // 对象实例中不能用this来引用当前对象，this==window对象
           if(param['sqlParam.startDate'] &&  param['sqlParam.endDate']){
           		if(param['sqlParam.endDate']<param['sqlParam.startDate']){
           			Ext.MessageBox.alert("提示","结束日期不能小于开始日期");
           			return;
           		}
           }
              grid.getDataSource().load({params:param});        
           },
           accountTranInfo2 : function(){
        	   if(selectModel.hasSelection()){
        		var params = eforexGrid.createParam();
	        	var url = Ext.get('accountTranInfoBtn2').dom.getAttribute('url');
	        	if(url.indexOf('?')!=-1){
	        		url += '&'+params;
	        	}else{
	        		url += '?'+params;
	        	}
	        	 popOtherFullWindow(url);
	        	}else{
	         		Ext.MessageBox.alert('提示','请选择要查询的记录。');
		         }
           },
           accountTranInfo3 : function(){
        	   if(selectModel.hasSelection()){
        		var params = eforexGrid.createParam();
	        	var url = Ext.get('accountTranInfoBtn3').dom.getAttribute('url');
	        	if(url.indexOf('?')!=-1){
	        		url += '&'+params;
	        	}else{
	        		url += '?'+params;
	        	}
	        	 popOtherFullWindow(url);
	        	}else{
	         		Ext.MessageBox.alert('提示','请选择要查询的记录。');
		         }
           },
           /////acc
            resetInfo : function(){         // 条件查询按钮
             var abc=document.getElementsByName("plItems");
        	var plstr='';
        	for(var i=0;i<abc.length;i++){
        		if(!abc[i].checked)
        		continue;
        		plstr=abc[i].value+';'+plstr;
        	} 
        	if(plstr.trim()==''){
        		Ext.MessageBox.alert('提示','请选中要重置状态的记录。');
        		return;
        	}
    		Ext.MessageBox.confirm('提示','您确定要修改这些记录吗？',function(btn){
 				if (btn == 'yes') {
					var params = eforexGrid.createParam();
					var form = Ext.get('gridMenu').dom;
					var delDiv = Ext.get('delDiv').dom;
					delDiv.innerHTML = '';
					Ext.MessageBox.wait('数据修改中...', '请稍后...');
					Ext.DomHelper.append(delDiv, {
						tag : 'input',
						type : 'hidden',
						name : 'selItems',
						value : plstr
					}, true);
					 var cb = {
						 success: eforexGrid.commentSuccess ,
						 failure: eforexGrid.commentFailure
					 }
					 var url = Ext.get('resetInfoBtn').dom.getAttribute('url');
					 url = url+"&selItems="+plstr
			Ext.lib.Ajax.request("POST",url,cb);	
				} else {

				}
			})
           },
           accountCheckInfo : function(){         // 对账按钮
        	    var param =eforexGrid.queryParam(); 
    			Ext.MessageBox.confirm('提示','您确定要对账吗？',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('对账中...', '请稍后...');
					 var cb = {
						 success: eforexGrid.commentSuccess ,
						 failure: eforexGrid.commentFailure
					 }
					 var url = Ext.get('accountCheckBtn').dom.getAttribute('url');
					 url = url+"&accTranExecption.frontCheckDate=" + param['accTranExecption.frontCheckDate']
					 Ext.lib.Ajax.request("POST",url,cb);	
				} else {

				}
			})
           },
           accountCheckInfoAgain : function(){         // 重新对账按钮    
    		Ext.MessageBox.confirm('提示','您确定要重新对账吗？',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('对账中...', '请稍后...');
					 var cb = {
						 success: eforexGrid.commentSuccess ,
						 failure: eforexGrid.commentFailure
					 }
					 var url = Ext.get('accountCheckAgainBtn').dom.getAttribute('url');
					Ext.lib.Ajax.request("POST",url,cb);	
				} else {

				}
			})
           },
           accountTranInfo : function(){
        	   if(selectModel.hasSelection()){
        		var params = eforexGrid.createParam();
	        	var url = Ext.get('accountTranInfoBtn').dom.getAttribute('url');
	        	if(url.indexOf('?')!=-1){
	        		url += '&'+params;
	        	}else{
	        		url += '?'+params;
	        	}
	        	 popOtherFullWindow(url);
	        	}else{
	         		Ext.MessageBox.alert('提示','请选中要进行冲正的交易记录。');
		         }
           },
           ////acc
           queryXlsParam : function(){    // 查询条件组合参数
         	 var xlsParams = {start:0, limit:LIMIT};   
 	         if(Ext.get("queryDiv")){// 查询条件Div层，处理所有的条件输入
 			     var a= Ext.get("queryDiv").dom.innerHTML;	 	
                  var arr=a.split(';');
                  for(var i=0;i<arr.length;i++){   
             	     var obj= arr[i];          // 取数组中元素
                      var p=obj.split("=");     // 分割字符串
                     

             		if(Ext.get(p[0]).dom.getAttribute('type')=='hidden'){
             			var displayVal = Ext.get(p[0]).getNextSibling().value;
                         if(displayVal=='请选择'){
                         	Ext.get(p[0]).dom.value = '';// 设置空值
                         }
             		    if(displayVal.trim().length == 0){
            		         Ext.get(p[0]).dom.value = '';// 设置空值
            		        }
             		};   
             		xlsParams[p[0]] = Ext.get(p[0]).getValue();// 控制判断
                  }      
 			}	
 			 return xlsParams;
 		},
           
         queryParam : function(){    // 查询条件组合参数
        	  qParams = {start:0, limit:LIMIT};   
	         if(Ext.get("queryDiv")){// 查询条件Div层，处理所有的条件输入
			     var a= Ext.get("queryDiv").dom.innerHTML;	 	
                 var arr=a.split(';');
                 for(var i=0;i<arr.length;i++){   
            	     var obj= arr[i];          // 取数组中元素
                     var p=obj.split("=");     // 分割字符串

            		if(Ext.get(p[0]).dom.getAttribute('type')=='hidden'){
            			var displayVal = Ext.get(p[0]).getNextSibling().value;
                        if(displayVal=='请选择'){
                        	Ext.get(p[0]).dom.value = '';// 设置空值
                        }
            		    if(displayVal.trim().length == 0){
           		         Ext.get(p[0]).dom.value = '';// 设置空值
           		        }
            		};   
            	    qParams[p[0]] = Ext.get(p[0]).getValue();// 控制判断
                 }      
			}	
			
			 return qParams;
		},     
        
		PagingToolbarOnClick : function(which){// 处理分页 下一页，前一页，等功能
			var ds = this.ds;
			if(qParams==null){
				qParams={};
			}
			switch (which) {
				case "first" :
					qParams['start'] = 0;
					qParams['limit'] = this.pageSize;
					ds.load( {params : qParams});
					break;
				case "prev" :
					qParams['start'] = Math.max(0, this.cursor - this.pageSize);
					qParams['limit'] = this.pageSize;
					ds.load( {params : qParams});
					break;
				case "next" :
					qParams['start'] = this.cursor + this.pageSize;
					qParams['limit'] = this.pageSize;
					ds.load( {params : qParams});
					break;
				case "last" :
					var total = ds.getTotalCount();
					var extra = total % this.pageSize;
					var lastStart = extra ? (total - extra) : total
							- this.pageSize;
					qParams['start'] = lastStart;
					qParams['limit'] = this.pageSize;
					ds.load({params : qParams});
					break;
				case "refresh" :
					qParams['start'] = this.cursor;
					qParams['limit'] = this.pageSize;
					ds.load( {params : qParams});
					break;
			}
		},
		 PagingToolbarOnKeydown : function(e) {
			qParams = qParams || {
				limit : this.pageSize
			};
			var k = e.getKey();
			var d = this.getPageData();
			if (k == e.RETURN) {
				var v = this.field.dom.value, pageNum;
				if (!v || isNaN(pageNum = parseInt(v, 10))) {
					this.field.dom.value = d.activePage;
					return;
				}
				pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
				qParams['start'] = pageNum * this.pageSize;
				this.ds.load( {
					params : qParams
				});
				e.stopEvent();
			} else if (k == e.HOME || (k == e.UP && e.ctrlKey)
					|| (k == e.PAGEUP && e.ctrlKey)
					|| (k == e.RIGHT && e.ctrlKey) || k == e.END
					|| (k == e.DOWN && e.ctrlKey) || (k == e.LEFT && e.ctrlKey)
					|| (k == e.PAGEDOWN && e.ctrlKey)) {
				var pageNum = (k == e.HOME || (k == e.DOWN && e.ctrlKey)
						|| (k == e.LEFT && e.ctrlKey) || (k == e.PAGEDOWN && e.ctrlKey))
						? 1
						: d.pages;
				this.field.dom.value = pageNum;
				qParams['start'] = (pageNum - 1) * this.pageSize;
				this.ds.load( {
					params : qParams
				});
				e.stopEvent();
			} else if (k == e.UP || k == e.RIGHT || k == e.PAGEUP
					|| k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN) {
				var v = this.field.dom.value, pageNum;
				var increment = (e.shiftKey) ? 10 : 1;
				if (k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN)
					increment *= -1;
				if (!v || isNaN(pageNum = parseInt(v, 10))) {
					this.field.dom.value = d.activePage;
					return;
				} else if (parseInt(v, 10) + increment >= 1
						& parseInt(v, 10) + increment <= d.pages) {
					this.field.dom.value = parseInt(v, 10) + increment;
					pageNum = Math.min(Math.max(1, pageNum + increment),
							d.pages)
							- 1;
					qParams['start'] = pageNum * this.pageSize;
					this.ds.load( {
						params : qParams
					});
				}
				e.stopEvent();
			}
		},
        getTabParam : function(ele){
        	var mainParams = Ext.get('dlgTabs').dom.elements[0].getAttribute('params').split(",");    
        	var params = ele.getAttribute('params').split(",");
        	var bean = ele.getAttribute('bean');
        	var str = '';
        	for (var i = 0; i < params.length; i++) {
        		str += bean + '.' + params[i] + '=' + selectModel.getSelected().get(mainParams[i]) + '&';	
        	}
        	return str + 'subAction=update';
        },
        createParam : function(){
			var elements = gridTitle.dom.elements;
			var str = '';
			for(var i=0; i<elements.length; i++){
				if(elements[i].getAttribute('byInfo') != null){
					str = str + elements[i].getAttribute('bean') + '.' + elements[i].getAttribute('id') + '=' +
					selectModel.getSelected().get(elements[i].getAttribute('id')) + '&';
				}
			}
			return str;

        },       
        printGirdInfo:function(){// 数据层Grid打印输出,打印分页问题
           var tabHead=document.title;// 取jsp页面TITLE值
           // grid.getDataSource().load({params:{start: 0, limit: 500}});
           var tabTitle=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-header",true);
           var tabBody=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-body",true);
           
           var elements = gridTitle.dom.elements;
		   var properties = new Array();
		   var tiles=new Array();// 作为列头部数据
		   var jIndex=0;
		   for(var i=0; i<elements.length; i++){
			   	if(elements[i].getAttribute('hidden') != null){
			     continue;// 忽略不直接显示的列数据
			   	}
			   	properties[jIndex]=elements[i].getAttribute('id');
			   	tiles[jIndex]=elements[i].getAttribute('colTitle');
			   	jIndex+=1;
		   }
           exportGridExcelData(tabHead,tabTitle.firstChild,tabBody.firstChild,tiles.length);
        },
        
        displayBankGraph:function(){
            var url = Ext.get('dspBankGraph').dom.getAttribute('url')
            popWindow(url,400,600);
		},
        
        
         exportRightsById:function(){
         	if(selectModel.hasSelection()){
	            var param =eforexGrid.createParam();
	             
	           printDataStore = new Ext.data.Store({
			       proxy: new Ext.data.HttpProxy({url: '/base/getRightsByRoleId.action'}),
			       reader: new Ext.data.JsonReader({
		        	   totalProperty: 'total',
		        	   root: 'data'
		           },
		           eforexRecord)
			    }); 
	            
			    tabHead ="角色授权管理";
			    tabTitle = ['角色编号','角色名称','权限代码','权限名称','产品名称'];
			    properties =['roleid','rolename','permit','name','appname'];
				
				printDataStore.load({params:param,
				  callback:function(){
				    var jsonDatas = printDataStore.reader.jsonData['data'];
				    exportRightsExcelJsonData(tabHead,tabTitle,jsonDatas,properties);
				  }
				});
         	}else{
         		Ext.MessageBox.alert('提示','请选中要导出的角色');
         	}
        },
        
        printAllGirdBackInfo:function(){// 数据层Grid打印输出,打印分页问题
        	var param =eforexGrid.queryXlsParam(); // 无限制查询所有数据并执行打印至excel中去
        	param['limit']=grid.getDataSource().getTotalCount();
        	param['byNeg']='true';
        	param['type']='xls';
        	var exlURL = listURL
        	for(var p in param){
        		if(typeof(param[p])!="function"){ 
        			if(p != ''){
        				exlURL += '&' + p + '=' + param[p];
        			}
        		}
        	}
        	window.location.href = exlURL ;
        	/*Ext.Ajax.request({
  			  params: param,
  			  method:'POST',
  			  url:listURL,
  			  success : function(o) {
  			  	},
  			  failure : function(o) { Ext.MessageBox.alert('消息', '下载失败!');}
  			});*/
//        	window.location.href = exlURL ;
        },
        printAllGirdInfo:function(){// 数据层Grid打印输出,打印分页问题
            var param =eforexGrid.queryParam(); // 无限制查询所有数据并执行打印至excel中去
            param['limit']=grid.getDataSource().getTotalCount();
            param['byNeg']='true';
             
            var tabHead=document.title;// 取jsp页面TITLE值直接作为输出excel的sheet名称即第一行的标题
           // grid.getDataSource().load({params:{start: 0, limit: 500}});
            var tabTitle=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-header",true);
            var tabBody=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-body",true);
           // exportGridExcelData(tabHead,tabTitle.firstChild,tabBody.firstChild);

        	var elements = gridTitle.dom.elements;
			var properties = new Array();
			var tiles=new Array();// 作为列头部数据
			var jIndex=0;
			for(var i=0; i<elements.length; i++){
			   if(elements[i].getAttribute('hidden') != null){
			     continue;// 忽略不直接显示的列数据
			   }
			   properties[jIndex]=elements[i].getAttribute('id');
			   tiles[jIndex]=elements[i].getAttribute('colTitle');
			   jIndex+=1;
			}
			printDataStore.load({params:param,
			  callback:function(){
			    var jsonDatas = printDataStore.reader.jsonData['data'];// 为何第一次竟不能执行到此。。。undefined.
			    exportGridExcelJsonData(tabHead,tabTitle.firstChild,jsonDatas,tiles.length,properties);
			  }
			});
        },
        
        updateInfo : function(){
			// var amountflag=eforexGrid.checkTradePositionAmount2();
			// if(!amountflag){
			// return;
			// }
			
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
			}
			if(infoDlg)infoDlg.hide();
        }, 
        
        doBreach : function(isFource){
// var amountflag=eforexGrid.checkTradePositionAmount2();
// if(!amountflag){
// return;
// }	
		var breachAmount=parseFloat(Formatter.toNumber(Ext.get("breachTrade.breachAmount").dom.value));
		var operAmt=parseFloat(Formatter.toNumber(Ext.get("breachTrade.operAmt").dom.value));
		if(breachAmount>operAmt){
			Ext.MessageBox.alert('提示',"违约金额不能大于可操作金额!!!");
			return;
		}
		var amountflag=eforexGrid.checkDLFunc("breachTrade.instrument"); //Kgr选择
         	if(!amountflag){
         		return;
         	}
        var amountflag=eforexGrid.checkDLFunc("breachTrade.marginCode"); //保证金货币
         	if(!amountflag){
         		return;
         	}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					if(!valiBreachTradeElement()){
						return;
					}
					if(isFource == 1){//强制违约
					  eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_BREACH,'fbreachBtn');
					}else{
					  eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_BREACH,'breachBtn');
					}
			}
        }, 
       doSpecialTradeAuth : function(inputType,btnname){
        	var commitFun = function(){
						switch(inputType){
							case SPECIAL_TYPE_BREACH :
								actionPath = '/forex/brachTradeAuth';
								break;
							case SPECIAL_TYPE_E_DELIVERY :
								actionPath = '/forex/edeliveryTradeAuth';
								break;
							case SPECIAL_TYPE_E_DURATION :
								actionPath = '/forex/edurationTradeAuth';
								break;
							case SPECIAL_TYPE_E_BREACH :
								actionPath = '/forex/ebrachTradeAuth';
								break;
							case SPECIAL_TYPE_DURATION :
								actionPath = '/forex/durationTradeAuth';
								break;
							case SPECIAL_TYPE_ALL_BREACH :
								actionPath = '/forex/allbreachTradeAuth';
								break;
							case SPECIAL_TYPE_DELIVERY :
								actionPath = '/forex/deliveryTradeAuth';
								break;
							case SPECIAL_TYPE_DELIVERY_CANCEL :
								actionPath = '/forex/deliveryCancelTradeAuth';
								break;
							default :
								return;
						}
						eforexGrid.authCommit = function(){
						   eforexGrid.confirmTradeAction(btnname);
					    };
						eforexGrid.checkAuthRight();
        	};
				 commitFun();
		},
        authDeliveryedErase : function(){
            //设置冲正交易授权页面信息；
        	var itemid = Ext.get('trade.itemId').dom.value;
        	var appl = Ext.get('trade.appId').dom.value;
        	var subAction = '';
        	//alert(itemid + ' == ' + appl);
        	if((itemid == 0 || itemid == 40)&& appl == 3){//结售汇
        		subAction = '?subAction=DELERASERMB'
        	}else if((itemid == 0 || itemid == 40)&& appl == 1){//外汇隔日
        		subAction = '?subAction=DELERASEFX'
        	}else if(itemid == 5 && appl == 3){//内部结售汇隔日
        		subAction = '?subAction=DELERASERMBDEPT'
        	}
		    actionPath = '/forex/doEraseAuth'+subAction;
		    eforexGrid.authCommit  = function(data){
		    	if(itemid == 5){
		    		eforexGrid.doDeptDeliveryedErase();
		    	}else if(itemid == 0 || itemid == 40){
		    		eforexGrid.doDeliveryedErase();
		    	}
		    };
        	eforexGrid.checkAuthRight();
        },
        
        authErase : function(){
      	   //设置冲正交易授权页面信息；
      	   var itemid,appl,subAction;
      	   if(Ext.get('trade.itemId')){
	        	 itemid = Ext.get('trade.itemId').dom.value;
	        	 appl = Ext.get('trade.appId').dom.value;
	        	 subAction = '';
             }else if(Ext.get('forwardTrade.itemId')){
	      		  itemid = Ext.get('forwardTrade.itemId').dom.value;
		       	 appl = Ext.get('forwardTrade.appId').dom.value;
		       	 subAction = '';
        	}else if(Ext.get('swapTrade.itemId')){
	      		  itemid = Ext.get('swapTrade.itemId').dom.value;
		       	 appl = Ext.get('swapTrade.appId').dom.value;
		       	 subAction = '';
        	}
	        	if(itemid == 0 && appl == 3){//结售汇
	        		subAction = '?subAction=ERASERMB'
	        	}else if(itemid == 0 && appl == 1){//外汇隔日
	        		subAction = '?subAction=ERASEFX'
	        	}else if(itemid == 5 && appl == 3){//内部结售汇隔日
	        		subAction = '?subAction=ERASERMBDEPT'
	        	}else if(itemid == 5 && appl == 1){//内部外汇
	        		subAction = '?subAction=ERASEFXDEPT'
	        	}else if(itemid == 40 && appl == 3){//结售汇T+N
	        		subAction = '?subAction=ERASERMBTN'
	        	}else if(itemid == 40 && appl == 1){//外汇T+N
	        		subAction = '?subAction=ERASEFXTN'
	        	}
	      
		    actionPath = '/forex/doEraseAuth'+subAction;
		    eforexGrid.authCommit = function(data){
		    	if(itemid == 5){
		    		eforexGrid.doDeptErase();
		    	}else if(itemid == 0 || itemid == 40){
		    		eforexGrid.doErase();
		    	}
		    };
        	eforexGrid.checkAuthRight();
        },
        updateDeptPropertyAuth : function(){
        	actionPath = '/forex/updateDeptPropertiesAuth';
        	eforexGrid.authCommit = function(data){
		    	eforexGrid.updateDeptProperty();
		    };
        	eforexGrid.checkAuthRight();
        },
        updateDeptProperty : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        doDeptErase : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('deptEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doErase : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('eraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDeptDeliveryedErase : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('deptDelveryedEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDeliveryedErase : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('delveryedEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doResendIs : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('resendIsBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doReverseIs : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('reverseIsBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doGapTrade : function(){
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('doGapBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDuration : function(){
        	if(Ext.get('isHolidayFlag').dom.value=='true'){
			Ext.Msg.alert("提示","展期远端起息日不能为节假日！!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
				if(!valiDurationTradeElement()){
					return;
				}
					 eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_BREACH,'durationBtn');
			}
        }, 
        
        doFarDuration : function(){
			if(Ext.get('isHolidayFlag').dom.value=='true'){
			Ext.Msg.alert("提示","远端展期起息日不能为节假日！!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
				if(!valiDurationTradeElement()){
					return;
				}
			   eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_DURATION,'farDurationBtn');
			}
        }, 
        
        doEarlyDeli : function(){
 
			if(Ext.get('isHolidayFlag').dom.value=='true'){
			Ext.Msg.alert("提示","提前交割起息日不能为节假日！!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// 是否需要校验提示性错误信息
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
				if(!valiEarlyDeliTradeElement()){
					return;
				}
				if(!specialTradeContext.checkValuedate()){
					return;
				}
					var formEl = content.getEl().child("form").dom;	
					var x = Ext.get('eDeliBtn');
					var btnname = 'eDeliBtn';
					if(!x){
						x = Ext.get('eDeliSwapBtn');
						btnname = 'eDeliSwapBtn';
					}
				   eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_DELIVERY,btnname);
			}
        },
        
        doDelivery : function(){
        
        		Ext.get('custDelivery.operAmount1').dom.value=Formatter.toNumber(Ext.get('custDelivery.operAmount1').dom.value);
            	Ext.get('custDelivery.operAmount2').dom.value=Formatter.toNumber(Ext.get('custDelivery.operAmount2').dom.value);
            	Ext.get('custDelivery.operAmount3').dom.value=Formatter.toNumber(Ext.get('custDelivery.operAmount3').dom.value);
            	Ext.get('custDelivery.operAmount4').dom.value=Formatter.toNumber(Ext.get('custDelivery.operAmount4').dom.value);
				var tranType=1;
				if(Ext.get('custDelivery.tranType'))tranType=Number(Ext.get('custDelivery.tranType').dom.value);
				/**if(Ext.get('custDelivery.operAmount1').dom.value == 0){
					Ext.Msg.alert('提示', "交割金额1不能为0，请重新输入");
					return ;
				}
				
				if(Ext.get('custDelivery.operAmount2').dom.value == 0){
					Ext.Msg.alert('提示', "交割金额2不能为0，请重新输入");
					return ;
				}**/
				if(tranType!=3&&tranType!=12&&tranType!=15){//违约不用判断account
				if(Ext.get('custDelivery.account1')){
	        		if(Ext.get('custDelivery.account1').dom.value == null || Ext.get('custDelivery.account1').dom.value.trim()==''){
		        		Ext.Msg.alert("错误","客户帐号不能为空,请重新输入!");
		        		return false;
	        		}
        		}
	        	if(Ext.get('custDelivery.account2')){
	        		if(Ext.get('custDelivery.account2').dom.value == null ||Ext.get('custDelivery.account2').dom.value.trim()==''){
		        		Ext.Msg.alert("错误","客户帐号不能为空,请重新输入!");
		        		return false;
	        		}
	        	}
	        	}
	        	if(Ext.get('custDelivery.gcAccount')){
	        		if(Ext.get('custDelivery.gcAccount').dom.value == null ||Ext.get('custDelivery.gcAccount').dom.value.trim()==''){
		        		Ext.Msg.alert("错误","轧差帐号不能为空,请重新输入!");
		        		return false;
	        		}
	        	}
				eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_DELIVERY,'deliveryBtn');
        },
        
        doCancelDelivery : function(){
        	eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_DELIVERY_CANCEL,'deliveryCancelBtn');
        },
        
        doAuthCheck:function(){
        	var tradeLoadCb = function(e,b,o){
				dialogWa.setContentSize(350,contentWa.getEl().dom.scrollHeight);// 控制授权窗口显示大小
		    };
                if(!dialogWa){// 授权窗口
                  this.initAuthSystem();
                }
			    var layoutWa = dialogWa.getLayout();
	    	    layoutWa.beginUpdate();
			    layoutWa.add('center',contentWa);
	            var update = contentWa.getUpdateManager(); // 面板更新器设置
				update.update({
					   url:'/base/Auth.jsp',
				       params:{},
				       callback:tradeLoadCb,// 回调函数
				       nocache:true,
					   scope:this		
				});     // 提交后台刷新数据
				layoutWa.endUpdate();
				dialogWa.show();   // 对话框显示
				// dialogWa.moveTo(dialogWa.xy[0],Ext.lib.Dom.getViewHeight()-dialogWa.getEl().getHeight());//暂时先这样干
				dialogWa.moveTo(650,200);// 暂时先这样干
        },
        
        delPlInfo:function(){// 批量删除操作
        	var abc=document.getElementsByName("plItems");
        	var plstr='';
        	for(var i=0;i<abc.length;i++){
        		if(!abc[i].checked)
        		continue;
        		plstr=abc[i].value+';'+plstr;
        	} 
        	if(plstr.trim()==''){
        		Ext.MessageBox.alert('提示','请选中要删除的记录。');
        		return;
        	}
        	
    		Ext.MessageBox.confirm('提示','您确定要删除这条记录吗？',function(btn){
 				if (btn == 'yes') {
					var params = eforexGrid.createParam();
					var form = Ext.get('gridMenu').dom;
					var delDiv = Ext.get('delDiv').dom;
					delDiv.innerHTML = '';
					Ext.MessageBox.wait('数据删除中...', '请稍后...');
					Ext.DomHelper.append(delDiv, {
						tag : 'input',
						type : 'hidden',
						name : 'selItems',
						value : plstr
					}, true);
					
			Ext.lib.Ajax.formRequest(form, Ext.get('delPlBtn').dom.getAttribute('action'),
               {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
				} else {

				}
			})
        },
        
        deleteInfo : function(){
        	 if(selectModel.hasSelection()){
	 			Ext.MessageBox.confirm('提示','您确定要删除这条记录吗？',function(btn){
	 				if(btn == 'yes'){
	 					var params = eforexGrid.createParam();
	 					var form = Ext.get('gridMenu').dom;
	 					var delDiv = Ext.get('delDiv').dom;
	 					delDiv.innerHTML = '';
	 					Ext.MessageBox.wait('数据删除中...','请稍后...');
	 					var objs = params.split('&');
	 					
	 					for(var j=0; j<objs.length-1; j++){
		 					var paramArrays = objs[j].split('=');
		 					for(var i=0; i<paramArrays.length; i++){
		 						if(i % 2 != 0){
				 					Ext.DomHelper.append(delDiv,{
				 						tag : 'input',
				 						type : 'hidden',
				 						name : 'selItems',
				 						value : paramArrays[i]
				 					},true);
			 					}
		 					}
		 				}
						Ext.lib.Ajax.formRequest(form, Ext.get('deleteBtn').dom.getAttribute('action'),
                    	{success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
	 				}
	 			}); 			
	         }else{
	         	Ext.MessageBox.alert('提示','请选中要删除的记录。');
	         }
        },
        resendInfo : function(){
        	if(selectModel.hasSelection()){
        		Ext.MessageBox.confirm('提示','您确定要补发这条记录吗？',function(btn){
        			if(btn == 'yes'){
        				var params = eforexGrid.createParam();
    					Ext.Ajax.request({
    		  			  	method: 'POST',
    		  			  	url: Ext.get('resendBtn').dom.getAttribute('action')+'?'+params,
    		  			  	success: function(o){
    			    					var data = o.responseText;
    			    					if(data.indexOf('ERROR')!= -1){
    			    					     Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));			    			
    			    					}else{
    			    						eforexGrid.refresh();
    			    					}
        					}, 
    		  				failure: eforexGrid.commentFailure
    		  			});
        			}
        		}); 			
        	}else{
        		Ext.MessageBox.alert('提示','请选中要补发的记录。');
        	}
        },
        rebatchInfo : function(){
        	Ext.MessageBox.confirm('提示','您确定清算未清算的记录吗？',function(btn){
    			if(btn == 'yes'){
    				Ext.Ajax.request({
		  			  	method:'POST',
		  			  	url: Ext.get('rebatchBtn').dom.getAttribute('action'),
		  			  	success: function(o){
			    					var data = o.responseText;
			    					if(data == 'success'){
			    						eforexGrid.refresh();
			    					}else if(data.indexOf('ERROR')!= -1){
			    					     Ext.MessageBox.alert('错误',data.substring(data.indexOf('ERROR')+5));			    			
			    					}else if(data.indexOf('TipOk')!= -1){
				    					 Ext.MessageBox.alert('提示',data.substring(data.indexOf('TipOk')+5));
				    					 eforexGrid.refresh();			    			
									}
    					}, 
		  				failure: eforexGrid.commentFailure
		  			});
				}
			});
        },
        deleteClientInfo : function(){
       	 if(selectModel.hasSelection()){
	 			Ext.MessageBox.confirm('提示','删除客户会级联删除相关的优惠信息，是否继续？',function(btn){
	 				if(btn == 'yes'){
	 					var params = eforexGrid.createParam();
	 					var form = Ext.get('gridMenu').dom;
	 					var delDiv = Ext.get('delDiv').dom;
	 					delDiv.innerHTML = '';
	 					Ext.MessageBox.wait('数据删除中...','请稍后...');
	 					var objs = params.split('&');
	 					for(var j=0; j<objs.length-1; j++){
		 					var paramArrays = objs[j].split('=');
		 					for(var i=0; i<paramArrays.length; i++){
		 						if(i % 2 != 0){
				 					Ext.DomHelper.append(delDiv,{
				 						tag : 'input',
				 						type : 'hidden',
				 						name : 'selItems',
				 						value : paramArrays[i]
				 					},true);
			 					}
		 					}
		 				}
						Ext.lib.Ajax.formRequest(form, Ext.get('deleteClientBtn').dom.getAttribute('action'),
                   	{success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
	 				}
	 			}); 			
	         }else{
	         	Ext.MessageBox.alert('提示','请选中要删除的记录。');
	         }
       },
        doAllAction : function(){
			var subAction = Ext.get("subAction").getValue(); 
	        	if(subAction.indexOf('insert') != -1){
	        		if(!eforexGrid.validRelationParams()){
	        			Ext.MessageBox.alert('提示','关联字段不相等，请重新输入.');
	        			return;
	        		}    		
	        	}  
	        	eforexGrid.formRequestSend();
        },
       
        formRequestSend : function(){
        	if(cbCounter > eval(dlgTabs).elements.length -1)
        	    return;
        	var panel = infoDlg.getLayout().getRegion("center").getPanel('panel'+cbCounter);
        	var formEl = panel.getEl().child("form");
        	if(!formEl){
        		cbCounter++;
        		eforexGrid.formRequestSend();
        		return; 
        	}

        	var action = formEl.dom.action;
        	var subAction = formEl.dom.elements("subAction").value;
        	if(action.indexOf(subAction) == -1){
        		action = action.substring(0,action.lastIndexOf("/")+1) + subAction + action.substring(action.lastIndexOf("/")+7);
        	} 
        	var cb = {
                success: eforexGrid.processSuccess,
                failure: eforexGrid.commentFailure,           
                argument: {"url": action, "form": formEl.dom}
            }; 		   
			Ext.lib.Ajax.formRequest(formEl.dom,action,cb);	             
        },

        validRelationParams : function(){
        	var eles = Ext.get('dlgTabs').dom.elements;
        	var mainParams = eles[0].getAttribute('params').split(",");
        	var mainBean = eles[0].getAttribute('bean');
        	var vals = new Array();
        		var mainEles = Ext.get('panel0').child("form").dom.elements;
        	for(var p=0;p<mainParams.length;p++)
        	    vals[p] = mainEles(mainBean+'.'+mainParams[p]).value;
        	    // vals[p] = Ext.get(mainBean+'.'+mainParams[p]).getValue();
        	for(var i=1;i<eles.length;i++){
        		var tempBean = eles[i].getAttribute('bean');
        		var tempParams = eles[i].getAttribute('params').split(",");
        		for(var j=0;j<tempParams.length;j++){
        			if(vals[j] != Ext.get(tempBean+'.'+tempParams[j]).getValue()){
        				return false;
        			}
        		}
        	}
        	return true;   
        },
        processSuccess : function(o){     
			var data = o.responseText;
			Ext.MessageBox.hide();
			if(data){
				if(data.indexOf('html')!= -1){
				    if(cbCounter == 0)			    
					    eforexGrid.refresh();
					else if(infoDlg && cbCounter == eval(dlgTabs).elements.length - 1){
						infoDlg.hide();	
						return;
					}					
					cbCounter ++;
					eforexGrid.formRequestSend();								
				}else{
					 Ext.DomHelper.overwrite(o.argument.form.name+'-msg', {
					     tag: 'img', 
					     src: '../images/default/form/exclamation.gif', 
					     width:16,
					     height:16,
					     align:'absmiddle'
					 }, true).insertHtml('afterEnd',data);				
				 }
			}
        },
       showCheckMSG1 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				Ext.MessageBox.alert('数据验证未通过','请按照页面上的提示正确输入。');	
				return;
			}
			else{
				var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('insertBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure}); 
			}
		}, 
		showCheckMSG2 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				Ext.MessageBox.alert('数据验证未通过','请按照页面上的提示正确输入。');	
				return;
			}
			else{
				if(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc')!=null){
        		 var flag= eval(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	                if(!flag){
	                 	return;
	                 }
	            }
				if(Ext.get('authDiv')!=undefined){// 需要验证授权
				   eforexGrid.doAuthCheck();
				}else{
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
				}
			}
		}, 
		showCheckMSG4 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				document.getElementById('divid').style.display = "block";
				Ext.MessageBox.alert('数据验证未通过','请按照页面上的提示正确输入。');	
				return;
			}
			else{
				document.getElementById("divid").style.display = "none";
				if(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc')!=null){
        		 var flag= eval(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc'));// 双击如果需要特殊处理的。执行此参数关联函数
	                if(!flag){
	                 	return;
	                 }
	            }
				if(Ext.get('authDiv')!=undefined){// 需要验证授权
				   eforexGrid.doAuthCheck();
				}else{
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('数据保存中...','请稍后...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
				}
			}
		}, 
		
		showCheckMSG3 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				Ext.MessageBox.alert('数据验证未通过','请按照页面上的提示正确输入。');	
				return;
			}
			else{
				var formEl = content.getEl().child("form").dom;	
				Ext.MessageBox.wait('数据保存中...','请稍后...');
				Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
	                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
			}
		}, 
		
	  getRadioBoxValue:function(myboxname){// 单选框选中值处理
	     	var retselection="";
			var mykboxlist=document.getElementsByName(myboxname);
			 for(var i=0;i<mykboxlist.length;i++)
			 {
			    if(mykboxlist[i].checked)
			    { 
			       retselection=mykboxlist[i].getAttribute('title');
			    }
			 }
			 return retselection;
	   },
		
	   getCheckBoxValue:function(mychkboxname){// 复选框选中显示值处理
	     	var retselection="";
			var mychkboxlist=document.getElementsByName(mychkboxname);
			 for(var i=0;i<mychkboxlist.length;i++)
			 {
			    if(mychkboxlist[i].checked)
			    {
			       if(retselection.length==0)
			         retselection = mychkboxlist[i].getAttribute('title');
			       else
			         retselection = retselection + ";" + mychkboxlist[i].getAttribute('title');// 此处可能出错
			    }
			 }
			 return retselection;
	   },
		
	   getDescibleCheckBoxValue:function(ele,describ){// 直接对 元素进行表诉而非页面上捕捉
	   	 return describ+":"+ eforexGrid.getCheckBoxValue(ele);
	   },
	   
	   
	    getOperStr : function(){// 现有代码
			var rows = document.getElementById("workTable").rows;
			var operStr = "";
			
			for(var i = 0;i < rows.length;i++){// 貌似并未完全遍历到
				if(rows[i].style.display!="none" &&rows[i].cells.length==4&&rows[i].cells[3].innerHTML.indexOf("*")!="-1"){
					var fText=rows[i].cells[0].innerHTML;// 直接取描述左边列说明
					var nodes=rows[i].cells[2].childNodes;// TD下面存在几个节点
					var fValue='';
					if(nodes.length==1){
						var fid=rows[i].cells[2].firstChild['name'];// 注意一行可能不止一个ID取值
						if(fid==null ||fid.trim().length==0){
						  continue;
						}
					}else {
						for(var j=0;j<nodes.length;j=j+2){// CheckBox
															// 处理失败,普通文本处理失败
					      fValue=fValue + eforexGrid.getMValue(nodes[j].name)+",";
					   }
					   if(fValue.indexOf('undefined')!=-1){
						fValue=rows[i].cells[2].innerText;
					   }
					   operStr = operStr + fText + fValue + ";";
					   continue;
					}
					fValue=eforexGrid.getMValue(fid);
					if(fValue==null || fValue.trim().length==0){
						fValue=rows[i].cells[2].firstChild.value;// 这一步出问题的
						if(fValue=='on'){
							fValue='';
						}
					}
					if(fValue.indexOf('undefined')!=-1){
						fValue=rows[i].cells[2].innerText;
					}
					operStr = operStr + fText + fValue + ";";
		  }
		}
		    if(Ext.get('workTable2')){// 最特殊，柜员管理中 角色多选处理
			  operStr = operStr + eforexGrid.getDescibleCheckBoxValue('user.roleIdArr',"角色");// 柜员管理角色多选处理
			}
			 document.getElementById("operStr").value = operStr;// 要不不删除最好的";"号operStr.substring(0,operStr.length-1)
		},
	   
		getOperStr_orgin_bak : function(){
			var rows = document.getElementById("workTable").rows;
			var operStr = "";
			
			for(var i = 0;i < rows.length;i++){
				if(rows[i].style.display!="none"){
					if(rows[i].cells.length==4&&rows[i].cells[3].innerHTML.indexOf("*")!="-1"&&rows[i].cells[2].innerHTML.indexOf("type=password")=="-1"&&rows[i].cells[2].innerHTML.indexOf("id=workTable2")=="-1"){
						if(rows[i].cells[2].innerHTML.indexOf("x-form-text")!="-1"&&rows[i].cells[2].innerHTML.indexOf("SELECT")=="-1"&&rows[i].cells[2].innerHTML.indexOf("x-form-field")=="-1"){
							operStr = operStr + rows[i].cells[0].innerHTML + rows[i].cells[2].firstChild.value + ";";
						}
						if(rows[i].cells[2].innerHTML.indexOf("SELECT")!="-1"&&rows[i].cells[2].innerHTML.indexOf("x-form-field")=="-1"){
							if(rows[i].cells[2].firstChild.selectedIndex!="-1"){
								operStr = operStr + rows[i].cells[0].innerHTML + rows[i].cells[2].firstChild.options[rows[i].cells[2].firstChild.selectedIndex].text + ";";
							}
						}
						if(rows[i].cells[2].innerHTML.indexOf("x-form-text")!="-1"&&rows[i].cells[2].innerHTML.indexOf("x-form-field")!="-1"){
							operStr = operStr + rows[i].cells[0].innerHTML + rows[i].cells[2].firstChild.firstChild.value + ";";
						}
					}
					if(rows[i].cells.length==4&&rows[i].cells[2].innerHTML.indexOf("type=checkbox")!="-1"){
							if(rows[i].cells[2].innerHTML.indexOf("id=workTable2")!="-1"){
								operStr = operStr + "nothing done";
							} else 
							if(rows[i].cells[2].innerHTML.indexOf("id=workTable2")=="-1"){
								var isChecked = "未选中";
								var checkBoxStrBegin = rows[i].cells[2].innerHTML.indexOf(">");
								if(rows[i].cells[2].firstChild.checked){
									isChecked = "选中";
								}
								operStr = operStr + rows[i].cells[0].innerHTML + rows[i].cells[2].innerHTML.substr(++checkBoxStrBegin,rows[i].cells[2].innerHTML.length) + isChecked +";";
							}
							else{
								var checkBoxes = Ext.get('workTable2').query('.x-form-checkbox');
								var checkBoxesStr = "";
								for(var j=0;j<checkBoxes.length;j++){
									if(checkBoxes[j].checked){
										checkBoxesStr = checkBoxesStr + checkBoxes[j].parentNode.innerText + ",";
									}
								}	
								checkBoxesStr = checkBoxesStr.substring(0,checkBoxesStr.length-1);
								operStr = operStr + rows[i].cells[0].innerHTML + checkBoxesStr +";";
							}
					}
					if(rows[i].cells.length==4&&rows[i].cells[2].innerHTML.indexOf("type=radio")!="-1"){
						var j = "0";
						var tempRadioHtml1 = rows[i].cells[2].innerHTML.split("<INPUT");
						var tempRadioHtml2 = "";
						var tempRadioHtml3 = "";
						for(var k = 1;k< tempRadioHtml1.length;k++){
							var tempStr = tempRadioHtml1[k].split(">");
							tempRadioHtml2 = tempRadioHtml2 + tempStr[1].replace(/^\s+|\s+$/g,"") + ";";
						}
						tempRadioHtml2 = tempRadioHtml2.substring(0,tempRadioHtml2.length-1);
						var radioEle = rows[i].cells[2].childNodes;
						for(var k=0;k<radioEle.length;k++){
							if(radioEle[k].type=="radio"){
								if(radioEle[k].checked){
									var tempRadioHtml4 = tempRadioHtml2.split(";");
									tempRadioHtml3 = tempRadioHtml4[j];
									break;
								}
								j++;
							}
						}
						operStr = operStr + rows[i].cells[0].innerHTML + tempRadioHtml3 +";";
					}
				}
			}
			document.getElementById("operStr").value = operStr.substring(0,operStr.length-1);
		},

		queryRollBakeOverFunc : function (){
			Ext.get('msg').dom.style.display = "none";

			var serialNo = Ext.get('brancherrorbook.systemid').dom.value;
			var type = Ext.get('brancherrorbook.type').dom.value;
			if(serialNo=='' || String(serialNo).length==0 ){ 
			     alert("请输入系统交易流水号");
			     return;
			}
			if(!/^[0-9]*[1-9][0-9]*$/.test(serialNo) ) {
				// 正数验证
				alert('输入格式不正确,请重新输入');
				return;
			}
			var params = 'trade.serialNo='+Number(serialNo)+'&trade.type='+Number(type);
		    var url='/forex/getBranchErrorTradeInfo.do';
		    var tradeCB=function(e,b,o){
		    	infoDlg.setContentSize(580,content.getEl().dom.scrollHeight);
		        Ext.get('rollbakeover').dom.style.display="block";
		        var data = o.responseText;
		    };
		    Ext.get('rollbakeover').load({				// 回调执行返回数据到页面加载
				   url:url,
			       params:params,
			       callback:tradeCB
			});
		},
		
		masterQueryRollBakeOverFunc : function (){
			Ext.get('msg').dom.style.display = "none";
			var serialNo = Ext.get('errorbook.systemid').dom.value;
			var type = Ext.get('errorbook.type').dom.value;
			var params = 'trade.serialNo='+Number(serialNo)+'&trade.type='+Number(type);
		    var url='/forex/getBranchErrorTradeInfo.do';
		    var tradeCB=function(e,b,o){
		    	infoDlg.setContentSize(650,content.getEl().dom.scrollHeight);
		        Ext.get('rollbakeover').dom.style.display="block";
		        var data = o.responseText;
		    };
		    Ext.get('rollbakeover').load({				// 回调执行返回数据到页面加载
				   url:url,
			       params:params,
			       callback:tradeCB
			});
		},		

		queryBranchCountExtFunc : function(){
			var branchcountid = Ext.get('client.branchcountid').dom.value;
			if(branchcountid == 0) {
				Ext.MessageBox.alert('提示','请选择总行对分行点差组');
				return;
			}
        	var url='/base/getBranchClientCountExtInfo.do';
        	clientCountExtpopFullWindow(url+"?countExt.branchcountid="+ branchcountid + "&countExt.counttype=1");
		},
		
		queryCountExtFunc : function(){
			var countid = Ext.get('client.custcountid').dom.value;
			if(countid == 0) {
				Ext.MessageBox.alert('提示','请选择分行对客户点差组');
				return;
			}
        	var url='/base/getClientCountExtInfo.action';
        	clientCountExtpopFullWindow(url+"?clientContext.custcountid="+ countid + "&clientContext.counttype=0");
		},
		
		 /**前台统一计算方法,ajax获取页面所有交易元素计算值
		 * @author wangdaowei
		 * */
        calcDeliveryInfo:function(){
        	btn.disable();// 禁用提交按钮
        	if(Ext.get('custDelivery.operAmount1').dom.value == null || Ext.get('custDelivery.operAmount1').dom.value == 0){
        		Ext.Msg.alert("错误","输入交割金额有误,请重新输入!");
        		return false;
        	}
        	if(Ext.get('custDelivery.operAmount2').dom.value == null || Ext.get('custDelivery.operAmount2').dom.value == 0){
        		Ext.Msg.alert("错误","输入交割金额有误,请重新输入!");
        		return false;
        	}
        	var params = eforexGrid.setDeliveryParam();
        	Ext.Ajax.request({
			 url : '/query/calcDeliveryInfo.action',params : params,
			 callback:function(opts,success,response){ 
				if(success){//回调函数
					var delivery = Ext.decode(response.responseText).data;
					eforexGrid.resetDeliveryInput(delivery);
				}}
			});
        },
        
        resetDeliveryInput:function(delivery){
         	Ext.get('custDelivery.operAmount1').dom.value=Formatter.formatAmt(delivery.operAmount1);
        	Ext.get('custDelivery.operAmount2').dom.value=Formatter.formatAmt(delivery.operAmount2);
        	Ext.get('custDelivery.operAmount3').dom.value=Formatter.formatAmt(delivery.operAmount3);
        	Ext.get('custDelivery.operAmount4').dom.value=Formatter.formatAmt(delivery.operAmount4);
         	if(btn)btn.enable();
        },
        
        validateAccount:function(){
	        if((Ext.get('custDelivery.account1').dom.value == '' || Ext.get('custDelivery.account2').dom.value == '' ||
         				Ext.get('custDelivery.account1').dom.value.length < 17 || Ext.get('custDelivery.account2').dom.value.length < 17)){
         		Ext.Msg.alert("提示","客户交易交割：请输入正确的客户账号!");
         		Ext.get('custDelivery.account1').dom.value = '';
         		Ext.get('custDelivery.account2').dom.value = '';
         		return;
         	}
         	btn.enable();
        },
        
        setDeliveryParam:function(){
        	var calAmount = Ext.get('custDelivery.calAmount').dom.value;
        	var operAmount1,operAmount2;
        	if(calAmount == 'true'){
        		operAmount2 = Formatter.toNumber(Ext.get('custDelivery.operAmount2').dom.value);
        		operAmount1 = 0.0;
        	}else{
        		operAmount1 = Formatter.toNumber(Ext.get('custDelivery.operAmount1').dom.value);
        		operAmount2 = 0.0;
        	}
        	Formatter.toNumber(Ext.get('custDelivery.operAmount2').dom.value)
        	var deliveryParam = 'delivery.type='+Number(Ext.get('custDelivery.type').dom.value)
        		+'&delivery.serialNo='+Number(Ext.get('custDelivery.serialNo').dom.value)
				+'&delivery.appId='+Number(Ext.get('custDelivery.appId').dom.value)
				+'&delivery.state='+Number(Ext.get('custDelivery.state').dom.value)
				+'&delivery.rateCode='+Number(Ext.get('custDelivery.rateCode').dom.value)
				+'&delivery.calAmount='+Ext.get('custDelivery.calAmount').dom.value
				+'&delivery.costRate='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.costRate').dom.value))
				+'&delivery.custRate='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.custRate').dom.value))
				+'&delivery.amount1='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.amount1').dom.value))
				+'&delivery.amount2='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.amount2').dom.value))
				+'&delivery.amount3='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.amount3').dom.value))
				+'&delivery.amount4='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.amount4').dom.value))
				+'&delivery.surplusamount1='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.surplusamount1').dom.value))
				+'&delivery.surplusamount2='+parseFloat(Formatter.toNumber(Ext.get('custDelivery.surplusamount2').dom.value))
				+'&delivery.operAmount1='+parseFloat(operAmount1)
				+'&delivery.operAmount2='+parseFloat(operAmount2)
				;
			return deliveryParam;
        },
        
        /**
        * 禁用btn
        * @author zhangfeng
        */
        checkBtnEnableState :function(){
       		  if(Ext.get('btnEnalbe')){
			     if(Ext.get('btnEnalbe').getValue() == 'false'){
			     	eforexGrid.disableTradeBut();
			     }else{
			     	eforexGrid.enableTradeBut();
			     }
			  }
        	
        },
        disableTradeBut :function(){
			if( btn){
				btn.disable();
			}
		},
		enableTradeBut : function(){
			if( btn){
				btn.enable();
			}
		},
        /**验证金额
		 * @author liangwj
		 * */
	    resetCheckInputAmount : function(amountEdit){
        	if(amountEdit.value==''){
        		return ;
        	}
        	var amount = 0.0;
        	if(String(amountEdit.value).indexOf(",")==-1 ){
	            if(/^(0|([1-9]\d*))(\.\d+)?[k|K|M|m]$/.test(amountEdit.value)){//输入末位kK?mM单位值 //支持1k=1000，1m=1000000
			  		var amountStr=amountEdit.value;
			  		var amountW=amountStr.substring(0,amountStr.length-1);//有效数字
			  		var n=0;
			  		if(amountStr.substring(amountStr.length-1).toLowerCase()=='k'){//有效单位K,k
			  			n=3;
			  		}else if(amountStr.substring(amountStr.length-1).toLowerCase()=='m'){//有效单位M,m
			  			n=6;
			  		}
			  		amount=parseFloat(amountW)*Math.pow(10,n);//有效数字*有效单位数
			  	}else if(/^(0|([1-9]\d*))(\.\d+)?$/.test(amountEdit.value)){//纯有效金额数字
			  		amount=parseFloat(amountEdit.value);//有效数字
			  	}else{
			  		amountEdit.value='0';
			  		Ext.Msg.alert("错误","输入金额有误,请重新输入!");
	        	    return false;
			  	}
			  	amountEdit.value=Formatter.formatAmt(amount);
        	}else {
        		amount=Formatter.toNumber(amountEdit.value);
        		amountEdit.value=Formatter.formatAmt(amount);
        	}
	    },
        refresh : function(){
        	var param =eforexGrid.queryParam();
        	param['start']=paging.cursor;
        	param['limit']=paging.pageSize;
        	// grid.getDataSource().load({params:{start: paging.cursor, limit:
			// paging.pageSize}});
        	grid.getDataSource().load({params:param});
        }
	}
}();
Ext.onReady(eforexGrid.init,eforexGrid,true);