package com.weiquan.service.attrmapping;

import java.util.Map;

import com.weiquan.domain.AttrMapping;

/**
 * �˽ӿ��������Դ��뻺���ʼ��
 * @author ZL
 *
 */
public interface AttrMappingCacheInitInterface {
	public Map<String, AttrMapping> initAttrMapping();
	public void initProxyObject(String[] packageUrls, String[] javaUrls, String[] outSideJavas );
}