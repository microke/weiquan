package com.weiquan.util;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import net.sf.json.JSONObject;

public class JsonUtil {
	
	private static final Logger LOGGER = Logger.getLogger(JsonUtil.class);
	/**
	 * 对象组装成JSON返回前台
	 * @author wangdaowei 2011-11-02
	 * @param response
	 * @param object
	 */
	public static String toJsonObject(Object object) {
			StringBuffer result = new StringBuffer();
			JSONObject jsonArray = JSONObject.fromObject(object);
			if (LOGGER.isDebugEnabled()) {
				LOGGER.debug("JSON数据对象:" + result.toString());
			}
			return jsonArray.toString();
	}
}
