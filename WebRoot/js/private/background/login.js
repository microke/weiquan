var loginContext = function(){
	var updatePassDlg,logDlg,loginBtn,resetBtn;
	return {
		init : function(){
			//alert('1');
			if(!updatePassDlg){
				
				updatePassDlg = new Ext.LayoutDialog('updatePass',{
							modal : true,
							autoScroll :true,
							title : '�����޸�',
							resizable : false,
							width : 350,
							height : 250,
							center: {
		                    	animate: true,
		                        autoScroll:true
	                    	}
						});
				updatePassDlg.addButton('ȷ��',loginContext.updatePass, updatePassDlg);
	            updatePassDlg.addButton('ȡ��', updatePassDlg.hide, updatePassDlg);
	            content = new Ext.ContentPanel('center',{autoCreate : true,fitToFrame:true,background:true});            
			}
			
			if(!logDlg){
				logDlg = new Ext.LayoutDialog('login-dlg',{
							modal : true,
							autoScroll :true,
							title : 'YFX����ۺϹ���ƽ̨',
							resizable : false,
							shadow: true,
							proxyDrag: true,
							closable: false,
							 autoTabs: true,
							width : 800,
							height : 480,
							center: {
		                    	animate: true,
		                        autoScroll:true
	                    	}
						});
				//logDlg.addKeyListener(27,logDlg.login, logDlg);
				loginBtn = logDlg.addButton('��¼',this.login, logDlg);
	            resetBtn = logDlg.addButton('����', this.loginReset, logDlg);

				//tabs = dialog.getTabs();
	            var layOut = logDlg.getLayout();
	            layOut.beginUpdate();
	            layOut.add('center', new Ext.ContentPanel(Ext.get('logForm'),{fitToFrame:true}));
	            document.getElementById("random").src = '../CreateCheckCode.do';
	            layOut.endUpdate();
			}
			logDlg.show();
		},
		enterSubmit : function(){
			if (window.event.keyCode==13){
				this.login();
		    }
		},
		showHideBtns : function(f){
        	var msg = Ext.get('post-wait');
       		if(f){
	       		resetBtn.enable();
	       		loginBtn.enable(); 
       			msg.removeClass('active-msg')
       		}
       		else{
	       		resetBtn.disable();
	       		loginBtn.disable();       			
       			msg.radioClass('active-msg');
       		}
        },
		login : function(){
			loginContext.showHideBtns(false);
			var form = Ext.get('loginForm').dom;
			Ext.lib.Ajax.formRequest(form, '../forex/login.action',
                    	{success: loginContext.commentSuccess, failure: loginContext.commentFailure});
		},
		loginReset : function(){
			Ext.get('user.userId').dom.value = "";
			Ext.get('user.password').dom.value = "";
			Ext.get('user.validCode').dom.value = "";
		},
		commentSuccess : function(o){
			loginContext.showHideBtns(true);
			var data = o.responseText;
			if(data){
				if(data.indexOf('Login')!= -1 ){
					location.href = '/forex/loadMain.action';
				}else if(data.indexOf('���볬����Ч��') != -1){
					var params = "user.userId=" + Ext.get("user.userId").getValue();
					var layout = updatePassDlg.getLayout();
	            	layout.beginUpdate();
	            	layout.add('center',content);
	           	 	var update = content.getUpdateManager();
					update.update('/base/UpdatePass.jsp',params);
		        	layout.endUpdate();
					updatePassDlg.show();
					
				}else{
					var str="<img src='../images/default/form/exclamation.gif 'width='16' height='16' align='absmiddle' /><font color='red'>"+data+"</font>";
					Ext.get('error').dom.innerHTML=str;
				 }
			}
        },
        commentFailure : function(o){
        	Ext.MessageBox.alert('����','����������,�����ύʧ��');
        },
        updatePass : function(){
        	var password = Ext.get('user.newPassword').dom.value;
		    if(!((/[0-9]+/g.test(password))&&(/[A-Za-z]+/g.test(password)))) {
				Ext.MessageBox.alert('����','�������������ڼ򵥣�������Ӣ�ĺ�������ϵ�����');
				return;
			}
			if(!(/^[^%&',;!=?$\x22]+$/g.test(password))) {
				Ext.MessageBox.alert('����','����������벻�ܺ��з���,����������');
				return;				
			}
			var form = Ext.get('formInfo').dom;
			form.elements('user.userId').value = Ext.get('user.userId').dom.value;
			Ext.MessageBox.wait('�����޸���...','���Ժ�');
			Ext.lib.Ajax.formRequest(form, '/base/updatePass.action',
                    {success: loginContext.loginSuccess, failure: loginContext.commentFailure}); 
		},
		loginSuccess : function(o){
			var data = o.responseText;
			Ext.MessageBox.hide();
			if(data.indexOf('html') != -1){
				Ext.MessageBox.alert('��ʾ','�޸ĳɹ��������µ�½');
				location.href = '/base/Login.jsp';
			}else{
				Ext.get('msg').dom.innerHTML='';
				 Ext.DomHelper.append('msg', {
				     tag: 'img', 
				     src: '../images/default/form/exclamation.gif', 
				     width:16,
				     height:16,
				     align:'absmiddle'
				 }, true).insertHtml('afterEnd',data);
			}
		}
	}
}()
Ext.onReady(loginContext.init,loginContext,true);

//������֤��
function show(o){

	var timenow = new Date().getTime();
	o.src="../CreateCheckCode.do?d="+timenow;
}
