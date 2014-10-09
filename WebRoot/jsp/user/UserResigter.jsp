<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%> 
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>微客</title>
   <% String path = request.getContextPath()+"/";
%>
<script type="text/javascript" async="" src="http://www.google-analytics.com/ga.js"></script>
	<link href="<%=path %>css/userface/plug/bootstrap/bootstrap.min.css" rel="stylesheet">
<link href="<%=path %>css/userface/plug/layout/jquery.gridmanager.css" rel="stylesheet"> 
<link href="<%=path %>css/userface/showdiv/showdiv.css" rel="stylesheet"> 
<link href="<%=path %>css/userface/showdiv/adwareDiv.css" rel="stylesheet"> 
    <script type='text/javascript' src='<%=path %>js_userface/plug/jQuery/html5.js'></script>
	<script type='text/javascript' src='<%=path %>js_userface/plug/jQuery/jQuery.js'></script>
	<script type='text/javascript' src='<%=path %>js_userface/plug/jQuery/jquery.validate.min.js'></script>
	<script type='text/javascript' src='<%=path %>js_userface/plug/project.js'></script>
	<script type='text/javascript' src='<%=path %>js_userface/plug/carouFredSel/carouFredSel.js'></script>
	<script type='text/javascript' src='<%=path %>js_userface/plug/placeholder.js'></script>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="keywords" content="微信群,直销,微信推广,微信代理">
	<meta http-equiv="description" content="微客，微界直客！">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/main.css">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/index.css" media="all">
	 
	<script type="text/javascript" src="<%=path %>js_userface/plug/weike-index.js"></script>
	<script type="text/javascript" src="<%=path %>js/private/forward/user/reg.js"></script>
	
	<script>
		var $do_submit = false;
		// 绑定回车键
		$('#loginBox').keydown(function(e){
			if(13 == event.keyCode){
				login();
			}
		});
			function login()
			{
				if (true == $do_submit)
				{
					return false;
				}
				var $pre_submit = '登录', $done_submit = '登录中...';
				var x = $('#username');
				var $username = $('#username').val(), $password = $('#password').val(), $keepalive = $('#rememberPwdIcon').val();
				$('#login_button').text($done_submit);
				$do_submit = true;
				// check
				if ('' == $username || '' == $password)
				{
					$('#err_tips').text('您输入的微盟号或密码错误，请重新输入！');
					$('#err_area').show();
					$('#login_button').text($pre_submit);
					$do_submit = false;
					return false;
				}
				var $login_data = {
					'user.loginName' : $username,
					'user.password' :  $password
				};
				$.post('<%=path %>user/login.action', $login_data, function(rs){
					if(rs.errno == 200)
					{
						location.href = rs.url_route;
					}
					else
					{
						$('#err_tips').text(rs.error);
						$('#err_area').show();
						$('#login_button').text($pre_submit);
					}
					$do_submit = false;
				}, 'json');
			}
	</script>
  </head>
  
  <body >
  
  <div class="nav clearfix">
	<div class="nav-content">
		<h1 class="left"><a href="/"  title="微客官网">微客·微信营销，如此简单！</a></h1>
		<div class="left city">
			<h2><a href="/site/city1">
					成就微客<i class="tri4"></i>
				</a></h2>
		</div>
			<div class="right line-li">
			<ul>
					 <c:forEach items="${tags}" var="tag" >
				        <li><a href="${tag.tagUrl}"  target="_black">${tag.tagName}</a></li>
					 </c:forEach>
		    </ul>
		          <div class="account">
			        <a href="<%=path %>index.action?flag=-1" class="btn-reg btn0" target="_black">注册</a>
					<a href="javascript:;" class="btn-login btn0"  onclick="if(location.hostname.indexOf('.cn')>-1){location.href='<%=path %>user/login.action'; return false;} loginBox.toggle(this, event);">登录</a>
					
			</div>
		</div>
	</div>
  </div>
  <div id="loginBox">
			<div class="login-panel">
				<h3>登录</h3>
				<div class="login-mod">
					<div class="login-err-panel dn" id="err_area">
						<span class="icon-wrapper"><i class="icon24-login err" style="margin-top:-.2em;*margin-top:0;"></i></span>
						<span id="err_tips"></span>
					</div>
					<form class="login-form" id="login-form">
						<div class="login-un">
							<span class="icon-wrapper"><i class="icon24-login un"></i></span>
							<input type="text" id="username" placeholder="微客号">
						</div>
						<div class="login-pwd">
							<span class="icon-wrapper"><i class="icon24-login pwd"></i></span>
							<input type="password" id="password" placeholder="密码">
						</div>
					</form>
					<div class="login-help-panel">
						<a id="rememberPwd" class="login-remember-pwd" href="javascript:;">
							<input type="checkbox" id="rememberPwdIcon">记住帐号
						</a>
						<a class="login-forget-pwd" href="/forgotpassword/">忘记密码？</a>
	                    <a class="login-forget-pwd" href="<%=path %>index.action?flag=-1">新用户注册</a>
					</div>
					<div class="login-btn-panel">
						<a class="login-btn" title="点击登录" href="javascript:;" id="login_button" onclick="login();">登录</a>
					</div>
				</div>
			</div>
			<div class="login-cover" onclick="loginBox.toggle(this, event);"></div>
		</div>
	  <div class="Public-content clearfix" style="background-image: url('<%=path %>images/banner.jpg');">
	<div class="Public">
		<h1 class="Public-h1">注册</h1>
		<div class="Public-box clearfix">
			<div class="reg-wrapper2">
				<form id="regform" class="form-horizontal" method="post" action="#">
					<div class="control-group">
						<label class="control-label" for="username">用户名</label>
						<div class="controls" >
							<input type="text" name="username" id="username">
							<span class="maroon">*</span><span class="help-inline">长度为6~16位字符，可以为“数字/字母/中划线/下划线”组成</span>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="password">设置密码</label>
						<div class="controls">
							<input type="password" name="password" id="password">
							<span class="maroon">*</span><span class="help-inline">长度为6~16位字符</span>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="repassword">确认密码</label>
						<div class="controls">
							<input type="password" name="repassword" id="repassword">
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="location_p">详细地址</label>
						<div class="controls">
							<select name="location_p" id="location_p"></select>
							<select name="location_c" id="location_c"></select>
							<select name="location_a" id="location_a"></select>
							<script src="<%=path %>js_userface/plug/wb/region_select.js"></script>
							<script type="text/javascript">
								new PCAS('location_p', 'location_c', 'location_a', '', '', '');
							</script>
						</div>
					</div>
					<div class="control-group" style="display:none;">
						<label class="control-label" for="address"></label>
						<div class="controls">
							<input type="text" class="input-xlarge" name="address" id="address" data-rule-required="true" value="" style="width:426px;" />
							<span class="maroon">*</span><span class="help-inline">详细地址：xx路xx号</span>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="phone">手机</label>
						<div class="controls">
							<input type="text" name="phone" id="phone">
							<span class="maroon">*</span><span class="help-inline">请输入正确的手机号码</span>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="email">邮箱</label>
						<div class="controls">
							<input type="text" name="email" id="email">
							<span class="maroon">*</span><span class="help-inline">邮箱将与支付及优惠相关，请填写正确的邮箱</span>
						</div>
					</div>
					<div class="control-group">
						<label class="control-label" for="qq">微信</label>
						<div class="controls">
							<input type="text" name="qq" id="qq" >
							<span class="maroon">*</span>
						</div>
					</div>

					<div class="control-group">
						<div class="controls">
							<button type="submit" class="btn-register"></button>
						</div>
					</div>
				</form>
			</div>
		</div>
	</div>
