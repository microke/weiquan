<%@ page language="java" import="java.util.*" pageEncoding="GBK"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%> 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <title>΢��</title>
   <%@ include file="./jsp/userface/common/Face_Lib.jsp"%>
	<meta http-equiv="pragma" content="no-cache">
	<meta http-equiv="cache-control" content="no-cache">
	<meta http-equiv="expires" content="0">    
	<meta http-equiv="keywords" content="΢��Ⱥ,ֱ��,΢���ƹ�,΢�Ŵ���">
	<meta http-equiv="description" content="΢�ͣ�΢��ֱ�ͣ�">
	<link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/main.css">
	<script type='text/javascript' src='<%=path %>js_userface/user/main/main.js'></script>
	 
    <link rel="stylesheet" type="text/css" href="<%=path %>css/userface/main/index_out.css" media="all" />
<script type="text/javascript" src="http://stc.weimob.com/src/www/index1/weimob-index.js?2014-02-25-11"></script>
  </head>
  
  <body >
  
  <div class="nav clearfix">
	<div class="nav-content">
		<h1 class="left"><a href="/"  title="΢�͹���">΢�͡�΢��Ӫ������˼򵥣�</a></h1>
		<div class="left city">
			<h2><a href="/site/city1">
					�ɾ�΢��<i class="tri4"></i>
				</a></h2>
		</div>
		<div class="right line-li">
        
			 <ul>
        <li><a href="/">��ҳ</a></li>
        <li><a href="http://life.weimob.com"  target="_black">Ʒ���Ƽ�</a></li>
        <li><a href="/site/case1" >΢��Ⱥ</a></li>
		<li><a href="/site/news"  >ý�屨��</a></li>
	    <%--<li class="nav_menu_li_1"><a style="width:70px; text-align:left;" class="_hover">��Ʒ����<i></i></a>
					 <div class="sub-nav">
						 <a href="/site/package" target="_black">΢���ײ�</a>
						 <a href="/site/guide1">���ܽ���</a>
						 <a href="/site/wenda" target="_black">��Ʒ�ʴ�</a>
						 <a href="/topic/weipai" target="_black">΢��</a>
						 <a href="/topic/wifi" target="_black">΢��WiFi</a>
						 <a href="/topic/printer" target="_black">СƱ��</a>
					 </div>

	    </li>
        --%>
        
        <li><a href="/site/proxy1" >��������</a></li>
		<li><a href="/site/aboutus" >����΢��</a></li>
        <li><a href="/site/help"  target="_black">����</a></li>
    </ul>
          <div class="account">
	        <a href="/site/reg1" class="btn-reg btn0" target="_black">ע��</a><%--
	         <a href="javascript:;" class="btn-login btn0" onclick="if(location.hostname.indexOf('.cn')>-1){location.href='http://www.weimob.com/site/login'; return false;} loginBox.toggle(this, event);">��¼</a>
						
	--%>
	 <a href="javascript:;" class="btn-login btn0" onclick="">��¼</a>
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
						<li><a href="#" >��ҳ</a></li>
						<li><a href="#">΢��Ⱥ</a></li>
						<li><a href="#">�ƹ�</a></li>
						<li><a href="#">΢��</a></li>
						<li><a href="#">����</a></li>
						<li><a href="#">��Ա</a></li>
						<li><a href="#">��������</a></li>
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
						<div class="column col-md-12 showtabletitle" ><a>���ں�</a></div>
						<div class="showtablebody">
								<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/689.jpeg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/699.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/653.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/internal/bussiness/td_code/638.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/699.jpg' class='img-responsive'>&nbsp;
											<a>������</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/689.jpeg' class='img-responsive'>&nbsp;
											<a>�������ֹ���</a>
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
											<a>��˼Դ����</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/638.jpg' class='img-responsive'>&nbsp;
											<a>ѧ������Ϻ�΢�ź�</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/629.jpg' class='img-responsive'>&nbsp;
											<a>�ϵ�</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											<img alt='qr' src='./images/internal/bussiness/td_code/614.jpg' class='img-responsive'>&nbsp;
											<a>��֪Ӣ��</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/581.jpg' class='img-responsive'>&nbsp;
											<a>babyArt���ձ���</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/717.jpg' class='img-responsive'>&nbsp;
											<a>���ֱ�������</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
												<img alt='qr' src='./images/internal/bussiness/td_code/674.jpg' class='img-responsive'>&nbsp;
											<a>������ɴ��Ӱ</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											
											
												<img alt='qr' src='./images/internal/bussiness/td_code/586.jpeg' class='img-responsive'>&nbsp;
											
											<a>i-D��Ӱʱ�л���</a>
										</p>
									</center>
								</div>
							
								<div class="col-md-2 showtabletr">
									<center>
										<p>
											
											
												<img alt='qr' src='./images/internal/bussiness/td_code/624.jpg' class='img-responsive'>&nbsp;
											
											<a>��ƽ�ɷ�</a>
										</p>
									</center>
								</div>
							
							</div>
						<div class="column col-md-12  showtablefoot" ></div>
					</div>
					
			
			<div class="row showBox -lt showtable">
				<div class="column col-md-12 showtabletitle" >
					<a>΢Ⱥ�Ƽ�</a>
				</div>
					<div class="showtablebody">
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/2.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/2.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
					
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
                        <a>��Դ</a>
				</div>
				
				<div class="showtablebody">
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/7T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/3T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/4T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/8T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/1T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/5T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/6T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/7T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						<div class="col-md-2 showtabletr"><center><p><img alt='' src='<%=path %>/images/test/8T.jpg' class='img-responsive'>&nbsp;<a>΢��Ⱥ����</a></p></center></div>
						
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
				<a href="/site/index1" target="_blank">΢����ҳ</a>&nbsp;|&nbsp;
				<a href="/site/reg1" target="_blank">Ʒ����פ</a>&nbsp;|&nbsp;
				<a href="/site/proxy1" target="_blank">�����ƹ�</a>&nbsp;|&nbsp;
				<a href="/site/aboutus" target="_blank">����΢��</a>&nbsp;|&nbsp;
				<a href="/site/agents" target="_blank">��Ȩ��֤</a>&nbsp;|&nbsp;
				<a href="http://agent.weimob.com/" target="_blank">�����̵�¼ </a>&nbsp;|&nbsp;
				<a href="/gdt" target="_blank"></a>

			</p>
			<p style="margin-top:6px;">��ϵ�绰��18368028782&nbsp;&nbsp;&nbsp;QQ��690062713&nbsp;&nbsp;&nbsp;���䣺690062713@qq.com</p>
			<p>��ַ
								�����������Ļ��㳡</p>
		</div>
		<div class="copyright">
			������Ϣ
		</div>
	</div>
</div>
<a class="feedbackbot" href="javascript:;" onclick= "$('#feedback, #feedback_cover').toggleClass('on');"></a>
<div style="display:none;"><script type="text/javascript" src="http://stc.weimob.com/src/www/index1/huishuo.js?v=2014-02-25-11"></script></div>

		  </body>
</html>
