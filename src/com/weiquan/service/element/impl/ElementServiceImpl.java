package com.weiquan.service.element.impl;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.weiquan.common.WqException;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.domain.QueryParam;
import com.weiquan.dao.ElementDao;
import com.weiquan.service.element.ElementService;
import com.weiquan.service.element.source.ElementSourceInterface;
import com.weiquan.service.ServiceCommonInterface;

public class ElementServiceImpl implements ElementService, ServiceCommonInterface<Element>{
	private Logger logger = Logger.getLogger(ElementServiceImpl.class);
	private Map<String, ElementSourceInterface> sourceMap = new HashMap<String, ElementSourceInterface>();
	private ElementDao elementDao;

	@Override
	public void registerSource(ElementSourceInterface source) {
		this.sourceMap.put(source.getSourceName().toUpperCase(), source);
	}
	@Override
	public List<Element> loadElements(ElementQuery queryObject, int elementType) {
		String name = queryObject.getSourceName().toUpperCase();
		logger.info("load source["+name+"]");
		ElementSourceInterface elementSource = this.sourceMap.get(name);
		if(elementSource == null){
			logger.info("There not has the elementSouce which is named ["+name+"]");
			throw new WqException("error.element.source.notExsit");
		}
		return elementSource.queryElement(queryObject, elementType);
	}
	
	@Override
	public Element getInfoById(long id){
		return null;
	}
	@Override
	public Element getInfoById(Element arg){
		return this.elementDao.get(arg);
	}
	public List<Element> getListByQueryParam(QueryParam queryParam){
		return null;
	}
	@Override
	public void update(Element arg){
		this.elementDao.update(arg);
	}
	@Override
	public void insert(Element arg){
		this.elementDao.insert(arg);
	}
	public void setElementDao(ElementDao arg){
		this.elementDao = arg;
	}
}