package com.weiquan.service.element.source;

import java.util.List;

import com.weiquan.common.WqDataDictionary;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;

public abstract class AbstractElementSource implements ElementSourceInterface{
	protected int[] supportElements = {1,2,3};
	protected int gridDefaultLimitSize = 12;
	@Override
	public int[] supportElementStyle() {
		return supportElements;
	}
	@Override
	public List<Element> queryElement(ElementQuery elementQuery, int elementType) {
		List<Element> elements = null;
		switch(elementType){
			case WqDataDictionary.ELEMENT_STYLE_GRID:
				elements=this.queryElement_ELEMENT_STYLE_GRID(elementQuery);
				break;
			case WqDataDictionary.ELEMENT_STYLE_ARTICLE:
				elements=this.queryElement_ELEMENT_STYLE_ARTICLE(elementQuery);
				break;
			case WqDataDictionary.ELEMENT_STYLE_AD_TOP:
				elements=this.queryElement_ELEMENT_AD_TOP(elementQuery);
				break;
			case WqDataDictionary.ELEMENT_STYLE_AD_CROSSWISE:
				elements=this.queryElement_ELEMENT_AD_CROSSWISE(elementQuery);
				break;
			case WqDataDictionary.ELEMENT_STYLE_AD_COLUMN:
				elements=this.queryElement_ELEMENT_AD_COLUMN(elementQuery);
				break;
			default:
				System.out.println("there dont have source["+elementType+"]");
		}
		return elements;
	}
	
	public abstract List<Element> queryElement_ELEMENT_STYLE_GRID(ElementQuery elementQuery);
	public abstract List<Element> queryElement_ELEMENT_STYLE_ARTICLE(ElementQuery elementQuery);
	public abstract List<Element> queryElement_ELEMENT_AD_TOP(ElementQuery elementQuery);
	public abstract List<Element> queryElement_ELEMENT_AD_CROSSWISE(ElementQuery elementQuery);
	public abstract List<Element> queryElement_ELEMENT_AD_COLUMN(ElementQuery elementQuery);
}
