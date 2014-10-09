package com.weiquan.util;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import net.sf.json.JSONObject;

public class JsonUtil {
	
	private static final Logger LOGGER = Logger.getLogger(JsonUtil.class);
	/**
	 * ������װ��JSON����ǰ̨
	 * @author wangdaowei 2011-11-02
	 * @param response
	 * @param object
	 */
	public static String toJsonObject(Object object) {
			StringBuffer result = new StringBuffer();
			JSONObject jsonArray = JSONObject.fromObject(object);
			if (LOGGER.isDebugEnabled()) {
				LOGGER.debug("JSON���ݶ���:" + result.toString());
			}
			return jsonArray.toString();
	}
}
