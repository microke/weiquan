//��ȡRadioѡ��ֵ
function getRadioChecked(tagName){
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
}

function checkRadio(tagName, value){
	var tags = document.getElementsByName(tagName);
	if(tags != null){
        var i;
        for(i=0;i<tags.length;i++){
            if(tags[i].value == value){
            	tags[i].checked = true;
            	return;
            }
        }
    }
}

/**
* ȥ������ո���
* trim:ȥ�����߿ո� lTrim:ȥ����ո� rTrim: ȥ���ҿո� alltrim:ȥ�����пո�
* �÷���
*     var str = "  hello ";
*     str = str.trim();
*/
String.prototype.trim = function()
{
    return this.replace(/(^[\ ]*)|([\ ]*$)/g, "");
}
String.prototype.lTrim = function()
{
    return this.replace(/(^[\\s]*)/g, "");
}
String.prototype.rTrim = function()
{
    return this.replace(/([\\s]*$)/g, "");
}
String.prototype.alltrim = function(){
	return this.replace(/\s+/g, "");
}

/*
������setTableRowCss
���ܣ����ñ�����CSS��ʽ
������
	tbl�����Ԫ��
*/
function resetTableRowCss(tbl,start){
	 for(var r=start; r<tbl.rows.length; r++)
	     tbl.rows[r].className = (r % 2 == 0)?"WhiteBack":"LightSkyBack";  
}

/*
������OpenDialog
���ܣ���ʾģ̬�Ի���
������
	src����Ҫ�򿪵�ҳ��
	width����ȣ����أ�
	height���߶ȣ����أ�
	path-ModalFrame.jsp����뵱ǰҳ���·��
���أ��Ի������
*/
function OpenDialog(src,width,height,path) {
	oldsrc="";
	while(oldsrc!=src)
	{
		oldsrc=src;
		src=src.replace("&","%26");//����������ص�
		src=src.replace("?","%3F");//����������ص�
		src=src.replace("=","%3D");//����������ص�
	}
	if (path != "")
		path = "../";
	return window.showModalDialog(path+"ModalFrame.jsp?src="+src,window,"dialogWidth:"+width+"px;dialogHeight:"+height+"px;dialogLeft:"+((screen.availWidth-width)/2)+"px;dialogTop:"+((screen.availHeight-height)/2)+"px;scroll:yes;resizable:no");
}


function popFullWindow(urlName)
{
	//window.open(urlName,"","left=0,top=0,width="+screen.availWidth+",height="+screen.availHeight+",status=yes,Toolbar=yes,menubar=yes,resizable=yes,Location=yes");
	newwin=window.open("","newwin","resizable=yes,Toolbar=no,menubar=no,Location=no");
	newwin.moveTo(0,0);
	newwin.resizeTo(screen.width,screen.height);
	newwin.location=urlName;
}

function popWindow(urlName,WWidth,WHeight)
{
	var  WLeft=Math.ceil((window.screen.width  -  WWidth) / 2   );   
	var  WTop   =   Math.ceil((window.screen.height   -   WHeight)   / 2 );   
	var  features = 'width= ' +  WWidth  +  'px,' + 'height= '+   WHeight     +   'px,'   
		+ 'left= '+WLeft + 'px, ' + 'top= '+WTop +  'px, ' 
		+ 'fullscreen=0,toolbar=0,location=0,menubar=0,resizable=0 '; 
     WinOP  = window.open("","newWin",features);
     WinOP.location=urlName;
}
function popWindownew(urlName,WWidth,WHeight)
{
	var  WLeft=Math.ceil((window.screen.width  -  WWidth) / 2   );   
	var  WTop   =   Math.ceil((window.screen.height   -   WHeight)   / 2 );   
	var  features = 'width= ' +  WWidth  +  'px,' + 'height= '+   WHeight     +   'px,'   
		+ 'left= '+WLeft + 'px, ' + 'top= '+WTop +  'px, ' 
		+ 'fullscreen=0,toolbar=0,location=0,menubar=0,resizable=0,scrollbars=1'; 
     WinOP  = window.open("","������Ʒ���׽���ȷ�ϵ�",features);
     WinOP.location=urlName;
}
function popOtherFullWindow(urlName)
{
	//window.open(urlName,"","left=0,top=0,width="+screen.availWidth+",height="+screen.availHeight+",status=yes,Toolbar=yes,menubar=yes,resizable=yes,Location=yes");
	newwin=window.open("","","resizable=yes,Toolbar=no,menubar=no,Location=no");
	newwin.moveTo(0,0);
	newwin.resizeTo(screen.width,screen.height);
	newwin.location=urlName;
}

