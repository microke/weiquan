//�鿴ԭ������ϸ��Ϣ
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
	var cBtn = infoWin.addButton('�ر�');
	var contentView = new Ext.ContentPanel('viewtrade',{autoCreate : true,fitToFrame:true});
	 var doViewCancleBtn = function(){
	    	contentView.setContent('');// ����������
	    	infoWin.hide();
	};
	cBtn.setHandler(doViewCancleBtn, infoWin);
    infoWin.setTitle("������ϸ��Ϣ�鿴");
    var layout = infoWin.getLayout();
    layout.beginUpdate();
    layout.add('center',contentView);
    var params = eforexGrid.createParam();
    var tradeLoadCb = function(e,b,o){
				infoWin.setContentSize(contentView.getEl().dom.scrollWidth,contentView.getEl().dom.scrollHeight);// ������Ȩ������ʾ��С
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
				       callback:tradeLoadCb,// �ص�����
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
	var printDataStore;// ����ӡʱ����Ϊ����Դװ������
	var gridTitle,listURL,qParams;
	var eforexRecord,eforexColModel,dataStore,grid,gridMenuForm,infoDlg,myInfoDlg,printDlg,printDlgO,content,mycontent,contentO,printOptionContent,selectModel,paging,cbCounter,btn1,printOptionBtn,dialogWa,infoWin;
	var Right,RightCM,RightDS,RightGrid,app,appCM,appDS,appGrid;
	var showtimeSpan = '<span id="showtime" style="color:#ff0000;width:200px;font:16px"></span>';
	var tradeSecond=0,tradeMin=0,tradeTimer ='',se;
	var actionPath = '/forex/updateOneTradeInfo';
	var btn,mybtn,otherbtn,kondorbtn,relationBtn, printBtn;// ȷ����ť��������ť��
	var btnDeal;
	var branchProfitIsBuyStore;
	var branchProfitIsBuySelect;
	var SPECIAL_TYPE_NORMAL = 1; 	  // ��ͨ����
	var SPECIAL_TYPE_E_DELIVERY = 4;  // ��ǰ����
	var SPECIAL_TYPE_E_DURATION = 2;  // ��ǰչ��
	var SPECIAL_TYPE_DELIVERY = 3; 	  // ����
	var SPECIAL_TYPE_E_BREACH = 10;   // ��ǰΥԼ
	var SPECIAL_TYPE_DURATION = 11;   // ����չ��
	var SPECIAL_TYPE_BREACH = 12;     // ����ΥԼ
	var SPECIAL_TYPE_ERASE = 13;      // ����
	var SPECIAL_TYPE_N_ERASE = 14;    // ���ճ���
	var SPECIAL_TYPE_ALL_BREACH = 15; // ȫ��ΥԼ
	var SPECIAL_TYPE_DELIVERY_CANCEL = 16; 	  // �����
	
	var branchProfitIsBuyData=[
                               ['-1', '����']
                                ];
    var ACC_RESULT_FLAG_DK = 1,ACC_RESULT_FLAG_ZF =2,ACC_RESULT_FLAG_ECCZ=3,ACCPROCE_STATUS_INIT= 0,ACCPROCE_STATUS_SUCCESS = 1,ACCPROCE_STATUS_EXCEPTION = 2,ACCPROCE_STATUS_NOTDO=3;
	return {
		init : function(){
			Ext.PagingToolbar.prototype.onClick=this.PagingToolbarOnClick;// ��ҳtoolbar����������أ����캯��ԭ�ͷ���
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
		      // this.getQueryPosListInfo();//��ѯͷ����ʷ��Ϣ����ģ������
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
				Ext.MessageBox.alert('��������','���ܴ���'+maxlimit+'�ַ���');
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
	    	
	    	Ext.MessageBox.confirm("�����ʼ��","��ȷ��Ҫ�����ʼ����",function(con){
	    		if(con == 'yes'){
	    			var form = content.getEl().child("form");
	    			Ext.lib.Ajax.formRequest(form.dom, "/base/passwordInit.action",
                    	{success: eforexGrid.commentSuccessPassword, failure: eforexGrid.commentFailure});
	    		}
	    	});
	    },
	    
		passwordInitFromGrid : function() {
	    	if(selectModel.hasSelection()){
	    		Ext.MessageBox.confirm("�����ʼ��","��ȷ��Ҫ�����ʼ����",function(con){
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
	         	Ext.MessageBox.alert('��ʾ','��ѡ����Ҫ��ʼ������ļ�¼��');
	         }
	    },
	    
        printContainter:function(){
	    	var formEl = content.getEl().child("form");
        	var params=Ext.lib.Ajax.serializeForm(formEl);// �Ա����������ݽ������л�����ϳɲ�����
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
    		
    		grid.on("rowdblclick",this.getInfo,this);// Grid����˫���¼������� �޸�ҳ��
    		selectModel = grid.getSelectionModel();
			grid.render();
		},
		loadGridData : function(){
			var gridFoot = grid.getView().getFooterPanel(true);
			if(!Ext.get('NoPage')){
				paging = new Ext.PagingToolbar(gridFoot, dataStore, {
			        pageSize: PAGESIZE,
			        displayInfo: true,
			        displayMsg: '��¼�� {0} - {1} �ܹ� {2}',
			        emptyMsg: "û�м�¼"
			    });
			}
		    var param =eforexGrid.queryParam(); 
		    dataStore.load({params:param});
		},
		createHeadToolBar : function(){// ���ϲ�Toolbar�����ã��������޸ģ�ɾ������ϸ��������ѯ
			var gridHead = grid.getView().getHeaderPanel(true);
			// var tbHead = new Ext.Toolbar(gridHead);
			
			var toolbarCount=21;
			if(gridMenuForm.dom.getAttribute("toolbarCount")){// ����Toolbar
																// ÿ�д�Ŷ������ݣ�Ĭ��21��
			 toolbarCount = Number(10);//gridMenuForm.dom.getAttribute("toolbarCount")
			}
			var tbHead = new Ext.Toolbar(gridHead,
			                null,
							{
							nextBlock : function(){
								if (this.items.getCount()>=toolbarCount && this.items.getCount()%toolbarCount==0 ){
									var table = document.createElement("table");// ����ṹdiv-->Table-->tbody--->tr..td
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
			
			if(Ext.get("queryDiv")){// ��ѯ����Div�㣬�������е���������
			     //  tbHead.addSeparator();
			     	tbHead.toolbarCount=10;
			       var a= Ext.get("queryDiv").dom.innerHTML;	 	
                   var b=a.split(';');
                   eforexGrid.createQueryText(tbHead,b);	 	
			}
			
			if(Ext.get("getQueryBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��ѯ',
					handler : this.getQueryInfo
				});
			}
			
			if(Ext.get("resetInfoBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����״̬',
					handler : this.resetInfo
				});
				}
			if(Ext.get("accountCheckBtn")){ // ������ѯ��ť
			tbHead.addSeparator();
			tbHead.addButton({
				text : '����',
				handler : this.accountCheckInfo
			});
			}
			if(Ext.get("accountCheckAgainBtn")){ // ������ѯ��ť
			tbHead.addSeparator();
			tbHead.addButton({
				text : '���¶���',
				handler : this.accountCheckInfoAgain
			});
			}
			if(Ext.get("accountTranInfoBtn")){ // Ԥ��
			tbHead.addSeparator();
			tbHead.addButton({
				text : '��ϸ',
				handler : this.accountTranInfo
			});
			}
			if(Ext.get("accountTranInfoBtn2")){ 
			tbHead.addSeparator();
			tbHead.addButton({
				text : '�����ı�����',
				handler : this.accountTranInfo2
			});
			}
			if(Ext.get("accountTranInfoBtn3")){ 
			tbHead.addSeparator();
			tbHead.addButton({
				text : '�����¼��������',
				handler : this.accountTranInfo3
			});
			}
			
			if(Ext.get("inTradeCheckBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����',
					handler : this.getInTradeCheckInfo
				});
			}
			
			if(Ext.get("breachBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ΥԼ',
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
			 			Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ΥԼ�ļ�¼��');
					 	}
					}
				});
			}
			if(Ext.get("fbreachBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ǿ��ΥԼ',
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
			 			Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ǿ��ΥԼ�ļ�¼��');
					 	}
					}
				});
			}
			if(Ext.get("allBreachBtn")){ // ������ѯ��ť
				if(Ext.get('allBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('allBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ȫ��ΥԼ',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ȫ��ΥԼ�ļ�¼��');
					 	}
					}
				});
				}
			}
			if(Ext.get("fallBreachBtn")){ // ������ѯ��ť
				if(Ext.get('fallBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('fallBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ǿ��ȫ��ΥԼ',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ǿ��ȫ��ΥԼ�ļ�¼��');
					 	}
					
					}
				});
				}
			}
			if(Ext.get("durationBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'չ��',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����չ�ڵļ�¼��');
					 	}
					}
				});
			}
			
			if(Ext.get("farDurationBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'Զ��չ��',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����Զ��չ�ڵļ�¼��');
					 	}
					
					}
				});
			}
			
			if(Ext.get("eraseBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����',
					handler :function(){eforexGrid.checkIfSpot();}
				});
			}
			
			if(Ext.get("tnEraseBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'T+N���׳���',
					handler : this.getTNEraseInfo
				});
			}
			
			if(Ext.get("deptEraseBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '�ڲ����׳���',
					handler : this.getDeptEraseInfo
				});
			}
			
			if(Ext.get("delveryedEraseBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��������',
					handler : this.getDeliveryedEraseInfo
				});
			}
			
			if(Ext.get("deptDelveryedEraseBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '�ڲ����׽�������',
					handler : this.getDeptDeliveryedEraseInfo
				});
			}
			
			if(Ext.get("rmbDeptPropertiesBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '�ڲ����׸������Ա��',
					handler : this.getRmbDeptPropertiesInfo
				});
			}
			
			if(Ext.get("resendIsBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��������',
					handler : this.getResendIsInfo
				});
			}
			
			if(Ext.get("reverseIsBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����ƽ��',
					handler : this.getReverseIsInfo
				});
			}
			
			if(Ext.get("doGapBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '���ƽ��',
					handler : this.getGapInfo
				});
			}
			if(Ext.get("eBreachBtn")){ // ������ѯ��ť
				if(Ext.get('eBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('breachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��ǰΥԼ',
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
			 			Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ������ǰΥԼ�ļ�¼��');
					 	}
					}
				});
				}
			}
			if(Ext.get("feBreachBtn")){ // ������ѯ��ť
				if(Ext.get('feBreachBtn').dom.getAttribute('ignore') && 'true'==Ext.get('feBreachBtn').dom.getAttribute('ignore')){
				} else {
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ǿ����ǰΥԼ',
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
			 			Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ǿ����ǰΥԼ�ļ�¼��');
					 	}
					}
				});
				}
			}
			if(Ext.get("eDeliBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��ǰ����',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ������ǰ����ļ�¼��');
					 	}
					} 
				});
			}
			if(Ext.get("eDeliSwapBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��ǰ����',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ������ǰ����ļ�¼��');
					 	}
					} 
				});
			}
			if(Ext.get("deliveryCancelBtn")){
				if(Ext.get('deliveryCancelBtn').dom.getAttribute('ignore') && 'true'==Ext.get('deliveryCancelBtn').dom.getAttribute('ignore')){
				} else {
					tbHead.addSeparator();
					tbHead.addButton({
						text : '�����',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���н�����ļ�¼��');
					 	}
						}
					});
				}
			}
			if(Ext.get("doTradeAuthBtn")){//�����������
				if(Ext.get('doTradeAuthBtn').dom.getAttribute('ignore') && 'true'==Ext.get('doTradeAuthBtn').dom.getAttribute('ignore')){
				} else {
					tbHead.addSeparator();
					tbHead.addButton({
						text : '���',
						handler : this.getTradeAuthInfo
					});
				}
			}
			if(Ext.get("insertBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����',
					handler : this.insert
// cls : 'x-btn-text-icon bmenu'
					// icon:'../images/default/dd/drop-yes.gif'
				});
			}
			if(Ext.get("importMtmBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '�����ֵ',
					handler : this.importMtm
				});
			}
			if(Ext.get("updateBtn")){// lableName="���׳���"
										// doFunc="��������()",doCallBackFunc="",
										// ��һ����������toolbar��ʾ���ڶ�����ӹ� ˫���¼���
										// �޸�Ԥ�����¼�,������ �ص�����
				tbHead.addSeparator();
				var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.getInfo
				});
			}
			if(Ext.get("synchronizeBtn")){// lableName=""
										// doFunc="��������()",doCallBackFunc="",
										// ��һ����������toolbar��ʾ���ڶ�����ӹ� ˫���¼���
										// �޸�Ԥ�����¼�,������ �ص�����
				tbHead.addSeparator();
				var lableName=Ext.get('synchronizeBtn').dom.getAttribute('lableName')==undefined?'ͬ��':Ext.get('updateBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.synchronizeKondor
				});
			}
			if(Ext.get("printOptionBtn")){ 
				tbHead.addSeparator();
				var lableName=Ext.get('printOptionBtn').dom.getAttribute('lableName')==undefined?'��Ȩ��Ȩ���״�ӡ':Ext.get('printOptionBtn').dom.getAttribute('lableName');
				tbHead.addButton({
					text : lableName,
					handler : this.getOptionBtnInfo
				});
			}
			if(Ext.get("printOut")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '��ӡ',
					handler : this.getPrintOutInfo
				});
			}
			if(Ext.get("deliveryBtn")){ // ������ѯ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����',
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
			 				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���н���ļ�¼��');
					 	}
					}
				});
			}
			
			if(Ext.get("deleteBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ɾ��',
					handler : this.deleteInfo
				});
			}
			if(Ext.get("resendBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����',
					handler : this.resendInfo
				});
			}
			if(Ext.get("rebatchBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : '���㵱��δ���㽻��',
					handler : this.rebatchInfo
				});
			}
			
			if(Ext.get("deleteClientBtn")){
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'ɾ��',
					handler : this.deleteClientInfo
				});
			}
			
			if(Ext.get("delPlBtn")){// ����ɾ��
				tbHead.addSeparator();
				tbHead.addButton({
					text : '����ɾ��',
					handler : this.delPlInfo
				});
			}
			if(Ext.get("dealUpdateBtn")){ // �޸Ľ�����Ϣ��������Ϣ��
				tbHead.addSeparator();
				var lableName=Ext.get('dealUpdateBtn').dom.getAttribute('lableName');
				lableName=(lableName==undefined?'�޸�':lableName);
				tbHead.addButton({
					text : lableName,
					handler : this.getDealInfo
				});
			}
			if(Ext.get("otherTradeBtn")){ // ���⽻�׹�����ѯԭ����
				tbHead.addSeparator();
				var lableName=Ext.get('otherTradeBtn').dom.getAttribute('lableName');
				lableName=(lableName==undefined?'��������':lableName);
				tbHead.addButton({
					text : lableName,
					handler : this.getOtherTrade
				});
			}
			
						
			if(Ext.get("printBtn")){ // ��ӡ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel������ǰҳ',
					handler : this.printGirdInfo
				});
			}
			if(Ext.get("printAllBtn")){ // ��ӡ��ť[Ҫ���ص���ֻ�ܷ�����󣬷������ִ�λ]����Ϊȡtitileʱ�Ǹ���Ҫ��ʾ�ĸ�������ǰ�������ģ�
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel��������',
					handler : this.printAllGirdInfo
				});
			}
			if(Ext.get("printAllBackBtn")){ // ��ӡ��ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel��������',
					handler : this.printAllGirdBackInfo
				});
			}
			if(Ext.get("excelBtn")){ // excel������ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel����',
					handler : this.printGirdInfo
				});
			}
			if(Ext.get("exportRightBtn")){ // excelȨ�޵�����ť
				tbHead.addSeparator();
				tbHead.addButton({
					text : 'excel����',
					handler : this.exportRightsById
				});
			}
			
			if(Ext.get("dspBankGraph")){ // ��ʾ�����㼶��ϵͼ
				tbHead.addSeparator();
				tbHead.addButton({
					text : '�㼶��ϵͼ',
					handler : this.displayBankGraph
				});
			}
	
			//tbHead.addSeparator();
			},
			getPrintOutInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
	        	if(selectModel.hasSelection()){
	        		var serialno = selectModel.getSelected().get('receiptNo');
	        		var url = Ext.get('printOut').dom.getAttribute('action')+"?actCustReceipt.receiptNo="+serialno;
	        	    eforexGrid.myPrint(url);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���д�ӡ�ļ�¼��');
		         }
        },
        getOtherTrade:function(){
        	if(selectModel.hasSelection()){ 
				var headType=selectModel.getSelected().get('headType');
				var headNo=selectModel.getSelected().get('headNo');
				var url = '/query/queryRelationTradeCondition.action?subAction=init&sqlParam.headNo='+headNo+'&sqlParam.headType='+headType;
				popWindow(url,1000,400);
			 }else{
			 	Ext.MessageBox.alert('��ʾ','��ѡ�����⽻�׼�¼��');
			 }
			
        },
        myPrint :function (url){//urlName,WWidth,WHeight
        	popWindownew(url,780,680);
        },
			checkGetDealInfoAuth : function(value){//�����޸ļ���Ƿ���Ҫ����������
				if(Ext.get('forwardTrade.customerId')){
					if(Ext.get('forwardTrade.customerId').dom.value==''){
						Ext.MessageBox.alert('��ʾ','�ͻ��Ų���Ϊ��');
						return;
						}
					//if(Ext.get('forwardTrade.account1').dom.value==''||Ext.get('forwardTrade.account2').dom.value==''){
						//Ext.MessageBox.alert('��ʾ','�˺Ų���Ϊ��');
						//return;
						//}
				}else if(Ext.get('swapTrade.customerId')){
					if(Ext.get('swapTrade.customerId').dom.value==''){
						Ext.MessageBox.alert('��ʾ','�ͻ��Ų���Ϊ��');
						return;
						}
					//if(Ext.get('swapTrade.account1').dom.value==''
					//||Ext.get('swapTrade.account2').dom.value==''
					//||Ext.get('swapTrade.nearAccount1').dom.value==''
					//||Ext.get('swapTrade.nearAccount2').dom.value==''){
						//Ext.MessageBox.alert('��ʾ','�˺Ų���Ϊ��');
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
			 	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���н�����ļ�¼��');
			 }
			
			},
			getCancelDeliveryInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
	        	if(Ext.get('deliveryCancelBtn').dom.getAttribute('doFunc')!=null){
	        		eval(Ext.get('deliveryCancelBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
				            btn = infoDlg.addButton('ȷ��');
				            cbtn = infoDlg.addButton('ȡ��');
				            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }else{
			        	 infoDlg.setContentSize(280,450);
			       	 	}
			            btn.setHandler(eforexGrid.doCancelDelivery, infoDlg);
			            
			            cbtn.setHandler(infoDlg.hide, infoDlg);
			            btn.enable();
			            cbtn.enable();
			            var lableName=Ext.get('deliveryCancelBtn').dom.getAttribute('lableName')==undefined?'�����':Ext.get('deliveryCancelBtn').dom.getAttribute('lableName');
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
						// ����diaglog�Ի���ʵ�ʴ�С
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
			           	layout.endUpdate();
			            infoDlg.show();
			            if(myInfoDlg)myInfoDlg.setTitle(lableName);
			         }else{
			         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���н�����ļ�¼��');
			         }
		        }
	        },
	    getDealInfo : function(){// ͨ������ʹ�õĴ������������ɿ���
	    if(btn)btn.show();
	    var isSell;
	    var itemId;
			if(Ext.get('dealUpdateBtn')==null){
				Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
				return;
			}
			if(Ext.get('dealUpdateBtn').dom.getAttribute('doFunc')!=null){
				eval(Ext.get('dealUpdateBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
						btn = infoDlg.addButton('ȷ��');
						infoDlg.addButton('ȡ��', eforexGrid.myCloseDlg, infoDlg);
						content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
					}else{
			        	 infoDlg.setContentSize(860,500);
			        }	
			        	if(!otherbtn){ 
		      				if(itemId!=3)otherbtn=infoDlg.addButton('��������', eforexGrid.relDetailsDlg,infoDlg);
		      				}
			        	if(relationBtn)relationBtn.hide();
			        	 if(btn)btn.show();
			        	 if(otherbtn)otherbtn.show();
			        	 if(!btn)btn = infoDlg.addButton('ȷ��');
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
		            		if(isSell=='���'){
		            			isBuy='false';
		            		}else if(isSell=='�ۻ�'){
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
		            var lableName=Ext.get('dealUpdateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('dealUpdateBtn').dom.getAttribute('lableName');
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
					Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�޸ĵļ�¼��');
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
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeData2=[
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeSubData1=[
                  ["110","110-����ó��"],
				  ["121","121-����ó��-����"],
				  ["122","122-����ó��-����"],
				  ["123","123-����ó��-���ںͱ��շ���"],
				  ["124","124-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["125","125-����ó��-��ѯ����"],
				  ["126","126-����ó��-��������"],
				  ["130","130-����ó��-����;���ת��"],
				  ["131","131-����;���ת��-ְ��������ļҿ�"],
				  ["132","132-����;���ת��--Ͷ������"],
				  ["133","133-����;���ת��--��������ת��"]
                 ];
                 var tradeSubData2=[
                  ["210","210-�ʱ��˻�"],
				  ["220","220-ֱ��Ͷ��"],
				  ["221","221-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["222","222-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["223","223-ֱ��Ͷ��-���ز�"],
				  ["231","231-֤ȯͶ��-�Ծ���֤ȯͶ�ʳ���"],
				  ["232","232-֤ȯͶ��-֤ȯ����"],
				  ["240","240-����Ͷ��"],
				  ["241","241-����Ͷ��-���У��羳����"],
				  ["242","242-����Ͷ��-��ծת����"],
				  ["250","250-����������"],
				  ["260","260-���ڻ����ʽ����ת��"],
				  ["261","261-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["262","262-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["270","270-����"]
                 ];
                 var tradeSubData3=[
                  ["310","310-����ó��"],
				  ["321","321-����ó��-����"],
				  ["322","322-����ó��-����"],
				  ["323","323-����ó��-���ںͱ��շ���"],
				  ["324","324-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["325","325-����ó��-��ѯ����"],
				  ["326","326-����ó��-��������"],
				  ["331","331-����;���ת��-ְ��������ļҿ�"],
				  ["332","332-����;���ת��-Ͷ������"],
				  ["333","333-����;���ת��-��������ת��"]
                 ];
                 var tradeSubData4=[
                  ["410","410-�ʱ��˻�"],
				  ["420","420-ֱ��Ͷ��"],
				  ["421","421-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["422","422-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["423","423-ֱ��Ͷ��-���ز�"],
				  ["431","431-֤ȯ����-�Ծ���֤ȯͶ�ʳ���"],
				  ["432","432-֤ȯ����-֤ȯ����"],
				  ["440","440-����Ͷ��"],
				  ["441","441-����Ͷ��-���У��羳����"],
				  ["442","442-����Ͷ��-��ծת����"],
				  ["450","450-����Ͷ��-����������"],
				  ["460","460-���ڻ����ʽ����ת��"],
				  ["461","461-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["462","462-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["470","470-����"]
                 ];
                 var tradeCustType=[
                  ["01","01-��������"],
				  ["02","02-���ڻ���"],
				  ["03","03-���ʻ���"],
				  ["04","04-���ʻ���"],
				  ["05","05-�������"],
				  ["06","06-�Ǿ������"],
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
	                 data : (firstNum=='1'||firstNum=='2')?tradeData1:tradeData2 // �������������
	                  });
		        var tradeProCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.tradeProCode",
		             store: store1 ,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"forwardTrade.tradeProCode",
		             emptyText:'��ѡ��',
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
	                 data : firstNum=='1'?tradeSubData1:(firstNum=='2'?tradeSubData2:(firstNum=='3'?tradeSubData3:tradeSubData4)) // �������������
	                  });
		        var tradeProSubCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.tradeSubProCode",
		             store: store2,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"forwardTrade.tradeSubProCode",
		             emptyText:'��ѡ��',
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
	                 data : tradeCustType // �������������
	                  });
		        tradeCustTypeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.forCusType",
		             store: store3,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"forwardTrade.forCusType",
		             emptyText:'��ѡ��',
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
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeData2=[
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeSubData1=[
                  ["110","110-����ó��"],
				  ["121","121-����ó��-����"],
				  ["122","122-����ó��-����"],
				  ["123","123-����ó��-���ںͱ��շ���"],
				  ["124","124-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["125","125-����ó��-��ѯ����"],
				  ["126","126-����ó��-��������"],
				  ["130","130-����ó��-����;���ת��"],
				  ["131","131-����;���ת��-ְ��������ļҿ�"],
				  ["132","132-����;���ת��--Ͷ������"],
				  ["133","133-����;���ת��--��������ת��"]
                 ];
                 var tradeSubData2=[
                  ["210","210-�ʱ��˻�"],
				  ["220","220-ֱ��Ͷ��"],
				  ["221","221-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["222","222-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["223","223-ֱ��Ͷ��-���ز�"],
				  ["231","231-֤ȯͶ��-�Ծ���֤ȯͶ�ʳ���"],
				  ["232","232-֤ȯͶ��-֤ȯ����"],
				  ["240","240-����Ͷ��"],
				  ["241","241-����Ͷ��-���У��羳����"],
				  ["242","242-����Ͷ��-��ծת����"],
				  ["250","250-����������"],
				  ["260","260-���ڻ����ʽ����ת��"],
				  ["261","261-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["262","262-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["270","270-����"]
                 ];
                 var tradeSubData3=[
                  ["310","310-����ó��"],
				  ["321","321-����ó��-����"],
				  ["322","322-����ó��-����"],
				  ["323","323-����ó��-���ںͱ��շ���"],
				  ["324","324-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["325","325-����ó��-��ѯ����"],
				  ["326","326-����ó��-��������"],
				  ["331","331-����;���ת��-ְ��������ļҿ�"],
				  ["332","332-����;���ת��-Ͷ������"],
				  ["333","333-����;���ת��-��������ת��"]
                 ];
                 var tradeSubData4=[
                  ["410","410-�ʱ��˻�"],
				  ["420","420-ֱ��Ͷ��"],
				  ["421","421-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["422","422-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["423","423-ֱ��Ͷ��-���ز�"],
				  ["431","431-֤ȯ����-�Ծ���֤ȯͶ�ʳ���"],
				  ["432","432-֤ȯ����-֤ȯ����"],
				  ["440","440-����Ͷ��"],
				  ["441","441-����Ͷ��-���У��羳����"],
				  ["442","442-����Ͷ��-��ծת����"],
				  ["450","450-����Ͷ��-����������"],
				  ["460","460-���ڻ����ʽ����ת��"],
				  ["461","461-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["462","462-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["470","470-����"]
                 ];
                 var tradeCustType=[
                  ["01","01-��������"],
				  ["02","02-���ڻ���"],
				  ["03","03-���ʻ���"],
				  ["04","04-���ʻ���"],
				  ["05","05-�������"],
				  ["06","06-�Ǿ������"],
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
	                 data : (firstNum=='1'||firstNum=='2')?tradeData1:tradeData2 // �������������
	                  });
		        var tradeProCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeProCode",
		             store: store1 ,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.tradeProCode",
		             emptyText:'��ѡ��',
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
	                 data : firstNum=='1'?tradeSubData1:(firstNum=='2'?tradeSubData2:(firstNum=='3'?tradeSubData3:tradeSubData4))// �������������
	                  });
		        var tradeProSubCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeSubProCode",
		             store: store2,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.tradeSubProCode",
		             emptyText:'��ѡ��',
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
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeData2=[
                  ["100","100-������Ŀ"],
                  ["200","200-�ʱ��������Ŀ"],
                  ["300","300-������Ŀ"],
                  ["400","400-�ʱ��������Ŀ"]
                 ];
                 var tradeSubData1=[
                  ["110","110-����ó��"],
				  ["121","121-����ó��-����"],
				  ["122","122-����ó��-����"],
				  ["123","123-����ó��-���ںͱ��շ���"],
				  ["124","124-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["125","125-����ó��-��ѯ����"],
				  ["126","126-����ó��-��������"],
				  ["130","130-����ó��-����;���ת��"],
				  ["131","131-����;���ת��-ְ��������ļҿ�"],
				  ["132","132-����;���ת��--Ͷ������"],
				  ["133","133-����;���ת��--��������ת��"]
                 ];
                 var tradeSubData2=[
                  ["210","210-�ʱ��˻�"],
				  ["220","220-ֱ��Ͷ��"],
				  ["221","221-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["222","222-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["223","223-ֱ��Ͷ��-���ز�"],
				  ["231","231-֤ȯͶ��-�Ծ���֤ȯͶ�ʳ���"],
				  ["232","232-֤ȯͶ��-֤ȯ����"],
				  ["240","240-����Ͷ��"],
				  ["241","241-����Ͷ��-���У��羳����"],
				  ["242","242-����Ͷ��-��ծת����"],
				  ["250","250-����������"],
				  ["260","260-���ڻ����ʽ����ת��"],
				  ["261","261-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["262","262-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["270","270-����"]
                 ];
                 var tradeSubData3=[
                  ["310","310-����ó��"],
				  ["321","321-����ó��-����"],
				  ["322","322-����ó��-����"],
				  ["323","323-����ó��-���ںͱ��շ���"],
				  ["324","324-����ó��-ר��Ȩ��ʹ�÷Ѻ������"],
				  ["325","325-����ó��-��ѯ����"],
				  ["326","326-����ó��-��������"],
				  ["331","331-����;���ת��-ְ��������ļҿ�"],
				  ["332","332-����;���ת��-Ͷ������"],
				  ["333","333-����;���ת��-��������ת��"]
                 ];
                 var tradeSubData4=[
                  ["410","410-�ʱ��˻�"],
				  ["420","420-ֱ��Ͷ��"],
				  ["421","421-ֱ��Ͷ��-���У�Ͷ���ʱ���"],
				  ["422","422-ֱ��Ͷ��-ֱ��Ͷ�ʳ���"],
				  ["423","423-ֱ��Ͷ��-���ز�"],
				  ["431","431-֤ȯ����-�Ծ���֤ȯͶ�ʳ���"],
				  ["432","432-֤ȯ����-֤ȯ����"],
				  ["440","440-����Ͷ��"],
				  ["441","441-����Ͷ��-���У��羳����"],
				  ["442","442-����Ͷ��-��ծת����"],
				  ["450","450-����Ͷ��-����������"],
				  ["460","460-���ڻ����ʽ����ת��"],
				  ["461","461-���ڻ����ʽ����ת��-���У��ʱ���Ӫ���ʽ�"],
				  ["462","462-���ڻ����ʽ����ת��-��ծ���˽��"],
				  ["470","470-����"]
                 ];
                 var tradeCustType=[
                  ["01","01-��������"],
				  ["02","02-���ڻ���"],
				  ["03","03-���ʻ���"],
				  ["04","04-���ʻ���"],
				  ["05","05-�������"],
				  ["06","06-�Ǿ������"],
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
	                 data : (NearfirstNum=='1'||NearfirstNum=='2')?tradeData1:tradeData2 // �������������
	                  });
		        var tradeProCodeNearBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeProCodeNear",
		             store: store11 ,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.tradeProCodeNear",
		             emptyText:'��ѡ��',
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
	                 data : NearfirstNum=='1'?tradeSubData1:(NearfirstNum=='2'?tradeSubData2:(NearfirstNum=='3'?tradeSubData3:tradeSubData4))// �������������
	                  });
		        var tradeProSubCodeNearBox = new Ext.form.ComboBox({
		             name:"swapTrade.tradeSubProCodeNear",
		             store: store22,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.tradeSubProCodeNear",
		             emptyText:'��ѡ��',
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
	                 data : tradeCustType // �������������
	                  });
		        tradeCustTypeBox = new Ext.form.ComboBox({
		             name:"swapTrade.forCusType",
		             store: store3,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.forCusType",
		             emptyText:'��ѡ��',
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
				businessTypeDs.load({params:{start:0}});// ��������
    			var bTypeCodeBox = new Ext.form.ComboBox({
		             name:"forwardTrade.deptBussinessType",
		             store: businessTypeDs,
		             displayField:'bussinessType',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"forwardTrade.deptBussinessType",
		             emptyText:'��ѡ��',
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
                  ["0","����"],
                  ["1","����"]
                 ];
				var cptyStore = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : cptyData // �������������
	                  });
				var cptyBox = new Ext.form.ComboBox({
		             name:"forwardTrade.cpty",
		             store: cptyStore,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"forwardTrade.cpty",
		             emptyText:'��ѡ��',
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
				businessTypeDs.load({params:{start:0}});// ��������
    			var bTypeCodeBox = new Ext.form.ComboBox({
		             name:"swapTrade.deptBussinessType",
		             store: businessTypeDs,
		             displayField:'bussinessType',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.deptBussinessType",
		             emptyText:'��ѡ��',
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
                  ["0","����"],
                  ["1","����"]
                 ];
				var cptyStore = new Ext.data.SimpleStore({
	                 fields: ['id', 'name'],
	                 data : cptyData // �������������
	                  });
				var cptyBox = new Ext.form.ComboBox({
		             name:"swapTrade.cpty",
		             store: cptyStore,
		             displayField:'name',// ��������
		             valueField:'id',     // ����ֵ
		             hiddenName:"swapTrade.cpty",
		             emptyText:'��ѡ��',
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
	        	 if(Ext.get('forwardTrade.rateCode')){//��֤����Һͱ�֤�������ͬʱ¼��  xujie 2014-02-10
	         		if(Ext.get('forwardTrade.marginCodeStr').dom) marginCode = Formatter.toNumber(Ext.get('forwardTrade.marginCodeStr').dom.value);
	         		if(Ext.get('forwardTrade.marginAmount').dom) marginAmount = Formatter.toNumber(Ext.get('forwardTrade.marginAmount').dom.value);
	         	}else if(Ext.get('swapTrade.rateCode')){
	         		if(Ext.get('swapTrade.marginCodeStr').dom) marginCode = Formatter.toNumber(Ext.get('swapTrade.marginCodeStr').dom.value);
	         		if(Ext.get('swapTrade.marginAmount').dom) marginAmount = Formatter.toNumber(Ext.get('swapTrade.marginAmount').dom.value);
	         	}
	         	if(((marginCode == '' || marginCode == '-��ѡ��-' )  && (marginAmount != 0 && marginAmount != ''))||((marginCode != '' && marginCode != '-��ѡ��-' )  && (marginAmount == 0 || marginAmount == '')) ){
	         		Ext.MessageBox.alert('��ʾ','��֤����Һͽ�����ͬʱ¼�룡');
	         		return -1;
	            }else{
		         	 if(marginCode == 0){
				           if(Ext.get('forwardTrade.rateCode')){//��֤����Һͱ�֤�������ͬʱ¼��  xujie 2014-02-10
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

		
			/*var checkRelInfo = eforexGrid.validateTradeRelevancyInfoFunc();//��֤������Ϣ
			if(!checkRelInfo){
         		return;
         	}
			if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{*/
            if(eforexGrid.checkMgamt() == -1)return;
			var isBuy;
			//alert(isSell);
			if(isSell=='B/S'|| isSell=='���'){
		        isBuy='false';
		        if(Ext.get('swapTrade.amount1')){
		            isBuy='true';}
		    }else if(isSell=='S/B'|| isSell=='�ۻ�'){
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
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('dealUpdateBtn').dom.getAttribute('action'),
							{success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
		 /*	}*/
		}, 
		/**
 * �Կͽ��� itemid != 5
 * true  - �ۻ�
 * false - ���
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
			 var initBnakListse = function(e,b,o){//������������Ⱦ xujie
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
			         btn = infoDlg.addButton('ȷ��');
			         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
		        }
		        btn.setHandler(eforexGrid.doAllAction, infoDlg);
		        btn.enable();
		        infoDlg.setTitle('���');
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
		            		 btn1 = infoDlg.addButton('�����ʼ��',eforexGrid.passwordInit);
		            	}
					}
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true});
		        }
		        if(btn1) {
		        	btn1.hide();
		        }
	      		btn.setHandler(eforexGrid.saveData, infoDlg);
	      		btn.enable();
	            infoDlg.setTitle('���');
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
			         //btn = infoDlg.addButton('ȷ��');
			         infoDlg.addButton('�ر�', infoDlg.hide, infoDlg);
		        }
		        //btn.setHandler(eforexGrid.doAllAction, infoDlg);
		        //btn.enable();
		        infoDlg.setTitle('�����ֵ');
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
		            		 btn1 = infoDlg.addButton('�����ʼ��',eforexGrid.passwordInit);
		            	}
					}**/
			            //btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true});
		        }
		        if(btn1) {
		        	btn1.hide();
		        }
	      		//btn.setHandler(eforexGrid.doImportMtm, infoDlg);
	      		//btn.enable();
	            infoDlg.setTitle('�����ֵ');
	            var layout = infoDlg.getLayout();
	            layout.beginUpdate();
	            layout.add('center',content);
	            var update = content.getUpdateManager();   
				update.update(Ext.get('importMtmBtn').dom.getAttribute('url'),null,eforexGrid.dlgLoadCallback);
	           	layout.endUpdate();
			}
           	infoDlg.show();
		},
		
	//�ϴ��ļ�ʱjavascript��ȡ�ļ��ı���·�������⣨"C:\fakepath\"���Ľ������
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
					Ext.MessageBox.alert('����','��ѡ���ļ�!');
					return;
				}
				var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, 'importMtm.action?file='+file,
		                    {success: eforexGrid.commentSuccessImportMtm, failure: eforexGrid.commentFailure}); 
		},
		
		commentSuccessImportMtm : function(o){
			var data = o.responseText;
			Ext.MessageBox.hide();
			if(data){
				 if(data !="" && data.indexOf('INFO')!= -1){
				 	 if(data.indexOf('ERROR')!= -1){
						alert("FXDEALMTM_I4������˻��ܣ�"+data.substring(data.indexOf('INFO')+4,data.indexOf('ERROR')));
					  }else{
					  	alert("FXDEALMTM_I4������˻��ܣ�"+data.substring(data.indexOf('INFO')+4));
					  }
					  
				 }
				 if(data.indexOf('ERROR')!= -1){
				     Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));
				}else{
					if(infoDlg){
							infoDlg.hide();
					}
					 Ext.MessageBox.alert('��ʾ','����ɹ�');
				 }
			}else{
				if(infoDlg){
							infoDlg.hide();
					}
					 Ext.MessageBox.alert('��ʾ','����ɹ�');
				 }
        },
		
		dlgLoadCallback : function(e,b,o){
			var data = '';
			if(typeof(o) != 'undefined'){data = o.responseText;}
			 if(data.indexOf('ERROR')!= -1){
				infoDlg.hide();
				Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));
				return 'error';
			}
			if(data.indexOf('TipOk')!= -1){
				infoDlg.hide();
				Ext.MessageBox.alert('��ʾ',data.substring(data.indexOf('TipOk')+5));
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
			// ��ͬ��ҳ���ʼ�������ֶ����Ʋ�ͬ
			var _name = "";
			if(Ext.get("user.validDate")!=null){
					_name = 'user.validDate';
					// ���ڿ�������
					var cvalueDate = new Ext.form.DateField({// ����ڽ���ҳ��ͳ�ʼ�����ڿؼ�
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			if(Ext.get("userExt.beginDate")!=null){
					_name = 'userExt.beginDate';
					// ���ڿ�������
					var cvalueDate = new Ext.form.DateField({// ����ڽ���ҳ��ͳ�ʼ�����ڿؼ�
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			if(Ext.get("userExt.endDate")!=null){
					_name = 'userExt.endDate';
					// ���ڿ�������
					var cvalueDate = new Ext.form.DateField({// ����ڽ���ҳ��ͳ�ʼ�����ڿؼ�
					   		name: _name,
					    	format:'Ymd'
					    });
					
					cvalueDate.applyTo(_name);
			}
			//��ǰչ��չ�ڽ��ɱ䣬ֻ��ȫ��չ
			if(Ext.get('durationBtn')){
				if(Ext.get('durationBtn').dom.getAttribute('url').indexOf("&ery=true")>0){
					if(Ext.get('durationTrade.durationAmount')){
						$('durationTrade.durationAmount').readOnly = true;
		            	$('durationTrade.durationAmount').className = 'input_NoBoder';
	            	}
	            }	
            }
            
			//��ǰչ��չ�ڽ��ɱ䣬ֻ��ȫ��չ
			if(Ext.get('farDurationBtn')){
				if(Ext.get('farDurationBtn').dom.getAttribute('url').indexOf("&ery=true")>0 ){
					if(Ext.get('durationTrade.durationAmount')){
						$('durationTrade.durationAmount').readOnly = true;
		            	$('durationTrade.durationAmount').className = 'input_NoBoder';
	            	}
	            }	
            }
            
			if(Ext.get("appList")&&Ext.get("app-grid")){// ��ʼ�� ��Ʒ�б� Grid��������
				eforexGrid.initRoleRightGrid();
				infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);  // �Ի���
																							// ��С����
			}else{
				if(content.getEl().dom.firstChild.offsetHeight!=undefined) {
					infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth+2,content.getEl().dom.firstChild.offsetHeight);
				}
			}
		},
		
		initRoleRightGrid:function(){// ��ʼ����ɫ ��Ʒ Ȩ��
		    app = Ext.data.Record.create([
			        	   {name: 'appid'},
			        	   {name: 'appname'}                                 	                      
	                  ]);	  
	        appCM = new Ext.grid.ColumnModel([
				{header: "Ȩ�޴���",width:326,align:'center', sortable: false,dataIndex:'appname'}
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
    		appGrid.on("rowdblclick",eforexGrid.appRowDblClick,this);// �������¼�����
			appGrid.render();
		    appDS.load({params:params});	
		    eforexGrid.initApplRightGrid();// ��ʼ��Grid����
	    },

	    initApplRightGrid:function(){
	    	 Right = Ext.data.Record.create([ 
	    		{name : 'id'}, 
				{name : 'name'}, 
				{name : 'enabled'},
				{name : 'permit'}
				]);
			var RightIdRendererFnc = function(value, p, r, rowIndex, colIndex,ds) { // Ȩ�ޱ������
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
			{header : "Ȩ�޴���",width : 200,sortable : false,dataIndex : 'permit'}, 
			{header : "Ȩ����",width : 220,sortable : false,dataIndex : 'name'}
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
            eforexGrid.loadApplRightGrid(record.get('appid') , roleId);// װ����������
	    },
	    
	    loadApplRightGrid:function(appid,roleid){// ѡ���Ʒ����װ�� ��ӦȨ�����ݵ�grid��
	    	var params = {'logRight.appid' :appid,'logRight.roleid' :roleid};
			RightDS.load({params : params}); // װ��ָ����������
	    },

	    ppRowRender:function(value, p, r, rowIndex, colIndex,ds) { // �Ƽ۲���������ͷ���ĸ�ѡ��
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
		
		ppRowRender:function(value, p, r, rowIndex, colIndex,ds) { // �Ƽ۲���������ͷ���ĸ�ѡ��
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
		
		ppCheckChange:function(checkBox){ // �Ƽ۲��� ��ѡѡ��
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
						if(success){// �ص�����
						 if(data.indexOf('dipname')==-1&&_bankId!=''){
				     		Ext.MessageBox.alert('����','�����ڸû�����������ѡ��!');
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
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('insertBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure}); 
			}
		},
		
		initAuthSystem:function(){
			 dialogWa= new Ext.LayoutDialog("authDiv", {// ͨ��div�㴴���Ի���
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
				btnWa = dialogWa.addButton('ȷ��');
				cancelBtnWa = dialogWa.addButton('ȡ��');
				contentWa = new Ext.ContentPanel('auth',{autoCreate : true,fitToFrame:false});
			    dialogWa.setTitle("������Ȩ��֤");        // �Ի�������TITLE����
			    btnWa.setHandler(eforexGrid.doAuthBtn,dialogWa);// �ύ��ť������
			    cancelBtnWa.setHandler(eforexGrid.doAuthCancleBtn, dialogWa);
		},
		
		 doAuthBtn:function(){
	    	// ��ֵ������ ҳ��������ȥ����ִ����ȥ����Ҫ������֤�������Ա
	    	var userId=Ext.get('authUser').dom.value;
	    	var userPwd=Ext.get('authPwd').dom.value;
	    	if(Ext.get('sysParam.userId')){
	    	var cuserId=Ext.get('sysParam.userId').dom.value;
	    	if(userId.trim()==cuserId.trim()){
	    		  alert("��Ȩ��Ա�������Լ�������������");
	    		  return;
	        	}
	    	}
	    	// ȡ�������Ȩ��Ա������,�����֤�������Դ˲������
	    	Ext.MessageBox.wait('��Ȩ��Ϣ��֤��...','���Ժ�...');// ������Ч��
	    	// TradeCalc.checkUserRight(userId,userPwd,'/base/updateSysParam',eforexGrid.AuthCallBackFunc);
	    	// Add by wdw 20101217 21:58 dwr����
		   var params = 'userId='+userId+'&userPwd='+userPwd+'&actionPath=/base/updateSysParam';
		   Ext.Ajax.request({
					url : '../forex/checkUserRight.action',
					params : params,
					callback:function(opts,success,response){
						data = response.responseText;
						if(success){// �ص�����
							eforexGrid.AuthCallBackFunc(data);
						}}
					});
	    },
	    
	    AuthCallBackFunc:function(data){
	    	Ext.MessageBox.hide();// �ص�ִ�����ok
	    	var code=data.substring(0,4);// 4λ��Ч����
			var pos=data.indexOf('|');
			if(code!='0000'){// Զ�ڣ�����Զ�ˣ�������0000 �ɹ�
			 	alert('����:'+data.substring(pos+1,data.length));
			 	return;
			}else {
			    alert(data.substring(pos+1,data.length));// ��ȷ��Ϣ
			}
			contentWa.setContent('');// ����������
	    	dialogWa.hide();// ��Ȩ������������
	    	eforexGrid.doUpdateSystem();
	    },
	    
	    doUpdateSystem:function(){// ϵͳ�����޸�ʵ�ʲ�����ǰ�������Ȩ��֤
			var formEl = content.getEl().child("form").dom;	
			Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
			Ext.lib.Ajax.formRequest(formEl, '../base/updateSysParam.action',
            {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
	    },
	    
	    doAuthCancleBtn:function(){
	    	contentWa.setContent('');// ����������
	    	dialogWa.hide();
	    },
		commentSuccessPassword:function(o){
	    	var data = o.responseText;
			if(data=='relogin'){
				alert("�����ʼ���ɹ��������µ�¼");
				window.close();
//				window.opener.close();
				window.opener.location.href = '/base/Login.jsp';
			}else if(data == 'true'){
				Ext.Msg.alert("��ʾ","�����ʼ���ɹ�");
			}else if(data == 'false'){
				Ext.Msg.alert("��ʾ","�����ʼ��ʧ��");
			}else{
				Ext.Msg.alert("��ʾ",data+123);
			}
			
		},
		commentSuccessPasswordForBranch:function(o){
	    	var data = o.responseText;
			if(data=='relogin'){
				alert("�����ʼ���ɹ��������µ�¼");
				window.close();
				window.opener.location.href = '/base/Login.jsp';
			}else if(data == 'true'){
				Ext.Msg.alert("��ʾ","�����ʼ���ɹ�");
			}else if(data == 'false'){
				Ext.Msg.alert("��ʾ","�����ʼ��ʧ��");
			}else{
				Ext.Msg.alert("��ʾ",data);
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
						alert('Ȩ�����óɹ�,�����...');
					}else{
						if(infoDlg){
							infoDlg.hide();
						}
						eforexGrid.refresh();
					}
				}else if(data.indexOf('ERROR')!= -1){
				     Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));
				}else if(data.indexOf('TipOk')!= -1){
				     Ext.MessageBox.alert('��ʾ',data.substring(data.indexOf('TipOk')+5));
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
								temp += "�Կͽ���";
							}else if(rultArr2[0] == ACC_RESULT_FLAG_ZF){
								temp += "���ܽ���";
							}else if(rultArr2[0] == ACC_RESULT_FLAG_ECCZ){
							    temp += "�ٴο���";
							}
							
							if(rultArr2[1] == ACCPROCE_STATUS_INIT){
							   temp +="  ���׺�����δ���ɣ�";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_SUCCESS){
							   temp +="  ���׺��������ɳɹ���";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_EXCEPTION){
							   temp +="  ���׺���������ʧ�ܣ�";
							}  
							if(rultArr2[1] == ACCPROCE_STATUS_NOTDO){
							   temp +="  ���׺������������ɣ�";
							}  
							if(rultArr2[1] == 4){
							   temp +="  ���׺���������δ֪״̬��";
							}
							temp += "<br/> �����룺"+  rultArr2[2];
							temp += "<br/> ������Ϣ��"+  rultArr2[3];
							temp += "<hr width='250' align='left' color='blue'/>";
							//temp += "<a href class='linkStyle' onClick='javacript:alert(1);'>xxxxxxxxxxxxxxxx</a>";
							//alert(temp);
				     }
				      if(data.indexOf('#ACTCRT#')!= -1){
				     	if(parseInt(receiptNo) == 0 ){
				     		Ext.MessageBox.alert('���׺������ͽ��',temp);
				     	}else if(parseInt(receiptNo) == -1){
				     	   	 temp += "����ص����ɽ��","����ص�����ʧ�ܣ�����ʱ�ֶ�������������ϵ����Աлл����";
				     	   	 Ext.MessageBox.alert('���׺������ͽ��',temp);
				     	}else{
						     var url = "/forex/printOutActCustReceipt.action?actCustReceipt.receiptNo="+receiptNo;
							 temp += "<a href onClick=eforexGrid.myPrint('"+url+"')>���[��]��ӡ�ͻ��ص�</a>";
					   		 Ext.Msg.confirm("��ȷ���Ƿ��ӡ�ͻ��ص�", temp, function(button,text){
								if(button=='yes'){
											var url = "/forex/printOutActCustReceipt.action?actCustReceipt.receiptNo="+receiptNo;
											eforexGrid.myPrint(url);
								}else{
										    
								}
							});
					   }
				     }else{
				         Ext.MessageBox.alert('���׺������ͽ��',temp);
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
        	Ext.MessageBox.alert('����','����������,�����ύʧ��');
        	if(infoDlg){
        		infoDlg.hide();
        	}
        },
        
        initAuthDialog:function(){
	  		    dialogWa= new Ext.LayoutDialog("authDiv", {// ͨ��div�㴴���Ի���
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
				btnWa = dialogWa.addButton('ȷ��');
				cancelBtnWa = dialogWa.addButton('ȡ��');
				contentWa = new Ext.ContentPanel('auth',{autoCreate : true,fitToFrame:false});
			    dialogWa.setTitle("������Ȩ��֤");        // �Ի�������TITLE����
			    btnWa.setHandler(eforexGrid.doAuthTradeBtn,dialogWa);// �ύ��ť������
			    cancelBtnWa.setHandler(eforexGrid.doAuthTradeCancleBtn, dialogWa);
	  },
        
      checkAuthRight:function(){
	    	var tradeLoadCb = function(e,b,o){
				dialogWa.setContentSize(360,contentWa.getEl().dom.scrollHeight);// ������Ȩ������ʾ��С
		    };
	          if(!dialogWa){// ��Ȩ����
	                  this.initAuthDialog();
	           }
			    var layoutWa = dialogWa.getLayout();
	    	    layoutWa.beginUpdate();
			    layoutWa.add('center',contentWa);
	            var update = contentWa.getUpdateManager(); // ������������
				update.update({
					   url:'/base/Auth.jsp',
				       params:{},
				       callback:tradeLoadCb,// �ص�����
				       nocache:true,
					   scope:this		
				});     // �ύ��̨ˢ������
				layoutWa.endUpdate();
				dialogWa.show();   // �Ի�����ʾ
	    },
	    
	    doAuthTradeBtn:function(){
	    	// ��ֵ������ ҳ��������ȥ����ִ����ȥ����Ҫ������֤�������Ա
	    	var userId=Ext.get('authUser').dom.value;
	    	var userPwd=Ext.get('authPwd').dom.value;
	    	// ȡ�������Ȩ��Ա������,�����֤�������Դ˲������
	    	Ext.MessageBox.wait('��Ȩ��Ϣ��֤��...','���Ժ�...');// ������Ч��
	    	// TradeCalc.checkUserRight(userId,userPwd,'/forex/updateOneTradeInfo',eforexGrid.AuthTradeCallBackFunc);
	    	// Add by wdw 20101217 21:58 dwr����
		   var params = 'userId='+userId+'&userPwd='+userPwd+'&actionPath='+actionPath;
		   Ext.Ajax.request({
					url : '../forex/checkUserRight.action',
					params : params,
					callback:function(opts,success,response){ 
						data = response.responseText;
						if(success){// �ص�����
							eforexGrid.AuthCallBackFunc(data);
						}}
					});
	    },
	   AuthCallBackFunc:function(data){
			    	Ext.MessageBox.hide();//�ص�ִ�����ok
			    	var code=data.substring(0,4);//4λ��Ч����
					var pos=data.indexOf('|');
					if(code!='0000'){//Զ�ڣ�����Զ�ˣ�������0000 �ɹ�
					 	Ext.Msg.alert('��ʾ','����:'+data.substring(pos+1,data.length));
					 	return;
					}else {
					    Ext.Msg.alert('��ʾ',data.substring(pos+1,data.length));//��ȷ��Ϣ
					}
					contentWa.setContent('');//����������
			    	dialogWa.hide();//��Ȩ������������
			    	//�����߼��жϣ�����һ����Ȩ ȫ�ֱ�����ʶ���ֽ�����Ȩ
			    	eforexGrid.authCommit();//��Ȩ��ִ�д˲��������ؼ���
			    	
		 },
		 authCommit : function(){
		 },
	    
	    doAuthTradeCancleBtn:function(){
	    	contentWa.setContent('');// ����������
	    	dialogWa.hide();
	    },
	    
	    callRoleAuthUpdate:function(){// ��ɫ��Ȩ�ص�
				eforexGrid.initRoleRightGrid();
				infoDlg.setContentSize(560,content.getEl().dom.firstChild.offsetHeight);  // �Ի���
																							// ��С����
	    },
	    
	    doRoleAuthUpdate:function(){
	    	        this.doInitDialg();
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		           // btn.setHandler(eforexGrid.updateInfo,
					// infoDlg);//���°��ص㴦����
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
				    var callBackFunc = function(e,b,o){
	                     eval(Ext.get('updateBtn').dom.getAttribute('doCallBackFunc'));	// ִ�еĻص�����
				    };
		           	
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
					layout.endUpdate();
		            infoDlg.show();
	    },
	    
	 callBackPrintGetInfo : function(){ 
		   infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);  // �Ի���
																															// ��С����
	  },
	  
	 callBackSpotTradeCzAndStatusUpdate:function(){// ��Ҫ�������� otherbtn
													// ����,���ƴ����Сע��
      	   if(document.getElementById('czEnabled') && document.getElementById('czEnabled').value.trim()=='true'){// ���Գ���
		      otherbtn.enable();
		   }
		   
		   if(document.getElementById('kondorEnabled') && document.getElementById('kondorEnabled').value.trim()=='true'){// ���Գ���
		      kondorbtn.enable();
		   }
		   infoDlg.setContentSize(content.getEl().dom.firstChild.offsetWidth,content.getEl().dom.firstChild.offsetHeight);  // �Ի���
																															// ��С����
	  },	  
	  
	  

        
        sendOneToKondor:function(){
        	var formEl = content.getEl().child("form").dom;	
			Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
	    	Ext.lib.Ajax.formRequest(formEl, "/forex/sendOneTradeInfo.do",
            {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
            infoDlg.hide();
        },
        
	    printContainterEforex:function(){
	    	  var PrintWin=window.open('about:blank','��ӡ��ϸ');
		      PrintWin.document.write('<object id="WebBrowser" width=0 height=0 classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2"></object>' + 
		      document.getElementById("containerPrintXX").innerHTML);
		      PrintWin.document.all.WebBrowser.ExecWB(6,1); // ��ӡ
		      PrintWin.close();
		      // PrintWin.document.all.WebBrowser.ExecWB(7,1);//��ӡԤ��
		      return;
		  },        
        
       doPrintGetInfo:function(){					// ��ӡ����
       	 if(selectModel.hasSelection()) {  
	       this.doInitDialg();
	        if(!otherbtn){
	            otherbtn = infoDlg.addButton('��ӡ'); 
				otherbtn.setHandler(eforexGrid.printContainterEforex,infoDlg);// �ύ��ť������
				// otherbtn.disable();
	        }
	        // var
			// lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
	        // infoDlg.setTitle( lableName );
	        var layout = infoDlg.getLayout();
	        layout.beginUpdate();
	        layout.add('center',content);
	        var params = eforexGrid.createParam();
	        params=params+'getinfo=1&'; 
	        var update = content.getUpdateManager();
		    var callBackFunc = function(e,b,o){
	             eval(Ext.get('getinfoBtn').dom.getAttribute('doCallBackFuncPrint'));	// ִ�еĻص�����
// if(document.getElementById('changeTransStatusEnabled') &&
// document.getElementById('changeTransStatusEnabled').value.trim()=='true'){//���Խ���ͷ���ֲ���
// btn.enable();
// }else{
// btn.disable();
// }
		    };
	       	
			update.update(Ext.get('getinfoBtn').dom.getAttribute('url'),params,callBackFunc); 
	       	layout.endUpdate();
	        infoDlg.show();
	        	        }else{
                Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�鿴�ļ�¼��');	        	
	        }
        },         
      dozqTradeUpdate:function(){					// ����״̬�޸�
      	if(selectModel.hasSelection()){
        	var type=selectModel.getSelected().get('type');
        	if(Number(type)!= 0 && Number(type)!=8  && Number(type)!=6){
        		Ext.MessageBox.alert('��ʾ','��Ӧ�����ѳ���');
        		return ;
        	}
                   this.doInitDialg();
		            if(!otherbtn){
			            otherbtn = infoDlg.addButton('����');
						otherbtn.setHandler(eforexGrid.updateTradeInfo,infoDlg);// �ύ��ť������
						otherbtn.disable();
		            }
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
				    var callBackFunc = function(e,b,o){
				    	 eval(Ext.get('updateBtn').dom.getAttribute('doCallBackFunc'));	// ִ�еĻص�����
				    	 infoDlg.setContentSize(400,336);// �̶�ҳ���С
				    };
		           	
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,callBackFunc);
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		   }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���ڽ���ļ�¼��');
		         }
        },        

        doCheckTradeTypeStatusUpdate:function(){
        	var type=selectModel.getSelected().get('type');
        	if(Number(type)!= 0 && Number(type)!=8){
        		Ext.MessageBox.alert('��ʾ','��Ӧ�����ѳ���');
        		return ;
        	}
                    this.doInitDialg();
                    var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		            var callBackFunc = function(e,b,o){
		            	if(document.getElementById('changeTransStatusEnabled') && document.getElementById('changeTransStatusEnabled').value.trim()=='true'){// ���Խ���ͷ���ֲ���
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
	      		Ext.MessageBox.alert('��ʾ','��ѡ����Ҫ����Ľ��׼�¼��');
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
	            printBtn = infoDlg.addButton('��ӡ',eforexGrid.printContainter);
	            infoDlg.addButton('�ر�', infoDlg.hide, infoDlg);
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'������Ϣ':Ext.get('updateBtn').dom.getAttribute('lableName');
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
	      		Ext.MessageBox.alert('��ʾ','��ѡ����Ҫ����Ľ��׼�¼��');
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
	            infoDlg.addButton('�ر�', infoDlg.hide, infoDlg);
				printBtn = infoDlg.addButton('��ӡ',eforexGrid.printContainter);
	            btn = infoDlg.addButton('ȷ��');
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
		    btn.setHandler(infoDlg.hide, infoDlg);
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            btn.setHandler(eforexGrid.updateInfo, infoDlg);
		            btn.disable();
        },
		getInTradeCheckInfo: function(){
			if(Ext.get('inTradeCheckBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼�����ϲ���');
        		return;
        	}
        	if(Ext.get('inTradeCheckBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('inTradeCheckBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
				             btn = infoDlg.addButton('ͨ��');
					         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
				        }
				        btn.setHandler(eforexGrid.doAllAction, infoDlg);
				        btn.enable();
				        infoDlg.setTitle('��ʵ');
				       	var layout = infoDlg.getLayout();
			            layout.beginUpdate(); 
			            var region = layout.getRegion("center");    
			            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
			            if(!region.getTabs()){	            	          
						    for(var i=0; i<eles.length; i++){
							   if(i ==0){
				        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
				        		   layout.add('center',content);
				        	   }else{
				        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
				        	   }
				            }       
			            }	        
			            for(var i=1; i<eles.length; i++){
			            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
			            	 var panelUpdate = panel.getUpdateManager();   
					         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ͨ��');
			            infoDlg.addButton('��ͨ��',function(){eforexGrid.doInputCheck(1)}, infoDlg);
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }
			            if(btn1) {
				        	btn1.show();
				        }
			            btn.setHandler(function(){eforexGrid.doInputCheck(3)}, infoDlg);
			            btn.enable();
			            var lableName=Ext.get('inTradeCheckBtn').dom.getAttribute('lableName')==undefined?'����':Ext.get('inTradeCheckBtn').dom.getAttribute('lableName');
			            infoDlg.setTitle( lableName );
			            var layout = infoDlg.getLayout();
			            layout.beginUpdate();
			            layout.add('center',content);
			            var params = eforexGrid.createParam();
			            var update = content.getUpdateManager();
						update.update(Ext.get('inTradeCheckBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
						// ����diaglog�Ի���ʵ�ʴ�С
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
			           	layout.endUpdate();
					   }
			           infoDlg.show();
			         }else{
			         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���и��˵Ľ��׼�¼��');
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
			Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
			Ext.lib.Ajax.formRequest(formEl, tempAction,
                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
			infoDlg.hide();
		},
        getBreachInfo:function(isFource){// ͨ������ʹ�õĴ������������ɿ���
        var butnoName;
        var titleMes;
        if(isFource==1){
			   butnoName='fbreachBtn';  
			   titleMes='ǿ��ΥԼ'   
			   }
		else{
			  butnoName='breachBtn';  
			   titleMes='ΥԼ'    
			   }
        	if(Ext.get('breachBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('breachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('breachBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){  
	        		var calAmt = selectModel.getSelected().get('calAmount');
		            var amt1 = Math.abs(selectModel.getSelected().get('amount1'));
		            var amt2 = Math.abs(selectModel.getSelected().get('amount2'));
		            var surplusamt1 = selectModel.getSelected().get('surplusamount1');
		            var isFarDelivery=selectModel.getSelected().get('isFarDelivery');
		            var tranType=selectModel.getSelected().get('tranType');
			        if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			           	Ext.MessageBox.alert('��ʾ','��ѡ�����⽻������Ϊ����ͨ���ס�����'+titleMes);
			           	return;
			        }
		            if(isFarDelivery == 1){
		           		Ext.MessageBox.alert('��ʾ','���ڽ��˲�������'+titleMes);
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(650,550);
			        }
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle(titleMes);
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
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
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		           	if(myInfoDlg)myInfoDlg.setTitle(lableName);
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ΥԼ�Ľ��׼�¼��');
		         }
	        }
        
        	
        },
        
        getEraseInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('eraseBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('eraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eraseBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '0'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ�д��ͽ��׽��г���');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
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
		            	var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'Զ�ڳ���':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            }else if(Ext.get('eraseBtn').dom.getAttribute('url').indexOf('&type=5')>0){
		            	var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'���ڳ���':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            }else{
		            	if(selectModel.getSelected().get('specialType') == 12 || selectModel.getSelected().get('specialType') == 3){
		            		 var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'ΥԼ����':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            	}else{
		           			 var lableName=Ext.get('eraseBtn').dom.getAttribute('lableName')==undefined?'���ճ���':Ext.get('eraseBtn').dom.getAttribute('lableName');
		            	}
		            }
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		            if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
	        }
        },
        
        //add by mzb  20130826 T+N����
        getTNEraseInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
      	if(Ext.get('tnEraseBtn')==null){
      		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
      		return;
      	}
      	if(Ext.get('tnEraseBtn').dom.getAttribute('doFunc')!=null){
      		eval(Ext.get('tnEraseBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '40'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ�м���T+N���׽��г���');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('tnEraseBtn').dom.getAttribute('lableName')==undefined?'T+N���׳���':Ext.get('tnEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('tnEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
	        }
      },
     
        getDeptEraseInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('deptEraseBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('deptEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deptEraseBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ���ڲ����׽��г���');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('deptEraseBtn').dom.getAttribute('lableName')==undefined?'�ڲ����׳���':Ext.get('deptEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('deptEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
	        }
        },
        
        getRmbDeptPropertiesInfo:function(){
        	if(Ext.get('rmbDeptPropertiesBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ���ڲ����׽������Ա��');
	            		return;
	        		}
	        		if(selectModel.getSelected().get('typeStr') == '���ڽ��׳���'
	        			||  selectModel.getSelected().get('eraseNo') != '0'){
	        			Ext.MessageBox.alert('��ʾ','�������ײ��ܽ����ʽ����Ա��');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
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
		            var lableName=Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('lableName')==undefined?'�ʽ����Ա��':Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�����޸ĵĽ��׼�¼��');
		         }
	        }
        },
        
    	getDeliveryedEraseInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('delveryedEraseBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('delveryedEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('delveryedEraseBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '0'
	        			&& selectModel.getSelected().get('itemId') != '40'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ�д��ͽ��׽��г���');
	            		return;
	        		}
	        		if(selectModel.getSelected().get('specialType')!='1'&&selectModel.getSelected().get('specialType')!='0'){
	        			Ext.MessageBox.alert('��ʾ','���⽻�ײ����ļ��ڲ��ܷ��𽻸�����');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authDeliveryedErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('delveryedEraseBtn').dom.getAttribute('lableName')==undefined?'��������':Ext.get('delveryedEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('delveryedEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
	        }
        },
        
        getDeptDeliveryedEraseInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('deptDelveryedEraseBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        		if(selectModel.getSelected().get('itemId') != '5'){
	        			Ext.MessageBox.alert('��ʾ','��ѡ���ڲ����׽��г���');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('�ر�', eforexGrid.myCloseDlg, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
				     }
				     if(otherbtn)otherbtn.hide();
				     if(relationBtn)relationBtn.hide();
				     if(btn)btn.show();
				     btn.setHandler(eforexGrid.authDeliveryedErase, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('deptDelveryedEraseBtn').dom.getAttribute('lableName')==undefined?'�ڲ����׽�������':Ext.get('deptDelveryedEraseBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('deptDelveryedEraseBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
	        }
        },
        
        getResendIsInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('resendIsBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('resendIsBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('resendIsBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('��������');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doResendIs, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('resendIsBtn').dom.getAttribute('lableName')==undefined?'��������':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('resendIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���в�������Ľ��׼�¼��');
		         }
	        }
        },
        
        getReverseIsInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('reverseIsBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('reverseIsBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('reverseIsBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('����ƽ��');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doReverseIs, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('reverseIsBtn').dom.getAttribute('lableName')==undefined?'����ƽ��':Ext.get('reverseIsBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('reverseIsBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���з���ƽ�̵Ľ��׼�¼��');
		         }
	        }
        },
        
        getGapInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('doGapBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('doGapBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('doGapBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('���ƽ��');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doGapTrade, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('doGapBtn').dom.getAttribute('lableName')==undefined?'���ƽ��':Ext.get('doGapBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('doGapBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���в��ƽ�̵Ľ��׼�¼��');
		         }
	        }
        },
        
        getDurationInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('durationBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('durationBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('durationBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){  
	        		if(Ext.get('durationBtn').dom.getAttribute('url').indexOf("&ery=true")>0){
		        		if(selectModel.getSelected().get('surplusamount1') != 0 || selectModel.getSelected().get('surplusamount2')!=0 ){
		        			Ext.MessageBox.alert('��ʾ','��ѡ��δ�����׽�����ǰչ��');
		            		return;
		        		}
	        		}else{
	        			 if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
				           	Ext.MessageBox.alert('��ʾ','��ѡ�����⽻������Ϊ����ͨ���ס�����չ��');
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(360,450);
			        }
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('չ��');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(360,450);
			        }
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doDuration, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('durationBtn').dom.getAttribute('lableName')==undefined?'չ��':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('durationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����չ�ڵĽ��׼�¼��');
		         }
	        }
        },

        getFarDurationInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('farDurationBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('farDurationBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('farDurationBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){  
	        	if( selectModel.getSelected().get('isFarDelivery')!=2){	
	        			Ext.MessageBox.alert('��ʾ','��ѡ��Զ�˵��ڵĽ��׽���Զ��չ��');
	            		return;
	            }
	        	if(Ext.get('farDurationBtn').dom.getAttribute('url').indexOf("&ery=true")>0 ){
	        		if( selectModel.getSelected().get('surplusamount1')!=0 ||selectModel.getSelected().get('surplusamount2')!=0 ){
	            		Ext.MessageBox.alert('��ʾ','��ѡ��δ�����׽�����ǰչ��');
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(360,450);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('Զ��չ��');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(360,450);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doFarDuration, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('farDurationBtn').dom.getAttribute('lableName')==undefined?'Զ��չ��':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('farDurationBtn').dom.getAttribute('url'),params,eforexGrid.dlgLoadCallback);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����Զ��չ�ڵĽ��׼�¼��');
		         }
	        }
        },
		getAllBreachInfo : function(isFource){// ͨ������ʹ�õĴ������������ɿ���
		    var butnoName;
        	var titleMes;
        	if(isFource==1){
			   butnoName='fallBreachBtn';  
			   titleMes='ǿ��ȫ��ΥԼ'   
			   }
			else{
			  butnoName='allBreachBtn';  
			   titleMes='ȫ��ΥԼ'    
			   }
        	if(Ext.get('allBreachBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('allBreachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('allBreachBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){ 
	        		var calAmt = selectModel.getSelected().get('calAmount');
		            var amt1 = Math.abs(selectModel.getSelected().get('amount1'));
		            var amt2 = Math.abs(selectModel.getSelected().get('amount2'));
		            var surplusamount1 = selectModel.getSelected().get('surplusamount1');
		            if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			         	Ext.MessageBox.alert('��ʾ','��ѡ�����⽻������Ϊ����ͨ���ס�����ȫ��ΥԼ');
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
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
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		           // eforexGrid.timer();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
	        		 
	        	}else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ΥԼ�Ľ��׼�¼��');
		         }
	        }
        },
         doAllBreach : function(isFource){
        	// var amountflag=eforexGrid.checkTradePositionAmount2();
        	// if(!amountflag){
        	// return;
        	// }
        	
        	if(Ext.get("allBreachTrade.nearCustLongPoints").dom.value=="" || Ext.get("allBreachTrade.nearCustLongPoints").dom.value=="NaN.00" ){
				Ext.MessageBox.alert('��ʾ','ȫ��ΥԼ�ͻ�����ˮ����Ϊ��');
			return;
			}
        	var amountflag=eforexGrid.checkDLFunc("allBreachTrade.instrument"); //Kgrѡ��
         	if(!amountflag){
         		return;
         	}
       		 var amountflag=eforexGrid.checkDLFunc("allBreachTrade.marginCode"); //��֤�����
         	if(!amountflag){
         		return;
         	}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
//				if(!valiAllBreachTradeElement()){
//					return;
//				}
				if(isFource==1){//ǿ��ΥԼ
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
         	Ext.MessageBox.wait('������...','���Ժ�...');
         	 Ext.Ajax.request({
					url : url,
					params : params,
					callback:function(opts,success,response){
						if(success){// �ص�����
							Ext.MessageBox.alert('��ʾ','����ɹ����ȴ��������!');
						}}
					});
         },
        showApplyPage : function(serialNo,type,flag){//������Ȩ����ҳ���ʼ��   xujie 2014-01-23
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
			        	 btn = infoDlg.addButton('ȷ��');
			        	 cbtn= infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
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
				    infoDlg.setTitle('��������');
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
		        //infoDlg.setTitle('��������');
		        //}
        },
        checkIfSpot	:function(){//����ֻ��ΥԼ����ǰΥԼ���ɵ����⽻�׳�������Ҫ��������,Զ���ڳ�������Ҫ��������
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
         checkExamineMessage : function(ifFource,flag){//������⽻���Ƿ��Ѿ�����˼�¼  xujie 2014-01-23
         var serialNo;
         var type;
         var alertMessage='';
         if(ifFource=='1')alertMessage='ǿ��';
         if(flag=='earlyBreach')alertMessage=alertMessage+'��ǰΥԼ';
		if(flag=='breach')alertMessage=alertMessage+'ΥԼ';
		if(flag=='allBreach')alertMessage=alertMessage+'ȫ��ΥԼ';
		if(flag=='duration')alertMessage=alertMessage+'��ǰչ��';
		if(flag=='farduration')alertMessage=alertMessage+'����չ��';
		if(flag=='earlyDelivery')alertMessage=alertMessage+'��ǰ����';
		if(flag=='earlyswapDelivery')alertMessage=alertMessage+'��ǰ����';
		if(flag=='earse')alertMessage=alertMessage+'����';
		if(flag=='delivery')alertMessage=alertMessage+'����';
		if(flag=='deliveryCancel')alertMessage=alertMessage+'�����';
         if(selectModel.hasSelection()){
         	if(flag=='deliveryCancel'){
         	serialNo= selectModel.getSelected().get('sourceNo');
         	type = selectModel.getSelected().get('sourceType');
         	state = selectModel.getSelected().get('state');
         	if(state == 1){
         		Ext.MessageBox.alert('��ʾ','�ý����¼�ѳ�����');
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
						if(success){// �ص�����
							if(response.responseText.indexOf('serialNo')==-1){
							Ext.Msg.confirm("��ȷ��", "ȷ��Ҫ�������⽻�����룿", function(button,text){   
								if(button=='yes'){
								eforexGrid.showApplyPage(serialNo,type,flag);
								}else{
								if(infoDlg)infoDlg.hide();
								}
							  });
							}
							else{
								if((Ext.decode(response.responseText).data)[0].applyState==0){//����δ���
									if(infoDlg)infoDlg.hide();
									Ext.MessageBox.alert('��ʾ','�ѷ�������,��������ˣ�');
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
				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����'+alertMessage+'�Ľ��׼�¼��');
				}
         },
         tradeAuthOK : function(){//���ͨ��
         	var btname='doTradeAuthBtn';
         	if(Ext.get('tradeAuth.applyState'))Ext.get('tradeAuth.applyState').dom.value=2;
         	eforexGrid.confirmTradeAction(btname);
         },
         tradeAuthNO : function(){//��˾ܾ�
         	var btname='doTradeAuthBtn';
         	if(Ext.get('tradeAuth.applyState'))Ext.get('tradeAuth.applyState').dom.value=1;
         	eforexGrid.confirmTradeAction(btname);
         },
         getTradeAuthInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
	        	if(Ext.get('doTradeAuthBtn').dom.getAttribute('doFunc')!=null){
	        		eval(Ext.get('doTradeAuthBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
		        } else{
		        	if(selectModel.hasSelection()){  
		        	var applyStateStr=selectModel.getSelected().get('applyStateStr');
		        	 var serialNo = selectModel.getSelected().get('serialNo');
		 			var type = selectModel.getSelected().get('type');
		 			var applyTime = selectModel.getSelected().get('applyTime');
		 			var applyDate = selectModel.getSelected().get('applyDate');
		        	if(applyStateStr=='�����'){
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
				            btn = infoDlg.addButton('ͨ��');
				            dtn = infoDlg.addButton('�ܾ�');
				            cbtn = infoDlg.addButton('�ر�');
				            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
			            }
			            btn.setHandler(eforexGrid.tradeAuthOK, infoDlg);
			            dtn.setHandler(eforexGrid.tradeAuthNO, infoDlg);
			            
			            cbtn.setHandler(infoDlg.hide, infoDlg);
			            btn.enable();
			            cbtn.enable();
			            var lableName=Ext.get('doTradeAuthBtn').dom.getAttribute('lableName')==undefined?'�������':Ext.get('deliveryCancelBtn').dom.getAttribute('lableName');
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
						// ����diaglog�Ի���ʵ�ʴ�С
						// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
			           	layout.endUpdate();
			            infoDlg.show();
			            }else{
			            	Ext.MessageBox.alert('��ʾ','ֻ�ܶԴ���˵����뷢�����');
			            }
			         }else{
			         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����������˵ļ�¼��');
			         }
		        }
	        },
        getEarlyBreachInfo : function(isFource){// ͨ������ʹ�õĴ������������ɿ���
        	var alertMes;
        	var lableName;
        	if(Ext.get('eBreachBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('eBreachBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eBreachBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
		            alertMes='ǿ����ǰΥԼ';
		            }else{
		            alertMes='��ǰΥԼ';
		            }
		            if(isFarDelivery == 1){
		            Ext.MessageBox.alert('��ʾ','���ڽ��˲�������'+alertMes);
		            		return;
		            }
		             if(tranType == 'Զ�ڽ���' || tranType == '���ڽ���'){
		              if(surplusamt1>0){
		               Ext.MessageBox.alert('��ʾ','�Ѳ��ֻ�ȫ���������ܽ���'+alertMes);
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
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
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		            eforexGrid.stopTimer();
		            if(myInfoDlg)myInfoDlg.setTitle(lableName);
	        	}else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����ΥԼ�Ľ��׼�¼��');
		         }
	        }
        },
        checkDLFunc:function(idname){//����¼���� ���ֻ����к�ѡ���ѡ
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
			    if(String(idvalue).trim().length==0){//����Ϊ0������ѡ��
			    	Ext.Msg.alert('��ʾ',textName+"Ϊ��,������ѡ��");
			    	return false;
			    }
			}
		    return true;
		},
        doEarlyBreach : function(isFource){	
	        var amountflag=eforexGrid.checkDLFunc("earlyBreachTrade.instrument"); //Kgrѡ��
	         	if(!amountflag){
	         		return;
	         	}
       		 var amountflag=eforexGrid.checkDLFunc("earlyBreachTrade.marginCode"); //��֤�����
         		if(!amountflag){
         			return;
         		}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
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
				if(isFource == 1){//ǿ��ΥԼ
					 eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_BREACH,'feBreachBtn');
				}else{
					eforexGrid.doSpecialTradeAuth(SPECIAL_TYPE_E_BREACH,'eBreachBtn');	
				}
				
			}
        }, 
       confirmTradeAction : function(bnname) {
			var formEl = infoDlg.getEl().child("form");// ����ҳ����ύ
			if (formEl && formEl.dom) {
				var params = Ext.lib.Ajax.serializeForm(formEl);// �Ա����������ݽ������л�����ϳɲ�����
				Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
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
        getSwapEdeliveryInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('eDeliSwapBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('eDeliSwapBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eDeliSwapBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
		            Ext.MessageBox.alert('��ʾ','���ڽ��˲���������ǰ����');
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('��ǰ����');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doEarlyDeli, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('eDeliSwapBtn').dom.getAttribute('lableName')==undefined?'��ǰ����':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eDeliSwapBtn').dom.getAttribute('url'),params,func);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ������ǰ����Ľ��׼�¼��');
		         }
	        }
        
        	
        },
        
        getEdeliveryInfo:function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('eDeliBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('eDeliBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('eDeliBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.enable();
			        infoDlg.setTitle('��ǰ����');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }else{
			        	 infoDlg.setContentSize(600,565);
			        } 
		            if(btn1) {
			        	btn1.show();
			        }
		            btn.setHandler(eforexGrid.doEarlyDeli, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('eDeliBtn').dom.getAttribute('lableName')==undefined?'��ǰ����':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
		           	
					update.update(Ext.get('eDeliBtn').dom.getAttribute('url'),params,func);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ������ǰ����Ľ��׼�¼��');
		         }
	        }
        
        	
        },
        
        getDeliveryInfo : function(){// ͨ������ʹ�õĴ������������ɿ���
        	if(Ext.get('deliveryBtn')==null){
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('deliveryBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('deliveryBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        	if(selectModel.hasSelection()){
	        	 /**if(selectModel.getSelected().get('tranType') && selectModel.getSelected().get('tranType') != 1){
			           	Ext.MessageBox.alert('��ʾ','��ѡ�����⽻������Ϊ����ͨ���ס����𽻸�');
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
			             btn = infoDlg.addButton('ȷ��');
	
				         infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			        }else{
			        	 infoDlg.setContentSize(500,350);
			        } 
			        btn.setHandler(eforexGrid.doAllAction, infoDlg);
			        btn.disable();
			        infoDlg.setTitle('���ս���');
			       	var layout = infoDlg.getLayout();
		            layout.beginUpdate(); 
		            var region = layout.getRegion("center");    
		            var eles = dlgTabs.dom.elements;    // tab���ӶԻ������
		            if(!region.getTabs()){	            	          
					    for(var i=0; i<eles.length; i++){
						   if(i ==0){
			        		   content = new Ext.ContentPanel('panel0',{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')});
			        		   layout.add('center',content);
			        	   }else{
			        	   	   layout.add('center',new Ext.ContentPanel('panel'+i,{autoCreate : true,fitToFrame:true,title: eles[i].getAttribute('tabTitle')}));// ����������������
			        	   }
			            }       
		            }	        
		            for(var i=1; i<eles.length; i++){
		            	 var panel = region.panels.itemAt(i);  // ������������ˢ��
		            	 var panelUpdate = panel.getUpdateManager();   
				         panelUpdate.update(eles[i].getAttribute('url'),eforexGrid.getTabParam(eles[i]));// ˢ�¶������ʼ������
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
				 }else{//�����������֧
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
			            btn = infoDlg.addButton('ȷ��');
			            infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
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
		            var lableName=Ext.get('deliveryBtn').dom.getAttribute('lableName')==undefined?'����':Ext.get('deliveryBtn').dom.getAttribute('lableName');
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
					//����diaglog�Ի���ʵ�ʴ�С
					//update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
				   }
		           infoDlg.show();
		           if(myInfoDlg)myInfoDlg.setTitle(lableName);
		           if(tranType!=1){
		           	if(btn)btn.enable();
		           }
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���н���Ľ��׼�¼��');
		         }
	        }
        
        	
        },
        getOptionBtnInfo : function(){
        	if(Ext.get('printOptionBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('printOptionBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	        } else{
	        }	
        },
        getInfo : function(){// ͨ������ʹ�õĴ������������ɿ���
         var initBnakListse = function(e,b,o){//������������Ⱦ xujie
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
        		Ext.MessageBox.alert('��ʾ','��¼��������ֱ���޸�');
        		return;
        	}
        	if(Ext.get('updateBtn').dom.getAttribute('doFunc')!=null){
        		eval(Ext.get('updateBtn').dom.getAttribute('doFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
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
			            btn = infoDlg.addButton('ȷ��');
			           	cbtn = infoDlg.addButton('ȡ��', infoDlg.hide, infoDlg);
			            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		            }
		            if(printBtn){printBtn.hide();}
		            if(btn1) {
			        	btn1.show();
			        }else{
			        	var url = Ext.get('updateBtn').dom.getAttribute('url');
				        if(url.indexOf('posswordinit')!=-1) {
			            		btn1 = infoDlg.addButton('�����ʼ��',eforexGrid.passwordInit);
		            	}
				        if(url.indexOf('getClientInfo')!=-1) {
			            		btn1 = infoDlg.addButton('�˻����OR����',eforexGrid.cleintAccountMngtadd);
			            		btn1 = infoDlg.addButton('�˻�����',eforexGrid.cleintAccountMngt);
		            	}
			        }
		            btn.setHandler(eforexGrid.updateInfo, infoDlg);
		            btn.enable();
		            var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'�޸�':Ext.get('updateBtn').dom.getAttribute('lableName');
		            infoDlg.setTitle( lableName );
		            var layout = infoDlg.getLayout();
		            layout.beginUpdate();
		            layout.add('center',content);
		            var params = eforexGrid.createParam();
		            var update = content.getUpdateManager();
					update.update(Ext.get('updateBtn').dom.getAttribute('url'),params,initBnakListse);
					// ����diaglog�Ի���ʵ�ʴ�С
					// update.update({url:Ext.get('updateBtn').dom.getAttribute('url'),params:params,callback:eforexGrid.dlgLoadCallback,scope:this,scripts:true});//����ҳ���ļ��ű���ִ��
		           	layout.endUpdate();
		            infoDlg.show();
		         }else{
		         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�޸ĵļ�¼��');
		         }
	        }
        },
		cleintAccountMngt : function() {
            var customerId = $('clientCustomerId').value;
            var flag_ = 1;//�ӿͻ������˺ű�ʾ
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
            var flag_ = 1;//�ӽ�������������ˮ�Ź����ʾ
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
    			Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫ���¸ÿͻ����˺���Ϣ��',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('�����˺���...', '���Ժ�...');
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
		    	var relationType =selectModel.getSelected().get('relationType');//�������� 1 - kondor 2 - KTP
		    	var serialNo =selectModel.getSelected().get('serialNo');//������ˮ��
		    	//var falg="1";//kondor downloadkey
		    	if(Number(relationType)!=3){
		    		Ext.MessageBox.alert('��ʾ',"ֻ�ܶԹ�������ΪdownloadKey�ļ�¼����ͬ��!");
		    		return;
		    	}
    			Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫͬ�����¸�Kondor��Ϣ��',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('ͬ������kondor��...', '���Ժ�...');
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
							if(success){// �ص�����
								var data = response.responseText;
								if(data.indexOf('ERROR')!= -1){
				     				Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));
				     				return;
				     			}else{
				     				Ext.MessageBox.alert('��ʾ','ͬ���ɹ�!');
				     				return;
				     			}
								}
							}
    		  			});
				} else {
					
				}
			})
			}else{
				Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�޸ĵļ�¼��');
			
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
	      		Ext.MessageBox.alert('��ʾ','��ѡ����Ҫ��ʾ�Ľ��׼�¼��');
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
	            btn = infoDlg.addButton('ȷ��');
	            btnDeal = infoDlg.addButton('ȷ��');
	            infoDlg.addButton('ȡ��', eforexGrid.myCloseDlg, infoDlg);
	            if(itemId!=3) otherbtn=infoDlg.addButton('��������', eforexGrid.relDetailsDlg,infoDlg);
	            relationBtn=infoDlg.addButton('�ⲿ��ˮ�Ź���', eforexGrid.relationNoDlg,infoDlg);
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true});
		     }
		     if(btnDeal){btnDeal.hide()}
		     if(btn){btn.hide();}
		     if(otherbtn)otherbtn.show();
		     if(relationBtn)relationBtn.show();
		     if(!otherbtn){ 
		      if(itemId!=3)otherbtn=infoDlg.addButton('��������', eforexGrid.relDetailsDlg,infoDlg);}
		      if(!relationBtn){ 
		    	 relationBtn=infoDlg.addButton('�ⲿ��ˮ�Ź���', eforexGrid.relationNoDlg);
		     }
	        var lableName=Ext.get('updateBtn').dom.getAttribute('lableName')==undefined?'������Ϣ':Ext.get('updateBtn').dom.getAttribute('lableName');
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
	      		Ext.MessageBox.alert('��ʾ','��ѡ����Ҫ��ӡ����Ȩ��Ȩ���׼�¼��');
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
	        	printOptionBtn = printDlgO.addButton('��ӡ',function(){eforexGrid.printContainterWithUrl(Ext.get('printOptionBtn').dom.getAttribute('url'));});
	        	printDlgO.addButton('�ر�', function (){
	        		printDlgO.hide();
				}, printDlgO);
	        	contentO = new Ext.ContentPanel('printCenterO',{autoCreate : true,fitToFrame:true});
		     }
	        var lableName=Ext.get('printOptionBtn').dom.getAttribute('lableName')==undefined?'��Ȩ��Ȩ���״�ӡ':Ext.get('printOptionBtn').dom.getAttribute('lableName');
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
        
        beforeQueryRateCodeFunc:function(combo,qStr,force,cancel){// ȫ�ֹ������ɲ�������ֵ
        	// combo.getName();
        	if(rateCodeCombo.getRawValue()==''){
        		rateCodeCombo.setValue('');// ��ֵ
        	}
        },
        
        bankBeforeFunc:function(){// ǿ�Ʋ�ѯ����
        	this.store.baseParams["bank.type"]=0;
        },
        
           createQueryText:function(tbar,arr){     // ���ݲ�����̬���������ı������
        		 var channelTypeData = [
        		    ['', '����'],
        		    ["MT", "����"],
        		    ["FR", "��ҵ����"],
        		    ["BH", "��������"],
        		    ["RL", "YRL"]
        		    
        		 ];
                 var profitStatusData = [
                	['-1', '����'],
               		['0', '���'],
                    ['1', '�����'],
                    ['2', '��ȷ��']       
                 ];
                  
                var forCustTypeData=[
                    ['-1', '����'],
					['01', "��������"],
					['02', "���ڻ���"],
					['03', "���ʻ���"],
					['04', "���ʻ���"],
					['05', "�������"],
					['06', "�Ǿ������"],
					['07', "TC"],
					['500', "�ڲ���"]
                  ];
               var clientTypeData=[
                    ['0', '���пͻ�'],
                    ['2', '��˽'],
                    ['3', '�Թ�']
                  ];
               var applTypeData=[
                  ['-1', '���в�Ʒ'],
//                 ['0', '����ģ��'],
                  ['1', '�������'],
// ['2', '�ƽ�����'],
                  ['3', '���ۻ�']
//                  ['4', '�׻㽻��']
                  ];
               var tradeDireData=[
                                  ['-1', '����'],
                                  ['1', '���'],
                                  ['2', '�ۻ�']
                                ];
               var bracnhProfitClientTypeData=[
                                 ['-1', '����'],
                                 ['1', '����'],
                                 ['2', '����'],
                                 ['3', '����']
                                  ];
               var rfqClientData=[
                                  ['-1', '����'],
                                  ['1', '��'],
                                  ['0', '��']
                                    ];
               var transtypeData=[
                                               ['-1', '����'],
                                               ['1', '������С���'],
                                               ['2', '���������'],
                                               ['3', 'ѯ����С���'],
                                               ['4', 'ѯ�������']
                                                ];
               var sysParamTypeData=[
                  ['0', '���в�Ʒ'],
                  ['1', '����ģ��'],
                  ['2', '�Ƽ�ģ��'],
                  ['3', '����ģ��'],
                  ['4', '����ģ��']
                  ];
                  var countTypeData=[
                  ['-1', '����'],
                  ['0', '���жԿͻ��Ż�'],
                  ['1', '���жԷ����Ż�']
                  ];   
                var applCurrencyNothTypeData=[
                  ['-1', '����'],
                  ['1', '�������'],
// ['2', '�ƽ�����'],
                  ['3', '���ۻ�']
                  ];
                 
                 var bankTypeData=[  /* �������� -1 ���� 0-���ڻ��� 1-�м���� */
                  ['-1', '����'],
                  ['0', '���ڻ���'],
                  ['1', '�м����']
                 ];
                 
                 var bankFlagData=[
                  ['-1', '����'],
                  ['0', '����'],
                  ['1', '����']
                 ];
                  var kgrTTParamData=[
	                 ['-1', '����'],
	                 ['0', '����'],
	                 ['2', 'Զ�ڽ���'],
	                 ['4', '���ڽ���']
                 ];
                  var kgrSTTParamData=[
                  	 ['0', '����'],
	                 ['1', '��ͨ����'],
	                 ['2', '��ǰչ��'],
	                 ['3', '��ǰΥԼ'],
	                 ['4', '��ǰ����'],
	                 ['11', '����չ��'],
	                 ['12', '����ΥԼ'],
	                 ['13', '����'],
	                 ['14', '���ճ���'],
	                 ['15', 'ȫ��ΥԼ']
                 ];
                  var specialTradeQueryParamData=[
                  	 ['0', '����'],
	                 ['2', '��ǰչ��'],
	                 ['3', '��ǰΥԼ'],
	                 ['4', '��ǰ����'],
	                 ['11', '����չ��'],
	                 ['12', '����ΥԼ'],
	                 ['15', 'ȫ��ΥԼ']
                 ];
                  var cashFlowTypeData=[
                  ['-1', '����'],
                  ['2', 'Զ��'],
                  ['4', '����']
                 ];
                 
                 var otherItemIdData=[  /* �������� -1 ���� 6-ͬҵ��� 7-����ͬҵ��� 8-�ʽ���� */
                  ['-1', '����'],
                  ['6', 'ͬҵ���'],
                  ['7', 'ͬҵ���'],
                  ['8', '�ʽ����']
                 ];
                 var kParamData=[
	                 ['0', '����'],
	                 ['1', 'USER'],
	                 ['2', 'FOLDER']
                 ];
                 var execStateData=[
                                 ['0', '����'],
                                 ['1', 'ִ����'],
                                 ['2', 'ִ��ʧ��'],
                                 ['3', 'ִ�гɹ�'],
                                 ['4', '�ȴ�����������ִ��']
                                 ];
                 var execModelData=[
                                    ['0', '����'],
                                    ['1', '�Զ�����'],
                                    ['2', '�ֶ�����']
                                    ];
                 var spotStatusTypeData=[
                  ['-1', '����'],
                  ['0', '����¼��'],
                  ['1', '���в�¼']
// ['2', 'cfets¼��'],
// ['3', '����¼��']
                  ];
                  var inputTradeSystemData=[
                  ['-1', '����'],
                  ['0', 'YFX'],
                  ['1', 'NDS����ϵͳ'],
                  ['4', 'DCI']
  //                ['2', '��㽻������'],
 //                 ['3', '����ϵͳ']
                  ];
                 var itemIdData=[  /* �������� -1 ���� */
                  ['-1', '����'],
                  ['3', 'ƽ�̽���'],
                  ['5', '�ڲ�����']
                 ];
                 
                 var stateData1=[  
                  ['-1', '����'],
                  ['0', '����']
//                  ['1', 'ɾ��'],
 //                 ['2', 'ΥԼ']
                 ];
                 
                 var stateData2=[ 
                  ['-1', '����'],
                  ['0', '����'],
                  ['1', 'ɾ��'],
                  ['2', '���ִ���'],
                  ['3', 'ȫ���']
                 ];
                 var itemIdFLATData=[
                 ['-1','����'],
                 ['2','���ƽ��'],
                 ['3','���ۻ�ƽ��'],
                 ['9','�ڲ�����']
                 ];
                 var brnachGcItemIdData=[
                 ['-1','����'],
                 ['2','�Կͽ���'],
                 ['5','�ڲ�����']
                 ];
                 var isSummaryData=[
	                 ['-1','����'],
	                 ['1','����'],
	                 ['0','����']
                 ];
                 var isitemIdData =[
                 ['','����'],
                 ['OSPAY','����'],
				 ['IGCL','����'],
				 ['IMBL','���ڵ���'],
				 ['IMCLPAY','����'],
				 ['LOAN','�������'],
				 ['YQJSH','Զ�ڽ��ۻ�'],
				 ['LCTF','ת�ÿ���'],
				 ['EXNG','�鸶'],
				 ['EXCL','����'],
				 ['TFAB','ת�õ���'],
				 ['OR','������'],
				 ['IMLG','��������'],
				 ['EXLG','����֪ͨ'],
				 ['EGCL','����'],
				 ['FRFT','����ͥ����'],
				 ['FRFTBUY','����ͥ��������'],
				 ['OA','����'],
				 ['CBCL','��Ʊ'],
				 ['IR','������'],
				 ['SG','�������'],
				 ['IMLC','���ڿ�֤ҵ��'],
				 ['EXAD','����֪ͨҵ��'],
				 ['JSHORG','�ֹ����ۻ�']
                 ];
                 var checkTypeData=[
                 	['-1', '����'],
                 	['0', 'YFXȱʧ����'],
                 	['1', 'NDSȱʧ����'],
                 	['2', '������Ϣ��һ��'],
                 	['3', '������Ϣһ��']
                 ];
                 var checkStateData=[
                 	['-1', '����'],
                 	['0','δ����'],
                 	['1','�Ѻ���'],
                 	['2', 'ϵͳ���Զ�����']
                 ];
                 var tranModeData=[
                 ['-1','����'],
                 ['0','���۽���'],
                 ['1','ѯ�۽���']
                 ];
                 var eventFlagData=[
                 ['-1','����'],
                 ['0','����ѯ��'],
                 ['3', '���г�ʱ'],
                 ['1','���б���'],
                 ['4','������Ӧ'],
                 ['6','���з���'],
                 ['7','���г�ʱ']
                 ];
                  var isCheckFlagData=[
                 ['-1','����'],
                 ['0','δ����'],
                 ['1','�Ѹ���']
                 ];
                 
                  
                  var  tradeTypeData= [
                  ['-1', '����'],
                  ['0', '���ڽ���'],
                  ['1', '���ڽ��׳���'],
                  ['2', 'Զ�ڽ���'],
                  ['3', 'Զ�ڽ��׳���'],
                  ['4', '���ڽ���'],
                  ['5', '���ڽ��׳���'],
                  ['6', '���ڽ���'],
                  ['7', '���ڽ��׳���'],
                  ['30', '�ѽ���ڳ���']
                  ];
                  
                  var  sourceTypeData= [
                  ['-1', '����'],
                  ['0', '��'],
                  ['2', 'Զ�ڽ���'],
                  ['4', '���ڽ���'],
                  ['6', '���ڽ���']
                  ];
                  
                 var cashFLowItemIdData=[  /* �������� -1 ���� 6-ͬҵ��� 8-�ʽ���� */
               	  ['-1', '����'],
                  ['0', '���ڽ���'],
                  ['2', 'Զ�ڽ���'],
                  ['6', '���ڽ���'],
                  ['4', '���ڽ���']
                  ];
                  
                 var spotFwdTradeTypeData=[ 
                  ['-1', '����'],
                  ['0', '���ڽ���'],
                  ['2', 'Զ�ڽ���'],
                  ['6', '���ڽ���'],
                  ['4', '���ڽ���(Զ��)']
                  ];
                  
                 var possTransTypeData=[
                 	['0','����'],
                 	['1','Զ��']
                 ];
                 var effectiveTypeData=[
                                        ['-1','����'],
                                        ['3','δ��Ч'],
                                        ['1','��Ч'],
                                        ['2','����']
                                         ];
                 var ctpyData=[
                    ['-1', '����'],
                    ['FXSPOT', 'FXSPOT'],
                    ['FXFORWARD', 'FXFORWARD'],
                    ['FXSWAP', 'FXSWAP']
                 ];
                 var kondorSendStateData=[
                 	['-1', '����'],
                 	['1', '�ļ�����ʧ��'],
                 	['2', 'FTP�ϴ�ʧ��'],
                 	['3', 'KONDOR���ͳɹ�']
                 ];
                 var custTradeQueryItemData=[
                    ['-1', '����'],
                 	['0','����'],
                 	['5','�ڲ�'],
                    ['20','��Ȩ��Ȩ'],
                    ['40','����T+N����']
                 ];
                 var inCheckStateData=[
                    ['-1','ȫ��'],
                    ['0','δ����'],
              	    ['1','���˾ܾ� '],
              	    ['2','���븴��'],
              	    ['3','����ͨ��']
                 ];
                 var flatTradeQueryItemData=[
                 	['-1', '����'],
                 	['3','ƽ��'],
                 	['5','�ڲ�'],
                 	 ['6','�ڲ�չ�ڽ���'],
                 	 ['7','�ڲ�ƽ�̽���'],
                 	 ['30','�ѽ����������ƽ��']
                 ];
                 var custTradeQueryItemData=[
                     ['-1', '����'],
                     ['0','����'],
                     ['3','����'],
                     ['5','�ڲ�'],
                     ['50','�ܷ�']
                  ];
                 var sendStateData=[
                     ['-1', '����'],
                     ['0','δ����'],
                     ['1','������'],
                     ['2','������'],
                     ['3','����ʧ��'],
                     ['4','���ܽ��Ϊ�㣬��������']
                 ];
                 var custFxTradeQueryItemData=[
                     ['-1', '����'],
                     ['0','����'],
                     ['5','�ڲ�'],
                     ['20','��Ȩ��Ȩ'],
                     ['40','����T+N����']
                  ];
                 var deptDirectionData=[
                    ['-1','ȫ��'],
                 	['0','���'],
                 	['1','�ۻ�']
                 ];
                 
                 var  branchProfitTypeData= [
                  ['-1', '����'],
                  ['0', '���ڽ���'],
                  ['2', 'Զ�ڽ���'],
                  ['4', '���ڽ���']
                  ];
                  
                  var  isStateData= [
                  ['-1', '����'],
                  ['0', '������'],
                  ['1', '��ƽ��']
                  ];
                  
                  var rmbTenDayMonthTradeTypeData = [
                  ['0','����'],
                  ['2','Զ��']  
                  ];
                  var rmbTenDayMonthDirectionData = [
                  ['-1','����'],
                  ['1','���'],
                  ['2','�ۻ�']
                  ];
                  var rmbTenDayMonthReportTypeData = [
                  ['-1','����'],
                  ['1','�±�'],
                  ['2','��Ѯ��'],
                  ['3','��Ѯ��'],
                  ['4','��Ѯ��']
                  ];
                /////ACC 
                 var accTranTypeData=[
                	 ['-1', '����'],
                	 ['5','����'],
                	 ['4','����']
                	 ];
                 
                 var accTranTranCodeData = [
                	 ['-1','����'],
                	 ['0-1','�������'],
                	 ['1-1','����������'],
                	 ['0-3','���ڽ��ۻ�'],
                	 ['1-3','���ڽ��ۻ����'],
                	 ['2-1','Զ�����'],
                	 ['3-1','Զ��������'],
                	 ['2-3','Զ�ڽ��ۻ�'],
                	 ['3-3','Զ�ڽ��ۻ����'],
                	 ['4-1','�������'],
                	 ['5-1','����������'],
                	 ['4-3','���ڽ��ۻ�'],
                	 ['5-3','���ڽ��ۻ����'],
                	 ['6-1','�������'],
                	 ['7-1','����������'],
                	 ['6-3','���ڽ��ۻ�'],
                	 ['7-3','���ڽ��ۻ����']
                	 ];
                 
                 var accTranStatusData = [
                	 ['-1','����'],
                	 ['0','δ����'],
                	 ['1','����ɹ�'],
                	 ['2','����ʧ��'],
                	 ['3','������']
                	 ];
                 var accTranAgentTypeData =  [
	                                     	 ['-1','����'],
	                                     	 ['11','���ͽ���'],
	                                     	 ['13','���ο���'],
	                                     	 ['21','�ڲ�����'],
	                                     	 ['53','�ڲ�����'],
	                                     	 ['50','����ƽ��'],
	                                     	 ['51','�ڲ�����ƽ��'],
	                                     	 ['60','�Զ�������ƽ']
	                                     	 ];
                var accTranTableTypeData =  [
	                                     	 ['-1','����'],
	                                     	 ['0','���ڽ���'],
	                                     	 ['2','Զ�ڽ���'],
	                                     	 ['4','���ڽ���'],
	                                     	 ['5','���ͽ���'],
	                                     	 ['6','��ֵ����'],
	                                     	 ['7','ͷ���ع�']
	                                     	];
                 var accProductTypeData = [
                	 ['-1', '����'],
                	 ['10','��������'],
                	 ['30','���ڽ��ۻ�']
                	 ];
                 var accTranTypeData = [
                	 ['-1', '����'],
                	 ['1','��ͨ����']
                	 ];
                 var accDateTypeData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','������'],
                	 ['2','������'],
                	 ['3','������']
                	 ];
                 var accTremTypeData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','T+0'],
                	 ['2','T+1/2'],
                	 ['3','Զ��']
                	 ];
                 var accDeliveryTypeData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','��������'],
                	 ['2','��������'],
                	 ['3','ƽ�ֽ���'],
                	 ['4','ΥԼ����'],
                	 ['5','��ǰ����'],
                	 ['6','չ�ڽ���']
                	 ];
                 var accIncomeTypeData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','����'],
                	 ['2','����']
                	 ];
                 var accSettlementSaleData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','���'],
                	 ['2','�ۻ�']
                	 ];
                 var accTypeFLData = [
                	 ['-1', '����'],
                	 ['0','Ĭ��'],
                	 ['1','�ڲ���'],
                	 ['2','�ڲ�+�ͻ���'],
                	 ['3','�ͻ���'],
                	 ['4','�ڲ���']
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
		       							Ext.MessageBox.alert('��ʾ', '��ѯ���ڲ���Ϊ��ǰϵͳ����');
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
                else if(p[2]=='kParamSelectT'){ 	// ���ڽ���¼�뷽����
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
   	             emptyText:'��ѡ��',
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
   	             else if(p[2]=='execStateSelectT'){ 	// ������״̬����
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
   	             emptyText:'��ѡ��',
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
   	              else if(p[2]=='kgrRCParamSelectT'){ 	//KGR���Ҷ�����
               	  var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true

   	             });
   	             }
   	              else if(p[2]=='kgrTTParamSelectT'){ 	//KGR������������
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
   	             emptyText:'��ѡ��',
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
   	             else if(p[2]=='kgrSTTParamSelectT'){ 	//KGR���⽻����������
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
   	             emptyText:'��ѡ��',
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
   	             else if(p[2]=='specialTradeParamSelectT'){ 	//���⽻�ײ�ѯ�����˵�
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
   	             emptyText:'��ѡ��',
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
                else if(p[2]=='spotTradeStatusselectT'){ 	// ���ڽ���¼�뷽����
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
	             emptyText:'��ѡ��',
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
                else if(p[2]=='execModelSelectT'){ 	// ���ڽ���¼�뷽����
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
                		emptyText:'��ѡ��',
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
                else if(p[2]=='execStateSelectT'){ 	// ���ڽ���¼�뷽����
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
                		emptyText:'��ѡ��',
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
	              else if(p[2]=='accTranTypeDataT'){ 	// ����ģ�������ײ�ѯҳ�潻��״̬    
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
	             emptyText:'��ѡ��',
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
                 else if(p[2]=='accTranTranCodeDataT'){ 	// ����ģ�������ײ�ѯҳ�潻������    
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
	             emptyText:'��ѡ��',
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
                
                else if(p[2]=='accTranStatusDataT'){ 	// ����ģ�������ײ�ѯҳ�潻������    
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
	             emptyText:'��ѡ��',
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
   	             emptyText:'��ѡ��',
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
   	             emptyText:'��ѡ��',
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
              else if(p[2]=='flatTradeItemIdData'){// ƽ�̽������ͽ�������
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
	             emptyText:'��ѡ��',
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
              else if(p[2]=='branchGcItemT'){// ������������ͽ�������
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
  	             emptyText:'��ѡ��',
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
              else if(p[2]=='isSummarySelectT'){// ������������ͽ�������
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
	             emptyText:'��ѡ��',
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
              	if(title.indexOf('����')!=-1){
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
	             emptyText:'��ѡ��',
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
              
              else if(p[2]=='inputSystemSelectT'){// ¼��ϵͳ�����˵�
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
            		  emptyText:'��ѡ��',
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
            		  emptyText:'��ѡ��',
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
  	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
              else if(p[2]=='gcTradeTypeT'){ 	//branchGc������������
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
   	             emptyText:'��ѡ��',
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
            		   emptyText:'��ѡ��',
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
                   	displayField:'bussinessType',// ��ʾ���Ҷ���������
                   	valueField:'id', // ��ֵ ���Ҷ�
                   	emptyText:'��ѡ��',
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
                else if(p[2]=='bankComUnionT'){		// bankComT,������������ģ����ѯ,���м����
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
		              displayField:'idName',// ��ʾ���Ҷ���������
		              valueField:'bankId', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
				else if(p[2]=='bankComIn') {		// bankComT,������������ģ����ѯ,�ڲ�����
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
		              displayField:'idName',// ��ʾ���Ҷ���������
		              valueField:'bankId', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
		              emptyText:'��ѡ��',
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
                else if(p[2]=='bankComInSubBank') {		// bankComInSubBank,������������ģ����ѯ ��ǰ�����У�������ǰ�У�
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
		              displayField:'idName',// ��ʾ���Ҷ���������
		              valueField:'bankId', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
				else if(p[2]=='bankComInM') {		// bankComT,������������ģ����ѯ,�ڲ�����
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
		              displayField:'idName',// ��ʾ���Ҷ���������
		              valueField:'bankId', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
				else if(p[2]=='bankComInM1') {		// bankComT,������������ģ����ѯ,�ڲ�����
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
		              displayField:'idName',// ��ʾ���Ҷ���������
		              valueField:'bankId', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
				else if(p[2]=='bankComInMA') {		// bankComT,������������ģ����ѯ,�ڲ�����
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
						displayField:'idName',// ��ʾ���Ҷ���������
						valueField:'bankId', // ��ֵ ���Ҷ�
						hiddenName:p[0],
						emptyText:'��ѡ��',
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
		              displayField:'engName',// ��ʾ���Ҷ���������
		              valueField:'cyCode', // ��ֵ ���Ҷ�
	                  hiddenName:p[0],
		              emptyText:'��ѡ��',
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
                
               else if(p[2]=='AllRateCodeselectT'){ 				// ���л��Ҷ�����
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }
	              
               else if(p[2]=='AllCnyRateCodeselectT'){ 				// ���н��ۻ���Ҷ�����
																	// (�������������Щ)
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAllCnyAppl'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	           }else if(p[2]=='channelTypeSelectT'){
	        	   var store = new Ext.data.SimpleStore({
	          		fields: ['channelType','channelTypeStr'],
	          		data : channelTypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'channelTypeStr',��// ��ʾֵ
		              valueField: 'channelType',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'��ѡ��ͻ�����',
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
	           }else if(p[2]=='clientTypeSelect'){  // �ͻ���������
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['type','typeStr'],
	          		data : clientTypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'typeStr',��// ��ʾֵ
		              valueField: 'type',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'��ѡ��ͻ�����',
				      selectOnFocus:true,
				      resizable:true,
				      value:'0'
		              });
                }else if(p[2]=='channeltypeSelect'){  // �ͻ���������
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['type','typeStr'],
	          		data : tradeDataStore.channeltypeData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'typeStr',��// ��ʾֵ
		              valueField: 'type',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'��ѡ��ͻ�����',
				      selectOnFocus:true,
				      resizable:true,
				      value:'-1'
		              });
                }else if(p[2]=='forCustSelect'){  // �ͻ���������
                	var store = new Ext.data.SimpleStore({
                		fields: ['forCusType','forCusTypeStr'],
                		data : forCustTypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'forCusTypeStr',��// ��ʾֵ
                		valueField: 'forCusType',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'��ѡ��ͻ�����',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
	           else if(p[2]=='clientRfqClientSelect'){  // �ͻ���������
	          		var store = new Ext.data.SimpleStore({
	          		fields: ['rfqClient','rfqClientStr'],
	          		data : rfqClientData
	          		});
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'rfqClientStr',��// ��ʾֵ
		              valueField: 'rfqClient',
		              hiddenName:p[0],
		              typeAhead: true,
		              mode: 'local',
				      triggerAction: 'all',
				      width:100,
				      listWidth:100,
				      // emptyText:'��ѡ��ͻ�����',
				      selectOnFocus:true,
				      resizable:true,
				      value:'-1'
		              });
	             }
                else if(p[2]=='ratePrevTranstypeSelectT'){  // �ͻ���������
                	var store = new Ext.data.SimpleStore({
                		fields: ['transtype','transtypeStr'],
                		data : transtypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'transtypeStr',��// ��ʾֵ
                		valueField: 'transtype',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'��ѡ��ͻ�����',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
                else if(p[2]=='effectiveSelectT'){  // �ͻ���������
                	var store = new Ext.data.SimpleStore({
                		fields: ['isEffective','isEffectiveStr'],
                		data : effectiveTypeData
                	});
                	tttt = new Ext.form.ComboBox({
                		name:p[0],
                		store: store,
                		displayField:'isEffectiveStr',��// ��ʾֵ
                		valueField: 'isEffective',
                		hiddenName:p[0],
                		typeAhead: true,
                		mode: 'local',
                		triggerAction: 'all',
                		width:100,
                		listWidth:100,
                		// emptyText:'��ѡ��ͻ�����',
                		selectOnFocus:true,
                		resizable:true,
                		value:'-1'
                	});
                }
	           else if(p[2]=='AllCurrencyChsNameT'){ 				// ���л���������������
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryCurrencyList.action'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','cyCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ������������
	              valueField:'cyCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });
	             
	             
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }                         
                
               else if(p[2]=='rateCodeselectT'){ 				// ���л��Ҷ�����,���׻�
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=-1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }    
	          
	           else if(p[2]=='rateCyUsdselectT'){ 				// ���ۻ㣬ֱ��
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byPosCyRate&sqlParam.appl=-1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }
              
	           else if(p[2]=='userDeptSelectT'){ // ���Ŷ�����
		              var store = new Ext.data.Store({
			          proxy: new Ext.data.HttpProxy({url: '/base/queryAjaxDeptList.action'}),
				        reader: new Ext.data.JsonReader({
				        	   totalProperty: 'total',
				        	   root: 'data'
				           },['deptName','deptId'])    
				      }); 
		              store.load({params:{start:0}});// ������������
		              tttt = new Ext.form.ComboBox({
		              name:p[0],
		              store: store,
		              displayField:'deptName',// ������ʾ��������
		              valueField:'deptId', // ���Ŵ�ֵ 
		              hiddenName:p[0],
		              emptyText:'��ѡ��',
		              // value:'0000',
		              // editable:false,//���ݲ��ɱ༭
		              typeAhead: true,
		              mode: 'local',
		              width:120,
		              triggerAction: 'all',
		              selectOnFocus:true,
				      resizable:true
		             });	
		             
		               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
		               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
		          }  
              
              else if(p[2]=='forginRateCodeselectT'){ // ��ҶԻ��Ҷ�����
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=1'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])    
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:120,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }    
	              
	          else if(p[2]=='cnyRateCodeselectT'){ // ���ۻ���Ҷ�����
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byAppl&sqlParam.appl=3'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])    
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:120,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	              }
	              else if(p[2]=='counttypeselectT'){ 			// �ͻ��Ż�����
            	 var store = new Ext.data.SimpleStore({
                 fields: ['counttypesec', 'counttypeStr'],
                 data : countTypeData 						// �������������
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'counttypeStr',
	             valueField:'counttypesec',     // ����ֵ
	             hiddenName:p[0],
	             emptyText:'��ѡ��',
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
                 data : igxzData // �������������
                  });
	             tttt = new Ext.form.ComboBox({
	             name:p[0],
	             store: store,
	             displayField:'igxzStr',// ��������
	             valueField:'igxz',     // ����ֵ
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
              else if(p[2]=='ratePosSelectT'){ 				// ���л��Ҷ�����,���׻�
	              var store = new Ext.data.Store({
		          proxy: new Ext.data.HttpProxy({url: '/base/queryRateList.action?querytype=byPosRate'}),
			        reader: new Ext.data.JsonReader({
			        	   totalProperty: 'total',
			        	   root: 'data'
			           },['engName','rateCode'])
			      }); 
	              store.load({params:{start:0}});// ��������
	              tttt = new Ext.form.ComboBox({
	              name:p[0],
	              store: store,
	              displayField:'engName',// ��ʾ���Ҷ���������
	              valueField:'rateCode', // ��ֵ ���Ҷ�
	              hiddenName:p[0],
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:100,
	              listWidth:100,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             
	               rateCodeCombo=tttt;// ��ֵȫ�ֱ���
	               tttt.on("beforequery", eforexGrid.beforeQueryRateCodeFunc, tttt);
	          }
            else if(p[2]=='bankSelectT'){ // ��������
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
	              emptyText:'��ѡ��',
	              // value:'0000',
	              // editable:false,//���ݲ��ɱ༭
	              typeAhead: true,
	              mode: 'local',
	              width:150,
	              triggerAction: 'all',
	              selectOnFocus:true,
			      resizable:true
	             });	
	             rateCodeCombo=tttt;// ��ֵȫ�ֱ���
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
					if(title.indexOf('����')!=-1){
						tradeTypeDataTemp.push(tradeTypeData[1]);
						tradeTypeDataTemp.push(tradeTypeData[2]);
						tradeTypeDataTemp.push(tradeTypeData[9]);
					}else if(title.indexOf('Զ��')!=-1){
						tradeTypeDataTemp.push(tradeTypeData[3]);
						tradeTypeDataTemp.push(tradeTypeData[4]);
						tradeTypeDataTemp.push(tradeTypeData[7]);
						tradeTypeDataTemp.push(tradeTypeData[8]);
					}else if(title.indexOf('����')!=-1){
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
						emptyText : '��ѡ��',
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
//					if(title.indexOf('����')!=-1){
//						tradeTypeDataTemp.push(sourceTypeData[1]);
//						tradeTypeDataTemp.push(sourceTypeData[2]);
//					}else if(title.indexOf('Զ��')!=-1){
//						tradeTypeDataTemp.push(sourceTypeData[3]);
//						tradeTypeDataTemp.push(sourceTypeData[4]);
//						tradeTypeDataTemp.push(sourceTypeData[7]);
//						tradeTypeDataTemp.push(sourceTypeData[6]);
//					}else if(title.indexOf('����')!=-1){
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
						emptyText : '��ѡ��',
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
				else if(p[2]=='accTranSelectT'){ // ������Ϣ�ղ�Ʒ��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applCurrencyNothTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
						emptyText : '��ѡ��',
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
	           
	            else if(p[2]=='applTypeselectT'){ // ���Ҳ�Ʒ��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	            else if(p[2]=='tradeDireT'){ // ���׷�������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDireData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	            else if(p[2]=='tradeDireTNoAll'){ // ���׷�������
	            	var tradeDireDataTemp = new Array();
						tradeDireDataTemp.push(tradeDireData[1]);
						tradeDireDataTemp.push(tradeDireData[2]);
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDireDataTemp // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	            else if(p[2]=='tradeBSDireT'){ // ����B/S��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : tradeDataStore.tradeBSDireData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	            else if(p[2]=='branchProfitApplTypeselectT'){ // ���Ҳ�Ʒ��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
				                                                ['-1', '����']
				                                                 ],[]);
		            	 }else if(value == '1'){
		            		 branchProfitIsBuyStore.loadData([
				                                                ['-1', '����']
				                                                 ],[]);
		            	 }else if(value == '3'){
		            		 branchProfitIsBuyStore.loadData([
		  	                                                ['-1', '����'],
			                                                ['1', '���'],
			                                                ['2', '����']
			                                                 ],[]);
		            	 }
		             });
	              }
	            else if(p[2]=='branchProfitClientTypeSelectT'){ // ����
	            	var store = new Ext.data.SimpleStore({
	            		fields: ['type', 'typeStr'],
	            		data : bracnhProfitClientTypeData // �������������
	            	});
	            	tttt = new Ext.form.ComboBox({
	            		name:p[0],
	            		store: store,
	            		displayField:'typeStr',// ��������
	            		valueField:'type',     // ����ֵ
	            		hiddenName:p[0],
	            		emptyText:'��ѡ��',
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
	            else if(p[2]=='branchProfitIsBuySelectT'){ // ����
	            	var store = new Ext.data.SimpleStore({
	            		fields: ['type', 'typeStr'],
	            		data : branchProfitIsBuyData // �������������
	            	});
	            	branchProfitIsBuyStore = store;
	            	tttt = new Ext.form.ComboBox({
	            		name:p[0],
	            		store: store,
	            		displayField:'typeStr',// ��������
	            		valueField:'type',     // ����ֵ
	            		hiddenName:p[0],
	            		emptyText:'��ѡ��',
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
	              else if(p[2]=='sysParamTypeselectT'){ // ������������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : sysParamTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	           else if(p[2]=='applCurrencyTypeselectT'){ // ������Ϣ�ղ�Ʒ��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
		       else if(p[2]=='applCurrencyNothTypeselectT'){ // ������Ϣ�ղ�Ʒ��������
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['type', 'typeStr'],
	                 data : applCurrencyNothTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
		         else if(p[2]=='itemIdselectT'){ // ����
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : itemIdData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// ��������
		             valueField:'itemId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
		         else if(p[2]=='otherItemIdselectT'){ // ͬҵ����
	            	 var store = new Ext.data.SimpleStore({
	                 fields: ['itemId', 'itemIdStr'],
	                 data : otherItemIdData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// ��������
		             valueField:'itemId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	                 data : spotFwdTradeTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeIdStr',// ��������
		             valueField:'typeId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	                 data : branchProfitTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeStr',// ��������
		             valueField:'type',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	                 data : possTransTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'typeIdStr',// ��������
		             valueField:'typeId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
		                 data : ctpyData // �������������
		                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'ctpyStr',// ��������
		             valueField:'ctpy',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
		                 data : deptDirectionData // �������������
		                  });
			             tttt = new Ext.form.ComboBox({
			             name:p[0],
			             store: store,
			             displayField:'directionStr',// ��������
			             valueField:'direction',     // ����ֵ
			             hiddenName:p[0],
			             emptyText:'��ѡ��',
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
	                 data : isStateData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'isStateStr',// ��������
		             valueField:'isState',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	                 data : rmbTenDayMonthTradeTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'tradeTypeStr',// ��������
		             valueField:'tradeType',     // ����ֵ
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
	                 data : rmbTenDayMonthReportTypeData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'reportTypeStr',// ��������
		             valueField:'reportType',     // ����ֵ
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
	                 data : tradeDataStore.hasSubAllData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'hasSubAllDataStr',// ��������
		             valueField:'hasSubAllData',     // ����ֵ
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
	                 data : tradeDataStore.matchFlagData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'matchFlagDataStr',// ��������
		             valueField:'matchFlagData',     // ����ֵ
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
	                 data : rmbTenDayMonthDirectionData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'directionStr',// ��������
		             valueField:'direction',     // ����ֵ
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
	                 data : cashFLowItemIdData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// ��������
		             valueField:'itemId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
                 else if(p[2]=='actStateSelectT'){ 	 //����״̬������  
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
	             emptyText:'��ѡ��',
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
	             else if(p[2]=='deliveryStateAllSelectT'){ 	 //����״̬������  
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
			             emptyText:'��ѡ��',
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
                 else if(p[2]=='deliveryStateSelectT'){ 	 //����״̬������  
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
	             emptyText:'��ѡ��',
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
	             else if(p[2]=='accTypeSelectT'){ 	 //����״̬������  
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
	             emptyText:'��ѡ��',
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
                 else if(p[2]=='tranTypeSelectT'){ 	 //��������������  
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
	             emptyText:'��ѡ��',
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
                  ["0","��������"],["1","������"]];
	            	 var store = new Ext.data.SimpleStore({
		                 fields: ['type', 'typeStr'],
		                 data : custType // �������������
		                  });
			             tttt = new Ext.form.ComboBox({
			             name:p[0],
			             store: store,
			             displayField:'typeStr',// ��������
			             valueField:'type',     // ����ֵ
			             hiddenName:p[0],
			             emptyText:'��ѡ��',
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
	                 data : cashFLowItemIdData // �������������
	                  });
		             tttt = new Ext.form.ComboBox({
		             name:p[0],
		             store: store,
		             displayField:'itemIdStr',// ��������
		             valueField:'itemId',     // ����ֵ
		             hiddenName:p[0],
		             emptyText:'��ѡ��',
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
            	tbar.addText(p[1]);// ����ı�
            	tbar.addField(tttt);
 // if(i%5==0){
 // }
            }
           }, 
         getQueryInfo : function(){         // ������ѯ��ť
              var param =eforexGrid.queryParam();         // ����ʵ���в�����this�����õ�ǰ����this==window����
           if(param['sqlParam.startDate'] &&  param['sqlParam.endDate']){
           		if(param['sqlParam.endDate']<param['sqlParam.startDate']){
           			Ext.MessageBox.alert("��ʾ","�������ڲ���С�ڿ�ʼ����");
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
	         		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ��ѯ�ļ�¼��');
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
	         		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ��ѯ�ļ�¼��');
		         }
           },
           /////acc
            resetInfo : function(){         // ������ѯ��ť
             var abc=document.getElementsByName("plItems");
        	var plstr='';
        	for(var i=0;i<abc.length;i++){
        		if(!abc[i].checked)
        		continue;
        		plstr=abc[i].value+';'+plstr;
        	} 
        	if(plstr.trim()==''){
        		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ����״̬�ļ�¼��');
        		return;
        	}
    		Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫ�޸���Щ��¼��',function(btn){
 				if (btn == 'yes') {
					var params = eforexGrid.createParam();
					var form = Ext.get('gridMenu').dom;
					var delDiv = Ext.get('delDiv').dom;
					delDiv.innerHTML = '';
					Ext.MessageBox.wait('�����޸���...', '���Ժ�...');
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
           accountCheckInfo : function(){         // ���˰�ť
        	    var param =eforexGrid.queryParam(); 
    			Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫ������',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('������...', '���Ժ�...');
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
           accountCheckInfoAgain : function(){         // ���¶��˰�ť    
    		Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫ���¶�����',function(btn){
 				if (btn == 'yes') {
					Ext.MessageBox.wait('������...', '���Ժ�...');
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
	         		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ���г����Ľ��׼�¼��');
		         }
           },
           ////acc
           queryXlsParam : function(){    // ��ѯ������ϲ���
         	 var xlsParams = {start:0, limit:LIMIT};   
 	         if(Ext.get("queryDiv")){// ��ѯ����Div�㣬�������е���������
 			     var a= Ext.get("queryDiv").dom.innerHTML;	 	
                  var arr=a.split(';');
                  for(var i=0;i<arr.length;i++){   
             	     var obj= arr[i];          // ȡ������Ԫ��
                      var p=obj.split("=");     // �ָ��ַ���
                     

             		if(Ext.get(p[0]).dom.getAttribute('type')=='hidden'){
             			var displayVal = Ext.get(p[0]).getNextSibling().value;
                         if(displayVal=='��ѡ��'){
                         	Ext.get(p[0]).dom.value = '';// ���ÿ�ֵ
                         }
             		    if(displayVal.trim().length == 0){
            		         Ext.get(p[0]).dom.value = '';// ���ÿ�ֵ
            		        }
             		};   
             		xlsParams[p[0]] = Ext.get(p[0]).getValue();// �����ж�
                  }      
 			}	
 			 return xlsParams;
 		},
           
         queryParam : function(){    // ��ѯ������ϲ���
        	  qParams = {start:0, limit:LIMIT};   
	         if(Ext.get("queryDiv")){// ��ѯ����Div�㣬�������е���������
			     var a= Ext.get("queryDiv").dom.innerHTML;	 	
                 var arr=a.split(';');
                 for(var i=0;i<arr.length;i++){   
            	     var obj= arr[i];          // ȡ������Ԫ��
                     var p=obj.split("=");     // �ָ��ַ���

            		if(Ext.get(p[0]).dom.getAttribute('type')=='hidden'){
            			var displayVal = Ext.get(p[0]).getNextSibling().value;
                        if(displayVal=='��ѡ��'){
                        	Ext.get(p[0]).dom.value = '';// ���ÿ�ֵ
                        }
            		    if(displayVal.trim().length == 0){
           		         Ext.get(p[0]).dom.value = '';// ���ÿ�ֵ
           		        }
            		};   
            	    qParams[p[0]] = Ext.get(p[0]).getValue();// �����ж�
                 }      
			}	
			
			 return qParams;
		},     
        
		PagingToolbarOnClick : function(which){// �����ҳ ��һҳ��ǰһҳ���ȹ���
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
        printGirdInfo:function(){// ���ݲ�Grid��ӡ���,��ӡ��ҳ����
           var tabHead=document.title;// ȡjspҳ��TITLEֵ
           // grid.getDataSource().load({params:{start: 0, limit: 500}});
           var tabTitle=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-header",true);
           var tabBody=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-body",true);
           
           var elements = gridTitle.dom.elements;
		   var properties = new Array();
		   var tiles=new Array();// ��Ϊ��ͷ������
		   var jIndex=0;
		   for(var i=0; i<elements.length; i++){
			   	if(elements[i].getAttribute('hidden') != null){
			     continue;// ���Բ�ֱ����ʾ��������
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
	            
			    tabHead ="��ɫ��Ȩ����";
			    tabTitle = ['��ɫ���','��ɫ����','Ȩ�޴���','Ȩ������','��Ʒ����'];
			    properties =['roleid','rolename','permit','name','appname'];
				
				printDataStore.load({params:param,
				  callback:function(){
				    var jsonDatas = printDataStore.reader.jsonData['data'];
				    exportRightsExcelJsonData(tabHead,tabTitle,jsonDatas,properties);
				  }
				});
         	}else{
         		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�����Ľ�ɫ');
         	}
        },
        
        printAllGirdBackInfo:function(){// ���ݲ�Grid��ӡ���,��ӡ��ҳ����
        	var param =eforexGrid.queryXlsParam(); // �����Ʋ�ѯ�������ݲ�ִ�д�ӡ��excel��ȥ
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
  			  failure : function(o) { Ext.MessageBox.alert('��Ϣ', '����ʧ��!');}
  			});*/
//        	window.location.href = exlURL ;
        },
        printAllGirdInfo:function(){// ���ݲ�Grid��ӡ���,��ӡ��ҳ����
            var param =eforexGrid.queryParam(); // �����Ʋ�ѯ�������ݲ�ִ�д�ӡ��excel��ȥ
            param['limit']=grid.getDataSource().getTotalCount();
            param['byNeg']='true';
             
            var tabHead=document.title;// ȡjspҳ��TITLEֱֵ����Ϊ���excel��sheet���Ƽ���һ�еı���
           // grid.getDataSource().load({params:{start: 0, limit: 500}});
            var tabTitle=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-header",true);
            var tabBody=Ext.get('topic-grid').child("div.x-grid-viewport .x-grid-body",true);
           // exportGridExcelData(tabHead,tabTitle.firstChild,tabBody.firstChild);

        	var elements = gridTitle.dom.elements;
			var properties = new Array();
			var tiles=new Array();// ��Ϊ��ͷ������
			var jIndex=0;
			for(var i=0; i<elements.length; i++){
			   if(elements[i].getAttribute('hidden') != null){
			     continue;// ���Բ�ֱ����ʾ��������
			   }
			   properties[jIndex]=elements[i].getAttribute('id');
			   tiles[jIndex]=elements[i].getAttribute('colTitle');
			   jIndex+=1;
			}
			printDataStore.load({params:param,
			  callback:function(){
			    var jsonDatas = printDataStore.reader.jsonData['data'];// Ϊ�ε�һ�ξ�����ִ�е��ˡ�����undefined.
			    exportGridExcelJsonData(tabHead,tabTitle.firstChild,jsonDatas,tiles.length,properties);
			  }
			});
        },
        
        updateInfo : function(){
			// var amountflag=eforexGrid.checkTradePositionAmount2();
			// if(!amountflag){
			// return;
			// }
			
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
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
			Ext.MessageBox.alert('��ʾ',"ΥԼ���ܴ��ڿɲ������!!!");
			return;
		}
		var amountflag=eforexGrid.checkDLFunc("breachTrade.instrument"); //Kgrѡ��
         	if(!amountflag){
         		return;
         	}
        var amountflag=eforexGrid.checkDLFunc("breachTrade.marginCode"); //��֤�����
         	if(!amountflag){
         		return;
         	}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					if(!valiBreachTradeElement()){
						return;
					}
					if(isFource == 1){//ǿ��ΥԼ
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
            //���ó���������Ȩҳ����Ϣ��
        	var itemid = Ext.get('trade.itemId').dom.value;
        	var appl = Ext.get('trade.appId').dom.value;
        	var subAction = '';
        	//alert(itemid + ' == ' + appl);
        	if((itemid == 0 || itemid == 40)&& appl == 3){//���ۻ�
        		subAction = '?subAction=DELERASERMB'
        	}else if((itemid == 0 || itemid == 40)&& appl == 1){//������
        		subAction = '?subAction=DELERASEFX'
        	}else if(itemid == 5 && appl == 3){//�ڲ����ۻ����
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
      	   //���ó���������Ȩҳ����Ϣ��
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
	        	if(itemid == 0 && appl == 3){//���ۻ�
	        		subAction = '?subAction=ERASERMB'
	        	}else if(itemid == 0 && appl == 1){//������
	        		subAction = '?subAction=ERASEFX'
	        	}else if(itemid == 5 && appl == 3){//�ڲ����ۻ����
	        		subAction = '?subAction=ERASERMBDEPT'
	        	}else if(itemid == 5 && appl == 1){//�ڲ����
	        		subAction = '?subAction=ERASEFXDEPT'
	        	}else if(itemid == 40 && appl == 3){//���ۻ�T+N
	        		subAction = '?subAction=ERASERMBTN'
	        	}else if(itemid == 40 && appl == 1){//���T+N
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
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('rmbDeptPropertiesBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        doDeptErase : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('deptEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doErase : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('eraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDeptDeliveryedErase : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('deptDelveryedEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDeliveryedErase : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('delveryedEraseBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doResendIs : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('resendIsBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doReverseIs : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('reverseIsBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doGapTrade : function(){
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
				checkPageSubmit("update");
			}
			else{
				if(document.getElementById("operStr")){
					eforexGrid.getOperStr();
				}
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('doGapBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
					infoDlg.hide();
			}
        },
        
        doDuration : function(){
        	if(Ext.get('isHolidayFlag').dom.value=='true'){
			Ext.Msg.alert("��ʾ","չ��Զ����Ϣ�ղ���Ϊ�ڼ��գ�!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
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
			Ext.Msg.alert("��ʾ","Զ��չ����Ϣ�ղ���Ϊ�ڼ��գ�!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
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
			Ext.Msg.alert("��ʾ","��ǰ������Ϣ�ղ���Ϊ�ڼ��գ�!");
			return;
			}
        	if(document.getElementById("inputErrorNum")){// �Ƿ���ҪУ����ʾ�Դ�����Ϣ
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
					Ext.Msg.alert('��ʾ', "������1����Ϊ0������������");
					return ;
				}
				
				if(Ext.get('custDelivery.operAmount2').dom.value == 0){
					Ext.Msg.alert('��ʾ', "������2����Ϊ0������������");
					return ;
				}**/
				if(tranType!=3&&tranType!=12&&tranType!=15){//ΥԼ�����ж�account
				if(Ext.get('custDelivery.account1')){
	        		if(Ext.get('custDelivery.account1').dom.value == null || Ext.get('custDelivery.account1').dom.value.trim()==''){
		        		Ext.Msg.alert("����","�ͻ��ʺŲ���Ϊ��,����������!");
		        		return false;
	        		}
        		}
	        	if(Ext.get('custDelivery.account2')){
	        		if(Ext.get('custDelivery.account2').dom.value == null ||Ext.get('custDelivery.account2').dom.value.trim()==''){
		        		Ext.Msg.alert("����","�ͻ��ʺŲ���Ϊ��,����������!");
		        		return false;
	        		}
	        	}
	        	}
	        	if(Ext.get('custDelivery.gcAccount')){
	        		if(Ext.get('custDelivery.gcAccount').dom.value == null ||Ext.get('custDelivery.gcAccount').dom.value.trim()==''){
		        		Ext.Msg.alert("����","�����ʺŲ���Ϊ��,����������!");
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
				dialogWa.setContentSize(350,contentWa.getEl().dom.scrollHeight);// ������Ȩ������ʾ��С
		    };
                if(!dialogWa){// ��Ȩ����
                  this.initAuthSystem();
                }
			    var layoutWa = dialogWa.getLayout();
	    	    layoutWa.beginUpdate();
			    layoutWa.add('center',contentWa);
	            var update = contentWa.getUpdateManager(); // ������������
				update.update({
					   url:'/base/Auth.jsp',
				       params:{},
				       callback:tradeLoadCb,// �ص�����
				       nocache:true,
					   scope:this		
				});     // �ύ��̨ˢ������
				layoutWa.endUpdate();
				dialogWa.show();   // �Ի�����ʾ
				// dialogWa.moveTo(dialogWa.xy[0],Ext.lib.Dom.getViewHeight()-dialogWa.getEl().getHeight());//��ʱ��������
				dialogWa.moveTo(650,200);// ��ʱ��������
        },
        
        delPlInfo:function(){// ����ɾ������
        	var abc=document.getElementsByName("plItems");
        	var plstr='';
        	for(var i=0;i<abc.length;i++){
        		if(!abc[i].checked)
        		continue;
        		plstr=abc[i].value+';'+plstr;
        	} 
        	if(plstr.trim()==''){
        		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫɾ���ļ�¼��');
        		return;
        	}
        	
    		Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫɾ��������¼��',function(btn){
 				if (btn == 'yes') {
					var params = eforexGrid.createParam();
					var form = Ext.get('gridMenu').dom;
					var delDiv = Ext.get('delDiv').dom;
					delDiv.innerHTML = '';
					Ext.MessageBox.wait('����ɾ����...', '���Ժ�...');
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
	 			Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫɾ��������¼��',function(btn){
	 				if(btn == 'yes'){
	 					var params = eforexGrid.createParam();
	 					var form = Ext.get('gridMenu').dom;
	 					var delDiv = Ext.get('delDiv').dom;
	 					delDiv.innerHTML = '';
	 					Ext.MessageBox.wait('����ɾ����...','���Ժ�...');
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
	         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫɾ���ļ�¼��');
	         }
        },
        resendInfo : function(){
        	if(selectModel.hasSelection()){
        		Ext.MessageBox.confirm('��ʾ','��ȷ��Ҫ����������¼��',function(btn){
        			if(btn == 'yes'){
        				var params = eforexGrid.createParam();
    					Ext.Ajax.request({
    		  			  	method: 'POST',
    		  			  	url: Ext.get('resendBtn').dom.getAttribute('action')+'?'+params,
    		  			  	success: function(o){
    			    					var data = o.responseText;
    			    					if(data.indexOf('ERROR')!= -1){
    			    					     Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));			    			
    			    					}else{
    			    						eforexGrid.refresh();
    			    					}
        					}, 
    		  				failure: eforexGrid.commentFailure
    		  			});
        			}
        		}); 			
        	}else{
        		Ext.MessageBox.alert('��ʾ','��ѡ��Ҫ�����ļ�¼��');
        	}
        },
        rebatchInfo : function(){
        	Ext.MessageBox.confirm('��ʾ','��ȷ������δ����ļ�¼��',function(btn){
    			if(btn == 'yes'){
    				Ext.Ajax.request({
		  			  	method:'POST',
		  			  	url: Ext.get('rebatchBtn').dom.getAttribute('action'),
		  			  	success: function(o){
			    					var data = o.responseText;
			    					if(data == 'success'){
			    						eforexGrid.refresh();
			    					}else if(data.indexOf('ERROR')!= -1){
			    					     Ext.MessageBox.alert('����',data.substring(data.indexOf('ERROR')+5));			    			
			    					}else if(data.indexOf('TipOk')!= -1){
				    					 Ext.MessageBox.alert('��ʾ',data.substring(data.indexOf('TipOk')+5));
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
	 			Ext.MessageBox.confirm('��ʾ','ɾ���ͻ��ἶ��ɾ����ص��Ż���Ϣ���Ƿ������',function(btn){
	 				if(btn == 'yes'){
	 					var params = eforexGrid.createParam();
	 					var form = Ext.get('gridMenu').dom;
	 					var delDiv = Ext.get('delDiv').dom;
	 					delDiv.innerHTML = '';
	 					Ext.MessageBox.wait('����ɾ����...','���Ժ�...');
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
	         	Ext.MessageBox.alert('��ʾ','��ѡ��Ҫɾ���ļ�¼��');
	         }
       },
        doAllAction : function(){
			var subAction = Ext.get("subAction").getValue(); 
	        	if(subAction.indexOf('insert') != -1){
	        		if(!eforexGrid.validRelationParams()){
	        			Ext.MessageBox.alert('��ʾ','�����ֶβ���ȣ�����������.');
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
				Ext.MessageBox.alert('������֤δͨ��','�밴��ҳ���ϵ���ʾ��ȷ���롣');	
				return;
			}
			else{
				var formEl = content.getEl().child("form").dom;
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('insertBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure}); 
			}
		}, 
		showCheckMSG2 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				Ext.MessageBox.alert('������֤δͨ��','�밴��ҳ���ϵ���ʾ��ȷ���롣');	
				return;
			}
			else{
				if(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc')!=null){
        		 var flag= eval(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	                if(!flag){
	                 	return;
	                 }
	            }
				if(Ext.get('authDiv')!=undefined){// ��Ҫ��֤��Ȩ
				   eforexGrid.doAuthCheck();
				}else{
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
				}
			}
		}, 
		showCheckMSG4 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				document.getElementById('divid').style.display = "block";
				Ext.MessageBox.alert('������֤δͨ��','�밴��ҳ���ϵ���ʾ��ȷ���롣');	
				return;
			}
			else{
				document.getElementById("divid").style.display = "none";
				if(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc')!=null){
        		 var flag= eval(Ext.get('updateBtn').dom.getAttribute('doCheckUpdateFunc'));// ˫�������Ҫ���⴦��ġ�ִ�д˲�����������
	                if(!flag){
	                 	return;
	                 }
	            }
				if(Ext.get('authDiv')!=undefined){// ��Ҫ��֤��Ȩ
				   eforexGrid.doAuthCheck();
				}else{
					var formEl = content.getEl().child("form").dom;	
					Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
					Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
		                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
				}
			}
		}, 
		
		showCheckMSG3 : function(){
       	Ext.MessageBox.hide();
			if(document.getElementById("inputErrorNum").value!="0"){
				Ext.MessageBox.alert('������֤δͨ��','�밴��ҳ���ϵ���ʾ��ȷ���롣');	
				return;
			}
			else{
				var formEl = content.getEl().child("form").dom;	
				Ext.MessageBox.wait('���ݱ�����...','���Ժ�...');
				Ext.lib.Ajax.formRequest(formEl, Ext.get('updateBtn').dom.getAttribute('action'),
	                    {success: eforexGrid.commentSuccess, failure: eforexGrid.commentFailure});
			}
		}, 
		
	  getRadioBoxValue:function(myboxname){// ��ѡ��ѡ��ֵ����
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
		
	   getCheckBoxValue:function(mychkboxname){// ��ѡ��ѡ����ʾֵ����
	     	var retselection="";
			var mychkboxlist=document.getElementsByName(mychkboxname);
			 for(var i=0;i<mychkboxlist.length;i++)
			 {
			    if(mychkboxlist[i].checked)
			    {
			       if(retselection.length==0)
			         retselection = mychkboxlist[i].getAttribute('title');
			       else
			         retselection = retselection + ";" + mychkboxlist[i].getAttribute('title');// �˴����ܳ���
			    }
			 }
			 return retselection;
	   },
		
	   getDescibleCheckBoxValue:function(ele,describ){// ֱ�Ӷ� Ԫ�ؽ��б��߶���ҳ���ϲ�׽
	   	 return describ+":"+ eforexGrid.getCheckBoxValue(ele);
	   },
	   
	   
	    getOperStr : function(){// ���д���
			var rows = document.getElementById("workTable").rows;
			var operStr = "";
			
			for(var i = 0;i < rows.length;i++){// ò�Ʋ�δ��ȫ������
				if(rows[i].style.display!="none" &&rows[i].cells.length==4&&rows[i].cells[3].innerHTML.indexOf("*")!="-1"){
					var fText=rows[i].cells[0].innerHTML;// ֱ��ȡ���������˵��
					var nodes=rows[i].cells[2].childNodes;// TD������ڼ����ڵ�
					var fValue='';
					if(nodes.length==1){
						var fid=rows[i].cells[2].firstChild['name'];// ע��һ�п��ܲ�ֹһ��IDȡֵ
						if(fid==null ||fid.trim().length==0){
						  continue;
						}
					}else {
						for(var j=0;j<nodes.length;j=j+2){// CheckBox
															// ����ʧ��,��ͨ�ı�����ʧ��
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
						fValue=rows[i].cells[2].firstChild.value;// ��һ���������
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
		    if(Ext.get('workTable2')){// �����⣬��Ա������ ��ɫ��ѡ����
			  operStr = operStr + eforexGrid.getDescibleCheckBoxValue('user.roleIdArr',"��ɫ");// ��Ա�����ɫ��ѡ����
			}
			 document.getElementById("operStr").value = operStr;// Ҫ����ɾ����õ�";"��operStr.substring(0,operStr.length-1)
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
								var isChecked = "δѡ��";
								var checkBoxStrBegin = rows[i].cells[2].innerHTML.indexOf(">");
								if(rows[i].cells[2].firstChild.checked){
									isChecked = "ѡ��";
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
			     alert("������ϵͳ������ˮ��");
			     return;
			}
			if(!/^[0-9]*[1-9][0-9]*$/.test(serialNo) ) {
				// ������֤
				alert('�����ʽ����ȷ,����������');
				return;
			}
			var params = 'trade.serialNo='+Number(serialNo)+'&trade.type='+Number(type);
		    var url='/forex/getBranchErrorTradeInfo.do';
		    var tradeCB=function(e,b,o){
		    	infoDlg.setContentSize(580,content.getEl().dom.scrollHeight);
		        Ext.get('rollbakeover').dom.style.display="block";
		        var data = o.responseText;
		    };
		    Ext.get('rollbakeover').load({				// �ص�ִ�з������ݵ�ҳ�����
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
		    Ext.get('rollbakeover').load({				// �ص�ִ�з������ݵ�ҳ�����
				   url:url,
			       params:params,
			       callback:tradeCB
			});
		},		

		queryBranchCountExtFunc : function(){
			var branchcountid = Ext.get('client.branchcountid').dom.value;
			if(branchcountid == 0) {
				Ext.MessageBox.alert('��ʾ','��ѡ�����жԷ��е����');
				return;
			}
        	var url='/base/getBranchClientCountExtInfo.do';
        	clientCountExtpopFullWindow(url+"?countExt.branchcountid="+ branchcountid + "&countExt.counttype=1");
		},
		
		queryCountExtFunc : function(){
			var countid = Ext.get('client.custcountid').dom.value;
			if(countid == 0) {
				Ext.MessageBox.alert('��ʾ','��ѡ����жԿͻ������');
				return;
			}
        	var url='/base/getClientCountExtInfo.action';
        	clientCountExtpopFullWindow(url+"?clientContext.custcountid="+ countid + "&clientContext.counttype=0");
		},
		
		 /**ǰ̨ͳһ���㷽��,ajax��ȡҳ�����н���Ԫ�ؼ���ֵ
		 * @author wangdaowei
		 * */
        calcDeliveryInfo:function(){
        	btn.disable();// �����ύ��ť
        	if(Ext.get('custDelivery.operAmount1').dom.value == null || Ext.get('custDelivery.operAmount1').dom.value == 0){
        		Ext.Msg.alert("����","���뽻��������,����������!");
        		return false;
        	}
        	if(Ext.get('custDelivery.operAmount2').dom.value == null || Ext.get('custDelivery.operAmount2').dom.value == 0){
        		Ext.Msg.alert("����","���뽻��������,����������!");
        		return false;
        	}
        	var params = eforexGrid.setDeliveryParam();
        	Ext.Ajax.request({
			 url : '/query/calcDeliveryInfo.action',params : params,
			 callback:function(opts,success,response){ 
				if(success){//�ص�����
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
         		Ext.Msg.alert("��ʾ","�ͻ����׽����������ȷ�Ŀͻ��˺�!");
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
        * ����btn
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
        /**��֤���
		 * @author liangwj
		 * */
	    resetCheckInputAmount : function(amountEdit){
        	if(amountEdit.value==''){
        		return ;
        	}
        	var amount = 0.0;
        	if(String(amountEdit.value).indexOf(",")==-1 ){
	            if(/^(0|([1-9]\d*))(\.\d+)?[k|K|M|m]$/.test(amountEdit.value)){//����ĩλkK?mM��λֵ //֧��1k=1000��1m=1000000
			  		var amountStr=amountEdit.value;
			  		var amountW=amountStr.substring(0,amountStr.length-1);//��Ч����
			  		var n=0;
			  		if(amountStr.substring(amountStr.length-1).toLowerCase()=='k'){//��Ч��λK,k
			  			n=3;
			  		}else if(amountStr.substring(amountStr.length-1).toLowerCase()=='m'){//��Ч��λM,m
			  			n=6;
			  		}
			  		amount=parseFloat(amountW)*Math.pow(10,n);//��Ч����*��Ч��λ��
			  	}else if(/^(0|([1-9]\d*))(\.\d+)?$/.test(amountEdit.value)){//����Ч�������
			  		amount=parseFloat(amountEdit.value);//��Ч����
			  	}else{
			  		amountEdit.value='0';
			  		Ext.Msg.alert("����","����������,����������!");
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