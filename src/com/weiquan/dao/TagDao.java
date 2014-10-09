package com.weiquan.dao;
import java.util.List;

import com.weiquan.domain.QueryParam;
import com.weiquan.domain.Tag;
public interface TagDao  extends WqAbstractDao<Tag>{
	public List<Tag> getListByQueryParam(QueryParam queryParam);
}