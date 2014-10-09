package com.weiquan.service.element;
import java.util.List;
import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
import com.weiquan.service.element.source.ElementSourceInterface;
public interface ElementService {
	
	/**
	 * ����Դע��
	 * @param source
	 */
	public void registerSource(ElementSourceInterface source);
	
	
	/**
	 * ���ݼ���
	 * @param queryObject
	 * @return
	 */
	public List<Element> loadElements(ElementQuery queryObject, int  elementType);
	
	
}