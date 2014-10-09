 
var sysParamValidation = function(){
	var SystemParamValidationStore;
	return{
		init : function(){
			this.initSystemParamValidationStore();
		},
		
		//��ȡXML���ݣ���װ������
		initSystemParamValidationStore : function() {
			var xr = new Ext.data.XmlReader({
			       record: 'data'  // XML �˻`
			      },
			     // Ҫ�xȡ�ę�λ���x
			     [
			      'type',
			      'max',
			      'min',
			      'check',
			      'length'
			     ]
			      );
			  // 2. �a��һ�� XML Document 
			  var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			  
			  var xmlStr;
			  Ext.Ajax.request({  
	                url : '/validate/validation.xml',  
	                method : 'POST',  
	                sync:true,
	                success : function(response) {  
				  		xmlStr = response.responseText;
				  		xmlDoc.loadXML(xmlStr);
						SystemParamValidationStore = xr.readRecords(xmlDoc);
	                }
	            });  
		},
		
		createError:function(errorMsg){
			$("sysParamValueTD").innerHTML="<font color='red'>*</font>&nbsp;<img style='vertical-align:middle' src='../images/default/form/exclamation.gif' onmouseover='getMSG("+'"block"+","+"sysParamValueError"'+")' onMouseOut='getMSG("+'"none"+","+"sysParamValueError"'+")'/>";
			$('sysParamValueError').innerText=errorMsg;
			$("inputErrorNum").value++;
		},
		
		//��ʱҳ���ϵ��õķ���
		systemParamValidate : function() {
			$("inputErrorNum").value=0;
			var value = Ext.get('sysParam.value').dom.value;
			if(value.replace(/^\s+|\s+$/g,"")=="" ){
				sysParamValidation.createError('ֵ����Ϊ�գ�������ֵ��');
				return;
			}
			var validateSeq = Ext.get('sysParam.validateSeq').dom.value;
			var record = SystemParamValidationStore.records[validateSeq];
			var type = record.data['type'];
			var max = record.data['max'];
			var min = record.data['min'];
			var check = record.data['check'];
			var length = record.data['length'];
			if(type == 'time'){
				var maxhour = max.substring(0,2);
				var maxmin = max.substring(2,4);
				var maxsec = max.substring(4,6);
				var minhour = min.substring(0,2);
				var minmin = min.substring(2,4);
				var minsec = min.substring(4,6);
				var maxtime = Number(max);
				var mintime = Number(min);
				maxhour = Number(maxhour);
				maxmin = Number(maxmin);
				maxsec = Number(maxsec);
				minhour = Number(minhour);
				minmin = Number(minmin);
				minsec = Number(minsec);
				if(value.length != 5&& value.length != 6){
					sysParamValidation.createError('ʱ��ֵ����Ϊ5λ����6λ��ֵ��');
					return;
				}
				
				if(/^[0-9]*[1-9][0-9]*$/.test(value)==false){
					sysParamValidation.createError('������������֣�С��������');
					return;
				}
				
				if(value.length == 5){
					var valuehour = value.substring(0,1);
					var valuemin = value.substring(1,3);
					var valuesec = value.substring(3,5);
					valuehour = Number(valuehour);
					valuemin = Number(valuemin);
					valuesec = Number(valuesec);
					if(value < mintime || value > maxtime){
						sysParamValidation.createError('����ʱ�䷶Χ��');
						return;
					}else{
						if(valuehour<minhour || valuehour>maxhour){
							sysParamValidation.createError('ʱ������Χ��');
							return;
						}else{
							if(valuemin<minmin || valuemin>maxmin){
								sysParamValidation.createError('�ֳ�����Χ��');
								return;
							}else{
								if(valuesec<minsec || valuesec>maxsec){
									sysParamValidation.createError('�볬����Χ��');
									return;
								}
							}
						}
					}
				}else if(value.length == 6){
					var valuehour = value.substring(0,2);
					var valuemin = value.substring(2,4);
					var valuesec = value.substring(4,6);
					valuehour = Number(valuehour);
					valuemin = Number(valuemin);
					valuesec = Number(valuesec);
					if(value < mintime || value > maxtime){
						sysParamValidation.createError('����ʱ�䷶Χ��');
						return;
					}else{
						if(valuehour<minhour || valuehour>maxhour){
							sysParamValidation.createError('ʱ������Χ��');
							return;
						}else{
							if(valuemin<minmin || valuemin>maxmin){
								sysParamValidation.createError('�ֳ�����Χ��');
								return;
							}else{
								if(valuesec<minsec || valuesec>maxsec){
									sysParamValidation.createError('�볬����Χ��');
									return;
								}
							}
						}
					}
				}
			}else if(type == 'openClose'){
				var checks = check.split(",");
				for(var i=0;i<checks.length;i++){
					if(value==checks[i]){
						break;
					}
				}
				if(i>=checks.length){
					sysParamValidation.createError('�����ֵ���ڱ�ע��ʾ��Χ�С�');
				}
			}else if(type=='onetozero'){
				if(!/^[-\+]?\d+(\.\d+)?$/g.exec(value)){
					sysParamValidation.createError('ֵ�ĸ�ʽ����ȷ�������֡�');
				}
				if(parseFloat(value)<=parseFloat(min) || parseFloat(value)>=parseFloat(max) || value.length>length){
					sysParamValidation.createError('�����ֵ����'+min+'��'+max+'֮��򳬳�'+(length-2)+'λ��Чλ��');
				}
			}else if(type=="refresh"){
				var reg =/^[0-9]*[1-9][0-9]*$/; //������
				if(!reg.test(value)){
					sysParamValidation.createError('�����ֵ������������');
					return;
				}
				if(parseInt(value)<parseInt(min) || parseInt(value) >parseInt(max)){
					sysParamValidation.createError('�����ֵ����'+min+'��'+max+'֮�䡣');
				} 
			}else if(type=="positiveint"){
				var reg =/^[0-9]*[1-9][0-9]*$/; //������
				if(!reg.test(value)){ 
					Ext.Msg.alert('��ʾ','�����ֵ������������');
					Ext.get('sysParam.value').dom.value = '';
				}
			}else if(type=="zeroPositiveInt"){
				var reg =/^[0-9]*[1-9][0-9]*$/; //������
				if(value!=0 && (!reg.test(value))){ 
					Ext.Msg.alert('��ʾ','�����ֵ���������������');
					Ext.get('sysParam.value').dom.value = '';
				}
			}else if(type=="spread"){
				var reg =/^-?\d+$/; //������
				if('-' == value && value.length == 1){
					return;
				}
				if(!reg.test(value)){ 
					Ext.Msg.alert('��ʾ','�����ֵ����������');
					Ext.get('sysParam.value').dom.value = '';
				}
			}else if(type == 'ipType'){
				var reg =/^((25[0-5]|2[0-4]\d|(1\d|[1-9])?\d)\.){3}(25[0-5]|2[0-4]\d|(1\d|[1-9])?\d)$/;
				if(!reg.test(value)){ 
					sysParamValidation.createError('��������ȷ��IP��ַ��');
					return;
				}
			}
			if(type == 'systemDate'){
				var reg =/^[0-9]*[1-9][0-9]*$/; //������
				if(!reg.test(value)){ 
					Ext.Msg.alert('��ʾ','�����ֵ������������');
					Ext.get('sysParam.value').dom.value = '';
					return;
				}
				if(value.length!=length){
					sysParamValidation.createError('�����ֵ����'+length+'λֵ');
					return;
				}
				var valueyear = value.substring(0,4);
				var valuemonth = value.substring(4,6);
				var valueday = value.substring(6,8);
				if(valuemonth<=0 || valuemonth>=13){
					sysParamValidation.createError('�����ֵ�·ݲ���1~12�·ݷ�Χ');
					return;				  
				}
				if(valuemonth==1 || valuemonth==3 || valuemonth==5 || valuemonth==7 || valuemonth==8 || valuemonth==10 || valuemonth==12){
					if(valueday<=0 || valueday>=32){
						sysParamValidation.createError('�����ֵ�����·��ﲻ���ڸ���');
						return;		
					}		  
				}
				if(valuemonth==4 || valuemonth==6 || valuemonth==9 || valuemonth==11){
					if(valueday<=0 || valueday>=31){
						sysParamValidation.createError('�����ֵ�����·��ﲻ���ڸ���');
						return;		
					}		  
				}
				if(valuemonth==2){
				    if(0==valueyear%4&&((valueyear%100!=0)||(valueyear%400==0))){
						if(valueday<=0 || valueday>=30){
							sysParamValidation.createError('�����ֵ�����·��ﲻ���ڸ���');
							return;		
						}
                    }else{
                        if(valueday<=0 || valueday>=29){
							sysParamValidation.createError('�����ֵ�����·��ﲻ���ڸ���');
							return;		
						}
                    }
				}
			}
			if($("inputErrorNum").value ==0){
				$("sysParamValueTD").innerHTML="<font color='red'>*</font>";
			}
		}
	}
}();    
Ext.onReady(sysParamValidation.init, sysParamValidation, true);