</div>
	  
<div id="feedback_cover" class="feedback_cover"></div>
<div class="footer">
	<div class="footer-content clearfix">
		<div class="foot-menu">
			<p>
				<a href="/site/index1" target="_blank">微客首页</a>&nbsp;|&nbsp;
				<a href="/site/reg1" target="_blank">品牌入驻</a>&nbsp;|&nbsp;
				<a href="/site/proxy1" target="_blank">渠道推广</a>&nbsp;|&nbsp;
				<a href="/site/aboutus" target="_blank">关于微客</a>&nbsp;|&nbsp;
				<a href="/site/agents" target="_blank">授权认证</a>&nbsp;|&nbsp;
				<a href="http://agent.weimob.com/" target="_blank">代理商登录 </a>&nbsp;|&nbsp;
				<a href="/gdt" target="_blank"></a>

			</p>
			<p style="margin-top:6px;">联系电话：18368028782&nbsp;&nbsp;&nbsp;QQ：690062713&nbsp;&nbsp;&nbsp;邮箱：690062713@qq.com</p>
			<p>地址
								杭州市西湖文化广场</p>
		</div>
		<div class="copyright">
			备案信息
		</div>
	</div>
</div>
<script type="text/javascript">
	$(function(){
		$('#username').focus();

	});

</script>

</html>
