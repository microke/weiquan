package com.weiquan.web.interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.User;
import com.weiquan.service.role.RoleService;

public class BackGroudInterceptor implements HandlerInterceptor {
	private Logger logger = Logger.getLogger(BackGroudInterceptor.class);
	private String loginUrl = "/backgroud/login.action";
	private RoleService roleService;
	
	@Override
	public void afterCompletion(HttpServletRequest arg0,
			HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1,
			Object arg2, ModelAndView arg3) throws Exception {

	}

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse arg1,
			Object arg2) throws Exception {
		//获取请求的uri,如/forex/queryTrade.action
		logger.info("THIS IS BACKGOURD FILTER.");
		String actionPath = request.getRequestURI();
		logger.debug("User access[URL : "+actionPath+"]");
		if(this.loginUrl.equals(actionPath)){
			
			 return true;
		}else{
			HttpSession session = request.getSession();
			User user = (User)session.getAttribute(WqDataDictionary.SESSION_KEY_USER);
			
			if(user == null){
				return false;
			}else{
				return this.roleService.hasBackgroudPower(user.getRole());
			}
		}
	}

	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}

	public void setRoleService(RoleService roleService) {
		this.roleService = roleService;
	}

}
