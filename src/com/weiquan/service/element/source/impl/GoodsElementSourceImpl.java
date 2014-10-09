package com.weiquan.service.element.source.impl;

import java.util.List;

import com.weiquan.dao.ElementDao;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.service.element.source.AbstractElementSource;
import com.weiquan.service.element.source.ElementSourceInterface;

public class GoodsElementSourceImpl extends AbstractElementSource {
	private ElementDao elementDao;
	
	@Override
	public String getSourceName() {
		return "WEIQUAN_GOODS".toUpperCase();
	}

	@Override
	public List<Element> queryElement_ELEMENT_STYLE_GRID(
			ElementQuery elementQuery) {
		return elementDao.queryElementFromGoods_0(elementQuery);
	}


	@Override
	public List<Element> queryElement_ELEMENT_STYLE_ARTICLE(
			ElementQuery elementQuery) {
		return null;
	}


	@Override
	public List<Element> queryElement_ELEMENT_AD_TOP(ElementQuery elementQuery) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public List<Element> queryElement_ELEMENT_AD_CROSSWISE(
			ElementQuery elementQuery) {
		// TODO Auto-generated method stub
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
