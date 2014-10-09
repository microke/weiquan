package com.weiquan.dao;
import com.weiquan.domain.AttrMapping;
public interface AttrMappingDao  extends WqAbstractDao<AttrMapping>{
	public AttrMapping getAttrMappingByIndex(AttrMapping attrMapping);
}