<%@ page language="java" pageEncoding="GBK"%>
<%@ taglib prefix="s" uri="http://www.springframework.org/tags/form"%> 
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
	<html>
	<head>
		<title>微全管理后台</title>
		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<%@ include file="../background/common/Common_Lib.jsp"%>
			
		<script type='text/javascript' src='<%=path %>js/private/background/login.js'></script>
	</head>

	<body>
	<div id ="logForm" style="background-image: url(<%=path %>images/login.jpg);">

			<s:form action="/backgroud/login.action" commandName="user">
			<Table width="100%" height="95%" align="center" border="0"  onkeyup="loginContext.enterSubmit()">
			<colgroup>
				<col style="width:60%" />
				<col style="width:10%" />
				<col style="width:30%;text-align:left" />
			</colgroup>
				
				<tr style="height: 150px">
					<td colspan="3" style="padding: 0px 0px 0px 60px;"></td>
				</tr>
					<tr style="height: 36px">
						<td></td>
						<td align="center"><font size="3" color=navy>用户名: </font></td>
						<td>
						<s:input path="loginName"/>
						</td>
					</tr>
					<tr style="height: 36px">
						<td></td>
						<td align="center"><font size="3" color=navy >密码:</font></td>
						<td>
						<s:input path="password"/>
						</td>
					</tr>
					<tr style="display:none" style="height: 36px">
						<td></td>
						<td align="center"><font size="3" color=navy>验证码:</font></td>
						<td>
						&nbsp; <img alt="" align="absmiddle" id="random" src="" />&nbsp;
							<a href="javascript:show(document.getElementById('random'))">刷新</a>
						</td>
					</tr>
					<tr style="height: 15px">
						<td></td>
						<td colspan="2" align="center" id="error"><%--
							&nbsp;<s:if test="%{message != null}">
									<s:property value="message"/>
								  </s:if>
						--%></td>
					</tr>
					<tr  style="height: 5px">
						<td colspan="3"></td>
					</tr>
			</Table>

			</s:form>
		</div>
		<div id="updatePass"></div>
		<!-- login begin-->
		<div id='login-dlg' style='visibility:hidden;'>
			<div class='x-dlg-ft'>
				<div id='dlg-msg'>
					<div id='post-wait' class='posting-msg'>
						<div class='waitting'>正在验证，请稍候...</div>
					</div>
				</div>
			</div>
		</div>
		<!-- login end-->
	</body>
	</html>
