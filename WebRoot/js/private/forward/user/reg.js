$(function(){
	var a=$("#regform").validate({
		rules:{
			username:{
				required:true,
				chkUserName:true,
				minlength:6,
				maxlength:16
			},
			password:{
				required:true,
				minlength:6,
				maxlength:16
			},
			email:{
				required:true,
				email:true
			},
			phone:{
				required:true,
				number:true,
				minlength:11,
				maxlength:14
			}
		},
		messages:{
			username:{
				required:"请输入用户名",
				minlength:"用户名长度不够",
				maxlength:"用户名长度不能超过16",
				chkUserName:"请使用[数字/字母/中划线/下划线]！"
			},
			password:{
				required:"请输入密码",
				minlength:"密码长度不够",
				maxlength:"密码长度不能超过16"
			},
			repassword:{
				required:"请输入密码",
				equalTo:"两次输入密码不相同"
			},
			email:{
				required:"请输入邮箱",
				email:"请输入正确的邮箱格式"
			},
			phone:{
				required:"请输入手机",
				minlength:"请输入正确的手机号码",
				maxlength:"请输入正确的手机号码",
				number:"请输入正确的手机号码"
			}
		},
		showErrors:function(b,d){
			if (d&&d.length>0) {
				$.each(d,function(e,g){
					var f=$(g.element);
					f.closest(".control-group").addClass("error");
					f.attr("title",g.message)});
			} else {
				var c=$(this.currentElements);
				c.closest(".control-group").removeClass("error");
				c.removeAttr("title");
			}
		},
		submitHandler:function(){
			var b=$("#regform");
			var d=$("#reg-btn");
			if(d.hasClass("disabled")){return;}
			var c={
				username:$("input[name='username']",b).val(),
				password:$("input[name='password']",b).val(),
				repassword:$("input[name='repassword']",b).val(),
                location_p:$('#location_p').val(),
                location_c:$('#location_c').val(),
                location_a:$('#location_a').val(),
                address:$('#address').val(),
				email:$("input[name='email']",b).val(),
				phone:$("input[name='phone']",b).val(),
				qq:$("input[name='qq']",b).val(),
				captcha:$("input[name='captcha']",b).val(),
				invite_code:$("input[name='invite_code']",b).val()
			};
			d.addClass("disabled");
			$.post("/site/reg1",c,function(e){
				d.removeClass("disabled");
				if(e.error=="username"){
					$("input[name='username']").focus();
					alert("用户名已存在")
				}else{
					if(e.error == 'invite_code') {
						alert('邀请码错误');
					}

					if(e.error=='success'){
						window.location.href="/site/success?n="+ c.username;
					}else{
						alert(e.error)
					}
				}
			},"json");
			return false;
		}
	});
			
	$.validator.addMethod("chkUserName",
		function(c){
			var b=/^[0-9a-zA-Z_-]+$/;
			return b.test(c)
		},"请使用[数字/字母/中划线/下划线]！");

	$.validator.addMethod("isMobilPhone",
		function(d){
			var b=/((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/;
			var c=new RegExp(b);
			return c.test(d)
		},"不是有效的手机号码")

});