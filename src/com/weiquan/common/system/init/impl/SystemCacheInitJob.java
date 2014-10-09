package com.weiquan.common.system.init.impl;

import java.util.Map;

import org.apache.log4j.Logger;

import com.weiquan.cache.CacheInterface;
import com.weiquan.common.WqContext;
import com.weiquan.common.WqDataDictionary;
import com.weiquan.common.system.init.AbstractSystemInitJob;
	
public class SystemCacheInitJob extends AbstractSystemInitJob{
	private final Logger logger = Logger.getLogger(SystemCacheInitJob.class);
	private Map<String, CacheInterface> cacheMap ;
	private WqContext wqContext;
	
	public void doSystemJob() throws Exception{
		logger.info("start init sys cache");
		if(cacheMap == null){
			logger.warn("cacheMap is null; There is no map of cache in system!");
		}else{
			
			for(Map.Entry<String, CacheInterface>  entry: cacheMap.entrySet()){
				logger.info("init cache["+entry.getKey()+"] ...");
				entry.getValue().initCache();
				logger.info("init cache["+entry.getKey()+"] success!");
			}
		}
		wqContext.setSysCacheMap(cacheMap);
		logger.info("init finished");
	}

	public void setCacheMap(Map<String, CacheInterface> cacheMap) {
		this.cacheMap = cacheMap;
	}

	public void setWqContext(WqContext wqContext) {
		this.wqContext = wqContext;
	}
	
}
