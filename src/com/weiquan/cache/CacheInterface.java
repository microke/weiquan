package com.weiquan.cache;

public interface CacheInterface<T> {
	public String getCacheInfomtion();
	public String getCacheName();
	public int getCacheChidrenCount();
	public void initCache()  throws Exception;
}
