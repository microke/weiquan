package com.weiquan.dao;
import java.util.List;

import com.weiquan.domain.Element;
import com.weiquan.domain.ElementQuery;
public interface ElementDao extends WqAbstractDao<Element>{
	public List<Element> queryElementFromGroup_0(ElementQuery queryObj);
	public List<Element> queryElementFromGoods_0(ElementQuery queryObj);
	public List<Element> queryElementFromBussiness_0(ElementQuery queryObj);
	public List<Element> queryElementFromNewInfo_1(ElementQuery queryObj);
	public List<Element> queryElementFromAdvertisement_2(ElementQuery queryObj);
	public List<Element> queryElementFromAdvertisement_3(ElementQuery queryObj);
}