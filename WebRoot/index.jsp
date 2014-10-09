<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%> 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>微客</title>
   <%@ include file="./jsp/userface/common/Face_Lib.jsp"%>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="微信群,直销,微信推广,微信代理">
	<meta http-equiv="description" content="微客，微界直客！">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/main.css">
	<script type='text/javascript' src='<%=path %>js_userface/user/main/main.js'></script>
	 
    <link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/index_out.css" media="all" />
<script type="text/javascript" src="http://stc.weimob.com/src/www/index1/weimob-index.js?2014-02-25-11"></script>
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
        <li><a href="/">首页</a></li>
        <li><a href="http://life.weimob.com"  target="_black">品牌推荐</a></li>
        <li><a href="/site/case1" >微信群</a></li>
		<li><a href="/site/news"  >媒体报道</a></li>
	    <%--<li class="nav_menu_li_1"><a style="width:70px; text-align:left;" class="_hover">产品中心<i></i></a>
					 <div class="sub-nav">
						 <a href="/site/package" target="_black">微盟套餐</a>
						 <a href="/site/guide1">功能介绍</a>
						 <a href="/site/wenda" target="_black">产品问答</a>
						 <a href="/topic/weipai" target="_black">微拍</a>
						 <a href="/topic/wifi" target="_black">微盟WiFi</a>
						 <a href="/topic/printer" target="_black">小票机</a>
					 </div>

	    </li>
        --%>
        
        <li><a href="/site/proxy1" >渠道代理</a></li>
		<li><a href="/site/aboutus" >关于微客</a></li>
        <li><a href="/site/help"  target="_black">帮助</a></li>
    </ul>
          <div class="account">
	        <a href="/site/reg1" class="btn-reg btn0" target="_black">注册</a><%--
	         <a href="javascript:;" class="btn-login btn0" onclick="if(location.hostname.indexOf('.cn')>-1){location.href='http://www.weimob.com/site/login'; return false;} loginBox.toggle(this, event);">登录</a>
						
	--%>
	 <a href="javascript:;" class="btn-login btn0" onclick="">登录</a>
	</div>
	
</div>

