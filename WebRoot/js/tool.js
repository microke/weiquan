var Tool = function(){
	return {
		//----------------------------基础实现 -------------------------------------------------------//
		/**
		 * 价格换算
		 * @param oldObj
		 * 	eg : {
		 * 		spotRate  : 基准汇率
		 * 		spotAva   ：基准小数有效位数
		 * 		points	  : 升贴水
		 * 		rpAva 	  ：升贴水小数有效位数
		 * 		forwardRate: 远期汇率
		 * 	    fowardAva : 远期小数有效位数
		 * 		target    :	2 -- 计算points, 3---计算forwardRate
		 * EG : 	
		 * arg.spotRate = parseFloat($('earlyDeliTrade.spotRate').value);
			arg.spotAva = parseFloat($('earlyDeliTrade.rateAva').value);
			arg.forwardRate = parseFloat($('earlyDeliTrade.nearRate').value);
			arg.forwardAva = parseFloat($('earlyDeliTrade.forwardAva').value);
			arg.points = parseFloat($('earlyDeliTrade.nearCustLongPoints').value);
			arg.rpAva = parseInt($('earlyDeliTrade.rpAva').value);
		 * 	}
		 * @returns
		 */
		changePrice:function(arg){
			var target = arg.target;
			var spotRate  = arg.spotRate;
			var spotAva = arg.spotAva
			var points = arg.points;
			var rpAva  = arg.rpAva;
			var tempSubPrice = 0;
			var forwardRate = arg.forwardRate;
			var forwardAva = arg.forwardAva;
			switch(target){
				case 2: 
					forwardRate = parseFloat(Formatter.formatPrec(forwardRate,forwardAva));
					spotRate = parseFloat(spotRate);
					
					tempSubPrice = forwardRate - spotRate;
					points = Formatter.formatPrec(parseFloat(tempSubPrice)*(Math.pow(10, spotAva)), rpAva );
					break;
				case 3: 
					points =Formatter.formatPrec(points,rpAva); 
					tempSubPrice = parseFloat(points) * (Math.pow(10,-1*spotAva));
					spotRate = parseFloat(spotRate);
					forwardRate = Formatter.formatPrec(spotRate + tempSubPrice,forwardAva);
					break;
			}
			arg.target = target;
			arg.spotRate = spotRate;
			arg.points = points;
			arg.forwardRate = forwardRate;
		},
		calcSwapFwdToFwdPoint: function(arg, callFuc){
			var buy = arg.buy;
			var calAmount = arg.calAmount;
			var valueDate = arg.valueDate;
			var maturityDate = arg.maturityDate;
			var rateCode = arg.rateCode;
			Ext.Ajax.request({
				url : '/forex/calcSwapFwdToFwdPoint.action',
				params : {
					buy : buy,
					calAmount : calAmount,
					valueDate : valueDate, 
					maturityDate :	maturityDate,
					rateCode : rateCode
				},
				callback:function(opts,success,response){
					var str = response.responseText;
					if(str.indexOf('ERROR')!= -1){
						 if(Ext.get('btnEnalbe')){
						 	Ext.get('btnEnalbe').dom.value='false';
						 	eforexGrid.checkBtnEnableState();
						 }
					     Ext.MessageBox.alert('错误',str.substring(str.indexOf('ERROR')+5));
					}else{
					 	if(Ext.get('btnEnalbe')){
						 	Ext.get('btnEnalbe').dom.value='true';
						 	eforexGrid.checkBtnEnableState();
						 }
						var temp = Ext.decode(response.responseText);
						callFuc(temp);
					}
					
				}
				});
			
		},
		/**
		 * 初始下拉框
		 */
		initComBoxTag : function(tagId, tagProArg,handlerArg , store, isApply){
			
			tagProArg = Tool.argCheck(tagProArg, {});
			var tempProArg ={
					 hiddenName:tagId,
					 name: tagId,
		          	  id:	  tagId
		              }; 
			Tool.extend(true, tempProArg, tagProArg);
			var arg = {
					tagId : tagId,
					store : store,
		          	tagProArg: tempProArg,
		          	handlerArg: handlerArg,
		          	isApply: isApply
			};
			return Tool.initComboBox(arg);
		},
		
		/**
		 * 初始化普通文本框
		 */
		initTextTag:function(tagId, tagProArg,handlerArg, isApply){
			tagProArg = Tool.argCheck(tagProArg, {});
			var tempProArg ={
					  name: tagId,
		          	  id:	  tagId
		              }; 
			Tool.extend(true, tempProArg, tagProArg);
			var arg = {
					tagId : tagId,
		          	tagProArg: tempProArg,
		          	handlerArg: handlerArg,
		          	isApply: isApply
			};
			return Tool.initTextField(arg);
		},
		
		//-------------------------------------公共
		getRadioChecked : function(tagName){
			var tags = document.getElementsByName(tagName);
			if(tags != null){
		        var i;
		        for(i=0;i<tags.length;i++){
		            if(tags[i].checked){
		                return tags[i].value;            
		            }
		        }
		    }
		    return null;
		},
		
		/**
		 * 对象合并
		 * @param override 是否覆盖原有值  如果未TRUE 附加对象和主对象都存在， 将被附加对象覆盖 
		 * @param o 主对象
		 * @param n 附加对象
		 * @returns
		 * 	无
		 */
		extend:function(override, o,n){
			   for(var p in n)if(n.hasOwnProperty(p) && (override || !o.hasOwnProperty(p) ))o[p]=n[p];
		},
		/**
		 * 空值处理 
		 * @param arg	需要处理的值
		 * @param defualtValue 为空情况下默认值
		 * @returns
		 * 		处理完成的结果
		 */
		argCheck:function(arg, defualtValue){
			if(  arg == undefined  || arg == null){
				arg = defualtValue;
			}
			return arg;
		},
		/**
		 *  EXT组件事件注册
		 * @param controls	组件
		 * @param handlerArg	事件集合
		 * 				EG:  [{eventName:'select', eventHandler : function(){alert(1);}}]
		 * @returns
		 * 	无
		 */
		eventRegistered : function(controls, handlerArg){
			handlerArg = Tool.argCheck(handlerArg, []);
			for(var i=0;  i<handlerArg.length; i++){
				controls.on( handlerArg[i].eventName,  handlerArg[i].eventHandler);
			}
		},
		/**
		 * 初始化文本框
		 * @param arg.tagId
		 * @param arg.tagProArg  --- params.properties
		 * @param arg.handlerArg	事件集合
		 * @param arg.isApply			true 使用applyTo渲染  false使用render渲染  如果不填默认使用true;
		 * 		EG:
		 * 		{
		 * 			tagId:	'tagId',
		 * 			tagProArg: {
		 * 				name : 'client.name',
		 * 				id:'client.name'
		 * 			},
		 * 			handlerArg:{
		 * 				[{eventName:'OnFocus', eventHandler : function(){alert(1);}}],
		 * 			},
		 * 			isApply : true
		 * 		}
		 * @returns
		 */
		initTextField : function(arg){
			var isApply = Tool.argCheck(arg.isApply, true);
			var tagId = arg.tagId;
			var tagProArg = Tool.argCheck(arg.tagProArg, {});
			var handlerArg = Tool.argCheck(arg.handlerArg, []);
			
			if(Ext.get(tagId)){
				var t = Ext.get(tagId);
				var fieldPram = {
			            width:140
			        };
				Tool.extend(true, fieldPram, tagProArg);
				var field =  new Ext.form.TextField(fieldPram);
				Tool.eventRegistered(field, handlerArg);	//注册事件
				 if(isApply){
					 field.applyTo(tagId);
	            	 
	             }else{
	            	 
	            	 field.render(tagId);
	             }
				return field;
			}else{
				return null;
			}
		},
		
		/**
		 * 初始化下拉框
		 * @param arg.tagId   		渲染对象ID
		 * @param arg.store	  		下拉框数据仓库
		 * @param arg.tagProArg		组价参数
		 * @param arg.handlerArg	事件集合
		 * @param arg.isApply			true 使用applyTo渲染  false使用render渲染  如果不填默认使用true;
		 * 	EG:  
		 * 		{
		 * 			tagId:	'tagId',
		 * 			store:  new Ext.data.SimpleStore({
		 *	          		fields: ['accountType','accountTypeStr'],
		 *	          		data : tradeDataStore.accountTypeData
	     *     		}),
	     *     		tagProArg: {
	     *     		   	id:'accountType',
	     *     			name:'accountType',
		 *             	displayField:'accountTypeStr',　// 显示值
		 *             	valueField: 'accountType',
		 *		      	value: tradeDataStore.ACC_TYPE_INTERNAL
	     *     		},
		 * 			handlerArg:	[{eventName:'select', eventHandler : function(){alert(1);}}],
		 * 			isApply : true
		 * 		}
		 * @returns
		 * 			组件对象
		 */
		initComboBox:function(arg){
			var isApply = Tool.argCheck(arg.isApply, true);
			var tagId = arg.tagId;
			var store = arg.store;
			var tagProArg = arg.tagProArg;
			var handlerArg = Tool.argCheck(arg.handlerArg, []);
			if(Ext.get(tagId)){
	            var tempProArg =  {
		              store: store,
		              emptyText:'请选择',
		              typeAhead: true,
		              mode: 'local',
		              editable :false,
		              width:140,
		              triggerAction: 'all',
//		              selectOnFocus:true,
				      resizable:true
		             };
	            Tool.extend(true, tempProArg, tagProArg);
	             var selectT = new Ext.form.ComboBox(tempProArg);
	             Tool.eventRegistered(selectT, handlerArg);
	             if(isApply){
	            	 selectT.applyTo(tagId);
	            	 
	             }else{
	            	 
	            	 selectT.render(tagId);
	             }
	             return selectT;
			}else{
				return null;
			}
			
			
		},
		/**
		 * 清除下拉框的选项
		 * @param oldObj
		 * @returns
		 */
		clearSelectOption:function(oldObj){//清除客户号
			while(oldObj.length>1){
				oldObj.options.remove(oldObj.length-1);
			}
			oldObj.disabled=true;//禁用Select
		}
	};
	
}();