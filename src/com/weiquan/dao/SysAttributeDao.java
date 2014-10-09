package com.weiquan.dao;
import java.util.List;

import com.weiquan.domain.SysAttribute;
public interface SysAttributeDao  extends WqAbstractDao<SysAttribute>{
	public List<SysAttribute> querySysAttributeListByGroupId(long groupId);
}