function clientCountExtpopFullWindow(urlName)
{
	newwin=window.open("","","status=no,resizable=yes,width=800px,height=300px,Toolbar=no,menubar=no,Location=no,status=no");
	newwin.location=urlName;
}

function sopFullWindow(urlName)
{
	newwin=window.open("","","status=no,resizable=yes,width=800px,height=480px,Toolbar=no,menubar=no,Location=no,status=no");
	newwin.location=urlName;
}

function resizeToDialog(h,w,l,t){
	window.dialogHeight=h+"px";
	window.dialogWidth =w+"px";
	window.dialogLeft = (screen.availWidth-w)/2 +"px";
	window.dialogTop = (screen.availHeight-h)/2 +"px";
}

/*
������getCheckedItem
���ܣ���ȡָ����ѡ���ѡ������
������
   mychkboxname����ѡ������
���أ�ѡ�����ݣ��ֺŷָ���ͬѡ�
*/
function getCheckedItem(mychkboxname) {
	retselection="";
	var mychkboxlist=document.getElementsByName(mychkboxname);

	for(var i=0;i<mychkboxlist.length;i++)
	{
		if(mychkboxlist[i].checked)
		{
			if(retselection.length==0)
				retselection = mychkboxlist[i].value;
       		else
         		retselection = retselection + ";" + mychkboxlist[i].value;
    	}
	}
	return retselection;
}

/*
������CheckAll
���ܣ�����ָ����ѡ���ѡ��״̬
������
   mychkboxname����ѡ������
   mychecked ѡ��ѡ��״̬��true/false��
���أ���
*/
function CheckAll(mychkboxname,mychecked) {
	var mychkboxlist=document.getElementsByName(mychkboxname);
	for(var i=0;i<mychkboxlist.length;i++)
	{
		mychkboxlist[i].checked=mychecked;
	}
}

/*
������CheckSelected
���ܣ����ݹ�ѡ��������ָ����ѡ���ѡ��״̬
������
   mychkboxname����ѡ������
   mycheckstr ��ѡ���ݣ��ֺŷָ���ͬѡ�
���أ���
*/
function CheckSelected(mychkboxname,mycheckstr) {
	var mychkboxlist=document.getElementsByName(mychkboxname);
	var mystr=String(";"+mycheckstr+";");
	for(var i=0;i<mychkboxlist.length;i++)
	{
		mychkboxlist[i].checked=(mystr.indexOf(";"+mychkboxlist[i].value+";")>=0);
	}
}
/*
����:checkTime
����:�ж��ַ����ǲ���ʱ���ʽ
����:
	str:Ҫ�жϵ��ַ�����140000��
����:
	true:��ȷ��ʱ���ʽ
	false:�����ʱ���ʽ
*/
function checkTime(_time){
	var flag = false;
	if(_time && /^([0-9]*|[0-9]{1}\d*\.\d{1}?\d*)$/.exec(_time.replace(/^\s+|\s+$/g,"")) ){
		var length = _time.length;
		if(length <= 6 && length >= 5 ){
			var seconds = parseInt(_time.substring(length-2 ,length));
			var min =  parseInt(_time.substring(length-4 ,length-2));
			var hours = parseInt(_time.substring(0 ,length-4));;
			if((seconds>=0 && seconds <60) && (min>=0 && min <60) && (hours>=0 && hours<=24)){
				flag = true;
			}
		}
	}
	return flag;
}

/*
����:isTime
����:�ж��ַ����ǲ���ʱ���ʽ
����:
	str:Ҫ�жϵ��ַ���
����:
	true:��ȷ��ʱ���ʽ
	false:�����ʱ���ʽ
*/
function isTime(str){
	var a = str.match(/^(\d{0,2}):(\d{0,2}):(\d{0,2})$/);
	if (a == null) 
		return false;
	if (a[1]>=24 || a[2]>=60 || a[3]>=60)
		return false;
	return true;
}

/*
����:isDateTime
����:�ж��ַ����ǲ�������ʱ���ʽ
����:
	str:Ҫ�жϵ��ַ���
����:
	true:��ȷ������ʱ���ʽ
	false:���������ʱ���ʽ
*/
function isDateTime(str){
	var a = str.match(/^(\d{0,4})-(\d{0,2})-(\d{0,2}) (\d{0,2}):(\d{0,2}):(\d{0,2})$/);
	if (a == null) 
		return false;
	if ( a[2]>=13 || a[3]>=32 || a[4]>=24 || a[5]>=60 || a[6]>=60) 
		return false;
	return true;
}