</div>
</div>
  	<div id="container" style="margin-top: 50px;">
		<%--<div id="mycanvas" style="width: 970px;">
			<div class='row'>
		  		<div class='column col-md-12' style="padding-left: 0px;padding-right: 0px;">
		  		<div id="navigation" >
				  	<ul id="nav" >
						<li><a href="#" class="apple"><span>Apple</span></a></li>
						<li><a href="#" >主页</a></li>
						<li><a href="#">微信群</a></li>
						<li><a href="#">推广</a></li>
						<li><a href="#">微客</a></li>
						<li><a href="#">代理</a></li>
						<li><a href="#">会员</a></li>
						<li><a href="#">关于我们</a></li>
						<li class="search_container">
							<form class="search" method="get" action="#">
								<label for="search">
									<input type="text" id="search" placeholder="Search" />
								</label>
							</form>
						</li>
					</ul>
					</div>
				</div>
			</div>
			
			--%>
			<div class='row showBox -lt adwaretable'>
				 <div align="center">
				 	<p><img alt='' src='<%=path %>/images/test/vaio_aftersales_index_20140710_03.jpg' class='img-responsive'></p>
				 </div>
			</div>
						<div class="row showBox -lt showtable">
						<div class="column col-md-12 showtabletitle" ><a>公众号</a></div>
						<div class="showtablebody">
								<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/689.jpeg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/699.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/653.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/638.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/699.jpg' class='img-responsive'>&nbsp;
											<a>范冰冰</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/689.jpeg' class='img-responsive'>&nbsp;
											<a>美国伯乐国际</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr" style="height: 169.328PX">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/656.jpg' class='img-responsive'>&nbsp;
											<a>123</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/653.jpg' class='img-responsive'>&nbsp;
											<a>新思源教育</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/638.jpg' class='img-responsive'>&nbsp;
											<a>学大教育上海微信号</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/629.jpg' class='img-responsive'>&nbsp;
											<a>合得</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/614.jpg' class='img-responsive'>&nbsp;
											<a>乐知英语</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/581.jpg' class='img-responsive'>&nbsp;
											<a>babyArt创艺宝贝</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/717.jpg' class='img-responsive'>&nbsp;
											<a>青浦本地生活</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/674.jpg' class='img-responsive'>&nbsp;
											<a>玛奇朵婚纱摄影</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											
											
												<img alt='qr' src='./images/internal/bussiness/td_code/586.jpeg' class='img-responsive'>&nbsp;
											
											<a>i-D摄影时尚机构</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											
											
												<img alt='qr' src='./images/internal/bussiness/td_code/624.jpg' class='img-responsive'>&nbsp;
											
											<a>华平股份</a>
										</p>
									</center>
								</div>
							
							</div>
						<div class="column col-md-12  showtablefoot" ></div>
					</div>
					
			
			<div class="row showBox -lt showtable">
				<div class="column col-md-12 showtabletitle" >
					<a>微群推荐</a>
				</div>
					<div class="showtablebody">
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/2.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/2.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
					
				</div>
					<div class="column col-md-12  showtablefoot" ></div>
			</div>
			<div class='row showBox -lt adwaretable'>
				 <div align="center">
				 <p>
				 	<img alt='' src='<%=path %>/images/test/adware.jpg' class='img-responsive'>
				 </p>
				 </div>
			</div>
			<div class="row showBox -lt showtable">
				<div class="column col-md-12 showtabletitle" >
                        <a>货源</a>
				</div>
				
				<div class="showtablebody">
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/7T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/8T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/7T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/8T.jpg' class='img-responsive'>&nbsp;<a>微信群名称</a></p></center></div>
						
					</div>
				<div class="column col-md-12  showtablefoot" ></div>
			</div><%--
			
			<div class='row showBox -lt showtable'>
				 <div class='column col-md-12'>
				 <div id="strengths" class="section-lt box">
					<h2>Strengths</h2>
					<ul>
						<li>perfect for hidden page content</li>
						<li>uber light at just over 1kb (minified)</li>
						<li>flexible width &amp; height</li>
						<li>image free</li>
						<li>multiple instances on one page</li>
						<li>great for login, sign up &amp; alert panels, etc.</li>
					</ul>
				</div>
				 </div>
			</div>
			--%><div class='row showBox -lt'>
				<div class='column col-md-3 showResume'>
				<p><img src='http://placekitten.com/400/400/' class='img-responsive'></p>
				<p>Vivamus faucibus nibh ut aliquam dignissim. Nunc tempus velit sit amet eleifend tempor. Aliquam vel tortor euismod, viverra urna tempus, scelerisque ipsum. Pellentesque at mauris non tortor elementum pretium. Integer rutrum libero at facilisis interdum. Praesent lobortis elit erat, quis elementum justo rhoncus eu. Ut eu dui lectus. Duis faucibus eu augue ut placerat.</p>
				</div>
				<div class='column col-md-3 showResume'>
				<p><img src='http://placekitten.com/400/400/' class='img-responsive'></p>
				<p>Vivamus faucibus nibh ut aliquam dignissim. Nunc tempus velit sit amet eleifend tempor. Aliquam vel tortor euismod, viverra urna tempus, scelerisque ipsum. Pellentesque at mauris non tortor elementum pretium. Integer rutrum libero at facilisis interdum. Praesent lobortis elit erat, quis elementum justo rhoncus eu. Ut eu dui lectus. Duis faucibus eu augue ut placerat.</p>
				</div>
				<div class='column col-md-3 showResume'>
				<p><img src='http://placekitten.com/400/400/' class='img-responsive'></p>
				<p>Vivamus faucibus nibh ut aliquam dignissim. Nunc tempus velit sit amet eleifend tempor. Aliquam vel tortor euismod, viverra urna tempus, scelerisque ipsum. Pellentesque at mauris non tortor elementum pretium. Integer rutrum libero at facilisis interdum. Praesent lobortis elit erat, quis elementum justo rhoncus eu. Ut eu dui lectus. Duis faucibus eu augue ut placerat.</p>
				</div>
				<div class='column col-md-3 showResume'>
				<p><img src='http://placekitten.com/400/400/' class='img-responsive'></p>
				<p>Vivamus faucibus nibh ut aliquam dignissim. Nunc tempus velit sit amet eleifend tempor. Aliquam vel tortor euismod, viverra urna tempus, scelerisque ipsum. Pellentesque at mauris non tortor elementum pretium. Integer rutrum libero at facilisis interdum. Praesent lobortis elit erat, quis elementum justo rhoncus eu. Ut eu dui lectus. Duis faucibus eu augue ut placerat.</p>
				</div>
			</div>		
		</div>
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
<a class="feedbackbot" href="javascript:;" onclick= "$('#feedback, #feedback_cover').toggleClass('on');"></a>
<div style="display:none;"><script type="text/javascript" src="http://stc.weimob.com/src/www/index1/huishuo.js?v=2014-02-25-11"></script></div>

		  </body>
</html>
