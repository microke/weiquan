var Tool = function(){
	return {
		//----------------------------����ʵ�� -------------------------------------------------------//
		/**
		 * �۸���
		 * @param oldObj
		 * 	eg : {
		 * 		spotRate  : ��׼����
		 * 		spotAva   ����׼С����Чλ��
		 * 		points	  : ����ˮ
		 * 		rpAva 	  ������ˮС����Чλ��
		 * 		forwardRate: Զ�ڻ���
		 * 	    fowardAva : Զ��С����Чλ��
		 * 		target    :	2 -- ����points, 3---����forwardRate
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
					     Ext.MessageBox.alert('����',str.substring(str.indexOf('ERROR')+5));
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
		 * ��ʼ������
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
		 * ��ʼ����ͨ�ı���
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
		
		//-------------------------------------����
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
		 * ����ϲ�
		 * @param override �Ƿ񸲸�ԭ��ֵ  ���δTRUE ���Ӷ���������󶼴��ڣ� �������Ӷ��󸲸� 
		 * @param o ������
		 * @param n ���Ӷ���
		 * @returns
		 * 	��
		 */
		extend:function(override, o,n){
			   for(var p in n)if(n.hasOwnProperty(p) && (override || !o.hasOwnProperty(p) ))o[p]=n[p];
		},
		/**
		 * ��ֵ���� 
		 * @param arg	��Ҫ�����ֵ
		 * @param defualtValue Ϊ�������Ĭ��ֵ
		 * @returns
		 * 		������ɵĽ��
		 */
		argCheck:function(arg, defualtValue){
			if(  arg == undefined  || arg == null){
				arg = defualtValue;
			}
			return arg;
		},
		/**
		 *  EXT����¼�ע��
		 * @param controls	���
		 * @param handlerArg	�¼�����
		 * 				EG:  [{eventName:'select', eventHandler : function(){alert(1);}}]
		 * @returns
		 * 	��
		 */
		eventRegistered : function(controls, handlerArg){
			handlerArg = Tool.argCheck(handlerArg, []);
			for(var i=0;  i<handlerArg.length; i++){
				controls.on( handlerArg[i].eventName,  handlerArg[i].eventHandler);
			}
		},
		/**
		 * ��ʼ���ı���
		 * @param arg.tagId
		 * @param arg.tagProArg  --- params.properties
		 * @param arg.handlerArg	�¼�����
		 * @param arg.isApply			true ʹ��applyTo��Ⱦ  falseʹ��render��Ⱦ  �������Ĭ��ʹ��true;
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
				Tool.eventRegistered(field, handlerArg);	//ע���¼�
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
		 * ��ʼ��������
		 * @param arg.tagId   		��Ⱦ����ID
		 * @param arg.store	  		���������ݲֿ�
		 * @param arg.tagProArg		��۲���
		 * @param arg.handlerArg	�¼�����
		 * @param arg.isApply			true ʹ��applyTo��Ⱦ  falseʹ��render��Ⱦ  �������Ĭ��ʹ��true;
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
		 *             	displayField:'accountTypeStr',��// ��ʾֵ
		 *             	valueField: 'accountType',
		 *		      	value: tradeDataStore.ACC_TYPE_INTERNAL
	     *     		},
		 * 			handlerArg:	[{eventName:'select', eventHandler : function(){alert(1);}}],
		 * 			isApply : true
		 * 		}
		 * @returns
		 * 			�������
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
		              emptyText:'��ѡ��',
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
		 * ����������ѡ��
		 * @param oldObj
		 * @returns
		 */
		clearSelectOption:function(oldObj){//����ͻ���
			while(oldObj.length>1){
				oldObj.options.remove(oldObj.length-1);
			}
			oldObj.disabled=true;//����Select
		}
	};
	
}();