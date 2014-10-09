<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%> 
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%> 
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>微客</title>
    <%@ include file="./userface/common/Face_Lib.jsp"%>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta http-equiv="keywords" content="微信群,直销,微信推广,微信代理">
	<meta http-equiv="description" content="微客，微界直客！">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/main.css">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/index.css" media="all">
	
	<script type='text/javascript' src='<%=path %>js_userface/user/main/main.js'></script>
	 
    <link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/index_out.css" media="all" />
	<script type="text/javascript" src="<%=path %>js_userface/plug/weike-index.js"></script>
	
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
					username:$username,
					password:$password,
					keepalive:$keepalive
				};
				$.post('/login', $login_data, function(rs){
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
  
  <div class="nav clearfix" >
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
					<a href="javascript:;" class="btn-login btn0"  onclick="if(location.hostname.indexOf('.cn')>-1){location.href='<%=path %>site/login'; return false;} loginBox.toggle(this, event);">登录</a>
			</div>
		</div>
	</div>
  </div>
  <div id="loginBox">
			<div class="login-panel">
				<h3>登录</h3>
				<div class="login-mod">
					<div class="login-err-panel dn" id="err_area">
						<span class="icon-wrapper">
							<i class="icon24-login err" style="margin-top:-.2em;*margin-top:0;"></i>
						</span>
						<span id="err_tips"></span>
					</div>
					<form class="login-form" id="login-form">
						<div class="login-un">
							<span class="icon-wrapper">
								<i class="icon24-login un"></i>
							</span>
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
	                    <a class="login-forget-pwd" href="/site/reg1">新用户注册</a>
					</div>
					<div class="login-btn-panel">
						<a class="login-btn" title="点击登录" href="javascript:;" id="login_button" onclick="login();">登录</a>
					</div>
				</div>
			</div>
			<div class="login-cover" onclick="loginBox.toggle(this, event);"></div>
		</div>
	  
  	<div id="container" style="margin-top: 50px;" >
			
			
			<c:forEach items="${sheets}" var="sheet">
				<c:choose>
					<c:when test="${sheet.tableTemplet.pageType==2}"><!-- 横条图片 -->
						<c:forEach items="${sheet.elements}" var="element">
							<div class='row showBox -lt adwaretable' >
								 <div class=''>
								 	<p><img alt='' src='.${element.groupShowImage.directory}/${element.groupShowImage.fileName}' class='img-responsive'></p>
								 </div>
							</div>
						</c:forEach>
					</c:when>
				<c:when test="${sheet.tableTemplet.pageType==3}"><!-- 置顶广告 -->
					<c:forEach items="${sheet.elements}" var="element">
						<div class='row showBox -lt adwaretable' >
							 <div align="center">
							 	<img alt='' src='.${element.groupShowImage.directory}/${element.groupShowImage.fileName}' class='img-responsive'>
							 </div>
						</div>
					</c:forEach>
				</c:when>
				<c:when test="${sheet.tableTemplet.pageType==0}"><!-- 宫格 -->
					<div class="row showBox -lt showtable" >
						<div class="column col-md-12 showtabletitle" >
						<a>${sheet.sheetName}
						</a>
							<%--<ul class="clearfix">
								<li class="on"><a href="/WebBusinessCircle/Category/id/5" target="_blank">More &gt; </a></li>
							</ul>
						--%></div>
						<div class="showtablebody">
							<c:forEach items="${sheet.elements}" var="element">
								<div class="col-md-2 showtabletr" style="height: 172PX">
									<center>
										<p>
											<c:if test="${element.groupShowImage!=null}">
												<img alt='show' src='.${element.groupShowImage.directory}/${element.groupShowImage.fileName}' class='img-responsive' style="height: 155PX;height: 155px">&nbsp;
											</c:if>
											<c:if test="${element.groupShowImage==null}">
												<img alt='qr' src='.${element.qrImage.directory}/${element.qrImage.fileName}' class='img-responsive' style="height: 155PX;height: 155px">&nbsp;
											</c:if>
											<a>${element.name}</a>
										</p>
									</center>
								</div>
							</c:forEach>
						</div>
						<div class="column col-md-12  showtablefoot" ></div>
					</div>
					
				</c:when>
				<c:when test="${sheet.tableTemplet.pageType==1}"><!-- 文章 -->
					<div class='row showBox -lt adwaretable'>
						 <div class="column col-md-12 showtabletitle" ><a>${sheet.sheetName}</a></div>
						<div class="showtablebody">
							<c:forEach items="${sheet.elements}" var="element">	
								<div class="col-md-6 showtabletr" style="height: 172PX">
									<center>
										<p>
											<c:if test="${element.groupShowImage!=null}">
												<img alt='show' src='.${element.groupShowImage.directory}/${element.groupShowImage.fileName}' class='img-responsive' style="height: 155PX;height: 155px">&nbsp;
											</c:if>
											<c:if test="${element.groupShowImage==null}">
												<img alt='qr' src='.${element.qrImage.directory}/${element.qrImage.fileName}' class='img-responsive' style="height: 155PX;height: 155px">&nbsp;
											</c:if>
											<a>${element.name}</a>
										</p>
									</center>
								</div>
							</c:forEach>
						</div>
						<div class="column col-md-6  showtablefoot" ></div>
					</div>
				</c:when>
				<c:when test="${sheet.tableTemplet.pageType==3}"><!-- 竖条图片 -->
				</c:when>
				</c:choose>
			</c:forEach>
			
		</div>
	<!-- 
<script charset="GBK" type="text/javascript" src="http://static.b.qq.com/account/bizqq/js/wpa.js?wty=1&type=13&kfuin=4006305400&ws=http%3A%2F%2Fwww.weimob.com%2F&title=%e4%bc%81%e4%b8%9aQQ%e5%94%ae%e5%89%8d&cot1=%e5%9b%bd%e5%86%85%e6%9c%80%e5%a4%a7%e7%9a%84%e5%be%ae%e4%bf%a1%e5%85%ac%e4%bc%97%e6%9c%8d%e5%8a%a1%e5%b9%b3%e5%8f%b0&btn1=%e4%bc%81%e4%b8%9aQQ%e5%92%a8%e8%af%a2&fsty=0&fposX=2&fposY=1&tx=2&aty=1&a=1001"></script>
	 -->
<div id="feedback_cover" class="feedback_cover"></div>
<div class="footer">
	<div class="footer-content clearfix">
		<div class="foot-menu">
			<p>
				<a href="/site/index1" target="_blank">微客首页</a>&nbsp;|&nbsp;
				<a href="/site/reg1" target="_blank">微群入驻</a>&nbsp;|&nbsp;
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
<a class="feedbackbot" href="javascript:;" onclick= "$('#feedback, #feedback_cover').toggleClass('on');"></a>
<div style="display:none;"><script type="text/javascript" src="http://stc.weimob.com/src/www/index1/huishuo.js?v=2014-02-25-11"></script></div>

		  </body>
</html>
