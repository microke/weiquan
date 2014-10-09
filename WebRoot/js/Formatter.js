 /* ��ѡ�����ʽ��������dataΪ��ֵ��ʽ��ά����,valueΪ�����ֵ */
var formatDataName = function(data,value){
	for(var i = 0; i < data.length; i++){
    		if(data[i][0] == value)
    		return(data[i][1]);
    	}
}
var Formatter = function(){
  return {
  	/* ���⽻�����͸�ʽ�� */
    formatDealType : function(value) {
    	var data =tradeDataStore.dealTypeData; 
    	return formatDataName(data,value);
    },	
  	/* ��ֵ�������͸�ʽ�� */
    formatAllSpecialType : function(value) {
    	var data =tradeDataStore.specialTypeAllData; 
    	return formatDataName(data,value);
    },	
  	/* ��Զ�˸�ʽ�� */
    formatFarDelivery : function(value) {
    	var data =tradeDataStore.isFarDeliveryData; 
    	return formatDataName(data,value);
    },	
  	/* ���ۻ����͸�ʽ�� */
   formatAppId: function(value) {
    	var data =tradeDataStore.appIdData; 
    	return formatDataName(data,value);
    },
  	/* Զ�������͸�ʽ�� */
   formatFwdSwap: function(value) {
    	var data =tradeDataStore.tradeTypeFwdSwapData; 
    	return formatDataName(data,value);
    },
  	/* ���ۻ����͸�ʽ�� */
   formatSpecialType: function(value) {
    	var data =tradeDataStore.specialTypeData; 
    	if(formatDataName(data,value)){
    		return formatDataName(data,value);
    	}else{
    		return '��ͨ����';
    	}
    	
    },
  	/* �Ƿ�����¼�������ʽ�� */
   formatHasSub: function(value) {
    	if(value == 1){
    		return '��';
    	}else{
    		return '��';
    	}
    	
    },
  	/* ���ۻ����͸�ʽ�� */
   formatKitemId: function(value) {
    	var data =tradeDataStore.itemIdAllData; 
    	if(formatDataName(data,value)){
    		return formatDataName(data,value);
    	}else{
    		return '';
    	}
    	
    },
    /* ���ʸ�ʽ�� */
    formatRate : function(value) {
    	if(String(value).indexOf(".") ==-1) {
	   		return (value + ".0000").substring(0,10);
    	}
    	if(String(value).substring(0, String(value).indexOf(".") ==1)) {
	   		return (value + "0000").substring(0,6);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==2)) {
	   		return (value + "0000").substring(0,7);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==3)) {
	   		return (value + "0000").substring(0,8);
    	}
    	if(String(value).substring(0, String(value).indexOf(".") ==4)) {
	   		return (value + "0000").substring(0,9);
    	}
    },
    formatQueryPageRate : function(value) {
    	if(String(value).indexOf(".") ==-1) {
	   		return (value + ".0000").substring(0,10);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==1)) {
	   		return (value + "0000").substring(0,8);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==2)) {
	   		return (value + "0000").substring(0,9);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==3)) {
	   		return (value + "0000").substring(0,10);
    	}
    	if(String(value).substring(0, String(value).indexOf(".") ==4)) {
	   		return (value + "0000").substring(0,11);
    	}
    },
    formatRp : function(value) {
    	if(String(value).indexOf(".") ==-1) {
	   		return (value + ".00").substring(0,10);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==1)) {
	   		return (value + "0").substring(0,6);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==2)) {
	   		return (value + "0").substring(0,7);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==3)) {
	   		return (value + "0").substring(0,8);
    	}
    	if(String(value).substring(0, String(value).indexOf(".") ==4)) {
	   		return (value + "0").substring(0,9);
    	}
    },
    formatFwdRate : function(value) {
    	if(String(value).indexOf(".") ==-1) {
	   		return (value + ".000000").substring(0,12);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==1)) {
	   		return (value + "000000").substring(0,8);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==2)) {
	   		return (value + "000000").substring(0,9);
    	} 
    	if(String(value).substring(0, String(value).indexOf(".") ==3)) {
	   		return (value + "000000").substring(0,10);
    	}
    	if(String(value).substring(0, String(value).indexOf(".") ==4)) {
	   		return (value + "000000").substring(0,11);
    	}
    },
    formatDealMtmRate : function(value) {
    	if(value==0){
    		return "";
    	}else if(value == '��ӯ��' || value == '�ܿ���' || value == 'ӯ����ֵ'){
    		return value;
    	}else{
    		return Formatter.formatFwdRate(value);
    	}
    },
    formatPercent : function(val){			   	      	      	                       	                        
	   return Formatter.formatPrec(val*Math.pow(10,2),2) + "%";                      
	},
	formatFun : function(prec,split){
            return function(v){
                return Formatter.formatAmt(v,prec,split);  
            };
    }, 
	formatPrec : function(v,prec,split){
		 prec = (prec == undefined || typeof prec != "number" || prec<0) ? 2 : prec;
		 v = parseFloat(v);
		 var whole,sub;
		 if(prec != 0){    
             v = (Math.round(v*Math.pow(10,prec)+0.00000005))/Math.pow(10,prec);
             var zeroFill = String(Math.pow(10,prec)).substring(1);   
             v = (v == Math.floor(v)) ? v + "." + zeroFill : v;
             v = String(v);
             var ps = v.split('.');
             whole = ps[0];        
             sub = ps[1] ? '.'+ (ps[1].length == prec?ps[1]:ps[1]+String(Math.pow(10,prec-ps[1].length)).substring(1)) : '.'+zeroFill;
		 }else{
		     whole = String(Math.round(v));
		     sub = '';
		 }    
         if(split && split == true){
             var r = /(\d+)(\d{3})/;
             while (r.test(whole)) {
                 whole = whole.replace(r, '$1' + ',' + '$2');
             }
         }
         return whole + sub;
    },
    
    formatNeg:function(v){
    	var s=parseFloat(v);
    	return s*(-1);
    },
    formatAmtPoints : function(v){
    	    var point = v+"";
			if(point.indexOf(".") >= 0){
				return v;
			}else{
				return point+".0";
			}
	},
    formatMAmt : function(v, prec) {
    	return Formatter.formatPrec(String(Formatter.formatNeg(v)),prec,true);
    },
    formatAmtTo : function(v) {
    	if(typeof(MasterContext)!='undefined'){
    		var s = MasterContext.formatNumberAmt(v,v);
    	}else{
    		var s = BranchContext.formatNumberAmt(v,v);
    	}
   		Ext.get(v).dom.value = this.formatAmt(s);
    },
    
    formatAmt : function(v, prec) {
    	return Formatter.formatPrec(v,prec,true);
    },
    formatAmtNull : function(v, prec) {
    	if(v == null|| v == 0||v == ""){
    		return "";
    	} else{
    		return Formatter.formatAmt(v,prec);
    	}
    },
    
    formatSwapAmount : function(val) {
    	return Formatter.formatAmt(String( Formatter.formatNeg(val) ),2);
    },

    formatPrice : function(val) {
    	Formatter.formatAmt(String( Formatter.formatNeg(val) ),4);
    },
    
    formatRatePrice : function(val) {
    	return Formatter.formatAmt(String(val) ,4);
    },
    
    formatLogNull : function(str) { 
    	if(str.indexOf('{null}')!=-1){
    		return str.replace(/\{null}/g,"");
    	} else {
    		return str;
    	}
    },
    
    dateByExt : function(date){
		if(String(date).trim().length!=8)
			return "0-00-00";				
		return Date.parseDate(String(date), 'Ymd').dateFormat('Y-m-d');
	},
    formatDate : function(value) {
    value = String(value);
    if(value.length<8)
        return "0-00-00";
	return value.substring(0,4) + "-" 
		+ value.substring(4,6) + "-" 
		+ value.substring(6,8);	
    },
    formatDateNull : function(value) {
    value = String(value);
    if(value.length<8)
        return "";
	return value.substring(0,4) + "-" 
		+ value.substring(4,6) + "-" 
		+ value.substring(6,8);	
    },
    
    formatDate2Value:function(value){//���ڸ�ʽ���� ת��Ϊ ��������yyyy-mm-dd���ͳ���10
    value = String(value);
			var result;
			if(value.length==8){//yyyymmdd ���ڸ�ʽ����
				return Number(value);
			}
			else if (value.length < 10)
			result = "00000000";
			result = value.substring(0, 4) + value.substring(5, 7)
					+ value.substring(8, 10);
			return Number(result);
    },
    
    formatTime : function(value) {
    value = String(value);
    if(value.length < 5){
        return "00:00:00";
    }
	if( value.length == 5) {
	    value = "0" + value;
	}
	return value.substring(0,2) + ":" 
		    + value.substring(2,4) + ":" 
		    + value.substring(4,6);	
    },
    toDate : function(value) {
	var retstr = "";
	var data = value.split('/'); 
	for(var i = 0; i < data.length; i ++ ) {
	    retstr += data[i];
	}
	return retstr;
    },
    toNumber : function(value) {	//ȥ���Ÿ�ʽ��
		var retstr = "";
		var data = value.split(','); 
		for(var i = 0; i < data.length; i ++ ) {
		    retstr += data[i];
		}
		return retstr;
    },
    
    formatAmtRateNum : function(num, avail) {// ֱ�Ӹ�ʽ�����ݣ� ��ѧ������
		return Formatter.formatAmt(Math.round(parseFloat(num)
						* (Math.pow(10, avail)))
						/ (Math.pow(10, avail)), avail);
	},
	
	
	/**
	* ��֤����ˮ
	* @author mzb
	*/
	validatePoint : function(val,name){
		if(Ext.get(val)){
			var farcustpoints = Ext.get(val).dom.value;
			if(farcustpoints == null || farcustpoints == ""){
		    	Ext.Msg.alert('��ʾ','�����'+name+'����Ϊ��');
		        return false;
		    }else if(!/^[-\+]?\d+(\.\d+)?$/.test(farcustpoints)){
		       	Ext.Msg.alert('��ʾ','�����'+name+'��ʽ����,����������');
		       	$(val).value='';
		       	return false;
		    }else {
		       	return true;
		    }
	    } 
	    return true;
	},
	/**
	* ��֤����
	* @author mzb
	*/
	validateRate : function(val,name){	
		if(Ext.get(val)){
			var rate = Ext.get(val).dom.value;
			if(rate == null || rate == ""||rate == 0){
		        Ext.Msg.alert('��ʾ','�����'+name+'����Ϊ�ջ�0');
		        return false;
		    }else if(!/^(0|([1-9]\d*))(\.\d+)?$/.test(rate)){
		        Ext.Msg.alert('��ʾ','�����'+name+'��ʽ����,����������');
		        $(val).value='';
		        return false;
		     }else {
		        return true;
		     }
	     }
			return true;
	},
	
    /**��ʽ��ȷ��ҳ����
     * amountXTD��ʾ����ȷ��ҳ��Ľ���ʽ��
     * eventAmountXTD��ʾ�����¼�ȷ��ҳ��Ľ���ʽ��
     * ��ô�ֵ�ԭ��:���2��ҳ���TD������ͬ,ID����,
     * 			��ʹȷ��ҳ��ر�,Ԫ����Ȼ����ҳ����,����������
     * @author wangdaowei
     * */
	resetConfirmAmount : function(){
		
		if(Ext.get('account1typeTD')){
			var data =tradeDataStore.accountTypeData; 
    		data = formatDataName(data,Ext.get('account1type').dom.value);
    		eval('account1typeTD').innerText =data;
		}
		
		if(Ext.get('account2typeTD')){
			var data =tradeDataStore.accountTypeData; 
    		data = formatDataName(data,Ext.get('account2type').dom.value);
    		eval('account2typeTD').innerText =data;
		}
		if(Ext.get('nearAccount1typeTD')){
			var data =tradeDataStore.accountTypeData; 
    		data = formatDataName(data,Ext.get('nearAccount1type').dom.value);
    		eval('nearAccount1typeTD').innerText =data;
		}
		
		if(Ext.get('nearAccount2typeTD')){
			var data =tradeDataStore.accountTypeData; 
    		data = formatDataName(data,Ext.get('nearAccount2type').dom.value);
    		eval('nearAccount2typeTD').innerText =data;
		}
		
		var amount = 0.0;
		if(Ext.get('amount1TD')){
			amount = Math.abs(Ext.get('amount1').dom.value);
			eval('amount1TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount2TD')){
			amount = Math.abs(Ext.get('amount2').dom.value);
			eval('amount2TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount3TD')){
			amount = Math.abs(Ext.get('amount3').dom.value);
			eval('amount3TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount4TD')){
			amount = Math.abs(Ext.get('amount4').dom.value);
			eval('amount4TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount5TD')){
			amount = Math.abs(Ext.get('amount5').dom.value);
			eval('amount5TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount6TD')){
			amount = Math.abs(Ext.get('amount6').dom.value);
			eval('amount6TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount7TD')){
			amount = Math.abs(Ext.get('amount7').dom.value);
			eval('amount7TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('amount8TD')){
			amount = Math.abs(Ext.get('amount8').dom.value);
			eval('amount8TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount1TD')){
			amount = Math.abs(Ext.get('amount1').dom.value);
			eval('eventAmount1TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount2TD')){
			amount = Math.abs(Ext.get('amount2').dom.value);
			eval('eventAmount2TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount3TD')){
			amount = Math.abs(Ext.get('amount3').dom.value);
			eval('eventAmount3TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount4TD')){
			amount = Math.abs(Ext.get('amount4').dom.value);
			eval('eventAmount4TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount5TD')){
			amount = Math.abs(Ext.get('amount5').dom.value);
			eval('eventAmount5TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount6TD')){
			amount = Math.abs(Ext.get('amount6').dom.value);
			eval('eventAmount6TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount7TD')){
			amount = Math.abs(Ext.get('amount7').dom.value);
			eval('eventAmount7TD').innerText = this.formatAmtRateNum(amount, 2);
		}
		if(Ext.get('eventAmount8TD')){
			amount = Math.abs(Ext.get('amount8').dom.value);
			eval('eventAmount8TD').innerText = this.formatAmtRateNum(amount, 2);
		}
	}
   };
}();



