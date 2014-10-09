package com.weiquan.service.element;
import java.util.List;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.service.element.source.ElementSourceInterface;
public interface ElementService {
	
	/**
	 * 数据源注册
	 * @param source
	 */
	public void registerSource(ElementSourceInterface source);
	
	
	/**
	 * 数据加载
	 * @param queryObject
	 * @return
	 */
	public List<Element> loadElements(ElementQuery queryObject, int  elementType);
	
	
}