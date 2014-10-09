package com.weiquan.service.element.source;

import java.util.List;

import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;

/**
 * ������Դ�ӿ� - 
 * 	���Խ�����Դע�ᵽElementService�У�
 *  ֻ��ע���˲ſ�����Sheet��ʹ��  
 * @author ZL
 *
 */
public interface ElementSourceInterface {
	/**
	 * ��SheetҲѡ��ʱʹ�ã�
	 * @return
	 */
	public String getSourceName();
	
	/**
	 * ֧�ֵ�Style��ʽ
	 * @return
	 */
	public int[] supportElementStyle();
	
	/**
	 * ǰ̨������ʾʹ��
	 * @param elementQuery
	 * @return
	 */
	public List<Element> queryElement(ElementQuery elementQuery, int elementType);
}
