package com.weiquan.cache.map;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.weiquan.common.WqException;

public abstract class AbstractMapCache<T> implements MapCacheInterface<T>{
	private static final Logger logger = Logger.getLogger(AbstractMapCache.class);
	protected Map<String, T> data = null;
	protected String name ;

	@Override
	public abstract void initCache() throws Exception;
	
	
	
	@Override
	public String getCacheInfomtion() {
		StringBuilder sbr = new StringBuilder();
		sbr.append("CacheInfomation:{ name:").append(getCacheName())
		.append(", dataCount:").append(getCacheChidrenCount() )
		.append("}");
		return null;
	}

	@Override
	public String getCacheName() {
		return this.name;
	}

	@Override
	public int getCacheChidrenCount() {
		return data.size();
	}

	@Override
	public T get(String key) {
		return data.get(key);
	}

	@Override
	public void remove(String key) {
		logger.debug("cache["+getCacheName()+"] remove{key:"+key+"}");
		this.data.remove(key);
	}

	@Override
	public void add(String key, T value) {
		logger.debug("cache["+getCacheName()+"] add{key:"+key+", value:"+value+"}");
		this.data.put(key, value);
	}

	@Override
	public Collection<T> getAllValue() {
		return this.data.values();
	}

/*	@Override
	public void update(String key, T value) {
		this.data.put(key, value);
	}*/
	
	
	
}
