package com.weiquan.service.element.source.impl;

import java.util.List;

import com.weiquan.dao.ElementDao;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.service.element.source.AbstractElementSource;
import com.weiquan.service.element.source.ElementSourceInterface;

public class NewInfoElementSourceImpl extends AbstractElementSource {
	private ElementDao elementDao;
	
	@Override
	public String getSourceName() {
		return "WEIQUAN_NEWINFO".toUpperCase();
	}

	@Override
	public List<Element> queryElement_ELEMENT_STYLE_GRID(
			ElementQuery elementQuery) {
//		return elementDao.queryElementFromNewInfo_0(elementQuery);
		return null;
	}


	@Override
	public List<Element> queryElement_ELEMENT_STYLE_ARTICLE(
			ElementQuery elementQuery) {
		return elementDao.queryElementFromNewInfo_1(elementQuery);
	}


	@Override
	public List<Element> queryElement_ELEMENT_AD_TOP(ElementQuery elementQuery) {
		return null;
	}


	@Override
	public List<Element> queryElement_ELEMENT_AD_CROSSWISE(
			ElementQuery elementQuery) {
		return null;
	}


	@Override
	public List<Element> queryElement_ELEMENT_AD_COLUMN(
			ElementQuery elementQuery) {
		return null;
	}
	


	public void setElementDao(ElementDao elementDao) {
		this.elementDao = elementDao;
	}


}