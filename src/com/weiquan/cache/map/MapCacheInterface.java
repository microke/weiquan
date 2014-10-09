package com.weiquan.cache.map;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.weiquan.cache.CacheInterface;
import com.weiquan.common.WqException;

public interface MapCacheInterface<T> extends CacheInterface<T>{
	public T get(String key);
	
	/**
	 * 移除KEY
	 * @param key
	 */
	public void remove(String key);
	
	/**
	 * 如果对象存在则更新对象
	 * @param key
	 * @param value
	 */
	public void add(String key, T value) ;
	
	public Collection<T> getAllValue();
	
/*	*//**
	 * IF KEY == NULL , THEN NOT EXSIT VALUE Which is the key;
	 * @param key
	 * @param value
	 * @return
	 *//*
	public void update(String key, T value);
	*/
	
}