/*
����:isDate
����:�ж��ַ����ǲ������ڸ�ʽ
����:
	str:Ҫ�жϵ��ַ���
����:
	true:��ȷ�����ڸ�ʽ
	false:��������ڸ�ʽ
*/
function isDate(str){
	var a = str.match(/^(\d{0,4})-(\d{0,2})-(\d{0,2})$/);
	if (a == null)
		return false;
	if (a[2]>=13 || a[3]>=32 || a[4]>=24) 
		return false;
	return true;
}

/*
����:validatedatetime
����:�������������Ƿ��ǺϷ���ʽ
����:
	obj:Ҫ�������ݵ��ı���
	type:���ڸ�ʽ������1=���� 2=ʱ�� 3=����ʱ��
����:
	��
*/
function validatedatetime(obj,type){
	var range=obj.createTextRange(); 
	var text = range.text;
	var selrange = document.selection.createRange();
	var seltext = selrange.text;
	var startpos = 0,endpos = 0;
	while(selrange.compareEndPoints("StartToStart",range)>0){ 
		selrange.moveStart("character",-1);  
		startpos ++;
	}
	while(selrange.compareEndPoints("EndToStart",range)>0){ 
		selrange.moveEnd("character",-1);  
		endpos ++;
	}
	
	if(event.keyCode>=48){//start from 0
		var keytext = String.fromCharCode(event.keyCode);
		text = text.substring(0,startpos) + keytext + text.substring(endpos,text.length);
	}
	else if(event.keyCode == 46){//delete
		if (startpos == endpos)
			text = text.substring(0,startpos) + text.substring(startpos+1,text.length);
		else
			text = text.substring(0,startpos) + text.substring(endpos,text.length);
	}
	else if(event.keyCode == 8){//Backspace
		if(startpos == endpos)
			text = text.substring(0,startpos-1) + text.substring(startpos,text.length);
		else
			text = text.substring(0,startpos) + text.substring(endpos,text.length);
	}
	if(event.keyCode == 45){//it is a '-'
		event.returnValue = false;
		return;
	}

	var valid;
	switch(type){
		case 1:valid = isDate(text);break;
		case 2:valid = isTime(text);break;
		case 3:valid = isDateTime(text);break;
		default:valid = false;
	}
	if(!valid){
		event.returnValue = false;
	}
}


var Cookie = {
    read : function(name) {
		var cookieValue = "";
		var search = name + "=";
		if (document.cookie.length > 0) {
	    	offset = document.cookie.indexOf(search);
	    	if (offset != -1) {
				offset += search.length ;
				end = document.cookie.indexOf(";", offset);
				if (end == -1)
		    		end = document.cookie.length;
				cookieValue = unescape(document.cookie.substring(offset, end))
	    	}
		}
		return cookieValue;
    },
    
    // Example:
    // writeCookie("myCookie", "my name", 24);
    // Stores the string "my name" in the cookie "myCookie" which expires after 24 hours.
    write : function(name, value, hours) {
		var expire = "";
		if (hours != null) {
	    	expire = new Date((new Date()).getTime() + hours * 3600000);
	    	expire = "; expires=" + expire.toGMTString();
		}
		document.cookie = name + "=" + escape(value) + expire;
    }
};

