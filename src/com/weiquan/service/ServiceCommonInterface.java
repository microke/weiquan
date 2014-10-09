package com.weiquan.service;

import java.util.List;

import com.weiquan.domain.QueryParam;

public interface ServiceCommonInterface<T> {
	public T getInfoById(long id);
	public T getInfoById(T arg);
	public List<T> getListByQueryParam(QueryParam queryParam);
	public void update(T arg);
	public void insert(T arg);
}
