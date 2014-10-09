package com.weiquan.service.element.source;

import java.util.List;

import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;

/**
 * 数据来源接口 - 
 * 	可以将数据源注册到ElementService中；
 *  只有注册了才可以在Sheet中使用  
 * @author ZL
 *
 */
public interface ElementSourceInterface {
	/**
	 * 在Sheet也选择时使用；
	 * @return
	 */
	public String getSourceName();
	
	/**
	 * 支持的Style样式
	 * @return
	 */
	public int[] supportElementStyle();
	
	/**
	 * 前台数据显示使用
	 * @param elementQuery
	 * @return
	 */
	public List<Element> queryElement(ElementQuery elementQuery, int elementType);
}