function exportExcel(tabName,tabTitle,tabContent,tabMaxLen){		
   setTimeout("exportExcelData('"+tabName+"','"+tabTitle+"','"+tabContent+"',"+tabMaxLen+")",1000);
}
function exportExcelData(tabName,tabTitle,tabContent,tabMaxLen){
 	var tabTil = document.getElementById(tabTitle);
    var tabCon = document.getElementById(tabContent);
    if(tabTil){
	    if(!tabMaxLen){
	    	tabMaxLen = tabCon.rows[0].cells.length;
	    }
		var xls = new ActiveXObject("Excel.Application");
		var workbook = xls.Workbooks.Add();
		var sheet  = workbook.ActiveSheet;
	    var today = new Date();
		try{
	   		sheet.Range(sheet.cells(1,1),sheet.Cells(1,tabMaxLen)).select();
	    }catch(e){
	    	alert("û�����ݲ�������");   
	    	return;
	    }
	    xls.Selection.Merge();
	    xls.Selection.HorizontalAlignment=-4108;
	    xls.Selection.Borders.LineStyle=1;
	    sheet.cells(1,1)=tabName;
		sheet.Rows("1:1").RowHeight=25.5;
	  	sheet.Rows("1:1").Font.Bold=true;
	  	sheet.Rows("1:1").Font.Size=20;
	  	sheet.Range(sheet.cells(2,1),sheet.cells(2,tabMaxLen)).Merge();	
		sheet.cells(3,1)="��������:"+today.getYear()+"��"+(today.getMonth()+1)+"��"+today.getDate()+"��";
	  	sheet.cells(3,1).Font.name="Times New Roman";
	    sheet.Range(sheet.cells(3,2),sheet.cells(3,tabMaxLen)).Merge();
	  	var sheetTabTil = sheet.Range(sheet.cells(4,1),sheet.Cells(3+tabTil.rows.length,tabMaxLen));
		sheetTabTil.Font.Bold=true;
		sheetTabTil.Interior.ColorIndex=15;
		setExcelCells(sheet,tabTil,4);
		var index = 4+tabTil.rows.length ; //���ݴӵڼ��п�ʼ
		if(tabCon.innerHTML.indexOf('colSpan')==-1 && tabCon.innerHTML.indexOf('rowSpan')==-1){
			for(var r=0;r<tabCon.rows.length;r++)
	    	   for(var c=0; c<tabMaxLen; c++)	//����    
	               sheet.cells(r+index,c+1).value = tabCon.rows[r].cells[c].innerText;		
		}else{
			setExcelCells(sheet,tabCon,index);      
		}   
		var allTab = sheet.Range(sheet.cells(1,1),sheet.cells(tabCon.rows.length+index-1,tabMaxLen)).Font.name="Times New Roman";
	    sheet.Cells.EntireColumn.AutoFit();
	  	var tabStyle = sheet.Range(sheet.cells(2,1),sheet.cells(tabCon.rows.length+index-1,tabMaxLen));
	  	tabStyle.borders.LineStyle=1;
	  	tabStyle.Font.Size=9;
	  	tabStyle.HorizontalAlignment=3; 	
	  	sheet.name=tabName;
		xls.visible=true;
	}else{
		throw "error";
	}
}


function exportGridExcelData(tabName,tabTil,tabCon,tabMaxLen){//Grid�������������Excel�����
    if(tabTil){
	    if(!tabMaxLen){
	    	tabMaxLen = tabTil.rows[0].cells.length;
	    }
	    
		var xls = new ActiveXObject("Excel.Application");
		var workbook = xls.Workbooks.Add();
		var sheet  = workbook.ActiveSheet;
	    var today = new Date();
		try{
	   		sheet.Range(sheet.cells(1,1),sheet.Cells(1,tabMaxLen)).select();
	    }catch(e){
	    	alert("û�����ݲ�������");   
	    	return;
	    }
	    xls.Selection.Merge();
	    xls.Selection.HorizontalAlignment=-4108;
	    xls.Selection.Borders.LineStyle=1;
	    sheet.cells(1,1)=tabName;
		sheet.Rows("1:1").RowHeight=25.5;
	  	sheet.Rows("1:1").Font.Bold=true;
	  	sheet.Rows("1:1").Font.Size=20;
	  	sheet.Range(sheet.cells(2,1),sheet.cells(2,tabMaxLen)).Merge();	
		sheet.cells(3,1)="��������:"+today.getYear()+"��"+(today.getMonth()+1)+"��"+today.getDate()+"��";
	  	sheet.cells(3,1).Font.name="Times New Roman";
	    sheet.Range(sheet.cells(3,2),sheet.cells(3,tabMaxLen)).Merge();
	  	var sheetTabTil = sheet.Range(sheet.cells(4,1),sheet.Cells(3+tabTil.rows.length,tabMaxLen));
		sheetTabTil.Font.Bold=true;
		sheetTabTil.Interior.ColorIndex=15;
		setExcelJsonCells(sheet,tabTil,4,tabMaxLen);
		var index = 4+tabTil.rows.length ; //���ݴӵڼ��п�ʼ
		if(tabCon.innerHTML.indexOf('colSpan')==-1 && tabCon.innerHTML.indexOf('rowSpan')==-1){
			for(var r=0;r<tabCon.rows.length;r++)
	    	   for(var c=0; c<tabMaxLen; c++){	//����
	    	   	   sheet.cells(r+index,c+1).NumberFormatLocal = "@ ";
	               sheet.cells(r+index,c+1).value = tabCon.rows[r].cells[c].innerText;
	    	   }
		}else{
			setExcelJsonCells(sheet,tabCon,index,tabMaxLen);      
		}   
		var allTab = sheet.Range(sheet.cells(1,1),sheet.cells(tabCon.rows.length+index-1,tabMaxLen)).Font.name="Times New Roman";
	    sheet.Cells.EntireColumn.AutoFit();
	  	var tabStyle = sheet.Range(sheet.cells(2,1),sheet.cells(tabCon.rows.length+index-1,tabMaxLen));
	  	tabStyle.borders.LineStyle=1;
	  	tabStyle.Font.Size=9;
	  	tabStyle.HorizontalAlignment=3; 	
	  	sheet.name=tabName;
		xls.visible=true;
	}else{
		throw "error";
	}
}

