package com.weiquan.common.filter;

import java.io.IOException;
import java.net.URLEncoder;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

public class UrlFilter implements Filter {
	public final static String DEFAULT_URI_ENCODE="GBK";
	private FilterConfig config=null;
	private String encode = null;
	@Override
	public void destroy() {
		config=null;
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse arg1,
			FilterChain arg2) throws IOException, ServletException {
		/*String uri = ((HttpServletRequest)request).getRequestURI();
		String ch = URLEncoder.encode(uri, this.encode).replace("%2F", "/");
		System.out.println(ch);
		if(uri.equals(ch)){
			arg2.doFilter(request, arg1);
			return ;
		}else{
			ch = ch.substring(((HttpServletRequest)request).getContextPath().length());
			config.getServletContext().getRequestDispatcher(ch).forward(request, arg1);
		}*/
		arg2.doFilter(request, arg1);
	}

	@Override
	public void init(FilterConfig config) throws ServletException {
		this.config = config;
		this.encode=config.getInitParameter("DEFAULT_URI_ENCODE");
		if(this.encode == null){
			this.encode = DEFAULT_URI_ENCODE;
		}
	}
	
}
