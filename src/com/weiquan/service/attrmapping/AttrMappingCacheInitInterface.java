package com.weiquan.service.attrmapping;

import java.util.Map;

import com.weiquan.domain.AttrMapping;

/**
 * 此接口用于属性代码缓存初始化
 * @author ZL
 *
 */
public interface AttrMappingCacheInitInterface {
	public Map<String, AttrMapping> initAttrMapping();
	public void initProxyObject(String[] packageUrls, String[] javaUrls, String[] outSideJavas );
}