function exportGridExcelJsonData(tabName,tabTil,jsonCon,tabMaxLen,pArray){//Grid�������������Excel�����
    if(tabTil){
	    if(!tabMaxLen){
	    	tabMaxLen = tabTil.rows[0].cells.length;
	    }
	    
		var xls = new ActiveXObject("Excel.Application");
		var workbook = xls.Workbooks.Add();
		var sheet  = workbook.ActiveSheet;
	    var today = new Date();
		try{
	   		sheet.Range(sheet.cells(1,1),sheet.Cells(1,tabMaxLen)).select();
	    }catch(e){
	    	alert("û�����ݲ�������");   
	    	return;
	    }
	    xls.Selection.Merge();
	    xls.Selection.HorizontalAlignment=-4108;
	    xls.Selection.Borders.LineStyle=1;
	    sheet.cells(1,1)=tabName;
		sheet.Rows("1:1").RowHeight=25.5;
	  	sheet.Rows("1:1").Font.Bold=true;
	  	sheet.Rows("1:1").Font.Size=20;
	  	sheet.Range(sheet.cells(2,1),sheet.cells(2,tabMaxLen)).Merge();	
		sheet.cells(3,1)="��������:"+today.getYear()+"��"+(today.getMonth()+1)+"��"+today.getDate()+"��";
	  	sheet.cells(3,1).Font.name="Times New Roman";
	    sheet.Range(sheet.cells(3,2),sheet.cells(3,tabMaxLen)).Merge();
	  	var sheetTabTil = sheet.Range(sheet.cells(4,1),sheet.Cells(3+tabTil.rows.length,tabMaxLen));
		sheetTabTil.Font.Bold=true;
		sheetTabTil.Interior.ColorIndex=15;
		//setExcelCells(sheet,tabTil,4);
		setExcelJsonCells(sheet,tabTil,4,pArray.length);
		var index = 4+tabTil.rows.length ; //���ݴӵڼ��п�ʼ
		for(var r=0;r<jsonCon.length;r++){
	    	 for(var c=0; c<pArray.length; c++) {	//����  
	    	 	  sheet.cells(r+index,c+1).NumberFormatLocal = "@ ";//�������Ϊ00001,excel����ʾ1,������ÿ��Խ����������
	    	      sheet.cells(r+index,c+1).value = jsonCon[r][ pArray[c] ];	
	    	 }
		}
 
		var allTab = sheet.Range(sheet.cells(1,1),sheet.cells(jsonCon.length+index-1,tabMaxLen)).Font.name="Times New Roman";
	    sheet.Cells.EntireColumn.AutoFit();
	  	var tabStyle = sheet.Range(sheet.cells(2,1),sheet.cells(jsonCon.length+index-1,tabMaxLen));
	  	tabStyle.borders.LineStyle=1;
	  	tabStyle.Font.Size=9;
	  	tabStyle.HorizontalAlignment=3; 	
	  	sheet.name=tabName;
		xls.visible=true;
	}else{
		throw "error";
	}
}

function setExcelJsonCells(sheet,tbl,startRow,tLeng){
	var rowspan,colspan,curColPos;
	for(var r=0; r<tbl.rows.length; r++){
	 	curColPos = 1;
	 	//for(var t=0; t<tbl.rows[r].cells.length; t++){				//��������
	 	for(var t=0; t<tLeng; t++){				//��������
	 	   rowspan = tbl.rows[r].cells[t].rowSpan;
	 	   colspan = tbl.rows[r].cells[t].colSpan; 	   
	 	   while(sheet.cells(startRow+r,curColPos).MergeCells){
	 	   	 curColPos += sheet.cells(startRow+r,curColPos).MergeArea.Columns.Count;
           }
	 	   if(rowspan > 1 || colspan>1){
	 	   	  sheet.Range(sheet.cells(startRow+r,curColPos),sheet.cells(startRow+r+rowspan-1,curColPos+colspan-1)).Merge();
	 	   }
	 	   sheet.cells(startRow+r,curColPos).NumberFormatLocal = "@ "; 
	 	   sheet.cells(startRow+r,curColPos).value = tbl.rows[r].cells[t].innerText;
	 	   //sheet.cells(4+r,curColPos).HorizontalAlignment=3;
	 	   curColPos += colspan;	                  
        }
	}
}

function setExcelCells(sheet,tbl,startRow){
	var rowspan,colspan,curColPos;
	for(var r=0; r<tbl.rows.length; r++){
	 	curColPos = 1;
	 	for(var t=0; t<tbl.rows[r].cells.length; t++){				//��������
	 	   rowspan = tbl.rows[r].cells[t].rowSpan;
	 	   colspan = tbl.rows[r].cells[t].colSpan; 	   
	 	   while(sheet.cells(startRow+r,curColPos).MergeCells){
	 	   	 curColPos += sheet.cells(startRow+r,curColPos).MergeArea.Columns.Count;
           }
	 	   if(rowspan > 1 || colspan>1){
	 	   	  sheet.Range(sheet.cells(startRow+r,curColPos),sheet.cells(startRow+r+rowspan-1,curColPos+colspan-1)).Merge();
	 	   }	 
	 	   sheet.cells(startRow+r,curColPos).value = tbl.rows[r].cells[t].innerText;
	 	   //sheet.cells(4+r,curColPos).HorizontalAlignment=3;
	 	   curColPos += colspan;	                  
        }
	}
}


function exportRightsExcelJsonData(tabName,tabTil,jsonCon,pArray){
	if(tabTil){
	    var	tabMaxLen = pArray.length;
		var xls = new ActiveXObject("Excel.Application");
		var workbook = xls.Workbooks.Add();
		var sheet  = workbook.ActiveSheet;
	    var today = new Date();
		try{
	   		sheet.Range(sheet.cells(1,1),sheet.Cells(1,tabMaxLen)).select();
	    }catch(e){
	    	alert("û�����ݲ�������");   
	    	return;
	    }
	    xls.Selection.Merge();
	    xls.Selection.HorizontalAlignment=-4108;
	    xls.Selection.Borders.LineStyle=1;
	    sheet.cells(1,1)=tabName;
		sheet.Rows("1:1").RowHeight=25.5;
	  	sheet.Rows("1:1").Font.Bold=true;
	  	sheet.Rows("1:1").Font.Size=20;
	  	sheet.Range(sheet.cells(2,1),sheet.cells(2,tabMaxLen)).Merge();	
		sheet.cells(3,1)="��������:"+today.getYear()+"��"+(today.getMonth()+1)+"��"+today.getDate()+"��";
	  	sheet.cells(3,1).Font.name="Times New Roman";
	    sheet.Range(sheet.cells(3,2),sheet.cells(3,tabMaxLen)).Merge();
	  	var sheetTabTil = sheet.Range(sheet.cells(4,1),sheet.Cells(4,tabMaxLen));
		sheetTabTil.Font.Bold=true;
		sheetTabTil.Interior.ColorIndex=15;
		
		for(var i=0;i<tabTil.length;i++){//ͷ
			sheet.cells(4,i+1).value = tabTil[i];
		}
		
		
		for(var r=0;r<jsonCon.length;r++){
	    	 for(var c=0; c<pArray.length; c++) {	//����   
	    	      sheet.cells(r+5,c+1).value = jsonCon[r][ pArray[c] ];	
	    	 }
		}
 
		var allTab = sheet.Range(sheet.cells(1,1),sheet.cells(jsonCon.length+4,tabMaxLen)).Font.name="Times New Roman";
	    sheet.Cells.EntireColumn.AutoFit();
	  	var tabStyle = sheet.Range(sheet.cells(2,1),sheet.cells(jsonCon.length+4,tabMaxLen));
	  	tabStyle.borders.LineStyle=1;
	  	tabStyle.Font.Size=9;
	  	tabStyle.HorizontalAlignment=3; 	
	  	sheet.name=tabName;
		xls.visible=true;
	}else{
		throw "error";
	}


}